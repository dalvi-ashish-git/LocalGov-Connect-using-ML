import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Supabase (optional)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Model files (severity model must be trained once)
SEVERITY_MODEL_PATH = os.getenv("SEVERITY_MODEL_PATH", "models/severity_model.joblib")
VECTORIZER_PATH = os.getenv("VECTORIZER_PATH", "models/vectorizer.pkl")

CLIP_MODEL_NAME = os.getenv("CLIP_MODEL_NAME", "openai/clip-vit-base-patch32")

# thresholds
CLIP_SIMILARITY_THRESHOLD = float(os.getenv("CLIP_SIMILARITY_THRESHOLD", 0.20))
TAMPER_ELA_THRESHOLD = float(os.getenv("TAMPER_ELA_THRESHOLD", 40.0))

# temp upload
TEMP_UPLOAD_DIR = os.getenv("TEMP_UPLOAD_DIR", "temp_uploads")
os.makedirs(TEMP_UPLOAD_DIR, exist_ok=True)
