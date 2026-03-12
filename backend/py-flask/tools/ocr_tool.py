import pytesseract
import cv2
import os

# Configure Tesseract path if found in default Windows location
tesseract_default_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
if os.path.exists(tesseract_default_path):
    pytesseract.pytesseract.tesseract_cmd = tesseract_default_path

# Rely on Tesseract being in the system PATH instead of a hardcoded Scoop directory.
# Windows users should install from: github.com/UB-Mannheim/tesseract/wiki
# And add to path.


def extract_text(image_path):
    try:
        # Tesseract accepts image arrays or paths. If path is given, load it.
        if isinstance(image_path, str):
            image = cv2.imread(image_path)
        else:
            image = image_path
            
        # Run Tesseract to get all text at once
        full_text = pytesseract.image_to_string(image, lang='eng')
        
        # Pytesseract doesn't easily return line-by-line confidences without verbose data format,
        # so we'll assign a default high confidence if it succeeds or fallback to generating it later.
        confidence_score = 0.90
        
        return full_text.upper(), confidence_score

    except Exception as e:
        print(f"Tesseract OCR Error: {e}")
        return "", 0