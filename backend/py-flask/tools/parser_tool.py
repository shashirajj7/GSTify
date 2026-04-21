"""
parser_tool.py  —  Line-by-line OCR field extractor for GST invoices.

Strategy:
 - Every keyword + amount pair must exist on the SAME line.
 - This prevents phone numbers, addresses, and product codes from
   being misidentified as financial figures.
 - CGST / SGST are summed independently before being returned as gst_amount.
"""

import re
from typing import Optional

# ── Patterns ──────────────────────────────────────────────────────────────────

# Indian GSTIN: 2-digit state, 5-alpha PAN, 4-digit, 1-alpha, 1 check, Z, 1 check
GSTIN_RE = re.compile(
    r'\b([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z])\b'
)

# Currency amount — handles Indian 1,23,456.78 and Western 1,234,567.89
# Must end with 1-2 decimal digits OR not have a following digit
# OCR often reads decimal points as spaces (e.g. '4.90' -> '4 90' or '4. 90')
AMOUNT_RE = re.compile(
    r'(?<![,\d])(\d{1,3}(?:,\d{2,3})*(?:[.\s]\d{1,2})?|\d+[.\s]\d{1,2})(?!\d)'
)


# Invoice number labels
INV_NO_RE = re.compile(
    r'(?:invoice\s*(?:no\.?|number|#|num)|'
    r'bill\s*(?:no\.?|number)|'
    r'inv\s*(?:no\.?|#|num)|'
    r'receipt\s*(?:no\.?|number|#))'
    r'\s*[:\-#]?\s*([A-Z0-9][A-Z0-9/\-]{1,30})',
    re.IGNORECASE,
)

# Date patterns
DATE_RE = re.compile(
    r'\b(\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{2,4}|\d{4}[/\-]\d{2}[/\-]\d{2})\b'
)

# ── Amount keyword lists ───────────────────────────────────────────────────────

TAXABLE_KWS = [
    'taxable value', 'taxable amount', 'taxable val',
    'total exclude gst', 'total excl gst', 'excl. gst', 'excl gst',
    'subtotal', 'sub total', 'sub-total',
    'net amount', 'net value', 'basic amount', 'base amount',
    'assessable value', 'value before tax', 'amount before tax',
]

CGST_KWS  = ['cgst']
SGST_KWS  = ['sgst', 'utgst']
IGST_KWS  = ['igst']

GST_TOTAL_KWS = [
    'total gst', 'gst amount', 'gst total', 'total tax', 'tax amount',
    'total inclusive gst',   # catches "Total Inclusive GST" as an alternative
]

TOTAL_KWS = [
    'grand total', 'net payable', 'amount payable', 'total payable',
    'invoice total', 'net total', 'total amount',
    'total due', 'balance due', 'amount due',
    'total:', 'total ',              # broad catches — lowest priority
]


# ── Helpers ───────────────────────────────────────────────────────────────────

def _amounts_in_line(line: str):
    """Return all numeric amounts found in a line, as floats (right-to-left order)."""
    raw = AMOUNT_RE.findall(line)
    results = []
    for s in raw:
        try:
            # Fix OCR errors where decimal point is read as space "4 90" -> "4.90"
            if " " in s:
                s = s.replace(" ", ".")
            # Fix OCR errors where comma is read as decimal point (193,00)
            if "," in s and len(s) - 1 - s.rfind(",") == 2:
                s = s.rsplit(",", 1)[0].replace(",", "") + "." + s.split(",")[-1]
            val = float(s.replace(',', ''))
            results.append(val)
        except ValueError:
            pass
    return results


def _last_amount(line: str) -> Optional[float]:
    """The rightmost (last) amount on a line — usually the currency value in billing."""
    amounts = _amounts_in_line(line)
    return amounts[-1] if amounts else None


def _norm(text: str) -> str:
    """Lowercase and collapse whitespace."""
    return re.sub(r'\s+', ' ', text.strip().lower())


# ── Main entry ────────────────────────────────────────────────────────────────

def parse_fields(raw_text: str) -> dict:
    """
    Parse OCR text and return a dict with:
        gstin, invoice_number, date,
        taxable_value, gst_amount, total_value
    All values default to None if not found.
    """
    lines = raw_text.split('\n')
    norm_lines = [(_norm(l), l) for l in lines]  # (normalised, original)

    result = {
        'gstin':          None,
        'invoice_number': None,
        'date':           None,
        'taxable_value':  None,
        'gst_amount':     None,
        'total_value':    None,
    }

    cgst_val = None
    sgst_val = None
    igst_val = None

    # ── Pass 1: GSTIN ─────────────────────────────────────────────────────────
    for _, orig in norm_lines:
        m = GSTIN_RE.search(orig.upper())
        if m:
            result['gstin'] = m.group(1)
            break

    # ── Pass 2: Invoice number ─────────────────────────────────────────────────
    for norm, orig in norm_lines:
        m = INV_NO_RE.search(orig)
        if m:
            candidate = m.group(1).strip().rstrip('.,;')
            if 3 <= len(candidate) <= 30:
                result['invoice_number'] = candidate
                break

    # ── Pass 3: Date ──────────────────────────────────────────────────────────
    for norm, orig in norm_lines:
        if 'date' in norm:
            m = DATE_RE.search(orig)
            if m:
                result['date'] = m.group(1)
                break
    if not result['date']:
        for norm, orig in norm_lines:
            m = DATE_RE.search(orig)
            if m:
                result['date'] = m.group(1)
                break

    # ── Pass 4: Financial amounts (line-by-line) ───────────────────────────────
    # We iterate every line; keyword and amount must be on the SAME line.

    candidates_total = []   # gather multiple "total" matches; pick the greatest

    for norm, orig in norm_lines:
        amt = _last_amount(orig)
        if amt is None:
            continue

        # Taxable value — first hit wins
        if result['taxable_value'] is None:
            for kw in TAXABLE_KWS:
                if kw in norm:
                    result['taxable_value'] = amt
                    break

        # CGST — update to latest (some invoices list CGST per line-item)
        for kw in CGST_KWS:
            if kw in norm and not any(x in norm for x in ['sgst', 'igst']):
                cgst_val = amt
                break

        # SGST / UTGST
        for kw in SGST_KWS:
            if kw in norm:
                sgst_val = amt
                break

        # IGST
        for kw in IGST_KWS:
            if kw in norm:
                igst_val = amt
                break

        # Explicit GST total
        if result['gst_amount'] is None:
            for kw in GST_TOTAL_KWS:
                if kw in norm:
                    result['gst_amount'] = amt
                    break

        # Total — collect candidates
        for kw in TOTAL_KWS:
            if kw in norm:
                candidates_total.append(amt)
                break

    # ── Resolve GST amount ────────────────────────────────────────────────────
    if result['gst_amount'] is None:
        if cgst_val is not None and sgst_val is not None:
            result['gst_amount'] = round(cgst_val + sgst_val, 2)
        elif igst_val is not None:
            result['gst_amount'] = igst_val
        elif cgst_val is not None:
            result['gst_amount'] = round(cgst_val * 2, 2)   # assume equal SGST

    # ── Resolve total ──────────────────────────────────────────────────────────
    if candidates_total:
        # Prefer the largest "total" candidate — grand total is >= sub-totals
        result['total_value'] = max(candidates_total)

    # ── Derivations ───────────────────────────────────────────────────────────
    tv  = result['taxable_value']
    gst = result['gst_amount']
    tot = result['total_value']

    if tot and tv and tot > tv * 2:
        if abs((tot / 100) - tv) <= tv * 0.5:
            tot = tot / 100
            result['total_value'] = tot
        else:
            tot, result['total_value'] = None, None

    if tv and gst and not tot:
        result['total_value'] = round(tv + gst, 2)

    if tot and gst and not tv:
        derived = round(tot - gst, 2)
        if derived > 0:
            result['taxable_value'] = derived

    if tot and tv and not gst:
        derived = round(tot - tv, 2)
        if derived >= 0:
            result['gst_amount'] = derived

    if tot and not tv and not gst:
        # User requested derivation: treat total as inclusive of 18% GST (9% CGST / 9% SGST)
        tv = round(tot / 1.18, 2)
        result['taxable_value'] = tv
        result['gst_amount'] = round(tot - tv, 2)

    # ── Sanity check ──────────────────────────────────────────────────────────
    # If total < taxable, something went wrong — reset the bad value
    if result['total_value'] and result['taxable_value']:
        if result['total_value'] < result['taxable_value'] * 0.95:
            # Likely picked up wrong taxable line; trust only total
            result['taxable_value'] = None
            result['gst_amount']    = None

    return result