import pandas as pd
import joblib
import os

# Get project root (one level up from this file)
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
MODEL_PATH = os.path.join(PROJECT_ROOT, 'models', 'ensemble_model.pkl')
COLS_PATH = os.path.join(PROJECT_ROOT, 'models', 'model_columns.pkl')

# Load trained model
model = joblib.load(MODEL_PATH)
model_cols = joblib.load(COLS_PATH)
# model = joblib.load('models/ensemble_model.pkl')
# model_cols = joblib.load('models/model_columns.pkl')
def predict_transaction(input_dict):
    input_df = pd.DataFrame([input_dict])
    
    # Match column order and fill missing ones
    for col in model_cols:
        if col not in input_df.columns:
            input_df[col] = 0
    input_df = input_df[model_cols]
    
    pred = model.predict(input_df)[0]
    prob = model.predict_proba(input_df)[0][1]
    
    return pred, prob
