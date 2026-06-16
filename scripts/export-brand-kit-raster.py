from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "brand-kit" / "exports"
PROOF = ROOT / "public" / "brand-kit" / "awdev-brand-kit-proof.png"
DISPLAY_FONT = Path("/System/Library/Fonts/Supplemental/Arial Black.ttf")
MONO_FONT = Path("/System/Library/Fonts/Supplemental/Andale Mono.ttf")

TERMINAL = (0, 255, 65, 255)
STEEL = (245, 245, 249, 255)
GRAY = (143, 144, 154, 255)
BLACK = (15, 15, 26, 255)
WHITE = (255, 255, 255, 255)

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
LOGGER = logging.getLogger(__name__)


@dataclass(frozen=True)
class ExportSpec:
    """Raster export definition."""

    name: str
    layout: str
    width: int
    height: int
    padded: bool
    style: str


SPECS = (
    ExportSpec("horizontal-gradient-transparent-4096", "horizontal", 4096, 1024, False, "gradient"),
    ExportSpec("horizontal-gradient-padded-4096", "horizontal", 4096, 1024, True, "gradient"),
    ExportSpec("horizontal-mono-white-transparent-4096", "horizontal", 4096, 1024, False, "mono-white"),
    ExportSpec("horizontal-mono-black-transparent-4096", "horizontal", 4096, 1024, False, "mono-black"),
    ExportSpec("stacked-gradient-transparent-4096", "stacked", 4096, 2304, False, "gradient"),
    ExportSpec("stacked-gradient-padded-4096", "stacked", 4096, 2304, True, "gradient"),
    ExportSpec("stacked-mono-white-transparent-4096", "stacked", 4096, 2304, False, "mono-white"),
    ExportSpec("stacked-mono-black-transparent-4096", "stacked", 4096, 2304, False, "mono-black"),
    ExportSpec("print-flat-transparent-6000", "stacked", 6000, 3375, False, "flat"),
    ExportSpec("print-flat-padded-6000", "stacked", 6000, 3375, True, "flat"),
    ExportSpec("monogram-transparent-2048", "monogram", 2048, 2048, False, "gradient"),
    ExportSpec("favicon-transparent-1024", "favicon", 1024, 1024, False, "gradient"),
)


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    """Load a font at a fixed size."""
    return ImageFont.truetype(str(path), size)


def text_mask(
    text: str,
    text_font: ImageFont.FreeTypeFont,
    tracking: int = 0,
) -> Image.Image:
    """Create a tightly cropped mask for text with optional tracking."""
    measure = Image.new("L", (16, 16), 0)
    draw = ImageDraw.Draw(measure)
    width = 0
    height = 0
    for char in text:
        bbox = draw.textbbox((0, 0), char, font=text_font)
        width += bbox[2] - bbox[0] + tracking
        height = max(height, bbox[3] - bbox[1])
    width = max(width - tracking, 1)
    mask = Image.new("L", (width + 80, height + 80), 0)
    draw = ImageDraw.Draw(mask)
    x = 40
    for char in text:
        bbox = draw.textbbox((0, 0), char, font=text_font)
        draw.text((x - bbox[0], 40 - bbox[1]), char, font=text_font, fill=255)
        x += bbox[2] - bbox[0] + tracking
    return crop_alpha(mask)


def crop_alpha(mask: Image.Image) -> Image.Image:
    """Crop transparent/empty edges from a mask or RGBA image."""
    bbox = mask.getbbox()
    if bbox is None:
        return mask
    return mask.crop(bbox)


def vertical_gradient(
    width: int,
    height: int,
    stops: tuple[tuple[float, tuple[int, int, int]], ...],
) -> Image.Image:
    """Build a vertical RGBA gradient."""
    image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    pixels = image.load()
    for y in range(height):
        position = y / max(height - 1, 1)
        lower = stops[0]
        upper = stops[-1]
        for index in range(len(stops) - 1):
            if stops[index][0] <= position <= stops[index + 1][0]:
                lower = stops[index]
                upper = stops[index + 1]
                break
        span = max(upper[0] - lower[0], 0.0001)
        local = (position - lower[0]) / span
        color = tuple(
            round(lower[1][channel] + (upper[1][channel] - lower[1][channel]) * local)
            for channel in range(3)
        )
        for x in range(width):
            pixels[x, y] = (*color, 255)
    return image


def colorize_mask(mask: Image.Image, style: str, part: str) -> Image.Image:
    """Convert a text mask to an RGBA layer."""
    if style == "mono-white":
        color = WHITE
        layer = Image.new("RGBA", mask.size, color)
    elif style == "mono-black":
        color = BLACK
        layer = Image.new("RGBA", mask.size, color)
    elif style == "flat":
        color = STEEL if part == "andrew" else TERMINAL
        layer = Image.new("RGBA", mask.size, color)
    elif part == "andrew":
        layer = vertical_gradient(
            mask.width,
            mask.height,
            (
                (0.0, (184, 184, 196)),
                (0.26, (255, 255, 255)),
                (0.56, (216, 216, 224)),
                (1.0, (108, 108, 120)),
            ),
        )
    else:
        layer = vertical_gradient(
            mask.width,
            mask.height,
            (
                (0.0, (170, 255, 192)),
                (0.2, (0, 255, 92)),
                (0.66, (0, 216, 58)),
                (1.0, (0, 110, 29)),
            ),
        )
        scan = Image.new("RGBA", mask.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(scan)
        for y in range(0, mask.height, max(mask.height // 72, 5)):
            draw.rectangle((0, y, mask.width, y + max(mask.height // 180, 2)), fill=(0, 0, 0, 54))
        layer.alpha_composite(scan)
    layer.putalpha(mask)
    return layer


def paste_centered(base: Image.Image, layer: Image.Image, xy: tuple[int, int]) -> None:
    """Paste a layer centered at a point."""
    x = xy[0] - layer.width // 2
    y = xy[1] - layer.height // 2
    base.alpha_composite(layer, (x, y))


def add_dev(base: Image.Image, xy: tuple[int, int], size: int, style: str) -> None:
    """Add .dev and terminal caret."""
    draw = ImageDraw.Draw(base)
    dev_font = font(MONO_FONT, size)
    color = BLACK if style == "mono-black" else GRAY
    if style == "mono-white":
        color = WHITE
    draw.text(xy, ".dev", font=dev_font, fill=color)
    bbox = draw.textbbox(xy, ".dev", font=dev_font)
    caret_color = BLACK if style == "mono-black" else TERMINAL
    draw.rectangle(
        (
            bbox[2] + int(size * 0.18),
            xy[1] + int(size * 0.63),
            bbox[2] + int(size * 0.92),
            xy[1] + int(size * 0.73),
        ),
        fill=caret_color,
    )


def fit_to_canvas(art: Image.Image, width: int, height: int, padded: bool) -> Image.Image:
    """Scale transparent art into a fixed canvas."""
    margin = 0.18 if padded else 0.06
    cropped = crop_alpha(art)
    max_w = int(width * (1 - margin))
    max_h = int(height * (1 - margin))
    scale = min(max_w / cropped.width, max_h / cropped.height)
    resized = cropped.resize(
        (round(cropped.width * scale), round(cropped.height * scale)),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    canvas.alpha_composite(resized, ((width - resized.width) // 2, (height - resized.height) // 2))
    return canvas


def render_wordmark(layout: str, style: str) -> Image.Image:
    """Render a transparent wordmark composition."""
    if layout == "horizontal":
        display = font(DISPLAY_FONT, 430)
        andrew = colorize_mask(text_mask("Andrew", display, tracking=-28), style, "andrew")
        webber = colorize_mask(text_mask("Webber", display, tracking=-28), style, "webber")
        art = Image.new("RGBA", (3400, 720), (0, 0, 0, 0))
        art.alpha_composite(andrew, (0, 70))
        art.alpha_composite(webber, (1220, 70))
        add_dev(art, (2830, 308), 132, style)
        return art

    display = font(DISPLAY_FONT, 560)
    andrew = colorize_mask(text_mask("Andrew", display, tracking=-38), style, "andrew")
    webber = colorize_mask(text_mask("Webber", display, tracking=-38), style, "webber")
    art = Image.new("RGBA", (3300, 1600), (0, 0, 0, 0))
    art.alpha_composite(andrew, (0, 0))
    art.alpha_composite(webber, (0, 555))
    add_dev(art, (2720, 615), 168, style)
    return art


def render_icon(layout: str, style: str) -> Image.Image:
    """Render monogram and favicon-style transparent icons."""
    size = 1800
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    display = font(DISPLAY_FONT, 1080)
    aw = colorize_mask(text_mask("AW", display, tracking=-200), style, "webber")
    paste_centered(image, aw, (size // 2, size // 2))
    draw = ImageDraw.Draw(image)
    draw.rectangle((1320, 1360, 1560, 1408), fill=TERMINAL)
    if layout == "favicon":
        badge = Image.new("RGBA", (size, size), (15, 15, 26, 255))
        badge.alpha_composite(image)
        return badge
    return image


def save_pair(image: Image.Image, name: str) -> None:
    """Save PNG and compressed WebP versions."""
    png_path = OUT / f"awdev-{name}.png"
    webp_path = OUT / f"awdev-{name}.webp"
    image.save(png_path, optimize=True)
    image.save(webp_path, quality=88, method=6)
    LOGGER.info("Wrote %s and %s", png_path.name, webp_path.name)


def make_proof(exports: list[tuple[str, Image.Image]]) -> None:
    """Create a dark proof sheet for fast visual review."""
    thumb_w = 900
    thumb_h = 420
    cols = 2
    rows = (len(exports) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * thumb_w, rows * thumb_h), (15, 15, 26))
    draw = ImageDraw.Draw(sheet)
    label_font = font(MONO_FONT, 26)
    for index, (name, image) in enumerate(exports):
        col = index % cols
        row = index // cols
        x = col * thumb_w
        y = row * thumb_h
        draw.rectangle((x + 18, y + 18, x + thumb_w - 18, y + thumb_h - 18), outline=(45, 45, 62))
        preview = fit_to_canvas(image, thumb_w - 96, thumb_h - 130, padded=True)
        sheet.paste(preview, (x + 48, y + 50), preview)
        draw.text((x + 36, y + thumb_h - 60), name, font=label_font, fill=(143, 144, 154))
    sheet.save(PROOF, quality=94)
    LOGGER.info("Wrote %s", PROOF)


def main() -> None:
    """Export the raster brand-kit package."""
    OUT.mkdir(parents=True, exist_ok=True)
    rendered: list[tuple[str, Image.Image]] = []
    for spec in SPECS:
        if spec.layout in {"monogram", "favicon"}:
            art = render_icon(spec.layout, spec.style)
        else:
            art = render_wordmark(spec.layout, spec.style)
        export = fit_to_canvas(art, spec.width, spec.height, spec.padded)
        save_pair(export, spec.name)
        rendered.append((spec.name, export))
    make_proof(rendered)


if __name__ == "__main__":
    main()
