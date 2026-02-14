from flask import Flask, render_template, request, jsonify, redirect, url_for
import sys
import os
import json
import hashlib
import datetime
import random
from collections import deque
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from src.predict import predict_transaction

app = Flask(__name__, static_folder='static', template_folder='templates')

# Simulated data storage for demo purposes
flagged_cases = deque(maxlen=100)
evidence_database = {}
real_time_transactions = deque(maxlen=50)

# Generate sample flagged cases
def generate_sample_cases():
    cases = [
        {
            'id': 'CASE-001',
            'timestamp': '2024-01-15 14:30:22',
            'customer_id': 'CUST-78945',
            'transaction_amount': 15420.50,
            'risk_score': 0.94,
            'status': 'Under Investigation',
            'evidence_count': 3,
            'location': 'New York, NY',
            'merchant': 'Online Electronics Store',
            'category': 'Electronics',
            'suspicious_patterns': ['High amount', 'Unusual time', 'New merchant']
        },
        {
            'id': 'CASE-002',
            'timestamp': '2024-01-15 13:45:11',
            'customer_id': 'CUST-12345',
            'transaction_amount': 8750.00,
            'risk_score': 0.87,
            'status': 'Evidence Collected',
            'evidence_count': 5,
            'location': 'Los Angeles, CA',
            'merchant': 'International Trading Co',
            'category': 'Import/Export',
            'suspicious_patterns': ['International transaction', 'Large amount', 'New account']
        },
        {
            'id': 'CASE-003',
            'timestamp': '2024-01-15 12:20:45',
            'customer_id': 'CUST-98765',
            'transaction_amount': 3200.75,
            'risk_score': 0.76,
            'status': 'Case Closed',
            'evidence_count': 2,
            'location': 'Chicago, IL',
            'merchant': 'Local Restaurant Chain',
            'category': 'Food & Beverage',
            'suspicious_patterns': ['Multiple transactions', 'Unusual frequency']
        }
    ]
    for case in cases:
        flagged_cases.append(case)

# Generate sample real-time transactions
def generate_real_time_data():
    locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ']
    merchants = ['Amazon.com', 'Walmart', 'Target', 'Best Buy', 'Home Depot', 'Starbucks', 'McDonald\'s']
    categories = ['Retail', 'Food & Beverage', 'Electronics', 'Home & Garden', 'Transportation']
    
    transaction = {
        'id': f'TXN-{random.randint(10000, 99999)}',
        'timestamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'customer_id': f'CUST-{random.randint(10000, 99999)}',
        'amount': round(random.uniform(10, 5000), 2),
        'location': random.choice(locations),
        'merchant': random.choice(merchants),
        'category': random.choice(categories),
        'status': 'Processing',
        'risk_score': round(random.uniform(0.1, 0.9), 3)
    }
    
    if transaction['risk_score'] > 0.7:
        transaction['status'] = 'Flagged'
        flagged_cases.append({
            'id': f'CASE-{len(flagged_cases) + 1:03d}',
            'timestamp': transaction['timestamp'],
            'customer_id': transaction['customer_id'],
            'transaction_amount': transaction['amount'],
            'risk_score': transaction['risk_score'],
            'status': 'New',
            'evidence_count': 0,
            'location': transaction['location'],
            'merchant': transaction['merchant'],
            'category': transaction['category'],
            'suspicious_patterns': ['High risk score', 'Unusual pattern']
        })
    
    real_time_transactions.append(transaction)
    return transaction

# Initialize sample data
generate_sample_cases()

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/detect', methods=['GET'])
def detect():
    return render_template('index.html')

@app.route('/dashboard', methods=['GET'])
def dashboard():
    return render_template('dashboard.html')

@app.route('/real-time', methods=['GET'])
def real_time():
    return render_template('real_time.html')

@app.route('/evidence', methods=['GET'])
def evidence():
    return render_template('evidence.html')

@app.route('/api/flagged-cases', methods=['GET'])
def get_flagged_cases():
    return jsonify(list(flagged_cases))

@app.route('/api/real-time-transactions', methods=['GET'])
def get_real_time_transactions():
    return jsonify(list(real_time_transactions))

@app.route('/api/generate-transaction', methods=['POST'])
def generate_transaction():
    transaction = generate_real_time_data()
    return jsonify(transaction)

@app.route('/api/evidence/<case_id>', methods=['GET'])
def get_case_evidence(case_id):
    # Simulate evidence data
    evidence_types = {
        'logs': [
            {'type': 'System Log', 'timestamp': '2024-01-15 14:30:22', 'message': 'User session initiated', 'hash': 'a1b2c3d4e5f6'},
            {'type': 'Access Log', 'timestamp': '2024-01-15 14:30:25', 'message': 'Transaction request received', 'hash': 'b2c3d4e5f6a1'},
            {'type': 'Security Log', 'timestamp': '2024-01-15 14:30:28', 'message': 'Risk assessment completed', 'hash': 'c3d4e5f6a1b2'}
        ],
        'metadata': [
            {'type': 'IP Address', 'value': '192.168.1.100', 'hash': 'd4e5f6a1b2c3'},
            {'type': 'User Agent', 'value': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'hash': 'e5f6a1b2c3d4'},
            {'type': 'Device ID', 'value': 'DEV-789456', 'hash': 'f6a1b2c3d4e5'}
        ],
        'session_info': [
            {'type': 'Session ID', 'value': 'SESS-123456789', 'hash': 'a1b2c3d4e5f6'},
            {'type': 'Login Time', 'value': '2024-01-15 14:25:10', 'hash': 'b2c3d4e5f6a1'},
            {'type': 'Last Activity', 'value': '2024-01-15 14:30:22', 'hash': 'c3d4e5f6a1b2'}
        ]
    }
    
    return jsonify(evidence_types)

@app.route('/api/update-case-status', methods=['POST'])
def update_case_status():
    data = request.json
    case_id = data.get('case_id')
    new_status = data.get('status')
    
    # Update case status in our simulated data
    for case in flagged_cases:
        if case['id'] == case_id:
            case['status'] = new_status
            break
    
    return jsonify({'success': True, 'message': f'Case {case_id} status updated to {new_status}'})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    # Gender comes as string, convert to int (Male=1, Female=0)
    if 'gender' in data:
        data['gender'] = 1 if data['gender'] == 'Male' else 0
    label, prob = predict_transaction(data)
    return jsonify({
        'prediction': 'Fraudulent' if label == 1 else 'Non-Fraudulent',
        'probability': round(prob * 100, 2)
    })

if __name__ == '__main__':
    app.run(debug=True) 