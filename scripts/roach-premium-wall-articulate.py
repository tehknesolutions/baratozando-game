from PIL import Image, ImageDraw, ImageChops
from pathlib import Path
import hashlib, json

ROOT = Path(__file__).resolve().parents[1]
IDLE = Image.open(ROOT/'public/assets/player/premium-v1/frames/idle/roach_idle_01.png').convert('RGBA')
JUMP1 = Image.open(ROOT/'public/assets/player/premium-v1/frames/jump/roach_jump_01.png').convert('RGBA')
JUMP2 = Image.open(ROOT/'public/assets/player/premium-v1/frames/jump/roach_jump_02.png').convert('RGBA')

LEGS = [
    ('rear_near', [(73,200),(88,199),(72,224),(45,253),(17,255),(12,247),(49,225),(69,207)], (80,207)),
    ('mid_near', [(126,201),(138,200),(160,241),(158,256),(142,256),(128,214)], (133,207)),
    ('front_near', [(175,201),(187,198),(222,239),(222,255),(201,255),(177,214)], (183,205)),
    ('rear_far', [(43,198),(61,198),(49,216),(25,236),(4,237),(4,228),(28,220),(43,207)], (53,206)),
    ('mid_far', [(94,194),(108,194),(103,211),(90,235),(78,239),(76,231),(90,215)], (101,204)),
    ('front_far', [(157,190),(171,190),(177,205),(201,226),(202,236),(190,233),(168,211)], (166,201)),
]
CLING_POSE=[7,-7,7,-6,6,-6]
CLIMB_SEQUENCE=[
    [8,-8,8,-6,6,-6],
    [2,-2,2,-2,2,-2],
    [-8,8,-8,6,-6,6],
    [-2,2,-2,2,-2,2],
]
PUSH_POSE=[12,-12,10,-9,9,-8]

def rotate_masked(base_img, poly, angle, pivot):
    if abs(angle) < 0.01:
        return base_img
    mask=Image.new('L',base_img.size,0)
    ImageDraw.Draw(mask).polygon(poly,fill=255)
    mask=ImageChops.multiply(mask,base_img.getchannel('A'))
    part=Image.new('RGBA',base_img.size,(0,0,0,0))
    part.paste(base_img,(0,0),mask)
    clean=base_img.copy()
    clean.putalpha(ImageChops.subtract(clean.getchannel('A'),mask))
    rotated=part.rotate(angle,resample=Image.Resampling.BICUBIC,center=pivot,expand=False)
    return Image.alpha_composite(clean,rotated)

def articulate(base_img, angles):
    out=base_img.copy()
    for (_,poly,pivot),angle in zip(LEGS,angles):
        out=rotate_masked(out,poly,angle,pivot)
    return out

def verticalize(img):
    return img.transpose(Image.Transpose.ROTATE_90)

def transition_from_horizontal(img, angle_ccw):
    crop=img.crop(img.getchannel('A').getbbox())
    rot=crop.rotate(angle_ccw,resample=Image.Resampling.BICUBIC,expand=True)
    max_dim=248
    scale=min(1.0,max_dim/max(rot.size))
    if scale<1.0:
        rot=rot.resize((max(1,round(rot.width*scale)),max(1,round(rot.height*scale))),Image.Resampling.LANCZOS)
    out=Image.new('RGBA',(256,256),(0,0,0,0))
    x=(256-rot.width)//2
    y=256-rot.height
    out.alpha_composite(rot,(x,y))
    return out
def write_frame(path,img,meta):
    path.parent.mkdir(parents=True,exist_ok=True)
    img.save(path,optimize=True)
    data=path.read_bytes()
    meta.update({
        'path':path.relative_to(ROOT).as_posix(),
        'sha256':hashlib.sha256(data).hexdigest(),
        'alphaBounds':list(img.getchannel('A').getbbox()),
    })
    return meta

def main():
    names=[n for n,_,_ in LEGS]

    cling_base=articulate(IDLE,CLING_POSE)
    cling=verticalize(cling_base)
    cling_row=write_frame(
        ROOT/'public/assets/player/premium-v1/frames/wall_cling/roach_wall_cling_01.png',
        cling,
        {'index':1,'preRotationAnglesDeg':dict(zip(names,CLING_POSE)),'rotationDegCCW':90}
    )

    climb_rows=[]
    for i,angles in enumerate(CLIMB_SEQUENCE,1):
        frame=verticalize(articulate(IDLE,angles))
        climb_rows.append(write_frame(
            ROOT/f'public/assets/player/premium-v1/frames/wall_climb/roach_wall_climb_{i:02d}.png',
            frame,
            {'index':i,'preRotationAnglesDeg':dict(zip(names,angles)),'rotationDegCCW':90}
        ))

    push=verticalize(articulate(IDLE,PUSH_POSE))
    wall_jump_frames=[
        (push,{'index':1,'phase':'wall_push','rotationDegCCW':90,'preRotationAnglesDeg':dict(zip(names,PUSH_POSE))}),
        (transition_from_horizontal(JUMP1,62),{'index':2,'phase':'turn_62deg','sourceJumpFrame':'public/assets/player/premium-v1/frames/jump/roach_jump_01.png','rotationDegCCW':62}),
        (transition_from_horizontal(JUMP1,32),{'index':3,'phase':'turn_32deg','sourceJumpFrame':'public/assets/player/premium-v1/frames/jump/roach_jump_01.png','rotationDegCCW':32}),
        (JUMP2.copy(),{'index':4,'phase':'airborne_horizontal','sourceJumpFrame':'public/assets/player/premium-v1/frames/jump/roach_jump_02.png','rotationDegCCW':0}),
    ]
    jump_rows=[]
    for img,meta in wall_jump_frames:
        jump_rows.append(write_frame(
            ROOT/f'public/assets/player/premium-v1/frames/wall_jump/roach_wall_jump_{meta["index"]:02d}.png',
            img,meta
        ))

    print(json.dumps({'wall_cling':[cling_row],'wall_climb':climb_rows,'wall_jump':jump_rows},indent=2))

if __name__=='__main__':
    main()
