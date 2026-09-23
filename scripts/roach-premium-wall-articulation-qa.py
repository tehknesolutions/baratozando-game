from pathlib import Path
from PIL import Image, ImageChops
import hashlib, json

ROOT=Path(__file__).resolve().parents[1]
IDLE=Image.open(ROOT/'public/assets/player/premium-v1/frames/idle/roach_idle_01.png').convert('RGBA')
JUMP2=Image.open(ROOT/'public/assets/player/premium-v1/frames/jump/roach_jump_02.png').convert('RGBA')
LOCK_BOX=(0,0,256,188)

def verify_file(frame):
    p=ROOT/frame['path']
    im=Image.open(p).convert('RGBA')
    if hashlib.sha256(p.read_bytes()).hexdigest()!=frame['sha256']:
        raise SystemExit(f'hash drift: {frame["path"]}')
    if im.size!=(256,256):
        raise SystemExit(f'size drift: {frame["path"]}')
    if im.getchannel('A').getbbox() is None:
        raise SystemExit(f'empty alpha: {frame["path"]}')
    return im

for name,count in [('wall_cling',1),('wall_climb',4),('wall_jump',4)]:
    manifest=json.loads((ROOT/f'art/source/player/premium-v1/frames/{name}/{name}_family.manifest.json').read_text(encoding='utf-8'))
    if manifest.get('status')!='RUNTIME_READY_V1':
        raise SystemExit(f'{name} status drift')
    if manifest.get('runtimeReady') is not True:
        raise SystemExit(f'{name} promoted too early')
    if manifest.get('preRotationUpperBodyLockRegion') != [0,0,256,188]:
        raise SystemExit(f'{name} lock region drift')
    if len(manifest.get('frames',[]))!=count:
        raise SystemExit(f'{name} frame count drift')

    for frame in manifest['frames']:
        im=verify_file(frame)
        if name in ('wall_cling','wall_climb') or (name=='wall_jump' and frame['index']==1):
            restored=im.transpose(Image.Transpose.ROTATE_270)
            if ImageChops.difference(IDLE.crop(LOCK_BOX),restored.crop(LOCK_BOX)).getbbox() is not None:
                raise SystemExit(f'{name} pre-rotation upper identity drift frame {frame["index"]}')

wall_jump=json.loads((ROOT/'art/source/player/premium-v1/frames/wall_jump/wall_jump_family.manifest.json').read_text(encoding='utf-8'))
rotations=[f['rotationDegCCW'] for f in wall_jump['frames']]
if rotations != [90,62,32,0]:
    raise SystemExit(f'wall_jump orientation sequence drift: {rotations}')

for frame in wall_jump['frames'][1:3]:
    im=verify_file(frame)
    x0,y0,x1,y1=im.getchannel('A').getbbox()
    if x0<=0 or y0<=0 or x1>=256 or y1>=256:
        raise SystemExit(f'wall_jump transition clipping risk frame {frame["index"]}: {(x0,y0,x1,y1)}')

end=verify_file(wall_jump['frames'][3])
if ImageChops.difference(JUMP2,end).getbbox() is not None:
    raise SystemExit('wall_jump final frame drift from approved JUMP frame 02')

print('PASS ROACH-17 WALL articulation QA: identity locks, climb gait, orientation transition and JUMP handoff')
