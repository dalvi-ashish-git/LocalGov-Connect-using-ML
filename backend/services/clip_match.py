# services/clip_match.py
from utils.logger import get_logger
from utils.config import CLIP_MODEL_NAME, CLIP_SIMILARITY_THRESHOLD
import torch
from PIL import Image
import os

logger = get_logger("clip_match")

# We'll try to lazy-load CLIP (HuggingFace Transformers). If not present, fall back to simple keyword match.
model = None
processor = None
device = "cuda" if torch.cuda.is_available() else "cpu"
clip_available = False

def _try_load_clip():
    global model, processor, clip_available
    if model is not None:
        return
    try:
        from transformers import CLIPProcessor, CLIPModel
        model = CLIPModel.from_pretrained(CLIP_MODEL_NAME).to(device)
        processor = CLIPProcessor.from_pretrained(CLIP_MODEL_NAME)
        clip_available = True
        logger.info("Loaded CLIP model")
    except Exception:
        logger.exception("Failed to load CLIP. Falling back to keyword-based matching.")
        clip_available = False

def clip_similarity(image_path, text):
    _try_load_clip()
    if not clip_available:
        # fallback: simple token overlap / keyword check
        txt = text.lower()
        image_fname = os.path.basename(image_path).lower()
        keywords = [w for w in txt.split() if len(w) > 3]
        matches = sum(1 for k in keywords if k in image_fname)
        # normalized pseudo-score
        score = matches / max(1, len(keywords))
        return float(score)
    try:
        image = Image.open(image_path).convert("RGB")
        inputs = processor(text=[text], images=image, return_tensors="pt", padding=True).to(device)
        with torch.no_grad():
            outputs = model(**inputs)
            img_emb = outputs.image_embeds
            txt_emb = outputs.text_embeds
            img_emb = img_emb / img_emb.norm(p=2, dim=-1, keepdim=True)
            txt_emb = txt_emb / txt_emb.norm(p=2, dim=-1, keepdim=True)
            sim = (img_emb @ txt_emb.T).cpu().numpy().item()
            return float(sim)
    except Exception:
        logger.exception("CLIP similarity failed")
        return -1.0

def match_passes(image_path, text, threshold=CLIP_SIMILARITY_THRESHOLD):
    score = clip_similarity(image_path, text)
    logger.info(f"CLIP / fallback score: {score}")
    return (score >= threshold, float(score))
