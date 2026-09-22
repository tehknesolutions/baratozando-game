from pathlib import Path
from PIL import Image, ImageChops
import hashlib, json

ROOT=Path(__file__).resolve().parents[1]
BASE=Image.open(ROOT/'public/assets/player/premium-v1/frames/idle/roach_idle_01.png').convert('RGBA')
LOCK_BOX=(0,0,256,189)

for name,count in [('jump',4),('fall',2)]:
    manifest=json.loads((ROOT/f'art/source/player/premium-v1/frames/{name}/{name}_family.manifest.json').read_text(encoding='utf-8'))
    if manifest.get('status')!='ARTICULATION_VISUAL_APPROVED_RUNTIME_PENDING':
        raise SystemExit(f'{name} status drift: {manifest.get("status")}')
    if manifest.get('runtimeReady') is not False:
        raise SystemExit(f'{name} promoted too early')
    if manifest.get('upperBodyLockRegion') != [0,0,256,189]:
        raise SystemExit(f'{name} upper body lock drift')
    if len(manifest.get('frames',[])) != count:
        raise SystemExit(f'{name} frame count drift')
    for frame in manifest['frames']:
        p=ROOT/frame['path']
        im=Image.open(p).convert('RGBA')
        if hashlib.sha256(p.read_bytes()).hexdigest()!=frame['sha256']:
            raise SystemExit(f'{name} hash drift frame {frame["index"]}')
        if im.size!=(256,256):
            raise SystemExit(f'{name} size drift frame {frame["index"]}')
        if ImageChops.difference(BASE.crop(LOCK_BOX),im.crop(LOCK_BOX)).getbbox() is not None:
            raise SystemExit(f'{name} upper identity drift frame {frame["index"]}')
        if im.getchannel('A').getbbox()!=(1,84,255,256):
            raise SystemExit(f'{name} alpha bounds drift frame {frame["index"]}')
print('PASS ROACH-15 JUMP/FALL articulation QA: locked upper identity and deterministic six-leg airborne poses')
