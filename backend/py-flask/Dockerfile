FROM python:3.10-slim

# Install system dependencies
# tesseract-ocr: OCR engine
# tesseract-ocr-eng: English language data pack
# poppler-utils: Required by pdf2image to convert PDF pages to images
# libgl1: Required by OpenCV
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    poppler-utils \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 10000

# Run app with gunicorn (4 workers, 120s timeout for large images)
CMD gunicorn api:app --bind 0.0.0.0:${PORT:-10000} --workers 2 --timeout 120
