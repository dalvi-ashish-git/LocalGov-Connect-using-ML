import os
from uuid import uuid4
from utils.config import TEMP_UPLOAD_DIR

def save_upload_temp(upload_file):
    ext = os.path.splitext(upload_file.filename)[1] or ".jpg"
    fname = f"{uuid4().hex}{ext}"
    path = os.path.join(TEMP_UPLOAD_DIR, fname)
    with open(path, "wb") as f:
        f.write(upload_file.file.read())
    return path

def remove_file(path):
    try:
        os.remove(path)
    except Exception:
        pass
