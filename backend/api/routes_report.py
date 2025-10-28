from fastapi import APIRouter, File, UploadFile, Form
from utils.logger import get_logger
from utils.file_utils import save_upload_temp, remove_file
from utils.validators import validate_image_file
from services.exif_utils import extract_gps_from_file
from services.clip_match import match_passes
from services.image_auth import is_tampered_heuristic
from services.severity_model import predict_severity
from utils.config import CLIP_SIMILARITY_THRESHOLD
from fastapi.responses import JSONResponse

logger = get_logger("api.report")
router = APIRouter()

@router.post("/process-report")
async def process_report(
    title: str = Form(...),
    description: str = Form(...),
    image: UploadFile = File(...)
):
    """
    Pipeline:
    1) Validate and save upload
    2) EXIF GPS check (terminate if missing)
    3) CLIP match check between image and combined text (terminate if mismatch)
    4) Tamper detection (score)
    5) Severity prediction (text only)
    6) Return processed payload (frontend will save to Supabase)
    """

    # Validate MIME and size
    validate_image_file(image)

    # Save to temp
    path = save_upload_temp(image)
    logger.info(f"Saved upload to {path}")

    try:
        # 1) EXIF GPS
        gps = extract_gps_from_file(path)
        if not gps:
            # Terminate process — inform frontend to ask citizen to enable location and re-upload
            return JSONResponse(status_code=400, content={
                "success": False,
                "error": "Image missing GPS EXIF data. Please enable location in camera and re-upload."
            })

        # 2) Match image <-> text (title + description)
        combined_text = f"{title}. {description}"
        passes_match, match_score = match_passes(path, combined_text)
        if not passes_match:
            return JSONResponse(status_code=400, content={
                "success": False,
                "error": "Image does not match the provided title/description.",
                "matching_score": match_score
            })

        # 3) Tamper detection (score)
        tampered, tamper_score = is_tampered_heuristic(path)

        # 4) Severity prediction based on title + description ONLY
        severity_label, severity_score = predict_severity(title, description)

        # Final payload prepared to be sent back to frontend for saving to Supabase
        payload = {
            "title": title,
            "description": description,
            "latitude": gps["lat"],
            "longitude": gps["lon"],
            "matching_score": match_score,
            "tamper_score": tamper_score,
            "tampered": tampered,
            "severity": severity_label,
            "severity_score": severity_score
        }

        # OPTIONAL: Save to Supabase here (commented) — add in your Supabase keys and function
        # from services.supabase_client import save_report
        # save_report(payload)

        return {"success": True, "data": payload}

    except Exception as e:
        logger.exception("Processing failed")
        return JSONResponse(status_code=500, content={"success": False, "error": "Internal server error"})
    finally:
        # cleanup
        remove_file(path)
