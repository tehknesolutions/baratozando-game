from pathlib import Path
from PIL import Image
import hashlib, json

ROOT=Path(__file__).resolve().parents[1]
manifest_path=ROOT/'art/source/environment/cellar/premium-v1/premium_materials_v1.manifest.json'
manifest=json.loads(manifest_path.read_text(encoding='utf-8'))

if manifest.get('id')!='ENV-CELLAR-PREMIUM-MATERIALS-V1':
    raise SystemExit('manifest id drift')
if manifest.get('status')!='RUNTIME_READY_V1':
    raise SystemExit(f"status drift: {manifest.get('status')}")
if manifest.get('runtimeReady') is not True:
    raise SystemExit('premium materials promoted too early')
if manifest.get('intrinsicScale')!=4 or manifest.get('displayScale')!=0.25:
    raise SystemExit('intrinsic/display scale contract drift')
if len(manifest.get('assets',[]))!=13:
    raise SystemExit('asset count drift')

repair=manifest.get('sourceRepairs',[{}])[0]
if repair.get('asset')!='fork.png':
    raise SystemExit('fork repair provenance missing')
if repair.get('restoredFromCommit')!='51d0d4d9351a9e59e9232578e9e2fa0243f96a82':
    raise SystemExit('fork repair source commit drift')

for row in manifest['assets']:
    src=ROOT/row['source']
    out=ROOT/row['output']
    if not src.exists() or not out.exists():
        raise SystemExit(f"missing asset: {row['name']}")
    src_bytes=src.read_bytes()
    out_bytes=out.read_bytes()
    if hashlib.sha256(src_bytes).hexdigest()!=row['sourceSha256']:
        raise SystemExit(f"source hash drift: {row['name']}")
    if hashlib.sha256(out_bytes).hexdigest()!=row['outputSha256']:
        raise SystemExit(f"output hash drift: {row['name']}")
    src_im=Image.open(src).convert('RGBA')
    out_im=Image.open(out).convert('RGBA')
    if list(src_im.size)!=row['sourceSize']:
        raise SystemExit(f"source size drift: {row['name']}")
    if list(out_im.size)!=row['outputSize']:
        raise SystemExit(f"output size drift: {row['name']}")
    if out_im.width!=src_im.width*4 or out_im.height!=src_im.height*4:
        raise SystemExit(f"4x intrinsic scale drift: {row['name']}")
    src_bbox=src_im.getchannel('A').getbbox()
    out_bbox=out_im.getchannel('A').getbbox()
    if src_bbox is None or out_bbox is None:
        raise SystemExit(f"empty alpha: {row['name']}")
    expected=(src_bbox[0]*4,src_bbox[1]*4,src_bbox[2]*4,src_bbox[3]*4)
    if any(abs(a-b)>10 for a,b in zip(out_bbox,expected)):
        raise SystemExit(f"silhouette bbox drift {row['name']}: {out_bbox} vs {expected}")

fork=Image.open(ROOT/'public/assets/environment/cellar/fork.png').convert('RGBA')
if fork.size!=(96,96):
    raise SystemExit(f"restored fork source size drift: {fork.size}")

print('PASS ENV-03 premium material binary/hash/dimension/silhouette QA (13 assets)')
