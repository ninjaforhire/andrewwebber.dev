from __future__ import annotations

import logging
import math
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
BACKGROUND = ROOT / "public" / "brand-kit" / "awdev-glow-background.png"
OUTPUT = ROOT / "public" / "brand-kit" / "awdev-logo-glow.mp4"
ARIAL_BLACK = Path("/System/Library/Fonts/Supplemental/Arial Black.ttf")
MONO = Path("/System/Library/Fonts/Supplemental/Andale Mono.ttf")
WIDTH = 1280
HEIGHT = 720
FPS = 30
DURATION_SECONDS = 6

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
LOGGER = logging.getLogger(__name__)


def crop_cover(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    """Resize and center-crop an image to cover the target size."""
    target_w, target_h = size
    scale = max(target_w / image.width, target_h / image.height)
    resized = image.resize(
        (math.ceil(image.width * scale), math.ceil(image.height * scale)),
        Image.Resampling.LANCZOS,
    )
    left = (resized.width - target_w) // 2
    top = (resized.height - target_h) // 2
    return resized.crop((left, top, left + target_w, top + target_h)).convert("RGBA")


def vertical_gradient(
    size: tuple[int, int],
    stops: tuple[tuple[float, tuple[int, int, int]], ...],
) -> Image.Image:
    """Create a vertical RGB gradient from percentage stops."""
    width, height = size
    image = Image.new("RGBA", size)
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


def text_mask(text: str, font: ImageFont.FreeTypeFont, xy: tuple[int, int]) -> Image.Image:
    """Draw text into an alpha mask."""
    mask = Image.new("L", (WIDTH, HEIGHT), 0)
    draw = ImageDraw.Draw(mask)
    draw.text(xy, text, font=font, fill=255)
    return mask


def paste_gradient_text(
    base: Image.Image,
    mask: Image.Image,
    gradient: Image.Image,
    glow_color: tuple[int, int, int],
    glow_alpha: int,
) -> None:
    """Composite glowing gradient text onto the base image."""
    glow = Image.new("RGBA", base.size, (*glow_color, 0))
    glow.putalpha(
        mask.filter(ImageFilter.GaussianBlur(18)).point(
            lambda value: min(value, glow_alpha)
        )
    )
    base.alpha_composite(glow)
    gradient_layer = Image.new("RGBA", base.size)
    gradient_layer.alpha_composite(gradient)
    gradient_layer.putalpha(mask)
    base.alpha_composite(gradient_layer)


def add_scanlines(base: Image.Image, mask: Image.Image) -> None:
    """Add horizontal scanlines inside the green word only."""
    scan = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(scan)
    for y in range(0, HEIGHT, 5):
        draw.rectangle((0, y, WIDTH, y + 1), fill=(5, 12, 7, 90))
    scan.putalpha(Image.eval(mask, lambda value: min(value, 90) if value else 0))
    base.alpha_composite(scan)


def render_frame(background: Image.Image, frame: int, total_frames: int) -> Image.Image:
    """Render one animation frame."""
    progress = frame / total_frames
    pulse = 0.76 + 0.24 * math.sin(progress * math.tau)
    image = background.copy()
    overlay = Image.new("RGBA", image.size, (0, 255, 65, 0))
    draw = ImageDraw.Draw(overlay)
    scan_y = int((progress * (HEIGHT + 180)) - 120)
    draw.rectangle(
        (0, scan_y, WIDTH, scan_y + 140),
        fill=(0, 255, 65, int(22 * pulse)),
    )
    image.alpha_composite(overlay)

    display_font = ImageFont.truetype(str(ARIAL_BLACK), 172)
    mono_font = ImageFont.truetype(str(MONO), 58)
    steel = vertical_gradient(
        (WIDTH, HEIGHT),
        (
            (0.0, (184, 184, 196)),
            (0.28, (255, 255, 255)),
            (0.58, (216, 216, 224)),
            (1.0, (108, 108, 120)),
        ),
    )
    green = vertical_gradient(
        (WIDTH, HEIGHT),
        (
            (0.0, (170, 255, 192)),
            (0.18, (0, 255, 92)),
            (0.64, (0, 216, 58)),
            (1.0, (0, 110, 29)),
        ),
    )
    andrew_mask = text_mask("Andrew", display_font, (105, 150))
    webber_mask = text_mask("Webber", display_font, (105, 306))
    paste_gradient_text(image, andrew_mask, steel, (255, 255, 255), int(42 * pulse))
    paste_gradient_text(image, webber_mask, green, (0, 255, 65), int(150 * pulse))
    add_scanlines(image, webber_mask)

    draw = ImageDraw.Draw(image)
    draw.text((980, 314), ".dev", font=mono_font, fill=(170, 170, 178, 255))
    caret_alpha = 255 if frame % FPS < FPS // 2 else 86
    draw.rectangle((1144, 376, 1182, 383), fill=(0, 255, 65, caret_alpha))
    return image.convert("RGB")


def main() -> None:
    """Render the brand kit MP4 preview."""
    total_frames = FPS * DURATION_SECONDS
    background = crop_cover(Image.open(BACKGROUND), (WIDTH, HEIGHT))
    with tempfile.TemporaryDirectory(prefix="awdev-brand-video-") as temp_dir:
        frames_dir = Path(temp_dir)
        for frame in range(total_frames):
            render_frame(background, frame, total_frames).save(
                frames_dir / f"frame_{frame:04d}.jpg",
                quality=92,
            )
        command = [
            "ffmpeg",
            "-y",
            "-framerate",
            str(FPS),
            "-i",
            str(frames_dir / "frame_%04d.jpg"),
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            str(OUTPUT),
        ]
        subprocess.run(command, check=True)
    LOGGER.info("Wrote %s", OUTPUT)


if __name__ == "__main__":
    main()
