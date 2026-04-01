import cv2
import numpy as np


def preprocess(image_input):
    """
    Preprocess an invoice image for better OCR accuracy.
    Accepts a file path (str) or a numpy image array.
    Returns a processed numpy array (BGR).
    """
    # Load image
    if isinstance(image_input, str):
        image = cv2.imread(image_input)
        if image is None:
            raise ValueError(f"Could not read image from path: {image_input}")
    else:
        image = image_input.copy()

    # 1. Upscale to give Tesseract more pixels to work with
    #    Only upscale if the image is smaller than 2000px on the longest side
    h, w = image.shape[:2]
    max_dim = max(h, w)
    scale = max(2.0, 2000 / max_dim) if max_dim < 2000 else 1.5
    image = cv2.resize(image, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)

    # 2. Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # 3. Denoise (reduces scanner noise and JPEG artifacts)
    gray = cv2.fastNlMeansDenoising(gray, h=10, templateWindowSize=7, searchWindowSize=21)

    # 4. Adaptive thresholding — handles uneven lighting / shadows on invoices
    #    More robust than simple Otsu for real-world photos
    thresh = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        blockSize=31,
        C=10
    )

    # 5. Convert back to 3-channel BGR (Tesseract can handle grayscale/binary
    #    but returning BGR keeps the pipeline consistent)
    final_img = cv2.cvtColor(thresh, cv2.COLOR_GRAY2BGR)

    return final_img