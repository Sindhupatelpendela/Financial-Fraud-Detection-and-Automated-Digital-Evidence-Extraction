









# Financial Fraud Detection and Automated Digital Evidence Extraction

## Overview

Financial Fraud Detection and Automated Digital Evidence Extraction is a Machine Learning-based web application designed to identify fraudulent financial transactions and assist investigators in analyzing suspicious activities.

The system processes transaction data, trains multiple machine learning models, predicts fraudulent transactions, and provides a web-based dashboard for monitoring and investigation.

---

## Key Features

### Fraud Detection
- Detects fraudulent financial transactions.
- Classifies transactions as legitimate or fraudulent.
- Supports intelligent fraud analysis using machine learning.

### Machine Learning Models
- K-Nearest Neighbors (KNN)
- Random Forest Classifier
- XGBoost Classifier
- Voting Ensemble Classifier

### Data Processing
- Data cleaning and preprocessing
- Feature engineering
- Categorical data encoding
- Train-test splitting

### Prediction System
- Real-time fraud prediction
- Automated transaction analysis
- Model-based decision support

### Web Dashboard
- User-friendly interface
- Interactive fraud monitoring
- Investigation support pages
- Real-time analysis screens

### Digital Evidence Extraction
- Extracts relevant information from suspicious transactions
- Supports digital forensic investigation
- Organizes evidence for reporting and analysis

---

## Technology Stack

### Programming Language
- Python 3.8

### Machine Learning
- Scikit-Learn
- XGBoost
- Pandas
- NumPy
- Joblib

### Data Visualization
- Matplotlib
- Seaborn

### Web Development
- Flask
- HTML
- CSS
- JavaScript

### Version Control
- Git
- GitHub

---

## Project Structure

```text
Financial-Fraud-Detection-and-Automated-Digital-Evidence-Extraction/
│
├── src/
│   ├── train_model.py
│   └── predict.py
│
├── web/
│   ├── app.py
│   ├── static/
│   │   ├── CSS Files
│   │   └── JavaScript Files
│   │
│   └── templates/
│       ├── dashboard.html
│       ├── evidence.html
│       ├── home.html
│       ├── index.html
│       └── real_time.html
│
├── requirements.txt
├── .gitignore
└── README.md
```

---

## Installation

### Download Python 3.8

Install Python 3.8 before running the application.

### Create Virtual Environment

```bash
py -3.8 -m venv venv
```

### Activate Virtual Environment

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Application

```bash
python web\app.py
```

---

## Required Libraries

```text
pandas
numpy
scikit-learn
xgboost
matplotlib
seaborn
streamlit
joblib
flask
```

---

## Workflow

1. Load transaction dataset.
2. Perform preprocessing and cleaning.
3. Encode categorical attributes.
4. Train machine learning models.
5. Evaluate model performance.
6. Predict fraudulent transactions.
7. Extract relevant evidence.
8. Display results through the Flask web dashboard.

---

## Applications

- Financial Fraud Detection
- Banking Security
- Digital Forensics
- Risk Management
- Cybercrime Investigation
- Financial Analytics

---

## Future Enhancements

- Real-time transaction monitoring
- Deep Learning integration
- AI-powered investigation assistant
- Cloud deployment
- Advanced analytics dashboard
- Automated report generation

---

## Author

### Pendela Sindhu

B.Tech – Information Technology

GitHub:
https://github.com/Sindhupatelpendela

Project Repository:
https://github.com/Sindhupatelpendela/Financial-Fraud-Detection-and-Automated-Digital-Evidence-Extraction
