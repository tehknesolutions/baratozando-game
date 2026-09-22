from PIL import Image, ImageDraw, ImageChops
from pathlib import Path
import hashlib, json

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'public/assets/player/premium-v1/frames/idle/roach_idle_01.png'
OUT = ROOT / 'public/assets/player/premium-v1/frames/walk'
BASE = Image.open(SRC).convert('RGBA')

LEGS = [
    ('rear_near', [(73,200),(88,199),(72,224),(45,253),(17,255),(12,247),(49,225),(69,207)], (80,207)),
    ('mid_near', [(126,201),(138,200),(160,241),(158,256),(142,256),(128,214)], (133,207)),
    ('front_near', [(175,201),(187,198),(222,239),(222,255),(201,255),(177,214)], (183,205)),
    ('rear_far', [(43,198),(61,198),(49,216),(25,236),(4,237),(4,228),(28,220),(43,207)], (53,206)),
    ('mid_far', [(94,194),(108,194),(103,211),(90,235),(78,239),(76,231),(90,215)], (101,204)),
    ('front_far', [(157,190),(171,190),(177,205),(201,226),(202,236),(190,233),(168,211)], (166,201)),
]
SEQUENCE = [
    [0,0,0,0,0,0],
    [4,-4,4,-3,3,-3],
    [7,-7,7,-5,5,-5],
    [3,-3,3,-2,2,-2],
    [-4,4,-4,3,-3,3],
    [-7,7,-7,5,-5,5],
]

def rotate_masked(base_img, poly, angle, pivot):
    if abs(angle) < 0.01:
        return base_img
    mask = Image.new('L', base_img.size, 0)
    ImageDraw.Draw(mask).polygon(poly, fill=255)
    mask = ImageChops.multiply(mask, base_img.getchannel('A'))
    part = Image.new('RGBA', base_img.size, (0,0,0,0))
    part.paste(base_img, (0,0), mask)
    clean = base_img.copy()
    clean.putalpha(ImageChops.subtract(clean.getchannel('A'), mask))
    rotated = part.rotate(angle, resample=Image.Resampling.BICUBIC, center=pivot, expand=False)
    return Image.alpha_composite(clean, rotated)
def main():
    OUT.mkdir(parents=True, exist_ok=True)
    rows = []
    leg_names = [name for name, _, _ in LEGS]
    for idx, angles in enumerate(SEQUENCE, 1):
        frame = BASE.copy()
        for (_, poly, pivot), angle in zip(LEGS, angles):
            frame = rotate_masked(frame, poly, angle, pivot)
        fp = OUT / f'roach_walk_{idx:02d}.png'
        frame.save(fp, optimize=True)
        data = fp.read_bytes()
        rows.append({
            'index': idx,
            'path': fp.relative_to(ROOT).as_posix(),
            'sha256': hashlib.sha256(data).hexdigest(),
            'alphaBounds': list(frame.getchannel('A').getbbox()),
            'anglesDeg': dict(zip(leg_names, angles)),
        })
    print(json.dumps(rows, indent=2))

if __name__ == '__main__':
    main()
