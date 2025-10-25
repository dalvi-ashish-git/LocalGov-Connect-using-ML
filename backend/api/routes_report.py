# api/routes_report.py
from fastapi import APIRouter, File, UploadFile, Form, Depends
from utils.logger import get_logger
from utils.response_utils import success, fail
from utils.file_utils import save_upload_temp, remove_file
from utils.validators import validate_image_file
from services.image_auth import is_tampered
from services.exif_utils import extract_gps_from_file
from services.clip_match import match_passes
from services.severity_model import predict_severity
from services.supabase_client import save_report

logger = get_logger("api.report")
router = APIRouter()

@router.post("/report/process")
async def process_report(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    citizen_id: str = Form(None),
    image: UploadFile = File(...)
):
    # Validate file
    validate_image_file(image)

    # Save to temp
    path = save_upload_temp(image)

    try:
        # 1. Tamper check
        tampered, tamper_score = is_tampered(path)
        if tampered:
            return fail({"reason": "tampered_image", "score": tamper_score}, code=400)

        # 2. EXIF GPS extraction
        gps = extract_gps_from_file(path)
        if not gps:
            return fail("Image missing GPS EXIF data. Please enable location and re-upload.", code=400)

        # 3. CLIP match
        combined_text = f"{category}. {title}. {description}"
        passes, matching_score = match_passes(path, combined_text)
        if not passes:
            return fail({"reason": "image_text_mismatch", "score": matching_score}, code=400)

        # 4. Severity prediction
        severity_label, severity_score = predict_severity(title, description, category)

        # 5. Build payload and optionally save to Supabase
        payload = {
            "title": title,
            "description": description,
            "category": category,
            "citizen_id": citizen_id,
            "gps": gps,
            "severity": severity_label,
            "severity_score": severity_score,
            "matching_score": matching_score,
            "tamper_score": tamper_score
        }

        # Attempt to save to Supabase (if configured). Supabase client logs if not configured.
        save_report(payload)

        return success(data=payload, message="Report processed and stored (if configured).")

    finally:
        # cleanup temp file
        remove_file(path)
