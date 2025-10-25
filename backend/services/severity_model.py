# services/severity_model.py
import os
import joblib
from utils.logger import get_logger
from utils.config import SEVERITY_MODEL_PATH, VECTORIZER_PATH

logger = get_logger("severity_model")

model = None
vectorizer = None

def _load_model():
    global model, vectorizer
    if model is not None and vectorizer is not None:
        return
    if os.path.exists(SEVERITY_MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
        try:
            model = joblib.load(SEVERITY_MODEL_PATH)
            vectorizer = joblib.load(VECTORIZER_PATH)
            logger.info("Loaded severity model & vectorizer")
        except Exception:
            logger.exception("Failed to load severity model; will use fallback heuristics")
            model = None
            vectorizer = None
    else:
        logger.info("Severity model or vectorizer not found; using rule-based fallback")

def predict_severity(title, description, category):
    """
    Returns (label, score)
    label in {"low","medium","high"}
    score: confidence 0-1
    """
    _load_model()
    text = f"{category}. {title}. {description}"
    if model is None or vectorizer is None:
        # simple rule-based fallback
        txt = text.lower()
        if any(k in txt for k in ["fire", "death", "fatal", "accident", "collapsed", "flood"]):
            return "high", 0.9
        if any(k in txt for k in ["pothole", "garbage", "leak", "overflow"]):
            return "medium", 0.7
        return "low", 0.5
    try:
        X = vectorizer.transform([text])
        proba = model.predict_proba(X)[0]
        idx = proba.argmax()
        label = model.classes_[idx]
        return str(label), float(proba[idx])
    except Exception:
        logger.exception("Severity model inference failed; using fallback")
        return "low", 0.4
