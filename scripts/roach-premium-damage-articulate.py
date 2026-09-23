from PIL import Image, ImageDraw, ImageChops
from pathlib import Path
import hashlib, json

ROOT=Path(__file__).resolve().parents[1]
IDLE=Image.open(ROOT/'public/assets/player/premium-v1/frames/idle/roach_idle_01.png').convert('RGBA')

LEGS=[
 ('rear_near',[(73,200),(88,199),(72,224),(45,253),(17,255),(12,247),(49,225),(69,207)],(80,207)),
 ('mid_near',[(126,201),(138,200),(160,241),(158,256),(142,256),(128,214)],(133,207)),
 ('front_near',[(175,201),(187,198),(222,239),(222,255),(201,255),(177,214)],(183,205)),
 ('rear_far',[(43,198),(61,198),(49,216),(25,236),(4,237),(4,228),(28,220),(43,207)],(53,206)),
 ('mid_far',[(94,194),(108,194),(103,211),(90,235),(78,239),(76,231),(90,215)],(101,204)),
 ('front_far',[(157,190),(171,190),(177,205),(201,226),(202,236),(190,233),(168,211)],(166,201)),
]

def rotate_masked(base_img, poly, angle, pivot):
    if abs(angle)<0.01: return base_img
    mask=Image.new('L',base_img.size,0)
    ImageDraw.Draw(mask).polygon(poly,fill=255)
    mask=ImageChops.multiply(mask,base_img.getchannel('A'))
    part=Image.new('RGBA',base_img.size,(0,0,0,0)); part.paste(base_img,(0,0),mask)
    clean=base_img.copy(); clean.putalpha(ImageChops.subtract(clean.getchannel('A'),mask))
    return Image.alpha_composite(clean,part.rotate(angle,resample=Image.Resampling.BICUBIC,center=pivot,expand=False))

def articulate(angles):
    out=IDLE.copy()
    for (_,poly,pivot),angle in zip(LEGS,angles):
        out=rotate_masked(out,poly,angle,pivot)
    return out
def place_transformed(img, sx=1.0, sy=1.0, dx=0, dy=0):
    bbox=img.getchannel('A').getbbox()
    crop=img.crop(bbox)
    w=max(1,round(crop.width*sx)); h=max(1,round(crop.height*sy))
    crop=crop.resize((w,h),Image.Resampling.LANCZOS)
    out=Image.new('RGBA',(256,256),(0,0,0,0))
    x=(256-w)//2+dx; y=256-h+dy
    out.alpha_composite(crop,(x,y))
    return out

def place_rotated(img, scale, angle_cw, yshift=0):
    bbox=img.getchannel('A').getbbox()
    crop=img.crop(bbox)
    w=max(1,round(crop.width*scale)); h=max(1,round(crop.height*scale))
    crop=crop.resize((w,h),Image.Resampling.LANCZOS)
    rot=crop.rotate(-angle_cw,resample=Image.Resampling.BICUBIC,expand=True)
    out=Image.new('RGBA',(256,256),(0,0,0,0))
    x=(256-rot.width)//2
    y=256-rot.height+yshift
    out.alpha_composite(rot,(x,y))
    return out

def save_frame(path,img,meta):
    path.parent.mkdir(parents=True,exist_ok=True)
    img.save(path,optimize=True)
    data=path.read_bytes()
    meta.update({'path':path.relative_to(ROOT).as_posix(),'sha256':hashlib.sha256(data).hexdigest(),'alphaBounds':list(img.getchannel('A').getbbox())})
    return meta
DODGE_SEQ=[
 ([0,0,0,0,0,0],1.0,1.0,0,0),
 ([5,-5,5,-4,4,-4],0.99,0.98,2,1),
 ([10,-10,9,-8,8,-7],0.96,0.94,3,2),
 ([5,-5,5,-4,4,-4],0.99,0.98,2,1),
 ([0,0,0,0,0,0],1.0,1.0,0,0),
]
HURT_SEQ=[
 ([0,0,0,0,0,0],0),
 ([-11,10,-9,8,-10,8],0),
 ([3,-3,3,-2,2,-2],0),
]
DEATH_SEQ=[
 ([0,0,0,0,0,0],0),
 ([4,-5,4,-3,4,-3],15),
 ([8,-9,7,-7,7,-6],30),
 ([12,-13,10,-10,10,-9],45),
 ([15,-15,13,-12,12,-11],62),
 ([18,-17,16,-14,14,-13],82),
]
RESPAWN_SEQ=[
 ([12,-12,10,-9,9,-8],0.25),
 ([8,-8,7,-6,6,-5],0.50),
 ([4,-4,4,-3,3,-3],0.75),
 ([0,0,0,0,0,0],1.00),
]

def main():
    names=[n for n,_,_ in LEGS]
    result={}

    rows=[]
    for i,(angles,sx,sy,dx,dy) in enumerate(DODGE_SEQ,1):
        frame=place_transformed(articulate(angles),sx,sy,dx,dy)
        rows.append(save_frame(ROOT/f'public/assets/player/premium-v1/frames/dodge/roach_dodge_{i:02d}.png',frame,{'index':i,'anglesDeg':dict(zip(names,angles)),'scaleX':sx,'scaleY':sy,'xShiftPx':dx,'yShiftPx':dy}))
    result['dodge']=rows

    rows=[]
    for i,(angles,dx) in enumerate(HURT_SEQ,1):
        frame=place_transformed(articulate(angles),1.0,1.0,dx,0)
        rows.append(save_frame(ROOT/f'public/assets/player/premium-v1/frames/hurt/roach_hurt_{i:02d}.png',frame,{'index':i,'anglesDeg':dict(zip(names,angles)),'xShiftPx':dx}))
    result['hurt']=rows

    rows=[]
    for i,(angles,angle) in enumerate(DEATH_SEQ,1):
        frame=place_rotated(articulate(angles),0.70,angle,-2)
        rows.append(save_frame(ROOT/f'public/assets/player/premium-v1/frames/death/roach_death_{i:02d}.png',frame,{'index':i,'anglesDeg':dict(zip(names,angles)),'rotationDegCW':angle,'preScale':0.70}))
    result['death']=rows

    rows=[]
    for i,(angles,alpha_scale) in enumerate(RESPAWN_SEQ,1):
        frame=articulate(angles)
        if alpha_scale<1:
            a=frame.getchannel('A').point(lambda p,s=alpha_scale:int(round(p*s)))
            frame.putalpha(a)
        rows.append(save_frame(ROOT/f'public/assets/player/premium-v1/frames/respawn/roach_respawn_{i:02d}.png',frame,{'index':i,'anglesDeg':dict(zip(names,angles)),'alphaScale':alpha_scale}))
    result['respawn']=rows

    print(json.dumps(result,indent=2))

if __name__=='__main__':
    main()
