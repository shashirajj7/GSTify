import os
import re
import uuid
from datetime import date as dt_date
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Fix OpenMP duplicate lib error on Windows dev machines
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

app = Flask(__name__)

# ---------------------------------------------------------------------------
# CORS — allow any *.vercel.app + localhost
# ---------------------------------------------------------------------------
CORS_ORIGINS_RE = re.compile(
    r"^https://[\w][\w\-]*(?:\.[\w][\w\-]*)*\.vercel\.app$"
    r"|^http://localhost(:\d+)?$"
    r"|^http://127\.0\.0\.1(:\d+)?$"
)


def cors_origin_allowed(origin):
    return bool(origin and CORS_ORIGINS_RE.match(origin))


CORS(app, resources={
    r"/*": {
        "origins": cors_origin_allowed,
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
    }
})

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp_uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 32 * 1024 * 1024  # 32 MB

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "pdf"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "GSTify AI Agent is running"}), 200


@app.route("/api/debug", methods=["GET"])
def debug_info():
    """Returns environment diagnostics — call this after deploy to verify deps."""
    import sys
    import subprocess
    info = {"python": sys.version, "status": "Flask is running"}

    for cmd, key in [
        (["tesseract", "--version"], "tesseract"),
        (["pdftoppm", "-v"], "poppler"),
    ]:
        try:
            r = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
            info[key] = (r.stdout + r.stderr).strip()
        except Exception as e:
            info[key] = f"NOT FOUND: {e}"

    for lib, attr in [("cv2", "__version__"), ("numpy", "__version__"), ("pytesseract", None)]:
        try:
            mod = __import__(lib)
            info[lib] = getattr(mod, attr) if attr else "imported ok"
        except Exception as e:
            info[lib] = f"ERROR: {e}"

    return jsonify(info), 200


@app.route("/api/process-invoice", methods=["POST"])
def process_invoice():
    # All heavy imports are lazy so Flask always starts
    import cv2
    import numpy as np
    import pandas as pd
    from tools.preprocessing_tool import preprocess
    from tools.ocr_tool import extract_text
    from tools.parser_tool import parse_fields
    from tools.gst_engine import calculate_tax_split
    from tools.gstr1_generator import generate as generate_gstr1
    from tools.gstr3b_generator import generate as generate_gstr3b
    from tools.gstr9_generator import generate as generate_gstr9
    import config

    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": "Allowed file types: png, jpg, jpeg, pdf"}), 400

    try:
        invoice_data = _process_one_file(file, cv2, np, preprocess, extract_text, parse_fields, calculate_tax_split)
    except Exception as e:
        print(f"[API] Error: {e}")
        import traceback; traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    invoice_store = pd.DataFrame([invoice_data])
    os.makedirs(config.OUTPUT_FOLDER, exist_ok=True)
    generate_gstr1(invoice_store, f"{config.OUTPUT_FOLDER}/gstr1.csv")
    generate_gstr3b(invoice_store, f"{config.OUTPUT_FOLDER}/gstr3b.csv")
    generate_gstr9(invoice_store, f"{config.OUTPUT_FOLDER}/gstr9.csv")

    return jsonify({
        "success": True,
        "filename": invoice_data["filename"],
        "confidence": round(invoice_data["confidence"] * 100, 2),
        "data": {
            "gstin":          invoice_data.get("gstin"),
            "invoice_number": invoice_data.get("invoice_number"),
            "date":           invoice_data.get("date"),
            "taxable_value":  invoice_data.get("taxable_value"),
            "gst_amount":     invoice_data.get("gst_amount"),
            "total_value":    invoice_data.get("total_value"),
            "cgst":           invoice_data.get("cgst"),
            "sgst":           invoice_data.get("sgst"),
            "igst":           invoice_data.get("igst"),
        },
    }), 200


@app.route("/api/process-multiple", methods=["POST"])
def process_multiple():
    import cv2
    import numpy as np
    import pandas as pd
    from tools.preprocessing_tool import preprocess
    from tools.ocr_tool import extract_text
    from tools.parser_tool import parse_fields
    from tools.gst_engine import calculate_tax_split
    from tools.gstr1_generator import generate as generate_gstr1
    from tools.gstr3b_generator import generate as generate_gstr3b
    from tools.gstr9_generator import generate as generate_gstr9
    import config

    if "files" not in request.files:
        return jsonify({"error": "No files part in the request"}), 400
    files = request.files.getlist("files")
    if not files or files[0].filename == "":
        return jsonify({"error": "No files selected"}), 400

    invoices_data = []
    errors = []
    for file in files:
        if not allowed_file(file.filename):
            errors.append(f"{file.filename}: unsupported type")
            continue
        try:
            data = _process_one_file(file, cv2, np, preprocess, extract_text, parse_fields, calculate_tax_split)
            invoices_data.append(data)
        except Exception as e:
            print(f"[API] Error processing {file.filename}: {e}")
            import traceback; traceback.print_exc()
            errors.append(f"{file.filename}: {e}")

    if not invoices_data:
        msg = "No valid invoices could be processed."
        if errors:
            msg += " Errors: " + "; ".join(errors)
        return jsonify({"error": msg}), 400

    invoice_store = pd.DataFrame(invoices_data)
    os.makedirs(config.OUTPUT_FOLDER, exist_ok=True)
    generate_gstr1(invoice_store, f"{config.OUTPUT_FOLDER}/gstr1.csv")
    generate_gstr3b(invoice_store, f"{config.OUTPUT_FOLDER}/gstr3b.csv")
    generate_gstr9(invoice_store, f"{config.OUTPUT_FOLDER}/gstr9.csv")

    avg_confidence = sum(float(d.get("confidence", 0)) for d in invoices_data) / len(invoices_data)

    result = {
        "success":     True,
        "is_multiple": True,
        "file_count":  len(invoices_data),
        "confidence":  round(avg_confidence * 100, 2),
        "invoices":    invoices_data,
        "summary": {
            "taxable_value": round(sum(float(d.get("taxable_value") or 0) for d in invoices_data), 2),
            "cgst":          round(sum(float(d.get("cgst") or 0) for d in invoices_data), 2),
            "sgst":          round(sum(float(d.get("sgst") or 0) for d in invoices_data), 2),
            "igst":          round(sum(float(d.get("igst") or 0) for d in invoices_data), 2),
            "total_value":   round(sum(float(d.get("total_value") or 0) for d in invoices_data), 2),
        },
    }
    if errors:
        result["warnings"] = errors
    return jsonify(result), 200


@app.route("/api/generate-csv", methods=["POST"])
def generate_csv():
    import pandas as pd
    from tools.gstr1_generator import generate as generate_gstr1
    from tools.gstr3b_generator import generate as generate_gstr3b
    from tools.gstr9_generator import generate as generate_gstr9
    import config

    data = request.json
    if not data or "invoices" not in data:
        return jsonify({"error": "No invoice data provided"}), 400

    invoices_data = data["invoices"]
    today_str = dt_date.today().strftime("%d/%m/%Y")
    for inv in invoices_data:
        if not inv.get("date"):
            inv["date"] = today_str

    invoice_store = pd.DataFrame(invoices_data)
    os.makedirs(config.OUTPUT_FOLDER, exist_ok=True)
    generate_gstr1(invoice_store, f"{config.OUTPUT_FOLDER}/gstr1.csv")
    generate_gstr3b(invoice_store, f"{config.OUTPUT_FOLDER}/gstr3b.csv")
    generate_gstr9(invoice_store, f"{config.OUTPUT_FOLDER}/gstr9.csv")

    return jsonify({"success": True, "message": "CSVs generated successfully"}), 200


@app.route("/")
def home():
    return "GSTify Backend is Running", 200


# ---------------------------------------------------------------------------
# Core processing helper (called by both single + multiple routes)
# ---------------------------------------------------------------------------

def _process_one_file(file_storage, cv2, np, preprocess, extract_text, parse_fields, calculate_tax_split):
    """
    Saves the uploaded file, runs OCR + parsing, returns invoice_data dict.
    Heavy deps are passed in as arguments (already imported lazily in the caller).
    """
    from pdf2image import convert_from_path

    filename = secure_filename(file_storage.filename)
    ext = filename.rsplit(".", 1)[1].lower() if "." in filename else ""
    unique_filename = f"{uuid.uuid4()}_{filename}"
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)

    try:
        file_storage.save(file_path)
        print(f"[API] Processing: {unique_filename}")

        # ── Convert to list of BGR images ────────────────────────────────────
        raw_images = []
        if ext == "pdf":
            pil_pages = convert_from_path(file_path, dpi=200)
            for pil_img in pil_pages:
                rgb = np.array(pil_img.convert("RGB"))
                raw_images.append(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR))
            if not raw_images:
                raise ValueError("PDF has no pages or could not be converted.")
        elif ext in {"png", "jpg", "jpeg"}:
            img = cv2.imread(file_path)
            if img is None:
                raise ValueError("Could not read image file.")
            raw_images = [img]
        else:
            raise ValueError(f"Unsupported file type: .{ext}")

        # ── OCR each page ─────────────────────────────────────────────────────
        combined_text = ""
        total_conf = 0.0
        for raw_img in raw_images:
            processed = preprocess(raw_img)
            page_text, page_conf = extract_text(processed)
            combined_text += "\n" + page_text
            total_conf += page_conf

        avg_confidence = total_conf / len(raw_images)

        if not combined_text.strip():
            raise ValueError(
                "OCR extracted no text. "
                "Ensure Tesseract-OCR is installed in the Docker image."
            )

        # ── Parse + Tax ────────────────────────────────────────────────────────
        fields = parse_fields(combined_text)
        cgst, sgst, igst = calculate_tax_split(
            fields.get("taxable_value"),
            fields.get("gst_amount"),
        )

        if not fields.get("date"):
            fields["date"] = dt_date.today().strftime("%d/%m/%Y")

        return {
            "filename":  filename,
            **fields,
            "cgst":      cgst,
            "sgst":      sgst,
            "igst":      igst,
            "confidence": avg_confidence,
        }

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
