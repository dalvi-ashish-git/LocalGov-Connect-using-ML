# train/train_tamper.py
import os
import numpy as np
from PIL import Image, ImageChops, ImageEnhance
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

def compute_ela_features(path, quality=90):
    img = Image.open(path).convert("RGB")
    from io import BytesIO
    tmp = BytesIO()
    img.save(tmp, "JPEG", quality=quality)
    tmp.seek(0)
    comp = Image.open(tmp)
    ela = ImageChops.difference(img, comp)
    extrema = ela.getextrema()
    max_diff = max([e[1] for e in extrema]) if extrema else 0
    factor = 255 // max(1, max_diff)
    ela = ImageEnhance.Brightness(ela).enhance(factor)
    arr = np.asarray(ela).astype(np.float32)
    return [float(arr.mean()), float(arr.std()), float(arr.max())]

def main():
    ds_path = os.path.join(os.path.dirname(__file__), "tamper_dataset.csv")
    if not os.path.exists(ds_path):
        print("Create train/tamper_dataset.csv with image_path,label")
        return
    lines = open(ds_path).read().strip().splitlines()
    header = lines[0]
    rows = lines[1:]
    X = []
    y = []
    for r in rows:
        parts = r.split(",")
        img_path = parts[0].strip()
        label = int(parts[1].strip())
        if not os.path.exists(img_path):
            print("Missing:", img_path)
            continue
        feats = compute_ela_features(img_path)
        X.append(feats)
        y.append(label)
    X = np.array(X)
    y = np.array(y)
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
    clf = RandomForestClassifier(n_estimators=200)
    clf.fit(Xtr, ytr)
    pred = clf.predict(Xte)
    print(classification_report(yte, pred))
    os.makedirs(os.path.join(os.path.dirname(__file__), "..", "models"), exist_ok=True)
    joblib.dump(clf, os.path.join(os.path.dirname(__file__), "..", "models", "tamper_ela_rf.joblib"))
    print("Saved tamper model.")

if __name__ == "__main__":
    main()
