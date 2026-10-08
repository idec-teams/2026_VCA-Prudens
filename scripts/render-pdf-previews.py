"""Render lossless previews without changing the original PDFs.

A4 documents use 300 dpi; oversized supplement sheets use 2560px width,
matching the embedded scans rather than upscaling them fourfold.
"""
from pathlib import Path
import os
import subprocess
import tempfile
from PIL import Image

root = Path(__file__).resolve().parents[1] / "public/assets"
renderer = os.environ.get("PDFTOPPM", "pdftoppm")
jobs = [
    (root / "report-20261008/vca-prudens-2026-idec-report.pdf", 14, "page-", True),
    (root / "documents-20261004/supplementary-material.pdf", 8, "supplementary-page-", False),
    (root / "documents-20261004/responsible-research-form.pdf", 1, "responsible-research-cover", False),
]
for pdf, count, prefix, thumbs in jobs:
    with tempfile.TemporaryDirectory(prefix="vca-pdf-hd-") as temp:
        for page in range(1, count + 1):
            suffix = f"{page:02d}" if thumbs else str(page) if count > 1 else ""
            destination = pdf.parent / f"{prefix}{suffix}-hd.webp"
            if destination.exists():
                continue
            output = Path(temp) / "page"
            resolution = ["-scale-to-x", "2560", "-scale-to-y", "-1"] if count == 8 else ["-r", "300"]
            subprocess.run([renderer, "-f", str(page), "-l", str(page), "-singlefile", *resolution, "-png", str(pdf), str(output)], check=True)
            with Image.open(str(output) + ".png") as image:
                image.save(destination, "WEBP", lossless=True, method=6)
                if thumbs:
                    image.thumbnail((520, 736), Image.Resampling.LANCZOS)
                    image.save(pdf.parent / f"thumb-{page:02d}-hd.webp", "WEBP", lossless=True, method=6)
                print(destination.name, flush=True)
