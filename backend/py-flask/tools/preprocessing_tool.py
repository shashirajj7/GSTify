import cv2
import numpy as np


def preprocess(image_input):
    """
    Preprocess an invoice image for better OCR accuracy.
    Accepts a file path (str) or a numpy image array.
    Returns a processed numpy array (BGR).

    Strategy:
      - Digital invoices (clean, high DPI): light sharpening + mild binary threshold
      - Photographed/scanned invoices (noisy): denoising + adaptive threshold
    The code detects which case we have and applies the right pipeline.
    """
    # ── Load ──────────────────────────────────────────────────────────────────
    if isinstance(image_input, str):
        image = cv2.imread(image_input)
        if image is None:
            raise ValueError(f"Could not read image from path: {image_input}")
    else:
        image = image_input.copy()

    h, w = image.shape[:2]

    # ── 1. Upscale small images ───────────────────────────────────────────────
    # Tesseract needs at least ~150 DPI; aim for 300 DPI-equivalent
    max_dim = max(h, w)
    if max_dim < 2000:
        scale = 2000 / max_dim
        image = cv2.resize(image, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)

    # ── 2. Convert to grayscale ───────────────────────────────────────────────
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # ── 3. Detect noise level ─────────────────────────────────────────────────
    # Laplacian variance: high = sharp (digital), low = blurry/noisy (photo)
    lap_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    is_noisy = lap_var < 500  # threshold chosen empirically for invoice images

    if is_noisy:
        # Photographed / scanned invoice — denoise lightly + adaptive threshold
        gray = cv2.fastNlMeansDenoising(gray, h=7, templateWindowSize=7, searchWindowSize=15)
        processed = cv2.adaptiveThreshold(
            gray, 255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            blockSize=31,
            C=10,
        )
    else:
        # Clean digital invoice — simple Otsu threshold (preserves fine text)
        # Optional: lightly sharpen before thresholding
        kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
        gray = cv2.filter2D(gray, -1, kernel)
        _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # ── 4. Return as 3-channel BGR (keeps pipeline consistent) ───────────────
    return cv2.cvtColor(processed, cv2.COLOR_GRAY2BGR)