import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import joblib

BASE = os.path.dirname(os.path.dirname(__file__))
MODEL_DIR = os.path.join(BASE, "models")
os.makedirs(MODEL_DIR, exist_ok=True)

data_path = os.path.join(os.path.dirname(__file__), "severity_dataset.csv")

if not os.path.exists(data_path):
    print("Create train/severity_dataset.csv first.")
    raise SystemExit

df = pd.read_csv(data_path)

df['text'] = df['title'].fillna('') + ". " + df['description'].fillna('')

X = df['text']
y = df['severity']

Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42, stratify=None) # stratify=y

vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1,2))
Xtr_tfidf = vectorizer.fit_transform(Xtr)
Xte_tfidf = vectorizer.transform(Xte)

clf = LogisticRegression(max_iter=400)
clf.fit(Xtr_tfidf, ytr)

print("Train done. Test accuracy:", clf.score(Xte_tfidf, yte))

joblib.dump(clf, os.path.join(MODEL_DIR, "severity_model.joblib"))
joblib.dump(vectorizer, os.path.join(MODEL_DIR, "vectorizer.pkl"))
print("Saved model to models/")
