"""Write a WebP sibling for each photo in public/images.

Browsers that understand WebP request the sibling; the original JPEG/PNG
stays as the fallback. Regenerating is optional and is not part of the
production build.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "images"
MAX_WIDTH = 1920
QUALITY = 74


def main() -> None:
    for src in sorted(ROOT.iterdir()):
        if src.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
            continue
        with Image.open(src) as image:
            has_alpha = image.mode in {"RGBA", "LA"} or (
                image.mode == "P" and "transparency" in image.info
            )
            converted = image.convert("RGBA" if has_alpha else "RGB")
            width, height = converted.size
            if width > MAX_WIDTH:
                height = round(height * MAX_WIDTH / width)
                converted = converted.resize((MAX_WIDTH, height), Image.Resampling.LANCZOS)
            dest = src.with_suffix(".webp")
            converted.save(dest, "WEBP", quality=QUALITY, method=6)
            print(
                f"{src.name}: {src.stat().st_size // 1024}KB {width}px"
                f" -> {dest.name} {dest.stat().st_size // 1024}KB {converted.size[0]}px"
            )


if __name__ == "__main__":
    main()
