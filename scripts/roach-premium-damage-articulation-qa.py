from pathlib import Path
from PIL import Image, ImageChops
import hashlib, json

ROOT=Path(__file__).resolve().parents[1]
IDLE=Image.open(ROOT/'public/assets/player/premium-v1/frames/idle/roach_idle_01.png').convert('RGBA')
defs=[('dodge',5),('hurt',3),('death',6),('respawn',4)]

for name,count in defs:
    p=ROOT/f'art/source/player/premium-v1/frames/{name}/{name}_family.manifest.json'
    m=json.loads(p.read_text(encoding='utf-8'))
    if m.get('status')!='RUNTIME_READY_V1':
        raise SystemExit(f'{name} status drift')
    if m.get('runtimeReady') is not True:
        raise SystemExit(f'{name} promoted too early')
    if len(m.get('frames',[]))!=count:
        raise SystemExit(f'{name} frame count drift')
    for frame in m['frames']:
        fp=ROOT/frame['path']
        im=Image.open(fp).convert('RGBA')
        if im.size!=(256,256):
            raise SystemExit(f'{name} size drift frame {frame["index"]}')
        if hashlib.sha256(fp.read_bytes()).hexdigest()!=frame['sha256']:
            raise SystemExit(f'{name} hash drift frame {frame["index"]}')
        bbox=im.getchannel('A').getbbox()
        if bbox is None:
            raise SystemExit(f'{name} empty alpha frame {frame["index"]}')
        x0,y0,x1,y1=bbox
        if name in ('dodge','hurt') and (x0<=0 or x1>=256):
            raise SystemExit(f'{name} side clipping risk frame {frame["index"]}: {bbox}')
        if name=='death' and (x0<=0 or y0<=0 or x1>=256 or y1>=256):
            raise SystemExit(f'death clipping risk frame {frame["index"]}: {bbox}')

respawn=json.loads((ROOT/'art/source/player/premium-v1/frames/respawn/respawn_family.manifest.json').read_text(encoding='utf-8'))
scales=[f['alphaScale'] for f in respawn['frames']]
if scales != [0.25,0.5,0.75,1.0]:
    raise SystemExit(f'respawn alpha ramp drift: {scales}')
final=Image.open(ROOT/respawn['frames'][-1]['path']).convert('RGBA')
if ImageChops.difference(IDLE,final).getbbox() is not None:
    raise SystemExit('respawn final frame drift from locked IDLE')
if hashlib.sha256((ROOT/respawn['frames'][-1]['path']).read_bytes()).hexdigest()!='1336c96baa6f30fdcba60167591b3b79657bae25a9221251cc9c3a356d556308':
    raise SystemExit('respawn final byte identity drift')

print('PASS ROACH-18 lifecycle articulation QA: dodge/hurt margins, death containment, respawn exact IDLE handoff')
