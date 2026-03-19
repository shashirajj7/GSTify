import os
import re
from datetime import date as dt_date
import uuid
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Fix OpenMP error from original script
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"


from tools.parser_tool import parse_fields
from tools.gst_engine import calculate_tax_split
import config
from tools.gstr1_generator import generate as generate_gstr1
from tools.gstr3b_generator import generate as generate_gstr3b
from tools.gstr9_generator import generate as generate_gstr9

app = Flask(__name__)
# Allow CORS for the React frontend (running on Vite's default ports or any local port)

CORS_ORIGINS_RE = re.compile(
    r"^https://[\w\-]+(\.vercel\.app)$"
    r"|^http://localhost(:\d+)?$"
    r"|^http://127\.0\.0\.1(:\d+)?$"
)

def cors_origin_allowed(origin):
    return bool(origin and CORS_ORIGINS_RE.match(origin))

CORS(app, resources={
    r"/*": {
        "origins": cors_origin_allowed,
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'temp_uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # 16 MB max upload size

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "AI Agent API is running"}), 200

@app.route('/api/process-invoice', methods=['POST'])
def process_invoice():
    from tools.preprocessing_tool import preprocess
    from tools.ocr_tool import extract_text
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No file selected for uploading"}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add a UUID to prevent filename collisions
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        try:
            # Save temporary file
            file.save(file_path)
            
            # Step 1: Preprocess (Warning: if it's a PDF, preprocess needs to handle it or we limit to images)
            # The original script says it only processed .png, .jpg, .jpeg
            if not filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                 return jsonify({"error": "Only image formats (PNG, JPG, JPEG) are supported by the OCR engine currently."}), 400
                 
            print(f"[API] Processing file: {unique_filename}")
            processed_img = preprocess(file_path)
            
            # Step 2: OCR Extraction
            text, confidence = extract_text(processed_img)
            
            if not text.strip():
                return jsonify({"error": "OCR Engine failed to extract any text. Confirm Tesseract-OCR is installed on your Windows system and added to your PATH."}), 500

            # Step 3: Parse fields
            fields = parse_fields(text)
            
            # Step 4: GST Logic
            cgst, sgst, igst = calculate_tax_split(
                fields.get("taxable_value"),
                fields.get("gst_amount")
            )
            
            # Step 5: Store invoice and Generate CSV
            # Use today's date as upload date if parser couldn't extract one
            if not fields.get("date"):
                fields["date"] = dt_date.today().strftime("%d/%m/%Y")
            invoice_data = {
                "filename": filename,
                **fields,
                "cgst": cgst,
                "sgst": sgst,
                "igst": igst,
                "confidence": confidence
            }
            invoice_store = pd.DataFrame([invoice_data])
            os.makedirs(config.OUTPUT_FOLDER, exist_ok=True)
            
            generate_gstr1(invoice_store, f"{config.OUTPUT_FOLDER}/gstr1.csv")
            generate_gstr3b(invoice_store, f"{config.OUTPUT_FOLDER}/gstr3b.csv")
            generate_gstr9(invoice_store, f"{config.OUTPUT_FOLDER}/gstr9.csv")
            
            # Prepare Response
            result = {
                "success": True,
                "filename": filename,
                "confidence": round(confidence * 100, 2), # Send as percentage
                "data": {
                    "gstin": fields.get("gstin"),
                    "invoice_number": fields.get("invoice_number"),
                    "date": fields.get("date"),
                    "taxable_value": fields.get("taxable_value"),
                    "gst_amount": fields.get("gst_amount"),
                    "total_value": fields.get("total_value"),
                    "cgst": cgst,
                    "sgst": sgst,
                    "igst": igst
                }
            }
            
            return jsonify(result), 200
            
        except Exception as e:
            print(f"[API] Error processing file {filename}: {e}")
            return jsonify({"error": str(e)}), 500
            
        finally:
            # Clean up the temporary file
            if os.path.exists(file_path):
                os.remove(file_path)
    else:
        return jsonify({"error": "Allowed file types are png, jpg, jpeg"}), 400

@app.route('/api/process-multiple', methods=['POST'])
def process_multiple():
    from tools.preprocessing_tool import preprocess
    from tools.ocr_tool import extract_text
    if 'files' not in request.files:
        return jsonify({"error": "No files part in the request"}), 400
        
    files = request.files.getlist('files')
    
    if not files or files[0].filename == '':
        return jsonify({"error": "No files selected for uploading"}), 400
        
    invoices_data = []
    total_taxable = 0.0
    total_cgst = 0.0
    total_sgst = 0.0
    total_igst = 0.0
    total_value = 0.0
    avg_confidence = 0.0
    
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            
            try:
                file.save(file_path)
                if not filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                     continue
                     
                processed_img = preprocess(file_path)
                text, confidence = extract_text(processed_img)
                
                if not text.strip():
                    continue

                fields = parse_fields(text)
                cgst, sgst, igst = calculate_tax_split(
                    fields.get("taxable_value"),
                    fields.get("gst_amount")
                )
                
                # Use today's date as upload date if parser couldn't extract one
                if not fields.get("date"):
                    fields["date"] = dt_date.today().strftime("%d/%m/%Y")

                invoice_data = {
                    "filename": filename,
                    **fields,
                    "cgst": cgst,
                    "sgst": sgst,
                    "igst": igst,
                    "confidence": confidence
                }
                
                invoices_data.append(invoice_data)
                
                total_taxable += float(fields.get("taxable_value") or 0.0)
                total_cgst += float(cgst or 0.0)
                total_sgst += float(sgst or 0.0)
                total_igst += float(igst or 0.0)
                total_value += float(fields.get("total_value") or 0.0)
                avg_confidence += float(confidence or 0.0)
                
            except Exception as e:
                print(f"[API] Error processing file {filename}: {e}")
            finally:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    
    if not invoices_data:
        return jsonify({"error": "No valid invoices could be processed."}), 400
        
    invoice_store = pd.DataFrame(invoices_data)
    os.makedirs(config.OUTPUT_FOLDER, exist_ok=True)
    
    generate_gstr1(invoice_store, f"{config.OUTPUT_FOLDER}/gstr1.csv")
    generate_gstr3b(invoice_store, f"{config.OUTPUT_FOLDER}/gstr3b.csv")
    generate_gstr9(invoice_store, f"{config.OUTPUT_FOLDER}/gstr9.csv")
    
    avg_confidence = float(avg_confidence) / len(invoices_data)
    
    result = {
        "success": True,
        "is_multiple": True,
        "file_count": len(invoices_data),
        "confidence": round(avg_confidence * 100, 2),
        "invoices": invoices_data,
        "summary": {
            "taxable_value": round(float(total_taxable), 2),
            "cgst": round(float(total_cgst), 2),
            "sgst": round(float(total_sgst), 2),
            "igst": round(float(total_igst), 2),
            "total_value": round(float(total_value), 2)
        }
    }
    return jsonify(result), 200

@app.route('/api/generate-csv', methods=['POST'])
def generate_csv():
    data = request.json
    if not data or 'invoices' not in data:
        return jsonify({"error": "No invoice data provided"}), 400
        
    invoices_data = data['invoices']
    batch_name = data.get('batch_name', 'Batch Upload')
    
    # Ensure every invoice has a date (upload date fallback)
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
    return "GSTify Backend is Running 🚀"

if __name__ == '__main__':
    # Run the Flask app on port 5000
    app.run(debug=True, host='0.0.0.0', port=5000)
