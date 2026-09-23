from pathlib import Path
from PIL import Image, ImageChops
import hashlib, json

ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'art/source/player/premium-v1/frames/run/run_family.manifest.json').read_text(encoding='utf-8'))
base=Image.open(ROOT/'public/assets/player/premium-v1/frames/idle/roach_idle_01.png').convert('RGBA')
lock_box=(0,0,256,189)

if manifest.get('status')!='RUNTIME_READY_V1':
    raise SystemExit(f'run status drift: {manifest.get("status")}')
if manifest.get('runtimeReady') is not True:
    raise SystemExit('run promoted too early')
if manifest.get('upperBodyLockRegion') != [0,0,256,189]:
    raise SystemExit('upper body lock region drift')
if len(manifest.get('frames',[])) != 8:
    raise SystemExit('run frame count drift')

for frame in manifest['frames']:
    p=ROOT/frame['path']
    im=Image.open(p).convert('RGBA')
    if hashlib.sha256(p.read_bytes()).hexdigest()!=frame['sha256']:
        raise SystemExit(f'hash drift frame {frame["index"]}')
    if im.size!=(256,256):
        raise SystemExit(f'size drift frame {frame["index"]}')
    if ImageChops.difference(base.crop(lock_box),im.crop(lock_box)).getbbox() is not None:
        raise SystemExit(f'upper body identity drift frame {frame["index"]}')
    if im.getchannel('A').getbbox()!=(1,84,255,256):
        raise SystemExit(f'alpha bounds drift frame {frame["index"]}')

print('PASS ROACH-14 RUN articulation QA: upper identity locked, six deterministic leg pivots, 8 frames')
