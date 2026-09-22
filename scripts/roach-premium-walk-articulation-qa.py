from pathlib import Path
from PIL import Image, ImageChops
import hashlib, json, sys

ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'art/source/player/premium-v1/frames/walk/walk_family.manifest.json').read_text(encoding='utf-8'))
base=Image.open(ROOT/'public/assets/player/premium-v1/frames/idle/roach_idle_01.png').convert('RGBA')
lock_box=(0,0,256,189)
expected_status='ARTICULATION_CANDIDATE_V1'

if manifest.get('status')!=expected_status:
    raise SystemExit(f'walk status drift: {manifest.get("status")}')
if manifest.get('runtimeReady') is not False:
    raise SystemExit('walk promoted too early')
if manifest.get('upperBodyLockRegion') != [0,0,256,189]:
    raise SystemExit('upper body lock region drift')
if len(manifest.get('frames',[])) != 6:
    raise SystemExit('walk frame count drift')

for frame in manifest['frames']:
    p=ROOT/frame['path']
    im=Image.open(p).convert('RGBA')
    sha=hashlib.sha256(p.read_bytes()).hexdigest()
    if sha != frame['sha256']:
        raise SystemExit(f'hash drift frame {frame["index"]}')
    if im.size != (256,256):
        raise SystemExit(f'size drift frame {frame["index"]}')
    diff=ImageChops.difference(base.crop(lock_box),im.crop(lock_box))
    if diff.getbbox() is not None:
        raise SystemExit(f'upper body identity drift frame {frame["index"]}')
    a=im.getchannel('A')
    if a.getbbox() != (1,84,255,256):
        raise SystemExit(f'alpha bounds drift frame {frame["index"]}: {a.getbbox()}')

print('PASS ROACH-12 WALK articulation QA: upper identity locked, six deterministic leg pivots, 6 frames')

