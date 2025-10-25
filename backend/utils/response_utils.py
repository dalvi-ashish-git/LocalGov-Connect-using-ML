# utils/response_utils.py
from fastapi import HTTPException

def success(data=None, message="OK"):
    return {"success": True, "message": message, "data": data}

def fail(message="Error", code=400):
    raise HTTPException(status_code=code, detail={"success": False, "error": message})
