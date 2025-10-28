from PIL import Image, ImageChops, ImageEnhance
import numpy as np
from utils.logger import get_logger
from utils.config import TAMPER_ELA_THRESHOLD
import os

logger = get_logger("image_auth")

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
        logger.exception("ELA failed")
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
    Returns (boolean_tampered, score)
    """
    try:
        score = ela_score(path)
        logger.info(f"ELA score: {score:.2f}")
        return (score > threshold, score)
    except Exception:
        logger.exception("Tamper check failed")
        return (False, 0.0)
