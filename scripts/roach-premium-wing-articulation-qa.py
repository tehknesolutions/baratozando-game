from pathlib import Path
from PIL import Image, ImageChops
import hashlib, json

ROOT=Path(__file__).resolve().parents[1]
defs=[
    ('wing_flap',4,'public/assets/player/premium-v1/frames/jump/roach_jump_03.png'),
    ('glide',2,'public/assets/player/premium-v1/frames/fall/roach_fall_01.png'),
]
for name,count,body_path in defs:
    manifest=json.loads((ROOT/f'art/source/player/premium-v1/frames/{name}/{name}_family.manifest.json').read_text(encoding='utf-8'))
    if manifest.get('status')!='WING_ARTICULATION_VISUAL_APPROVED_RUNTIME_PENDING':
        raise SystemExit(f'{name} status drift')
    if manifest.get('runtimeReady') is not False:
        raise SystemExit(f'{name} promoted too early')
    if manifest.get('wingArtworkStatus')!='DERIVED_CANONICAL_WING_TEXTURE_V1':
        raise SystemExit(f'{name} wing art provenance drift')
    if len(manifest.get('frames',[]))!=count:
        raise SystemExit(f'{name} frame count drift')
    body=Image.open(ROOT/body_path).convert('RGBA')
    head_box=(158,0,256,256)
    lower_box=(0,180,256,256)
    envelope=(35,85,160,195)
    for frame in manifest['frames']:
        p=ROOT/frame['path']
        im=Image.open(p).convert('RGBA')
        if hashlib.sha256(p.read_bytes()).hexdigest()!=frame['sha256']:
            raise SystemExit(f'{name} hash drift frame {frame["index"]}')
        if im.size!=(256,256):
            raise SystemExit(f'{name} size drift frame {frame["index"]}')
        if ImageChops.difference(body.crop(head_box),im.crop(head_box)).getbbox() is not None:
            raise SystemExit(f'{name} head/antennae identity drift frame {frame["index"]}')
        if ImageChops.difference(body.crop(lower_box),im.crop(lower_box)).getbbox() is not None:
            raise SystemExit(f'{name} lower-body/legs drift frame {frame["index"]}')
        diff=ImageChops.difference(body,im).getbbox()
        if diff is not None:
            x0,y0,x1,y1=diff
            ex0,ey0,ex1,ey1=envelope
            if x0<ex0 or y0<ey0 or x1>ex1 or y1>ey1:
                raise SystemExit(f'{name} wing change escaped envelope frame {frame["index"]}: {diff}')
print('PASS ROACH-16 WING_FLAP/GLIDE articulation QA: identity locks preserved and wing changes contained')
