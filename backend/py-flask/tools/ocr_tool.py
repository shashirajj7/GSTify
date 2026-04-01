import pytesseract
import cv2
import numpy as np
import os

# On Linux (Render/Docker), tesseract is in /usr/bin/tesseract from the apt install.
# On Windows, check the default install path.
_windows_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
if os.path.exists(_windows_path):
    pytesseract.pytesseract.tesseract_cmd = _windows_path
# On Linux the binary is already on PATH — no override needed.


def extract_text(image):
    """
    Run Tesseract OCR on a preprocessed image (numpy array or file path).
    Returns:
        full_text (str): Extracted text in UPPERCASE.
        confidence (float): Real average word confidence 0.0–1.0.
    """
    try:
        # Accept a file path or a numpy array
        if isinstance(image, str):
            image = cv2.imread(image)
            if image is None:
                raise ValueError(f"cv2.imread returned None for path: {image}")

        # Tesseract config:
        # --oem 3  → default LSTM engine
        # --psm 6  → assume uniform block of text (good for invoices)
        config = "--oem 3 --psm 6"

        # Full OCR text
        full_text = pytesseract.image_to_string(image, lang="eng", config=config)

        # Real per-word confidence via image_to_data
        data = pytesseract.image_to_data(
            image, lang="eng", config=config,
            output_type=pytesseract.Output.DICT
        )
        confidences = [
            int(c) for c in data["conf"]
            if str(c).lstrip("-").isdigit() and int(c) >= 0
        ]
        confidence_score = (sum(confidences) / len(confidences) / 100.0) if confidences else 0.0

        return full_text.upper(), round(confidence_score, 4)

    except Exception as e:
        print(f"[OCR] Tesseract error: {e}")
        return "", 0.0