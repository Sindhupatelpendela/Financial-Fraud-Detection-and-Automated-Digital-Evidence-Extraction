# src/train_model.py
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
import xgboost as xgb
import os

# Create output folder if not exists
os.makedirs("models", exist_ok=True)

# Load dataset
data = pd.read_csv('data/bs140513_032310.csv')
data = data.drop(['zipcodeOri', 'zipMerchant'], axis=1)

# Encode categoricals
cat_cols = data.select_dtypes(include='object').columns
for col in cat_cols:
    data[col] = data[col].astype('category').cat.codes

X = data.drop('fraud', axis=1)
y = data['fraud']
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, test_size=0.3, random_state=42)

# Train models
knn = KNeighborsClassifier(n_neighbors=5, p=1)
rf = RandomForestClassifier(n_estimators=100, max_depth=8, class_weight='balanced', random_state=42)
xgb_clf = xgb.XGBClassifier(max_depth=6, learning_rate=0.05, n_estimators=400, objective="binary:hinge", random_state=42)

knn.fit(X_train, y_train)
rf.fit(X_train, y_train)
xgb_clf.fit(X_train, y_train)

# Ensemble
ensemble = VotingClassifier(estimators=[("knn", knn), ("rf", rf), ("xgb", xgb_clf)], voting="soft", weights=[1,4,1])
ensemble.fit(X_train, y_train)

# Save model and input columns
joblib.dump(ensemble, 'models/ensemble_model.pkl')
joblib.dump(X_train.columns.tolist(), 'models/model_columns.pkl')

print("✅ Model and column list saved to 'models/' folder")
