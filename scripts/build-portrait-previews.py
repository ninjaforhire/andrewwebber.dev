"""Build 4 portrait artifacts from a single source photo.

Inputs:  public/images/portrait/source/andrew-800.jpg
Outputs:
  - src/data/portrait-ascii.txt          (ASCII art, denser per pixel brightness)
  - src/data/portrait-lineart.svg        (Canny edge → SVG paths, viewBox 800x800)
  - public/images/portrait/andrew-display.jpg (passthrough for CSS variant)
  - public/images/portrait/andrew-mask.png    (RGBA body silhouette mask)
"""
from __future__ import annotations
import pathlib
import cv2
import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "images" / "portrait" / "source" / "andrew-800.jpg"
ASCII_OUT = ROOT / "src" / "data" / "portrait-ascii.txt"
SVG_OUT = ROOT / "src" / "data" / "portrait-lineart.svg"
DISPLAY_OUT = ROOT / "public" / "images" / "portrait" / "andrew-display.jpg"
MASK_OUT = ROOT / "public" / "images" / "portrait" / "andrew-mask.png"
MASK_INV_OUT = ROOT / "public" / "images" / "portrait" / "andrew-mask-inverse.png"

ASCII_COLS = 160  # higher res = more facial detail
ASCII_RAMP = " .`'-:_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@"


def build_ascii() -> str:
    img = Image.open(SRC).convert("L")
    w, h = img.size
    new_w = ASCII_COLS
    new_h = max(1, int(h / w * new_w * 0.5))
    img = img.resize((new_w, new_h))
    arr = np.array(img).astype(np.float32)
    p_low, p_high = np.percentile(arr, [5, 95])
    if p_high > p_low + 1:
        arr = (arr - p_low) * (255.0 / (p_high - p_low))
    arr = np.clip(arr, 0, 255)
    ramp = ASCII_RAMP
    n = len(ramp) - 1
    lines = []
    for row in arr:
        line = "".join(ramp[min(n, max(0, int(v * n / 255)))] for v in row.tolist())
        lines.append(line)
    return "\n".join(lines)


def build_body_mask() -> np.ndarray:
    """Return an HxW uint8 alpha mask: ~255 inside body, 0 outside, feathered edges."""
    gray = cv2.imread(str(SRC), cv2.IMREAD_GRAYSCALE)
    if gray is None:
        raise RuntimeError(f"could not read {SRC}")
    # Body = anything brighter than background. Use Otsu-ish threshold so it
    # adapts to whatever the bg-removed export produced.
    _, mask = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    # Fill holes (eyes, nostrils, between hair strands).
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    # Keep only the largest connected component (drops speckle / dust).
    n_lbl, lbl, stats, _ = cv2.connectedComponentsWithStats(mask, connectivity=8)
    if n_lbl > 1:
        # index 0 is background; pick the largest non-bg label
        biggest = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        mask = np.where(lbl == biggest, 255, 0).astype(np.uint8)
    # Soft edge so ASCII fades out cleanly.
    mask = cv2.GaussianBlur(mask, (21, 21), 0)
    return mask


def build_lineart_svg() -> str:
    img = cv2.imread(str(SRC), cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise RuntimeError(f"could not read {SRC}")
    # CLAHE boosts local contrast — pulls more detail out of the darker side
    # of the face that the bg-removed export under-exposed.
    clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
    img = clahe.apply(img)
    img = cv2.GaussianBlur(img, (3, 3), 0)
    edges = cv2.Canny(img, 35, 110)
    h, w = edges.shape
    contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_TC89_KCOS)
    parts: list[str] = []
    for cnt in contours:
        if len(cnt) < 3:
            continue
        simp = cv2.approxPolyDP(cnt, 0.4, False)
        pts = simp.reshape(-1, 2)
        if len(pts) < 2:
            continue
        d = "M " + " L ".join(f"{x},{y}" for x, y in pts)
        parts.append(f'<path d="{d}" />')
    inner = "\n  ".join(parts)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="none"\n'
        '  stroke="currentColor" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round">\n'
        f'  {inner}\n'
        '</svg>\n'
    )


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"missing source: {SRC}")
    for p in (ASCII_OUT.parent, SVG_OUT.parent, DISPLAY_OUT.parent):
        p.mkdir(parents=True, exist_ok=True)

    ASCII_OUT.write_text(build_ascii() + "\n")
    print(f"wrote {ASCII_OUT} ({ASCII_OUT.stat().st_size} bytes)")

    SVG_OUT.write_text(build_lineart_svg())
    print(f"wrote {SVG_OUT} ({SVG_OUT.stat().st_size} bytes)")

    # Display JPEG for shader variants.
    disp = Image.open(SRC).convert("RGB")
    disp.thumbnail((720, 720))
    disp.save(DISPLAY_OUT, "JPEG", quality=85, optimize=True)
    print(f"wrote {DISPLAY_OUT} ({DISPLAY_OUT.stat().st_size} bytes)")

    # Body mask + inverse as RGBA PNGs. White RGB, mask in alpha channel —
    # usable directly as CSS mask-image assets.
    alpha = build_body_mask()
    rgba = np.zeros((alpha.shape[0], alpha.shape[1], 4), dtype=np.uint8)
    rgba[..., :3] = 255
    rgba[..., 3] = alpha
    Image.fromarray(rgba, "RGBA").resize((720, 720)).save(MASK_OUT, "PNG", optimize=True)
    print(f"wrote {MASK_OUT} ({MASK_OUT.stat().st_size} bytes)")

    rgba_inv = np.zeros_like(rgba)
    rgba_inv[..., :3] = 255
    rgba_inv[..., 3] = 255 - alpha
    Image.fromarray(rgba_inv, "RGBA").resize((720, 720)).save(MASK_INV_OUT, "PNG", optimize=True)
    print(f"wrote {MASK_INV_OUT} ({MASK_INV_OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
