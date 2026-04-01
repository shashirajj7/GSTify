"""
GSTify Flask API
All imports are lazy (inside route functions) so the app always boots.
"""
import os
import re
import uuid
from datetime import date as dt_date

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

app = Flask(__name__)

# Simplest CORS: allow all origins. We validate the request in the frontend.
# (a callable origins was crashing flask-cors on Render)
CORS(app, origins="*")

# Upload config
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp_uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 32 * 1024 * 1024  # 32 MB

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "pdf"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

@app.route("/")
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "GSTify is running"}), 200


# ---------------------------------------------------------------------------
# Debug — reports what is actually installed in the container
# ---------------------------------------------------------------------------

@app.route("/api/debug", methods=["GET"])
def debug_info():
    import sys, subprocess
    info = {"python": sys.version, "flask_started": True}
    for cmd, key in [
        (["tesseract", "--version"], "tesseract"),
        (["pdftoppm", "-v"],         "poppler"),
    ]:
        try:
            r = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
            info[key] = (r.stdout + r.stderr).strip()
        except Exception as e:
            info[key] = f"NOT FOUND: {e}"
    for lib in ["cv2", "numpy", "pytesseract", "pdf2image", "PIL"]:
        try:
            mod = __import__(lib)
            info[lib] = getattr(mod, "__version__", "imported ok")
        except Exception as e:
            info[lib] = f"ERROR: {e}"
    return jsonify(info), 200


# ---------------------------------------------------------------------------
# Process single invoice
# ---------------------------------------------------------------------------

@app.route("/api/process-invoice", methods=["POST"])
def process_invoice():
    try:
        import cv2, numpy as np, pandas as pd
        from tools.preprocessing_tool import preprocess
        from tools.ocr_tool import extract_text
        from tools.parser_tool import parse_fields
        from tools.gst_engine import calculate_tax_split
        from tools.gstr1_generator import generate as g1
        from tools.gstr3b_generator import generate as g3b
        from tools.gstr9_generator import generate as g9
        import config
    except Exception as e:
        return jsonify({"error": f"Server dependency error: {e}"}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "No file selected"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": "Allowed file types: png, jpg, jpeg, pdf"}), 400

    try:
        inv = _process_one(file, cv2, np, preprocess, extract_text, parse_fields, calculate_tax_split)
    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    try:
        df = pd.DataFrame([inv])
        os.makedirs(config.OUTPUT_FOLDER, exist_ok=True)
        g1(df, f"{config.OUTPUT_FOLDER}/gstr1.csv")
        g3b(df, f"{config.OUTPUT_FOLDER}/gstr3b.csv")
        g9(df, f"{config.OUTPUT_FOLDER}/gstr9.csv")
    except Exception:
        pass  # CSV generation failure is non-fatal

    return jsonify({
        "success": True,
        "filename": inv["filename"],
        "confidence": round(inv["confidence"] * 100, 2),
        "data": {k: inv.get(k) for k in [
            "gstin", "invoice_number", "date",
            "taxable_value", "gst_amount", "total_value",
            "cgst", "sgst", "igst"
        ]},
    }), 200


# ---------------------------------------------------------------------------
# Process multiple invoices
# ---------------------------------------------------------------------------

@app.route("/api/process-multiple", methods=["POST"])
def process_multiple():
    try:
        import cv2, numpy as np, pandas as pd
        from tools.preprocessing_tool import preprocess
        from tools.ocr_tool import extract_text
        from tools.parser_tool import parse_fields
        from tools.gst_engine import calculate_tax_split
        from tools.gstr1_generator import generate as g1
        from tools.gstr3b_generator import generate as g3b
        from tools.gstr9_generator import generate as g9
        import config
    except Exception as e:
        return jsonify({"error": f"Server dependency error: {e}"}), 500

    if "files" not in request.files:
        return jsonify({"error": "No files part in the request"}), 400
    files = request.files.getlist("files")
    if not files or not files[0].filename:
        return jsonify({"error": "No files selected"}), 400

    results, errors = [], []
    for file in files:
        if not allowed_file(file.filename):
            errors.append(f"{file.filename}: unsupported type"); continue
        try:
            results.append(_process_one(file, cv2, np, preprocess, extract_text, parse_fields, calculate_tax_split))
        except Exception as e:
            import traceback; traceback.print_exc()
            errors.append(f"{file.filename}: {e}")

    if not results:
        return jsonify({"error": "No valid invoices processed. " + "; ".join(errors)}), 400

    try:
        df = pd.DataFrame(results)
        os.makedirs(config.OUTPUT_FOLDER, exist_ok=True)
        g1(df, f"{config.OUTPUT_FOLDER}/gstr1.csv")
        g3b(df, f"{config.OUTPUT_FOLDER}/gstr3b.csv")
        g9(df, f"{config.OUTPUT_FOLDER}/gstr9.csv")
    except Exception:
        pass

    avg_conf = sum(float(r.get("confidence", 0)) for r in results) / len(results)
    out = {
        "success": True, "is_multiple": True,
        "file_count": len(results),
        "confidence": round(avg_conf * 100, 2),
        "invoices":   results,
        "summary": {
            k: round(sum(float(r.get(k) or 0) for r in results), 2)
            for k in ["taxable_value", "cgst", "sgst", "igst", "total_value"]
        },
    }
    if errors:
        out["warnings"] = errors
    return jsonify(out), 200


# ---------------------------------------------------------------------------
# Generate CSV from existing invoice data
# ---------------------------------------------------------------------------

@app.route("/api/generate-csv", methods=["POST"])
def generate_csv():
    try:
        import pandas as pd
        from tools.gstr1_generator import generate as g1
        from tools.gstr3b_generator import generate as g3b
        from tools.gstr9_generator import generate as g9
        import config
    except Exception as e:
        return jsonify({"error": f"Server dependency error: {e}"}), 500

    data = request.json
    if not data or "invoices" not in data:
        return jsonify({"error": "No invoice data provided"}), 400

    today = dt_date.today().strftime("%d/%m/%Y")
    for inv in data["invoices"]:
        if not inv.get("date"):
            inv["date"] = today

    df = pd.DataFrame(data["invoices"])
    os.makedirs(config.OUTPUT_FOLDER, exist_ok=True)
    g1(df, f"{config.OUTPUT_FOLDER}/gstr1.csv")
    g3b(df, f"{config.OUTPUT_FOLDER}/gstr3b.csv")
    g9(df, f"{config.OUTPUT_FOLDER}/gstr9.csv")
    return jsonify({"success": True, "message": "CSVs generated"}), 200


# ---------------------------------------------------------------------------
# Core helper — called by both upload routes
# ---------------------------------------------------------------------------

def _process_one(file_storage, cv2, np, preprocess, extract_text, parse_fields, calculate_tax_split):
    from pdf2image import convert_from_path

    filename  = secure_filename(file_storage.filename)
    ext       = filename.rsplit(".", 1)[1].lower() if "." in filename else ""
    tmp_path  = os.path.join(app.config["UPLOAD_FOLDER"], f"{uuid.uuid4()}_{filename}")

    try:
        file_storage.save(tmp_path)
        print(f"[API] Processing: {filename}")

        # Build list of BGR frames
        frames = []
        if ext == "pdf":
            for pil in convert_from_path(tmp_path, dpi=200):
                frames.append(cv2.cvtColor(np.array(pil.convert("RGB")), cv2.COLOR_RGB2BGR))
            if not frames:
                raise ValueError("PDF has no pages.")
        elif ext in {"png", "jpg", "jpeg"}:
            img = cv2.imread(tmp_path)
            if img is None:
                raise ValueError("Could not read image file.")
            frames = [img]
        else:
            raise ValueError(f"Unsupported type: .{ext}")

        # OCR all frames
        full_text, total_conf = "", 0.0
        for frame in frames:
            t, c = extract_text(preprocess(frame))
            full_text += "\n" + t
            total_conf += c

        if not full_text.strip():
            print("[OCR] Warning: no text extracted. Returning empty fields.")
            # Don't crash — let the Validation page show with empty fields
            # so the user can still see the invoice image and enter data manually

        fields = parse_fields(full_text)
        cgst, sgst, igst = calculate_tax_split(
            fields.get("taxable_value"), fields.get("gst_amount")
        )
        if not fields.get("date"):
            fields["date"] = dt_date.today().strftime("%d/%m/%Y")

        return {
            "filename":   filename,
            **fields,
            "cgst":       cgst,
            "sgst":       sgst,
            "igst":       igst,
            "confidence": total_conf / len(frames),
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
