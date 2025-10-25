# services/supabase_client.py
from utils.config import SUPABASE_URL, SUPABASE_KEY
from utils.logger import get_logger

logger = get_logger("supabase_client")

def get_client():
    if not SUPABASE_URL or not SUPABASE_KEY:
        logger.info("Supabase not configured in .env")
        return None
    try:
        from supabase import create_client
        client = create_client(SUPABASE_URL, SUPABASE_KEY)
        return client
    except Exception:
        logger.exception("Failed to create Supabase client")
        return None

def save_report(payload: dict):
    """
    payload example:
      {
         "title": "...", "description": "...", "category": "...",
         "gps": {"lat":..,"lon":..}, "severity": "high", "metadata": {...}
      }
    """
    client = get_client()
    if client is None:
        logger.info("Supabase client not available; skipping DB save")
        return None
    try:
        res = client.table("civic_issues").insert(payload).execute()
        logger.info("Saved report to Supabase")
        return res
    except Exception:
        logger.exception("Failed to save report to Supabase")
        return None
