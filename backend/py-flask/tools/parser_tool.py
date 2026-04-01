import re
from typing import Optional

# ---------------------------------------------------------------------------
# Regex Patterns
# ---------------------------------------------------------------------------

# Standard 15-character GSTIN format
GSTIN_PATTERN = r"\b\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b"

# Date: DD/MM/YYYY or DD-MM-YYYY or YYYY-MM-DD
DATE_PATTERN = r"\b(\d{4}[-/]\d{2}[-/]\d{2}|\d{2}[-/]\d{2}[-/]\d{4})\b"

# Amount pattern — matches:
#   1,00,000.00  |  1000.00  |  1,000  |  1000  |  10 000.00
# Does NOT require decimal part anymore (fixes the ".00 required" bug)
AMOUNT_PATTERN = r"(?<!\d)(\d{1,3}(?:[,\s]\d{2,3})*(?:\.\d{1,2})?)(?!\d)"

# Minimum amount threshold — ignore tiny numbers (qty, HSN codes, page numbers)
MIN_AMOUNT = 10.0


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _clean_amount(val_str: str) -> Optional[float]:
    """Strip commas/spaces and convert to float. Returns None on failure."""
    try:
        return float(val_str.replace(",", "").replace(" ", ""))
    except (ValueError, AttributeError):
        return None


def extract_number_from_line(line: str) -> Optional[float]:
    """
    Find all monetary amounts on a line and return the last (rightmost) one.
    The last number on a line is almost always the actual value column.
    """
    matches = re.findall(AMOUNT_PATTERN, line)
    if not matches:
        return None

    # Walk matches from right to left, return first valid amount ≥ MIN_AMOUNT
    for val_str in reversed(matches):
        val = _clean_amount(val_str)
        if val is not None and val >= MIN_AMOUNT:
            return val
    return None


# ---------------------------------------------------------------------------
# Main parser
# ---------------------------------------------------------------------------

def parse_fields(text: str) -> dict:
    """
    Parse key GST invoice fields from raw OCR text.
    Returns a dict with keys:
        gstin, invoice_number, date, taxable_value, gst_amount, total_value
    """
    lines = text.split("\n")

    gstin = None
    date = None
    invoice_number = None
    subtotal = None
    gst_amount = None          # will accumulate CGST + SGST or IGST
    total = None

    for i, line in enumerate(lines):
        line_upper = line.strip().upper()
        if not line_upper:
            continue

        # ── GSTIN ──────────────────────────────────────────────────────────
        if not gstin:
            m = re.search(GSTIN_PATTERN, line_upper)
            if m:
                gstin = m.group()

        # ── Date ──────────────────────────────────────────────────────────
        if not date:
            m = re.search(DATE_PATTERN, line_upper)
            if m:
                raw_date = m.group()
                # Normalise YYYY-MM-DD → DD/MM/YYYY
                if re.match(r"\d{4}[-/]\d{2}[-/]\d{2}", raw_date):
                    parts = re.split(r"[-/]", raw_date)
                    date = f"{parts[2]}/{parts[1]}/{parts[0]}"
                else:
                    date = raw_date.replace("-", "/")

        # ── Invoice Number ─────────────────────────────────────────────────
        if not invoice_number:
            # Primary: explicit label before the number
            m = re.search(
                r"(?:INVOICE|INV|RECEIPT|BILL|VOUCHER)"
                r"[\s\.:#-]*(?:NO|NUMBER|NO\.)?[\s\.:#-]*"
                r"([A-Z0-9][A-Z0-9/\-]{2,})",
                line_upper
            )
            if m:
                candidate = m.group(1).strip("/:- ")
                # Filter out noise tokens
                if candidate not in ("NO", "DATE", "OICE", "VOICE", "NUMBER"):
                    invoice_number = candidate

            # Fallback: OCR sometimes drops the "INV" prefix — look for a
            # standalone alphanumeric token that resembles an invoice ID
            if not invoice_number:
                m = re.search(r"(?:OICE|INV)[^A-Z0-9]*([A-Z0-9][A-Z0-9/\-]{3,})", line_upper)
                if m:
                    candidate = m.group(1).strip("/:- ")
                    if candidate not in ("OICE", "VOICE", "NO", "DATE"):
                        invoice_number = candidate

        # ── Taxable Value / Subtotal ────────────────────────────────────────
        if re.search(r"\b(SUBTOTAL|TAXABLE\s*VALUE|SUB\s*TOTAL|TAXABLE\s*AMT)\b", line_upper):
            val = extract_number_from_line(line_upper)
            if val and (subtotal is None or val > subtotal):
                subtotal = val

        # ── GST Amount (CGST / SGST / IGST lines) ──────────────────────────
        # Match explicit GST component labels; avoid GSTIN lines.
        if re.search(r"\b(CGST|SGST|IGST|UTGST)\b", line_upper):
            val = extract_number_from_line(line_upper)
            if val:
                gst_amount = (gst_amount or 0.0) + val

        elif re.search(r"\bGST\b", line_upper) and "GSTIN" not in line_upper and "EXCLUD" not in line_upper:
            # Generic "GST" or "Total GST" line (accumulate)
            val = extract_number_from_line(line_upper)
            if val:
                gst_amount = (gst_amount or 0.0) + val

        # ── Total ──────────────────────────────────────────────────────────
        # Match "TOTAL" but exclude sub-totals and taxable value lines
        if re.search(r"\bGRAND\s*TOTAL\b", line_upper):
            val = extract_number_from_line(line_upper)
            if val:
                total = val  # Grand Total wins outright
        elif re.search(r"\bTOTAL\b", line_upper) and not re.search(
            r"\b(SUB\s*TOTAL|TAXABLE|CGST|SGST|IGST|UTGST)\b", line_upper
        ):
            val = extract_number_from_line(line_upper)
            if val and (total is None or val > total):
                total = val

    # ── Fallback: derive missing values ────────────────────────────────────

    # If still no total, take the largest amount in the whole document
    if total is None:
        all_amounts = [extract_number_from_line(l.upper()) for l in lines]
        valid = [a for a in all_amounts if a is not None]
        if valid:
            total = max(valid)

    # If subtotal missing but we have total + GST, derive it
    if total is not None and gst_amount is not None and subtotal is None:
        derived = round(total - gst_amount, 2)
        if derived > 0:
            subtotal = derived

    # If GST is missing but subtotal and total exist, derive it
    if gst_amount is None and subtotal is not None and total is not None:
        derived_gst = round(total - subtotal, 2)
        if derived_gst > 0:
            gst_amount = derived_gst

    return {
        "gstin": gstin,
        "invoice_number": invoice_number,
        "date": date,
        "taxable_value": subtotal if subtotal is not None else total,
        "gst_amount": gst_amount,
        "total_value": total,
    }