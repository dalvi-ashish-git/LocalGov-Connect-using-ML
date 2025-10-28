import os
import joblib
from utils.logger import get_logger
from utils.config import SEVERITY_MODEL_PATH, VECTORIZER_PATH

logger = get_logger("severity_model")

model = None
vectorizer = None

def load_model():
    global model, vectorizer
    if model is not None and vectorizer is not None:
        return
    if os.path.exists(SEVERITY_MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
        try:
            model = joblib.load(SEVERITY_MODEL_PATH)
            vectorizer = joblib.load(VECTORIZER_PATH)
            logger.info("Loaded severity model and vectorizer")
        except Exception:
            logger.exception("Failed to load severity model")
            model = None
            vectorizer = None
    else:
        logger.info("Severity model files not found; run train/train_severity.py")

def predict_severity(title, description, category=None):
    """
    Returns (label, score). Label in {'low','medium','high'}
    This function uses text-only model (title + description).
    """
    load_model()
    text = f"{title}. {description}"
    if model is None or vectorizer is None:
        # fallback heuristic
        txt = text.lower()
        if any(k in txt for k in ["fire","accident","flood","collapse","death","electrocute"]):
            return "high", 0.95
        if any(k in txt for k in ["pothole","garbage","leak","overflow","broken"]):
            return "medium", 0.75
        return "low", 0.5
    try:
        X = vectorizer.transform([text])
        proba = model.predict_proba(X)[0]
        idx = proba.argmax()
        label = model.classes_[idx]
        return str(label), float(proba[idx])
    except Exception:
        logger.exception("Severity model inference failed; using fallback")
        return "low", 0.5
