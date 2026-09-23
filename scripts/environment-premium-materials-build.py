from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter
import hashlib, json, random

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'public/assets/environment/cellar'
OUT=SRC/'premium-v1'
SCALE=4

PROFILES={
 'floor_wood.png':'wood',
 'floor_masonry.png':'masonry',
 'floor_metal.png':'metal',
 'pipe_horizontal.png':'metal',
 'fork.png':'metal',
 'bottle.png':'glass',
 'can.png':'metal',
 'crate.png':'wood',
 'cable.png':'rubber',
 'drain.png':'metal',
 'grime_decal.png':'grime',
 'mold_decal.png':'organic',
 'dust_particle.png':'dust',
}

def sha(path:Path)->str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def alpha_masked_overlay(base:Image.Image, overlay:Image.Image)->Image.Image:
    alpha=ImageChops.multiply(overlay.getchannel('A'),base.getchannel('A'))
    overlay=overlay.copy()
    overlay.putalpha(alpha)
    return Image.alpha_composite(base,overlay)

def add_gradient(base:Image.Image, top_alpha:int, bottom_alpha:int, color:tuple[int,int,int])->Image.Image:
    grad=Image.new('RGBA',base.size,(0,0,0,0))
    draw=ImageDraw.Draw(grad)
    h=max(1,base.height-1)
    for y in range(base.height):
        a=round(top_alpha+(bottom_alpha-top_alpha)*(y/h))
        draw.line((0,y,base.width,y),fill=(*color,a))
    return alpha_masked_overlay(base,grad)

def materialize(src:Path, profile:str)->Image.Image:
    original=Image.open(src).convert('RGBA')
    out=original.resize((original.width*SCALE,original.height*SCALE),Image.Resampling.LANCZOS)
    a=out.getchannel('A')

    rgb=out.convert('RGB')
    contrast={'wood':1.08,'masonry':1.10,'metal':1.12,'glass':1.10,'rubber':1.06,'grime':1.08,'organic':1.08,'dust':1.0}[profile]
    sharp={'wood':1.20,'masonry':1.22,'metal':1.28,'glass':1.18,'rubber':1.12,'grime':1.12,'organic':1.12,'dust':1.0}[profile]
    rgb=ImageEnhance.Contrast(rgb).enhance(contrast)
    rgb=ImageEnhance.Sharpness(rgb).enhance(sharp)
    rgb=rgb.filter(ImageFilter.UnsharpMask(radius=1.0,percent=72,threshold=4))
    out=rgb.convert('RGBA')
    out.putalpha(a)

    seed=int(hashlib.sha256((src.name+profile).encode()).hexdigest()[:16],16)
    rng=random.Random(seed)
    overlay=Image.new('RGBA',out.size,(0,0,0,0))
    d=ImageDraw.Draw(overlay)

    if profile=='wood':
        for _ in range(max(22,out.height//3)):
            y=rng.randrange(1,out.height-1)
            x=rng.randrange(0,max(1,out.width-18))
            length=rng.randrange(18,max(19,min(out.width-x,92)))
            tone=rng.choice([(228,170,105,12),(52,28,15,18),(125,72,38,13)])
            d.line((x,y,x+length,y+rng.choice([-1,0,1])),fill=tone,width=rng.choice([1,1,2]))
        for _ in range(max(4,out.width//180)):
            x=rng.randrange(out.width); y=rng.randrange(out.height)
            r=rng.randrange(2,6)
            d.ellipse((x-r,y-r,x+r,y+r),outline=(48,25,14,18),width=1)
        out=alpha_masked_overlay(out,overlay)
        out=add_gradient(out,0,12,(18,11,8))

    elif profile=='masonry':
        for _ in range(max(80,(out.width*out.height)//1800)):
            x=rng.randrange(out.width); y=rng.randrange(out.height)
            r=rng.randrange(1,4)
            if rng.random()<0.58:
                col=(24,27,27,rng.randrange(8,20))
            else:
                col=(145,137,119,rng.randrange(5,12))
            d.ellipse((x-r,y-r,x+r,y+r),fill=col)
        out=alpha_masked_overlay(out,overlay)
        out=add_gradient(out,0,24,(8,16,17))

    elif profile=='metal':
        for _ in range(max(28,out.height//2)):
            y=rng.randrange(out.height)
            x=rng.randrange(max(1,out.width))
            length=rng.randrange(14,max(15,min(max(16,out.width-x),120)))
            d.line((x,y,min(out.width-1,x+length),y),fill=(208,194,166,rng.randrange(5,16)),width=1)
        for _ in range(max(6,(out.width*out.height)//16000)):
            x=rng.randrange(out.width); y=rng.randrange(out.height)
            r=rng.randrange(2,8)
            d.ellipse((x-r,y-r,x+r,y+r),fill=(127,55,25,rng.randrange(7,18)))
        out=alpha_masked_overlay(out,overlay)
        out=add_gradient(out,4,14,(14,10,8))

    elif profile=='glass':
        for frac,alpha in [(0.36,16),(0.43,9)]:
            x=round(out.width*frac)
            d.line((x,round(out.height*.13),x-2,round(out.height*.74)),fill=(205,223,221,alpha),width=max(1,out.width//90))
        out=alpha_masked_overlay(out,overlay)
        out=add_gradient(out,8,18,(8,17,18))

    elif profile=='rubber':
        for _ in range(max(20,out.height//5)):
            x=rng.randrange(out.width); y=rng.randrange(out.height)
            r=rng.randrange(1,3)
            d.ellipse((x-r,y-r,x+r,y+r),fill=(165,150,126,rng.randrange(3,8)))
        out=alpha_masked_overlay(out,overlay)
        out=add_gradient(out,4,12,(7,7,7))

    elif profile in ('grime','organic'):
        for _ in range(max(24,(out.width*out.height)//6000)):
            x=rng.randrange(out.width); y=rng.randrange(out.height)
            r=rng.randrange(2,8)
            col=(38,31,20,rng.randrange(4,12)) if profile=='grime' else (45,66,41,rng.randrange(4,12))
            d.ellipse((x-r,y-r,x+r,y+r),fill=col)
        out=alpha_masked_overlay(out,overlay)

    return out

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    assets=[]
    for name,profile in PROFILES.items():
        src=SRC/name
        dst=OUT/name
        before=Image.open(src).convert('RGBA')
        after=materialize(src,profile)
        after.save(dst,optimize=True)
        assets.append({
          'name':name,
          'profile':profile,
          'source':src.relative_to(ROOT).as_posix(),
          'output':dst.relative_to(ROOT).as_posix(),
          'sourceSha256':sha(src),
          'outputSha256':sha(dst),
          'sourceSize':[before.width,before.height],
          'outputSize':[after.width,after.height],
          'intrinsicScale':SCALE,
          'displayScale':1/SCALE,
          'silhouettePolicy':'alpha channel only resampled with LANCZOS; no object redesign',
        })

    manifest={
      'id':'ENV-CELLAR-PREMIUM-MATERIALS-V1',
      'status':'RUNTIME_CANDIDATE',
      'runtimeReady':False,
      'intrinsicScale':SCALE,
      'displayScale':1/SCALE,
      'policy':'source-derived deterministic premium material pass; preserve world scale and silhouettes',
      'profiles':['wood','masonry','metal','glass','rubber','grime','organic','dust'],
      'sourceRepairs': [{
        'asset':'fork.png',
        'reason':'main source blob was PNG-truncated and failed decode',
        'supersededCorruptSourceSha256':'84b3c15e396d421dcbfc25f7100e1cee0fa6c82dd68cd175a122425bfa0d17cd',
        'restoredFromCommit':'51d0d4d9351a9e59e9232578e9e2fa0243f96a82',
        'restoredSourceSha256':'1f2101a37062fcfbbabb737df3ed5dad71bff0dbb8e19627ccd6b23fe3b36807',
      }],
      'assets':assets,
      'promotionGate':'binary/hash/dimension/silhouette QA + runtime scale-lock contract + full tests/build/HTTP smoke',
    }
    m=ROOT/'art/source/environment/cellar/premium-v1'
    m.mkdir(parents=True,exist_ok=True)
    (m/'premium_materials_v1.manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'count':len(assets),'outputs':[a['output'] for a in assets]},indent=2))

if __name__=='__main__':
    main()
