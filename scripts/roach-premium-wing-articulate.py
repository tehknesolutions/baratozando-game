from PIL import Image, ImageDraw, ImageChops
from pathlib import Path
import hashlib, json

ROOT = Path(__file__).resolve().parents[1]
IDLE = Image.open(ROOT/'public/assets/player/premium-v1/frames/idle/roach_idle_01.png').convert('RGBA')
WING_BODY = Image.open(ROOT/'public/assets/player/premium-v1/frames/jump/roach_jump_03.png').convert('RGBA')
GLIDE_BODY = Image.open(ROOT/'public/assets/player/premium-v1/frames/fall/roach_fall_01.png').convert('RGBA')

WING_POLY=[(52,149),(79,137),(125,137),(158,148),(158,169),(136,184),(92,192),(51,188),(39,175)]
WING_HINGE=(153,154)

mask=Image.new('L',IDLE.size,0)
ImageDraw.Draw(mask).polygon(WING_POLY,fill=255)
mask=ImageChops.multiply(mask,IDLE.getchannel('A'))
WING_SOURCE=Image.new('RGBA',IDLE.size,(0,0,0,0))
WING_SOURCE.paste(IDLE,(0,0),mask)

def wing_layer(angle, alpha_scale):
    layer=WING_SOURCE.copy()
    layer.putalpha(layer.getchannel('A').point(lambda p,a=alpha_scale:int(p*a)))
    return layer.rotate(angle,resample=Image.Resampling.BICUBIC,center=WING_HINGE,expand=False)
def compose(body, layers):
    out=body.copy()
    for angle,alpha in layers:
        out=Image.alpha_composite(out,wing_layer(angle,alpha))
    return out

def write_family(name, body, specs):
    outdir=ROOT/f'public/assets/player/premium-v1/frames/{name}'
    outdir.mkdir(parents=True,exist_ok=True)
    rows=[]
    for idx,layers in enumerate(specs,1):
        frame=compose(body,layers)
        fp=outdir/f'roach_{name}_{idx:02d}.png'
        frame.save(fp,optimize=True)
        data=fp.read_bytes()
        rows.append({
            'index':idx,
            'path':fp.relative_to(ROOT).as_posix(),
            'sha256':hashlib.sha256(data).hexdigest(),
            'alphaBounds':list(frame.getchannel('A').getbbox()),
            'wingLayers':[{'angleDeg':a,'alphaScale':alpha} for a,alpha in layers],
        })
    return rows

WING_FLAP_SPECS=[
    [],
    [(-12,0.25),(-18,0.65)],
    [(-35,0.38),(-45,0.72)],
    [(-14,0.25),(-20,0.65)],
]

GLIDE_SPECS=[
    [(-28,0.36),(-36,0.68)],
    [(-31,0.36),(-40,0.68)],
]
def main():
    result={
        'wing_flap':write_family('wing_flap',WING_BODY,WING_FLAP_SPECS),
        'glide':write_family('glide',GLIDE_BODY,GLIDE_SPECS),
    }
    print(json.dumps(result,indent=2))

if __name__=='__main__':
    main()
