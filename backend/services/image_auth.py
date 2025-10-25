# services/image_auth.py
from PIL import Image, ImageChops, ImageEnhance
import numpy as np
from utils.logger import get_logger
from utils.config import TAMPER_ELA_THRESHOLD, TAMPER_MODEL_PATH
import os
import joblib

logger = get_logger("image_auth")

# Optional: lazy-loaded tamper model (if you train one)
tamper_model = None
tamper_model_loaded = False
tamper_model_path = TAMPER_MODEL_PATH

def _compute_ela_image(path, quality=90):
    try:
        orig = Image.open(path).convert("RGB")
        from io import BytesIO
        tmp = BytesIO()
        orig.save(tmp, "JPEG", quality=quality)
        tmp.seek(0)
        comp = Image.open(tmp)
        ela = ImageChops.difference(orig, comp)
        extrema = ela.getextrema()
        max_diff = max([e[1] for e in extrema]) if extrema else 0
        factor = 255 // max(1, max_diff)
        ela = ImageEnhance.Brightness(ela).enhance(factor)
        return ela
    except Exception:
        logger.exception("ELA generation failed")
        return None

def _ela_score_from_image(ela_image):
    if ela_image is None:
        return 0.0
    arr = np.asarray(ela_image).astype(np.float32)
    return float(np.mean(arr))

def ela_score(path):
    ela = _compute_ela_image(path)
    return _ela_score_from_image(ela)

def is_tampered_heuristic(path, threshold=TAMPER_ELA_THRESHOLD):
    """
    Returns (bool_tampered, score)
    Heuristic based on ELA mean.
    """
    try:
        score = ela_score(path)
        logger.info(f"ELA score: {score:.2f}")
        return (score > threshold, score)
    except Exception:
        logger.exception("Tamper heuristic failed")
        return (False, 0.0)

def _load_tamper_model():
    global tamper_model, tamper_model_loaded
    if tamper_model_loaded:
        return
    if os.path.exists(tamper_model_path):
        try:
            tamper_model = joblib.load(tamper_model_path)
            tamper_model_loaded = True
            logger.info("Loaded tamper model")
        except Exception:
            logger.exception("Failed to load tamper model")
    else:
        logger.info("No tamper model found; using heuristic.")

# public function to check tampering (tries model then falls back)
def is_tampered(path):
    _load_tamper_model()
    # If model exists, call it (assuming model takes ELA features). Here fallback to heuristic.
    if tamper_model_loaded and tamper_model is not None:
        try:
            # Example: model expects features [mean,std,max]; compute them
            ela = _compute_ela_image(path)
            arr = np.asarray(ela).astype(np.float32)
            feat = [float(arr.mean()), float(arr.std()), float(arr.max())]
            pred = tamper_model.predict([feat])[0]
            score = tamper_model.predict_proba([feat])[0].max()
            return (bool(pred), float(score))
        except Exception:
            logger.exception("Tamper model inference failed, using heuristic")
    return is_tampered_heuristic(path, threshold=TAMPER_ELA_THRESHOLD)
