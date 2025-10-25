# utils/validators.py
from fastapi import UploadFile
from fastapi import HTTPException

ALLOWED_MIME = {"image/jpeg", "image/png"}

def validate_image_file(upload_file: UploadFile, max_size_mb: int = 8):
    if upload_file.content_type not in ALLOWED_MIME:
        raise HTTPException(status_code=400, detail="Invalid image type")
    upload_file.file.seek(0, 2)
    size = upload_file.file.tell()
    upload_file.file.seek(0)
    if size > max_size_mb * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large")
    return True
