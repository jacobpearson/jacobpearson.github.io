"""Make the Work with me page images from the Compagnons Unsplash photo.

Photo: "A hand-drawn website wireframe on paper with an orange pen on a desk"
by Compagnons, https://unsplash.com/photos/website-wireframe-sketch-on-paper-4UGmm3WRUoQ
(Unsplash License).

Usage (from the repo root, after downloading the photo):
    python _tools/make-work-with-me-images.py path/to/compagnons-photo.jpg

Writes:
    assets/images/og/page-work-with-me.jpg  1200x630 plain crop: page hero, like the other page-*.jpg files
    assets/images/og/work-with-me.jpg       1200x630 share card with the page title, under 300 KB

Then rebuild the site; the page picks both up automatically.
Optional: --focus-y 0.5 sets the vertical crop centre (0 = top, 1 = bottom).
"""
import argparse
import os
import sys

from PIL import Image, ImageDraw, ImageFont, ImageOps

W, H = 1200, 630
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "assets", "images", "og")

NAVY = (26, 26, 46)          # --navy / dark --bg
COOL_WHITE = (247, 247, 255)  # --cool-white
ORANGE = (242, 94, 13)        # --accent
SLATE_LIGHT = (176, 182, 200)

# The site's font stack is Helvetica Neue, Helvetica, Arial: use the first one installed.
FONT_CANDIDATES_BOLD = [
    "HelveticaNeue-Bold.ttf", "Helvetica-Bold.ttf", "arialbd.ttf", "Arial Bold.ttf",
    r"C:\Windows\Fonts\arialbd.ttf", "/Library/Fonts/Arial Bold.ttf", "DejaVuSans-Bold.ttf",
]
FONT_CANDIDATES_REGULAR = [
    "HelveticaNeue.ttf", "Helvetica.ttf", "arial.ttf", "Arial.ttf",
    r"C:\Windows\Fonts\arial.ttf", "/Library/Fonts/Arial.ttf", "DejaVuSans.ttf",
]


def load_font(candidates, size):
    for name in candidates:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    sys.exit("No usable font found; edit FONT_CANDIDATES in this script.")


def save_under(img, path, max_bytes, start_quality=86):
    q = start_quality
    while True:
        img.save(path, "JPEG", quality=q, optimize=True, progressive=True)
        size = os.path.getsize(path)
        if size <= max_bytes or q <= 50:
            return size, q
        q -= 4


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source")
    ap.add_argument("--focus-y", type=float, default=0.5)
    ap.add_argument("--out-dir", default=OUT_DIR)
    args = ap.parse_args()

    src = ImageOps.exif_transpose(Image.open(args.source)).convert("RGB")
    crop = ImageOps.fit(src, (W, H), Image.LANCZOS, centering=(0.5, args.focus_y))
    os.makedirs(args.out_dir, exist_ok=True)

    # 1. Page hero: plain crop, same as the other page-*.jpg files (the site screens it back in CSS).
    hero_path = os.path.join(args.out_dir, "page-work-with-me.jpg")
    size, q = save_under(crop, hero_path, 200_000)
    print(f"{hero_path}: {size // 1024} KB (q{q})")

    # 2. Share card: darkened photo, navy fade from the left, title in the site's type.
    card = crop.copy()
    card = Image.blend(card, Image.new("RGB", (W, H), NAVY), 0.45)
    fade = Image.new("L", (W, H))
    fd = ImageDraw.Draw(fade)
    for x in range(W):
        t = max(0.0, 1 - x / (W * 0.85))
        fd.line([(x, 0), (x, H)], fill=int(255 * (0.25 + 0.7 * t)))
    card = Image.composite(Image.new("RGB", (W, H), NAVY), card, fade)

    d = ImageDraw.Draw(card)
    x = 100
    d.rectangle([x, 168, x + 96, 177], fill=ORANGE)
    title_font = load_font(FONT_CANDIDATES_BOLD, 112)
    d.text((x, 220), "Work with me", font=title_font, fill=COOL_WHITE)
    sub_font = load_font(FONT_CANDIDATES_REGULAR, 38)
    d.text((x, 372), "Jacob Pearson · Product manager · Auckland, NZ", font=sub_font, fill=SLATE_LIGHT)
    small_font = load_font(FONT_CANDIDATES_BOLD, 30)
    d.text((x, 440), "Permanent, contract and part-time", font=small_font, fill=ORANGE)

    card_path = os.path.join(args.out_dir, "work-with-me.jpg")
    size, q = save_under(card, card_path, 300_000)
    print(f"{card_path}: {size // 1024} KB (q{q})")


if __name__ == "__main__":
    main()
