# train/train_severity.py
import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
from utils.config import SEVERITY_MODEL_PATH, VECTORIZER_PATH, BASE_DIR

def main():
    data_path = os.path.join(os.path.dirname(__file__), "dataset.csv")
    if not os.path.exists(data_path):
        print("Create train/dataset.csv first. Example rows:")
        print('title,description,category,severity')
        return
    df = pd.read_csv(data_path)
    df['text'] = df['category'].fillna('') + ". " + df['title'].fillna('') + ". " + df['description'].fillna('')
    X = df['text']
    y = df['severity']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    vect = TfidfVectorizer(max_features=10000, ngram_range=(1,2))
    Xtr = vect.fit_transform(X_train)
    Xte = vect.transform(X_test)
    clf = LogisticRegression(max_iter=400)
    clf.fit(Xtr, y_train)
    pred = clf.predict(Xte)
    print("Accuracy:", accuracy_score(y_test, pred))
    print(classification_report(y_test, pred))
    os.makedirs(os.path.join(os.path.dirname(__file__), "..", "models"), exist_ok=True)
    joblib.dump(clf, os.path.join(os.path.dirname(__file__), "..", "models", "severity_model.joblib"))
    joblib.dump(vect, os.path.join(os.path.dirname(__file__), "..", "models", "vectorizer.pkl"))
    print("Saved model and vectorizer to models/")

if __name__ == "__main__":
    main()
