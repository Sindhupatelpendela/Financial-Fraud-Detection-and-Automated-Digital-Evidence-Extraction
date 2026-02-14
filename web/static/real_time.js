// Real-time Monitoring JavaScript
let volumeChart = null;
let riskChart = null;
let autoGenerateInterval = null;
let isAutoGenerating = false;
let transactionCount = 0;
let flaggedCount = 0;
let totalVolume = 0;
let processingTimes = [];

// Initialize real-time monitoring
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    loadInitialData();
    updateSystemStatus();
    setInterval(updateSystemStatus, 10000); // Update system status every 10 seconds
});

// Initialize charts
function initializeCharts() {
    // Volume Chart
    const volumeCtx = document.getElementById('volumeChart').getContext('2d');
    volumeChart = new Chart(volumeCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Transaction Volume',
                data: [],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Risk Distribution Chart
    const riskCtx = document.getElementById('riskChart').getContext('2d');
    riskChart = new Chart(riskCtx, {
        type: 'doughnut',
        data: {
            labels: ['Low Risk', 'Medium Risk', 'High Risk'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    '#38a169',
                    '#d69e2e',
                    '#e53e3e'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Load initial data
async function loadInitialData() {
    try {
        const response = await fetch('/api/real-time-transactions');
        const transactions = await response.json();
        
        // Display existing transactions
        transactions.forEach(transaction => {
            addTransactionToList(transaction);
        });
        
        updateStats();
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}

// Toggle auto-generation
function toggleAutoGenerate() {
    const btn = document.getElementById('auto-generate-btn');
    
    if (isAutoGenerating) {
        stopAutoGenerate();
        btn.innerHTML = '<i data-feather="play"></i> Start Auto-Generate';
        btn.classList.remove('auto-generating');
    } else {
        startAutoGenerate();
        btn.innerHTML = '<i data-feather="pause"></i> Stop Auto-Generate';
        btn.classList.add('auto-generating');
    }
    
    isAutoGenerating = !isAutoGenerating;
    feather.replace();
}

// Start auto-generation
function startAutoGenerate() {
    autoGenerateInterval = setInterval(() => {
        generateSingleTransaction();
    }, 3000); // Generate every 3 seconds
}

// Stop auto-generation
function stopAutoGenerate() {
    if (autoGenerateInterval) {
        clearInterval(autoGenerateInterval);
        autoGenerateInterval = null;
    }
}

// Generate single transaction
async function generateSingleTransaction() {
    try {
        const startTime = performance.now();
        
        const response = await fetch('/api/generate-transaction', {
            method: 'POST'
        });
        
        const transaction = await response.json();
        const processingTime = performance.now() - startTime;
        
        // Add processing time to array
        processingTimes.push(processingTime);
        if (processingTimes.length > 10) {
            processingTimes.shift();
        }
        
        // Add transaction to list
        addTransactionToList(transaction);
        
        // Update stats
        updateStats();
        
        // Update charts
        updateCharts(transaction);
        
        // Show alert for flagged transactions
        if (transaction.status === 'Flagged') {
            showAlert(transaction);
        }
        
    } catch (error) {
        console.error('Error generating transaction:', error);
    }
}

// Add transaction to list
function addTransactionToList(transaction) {
    const list = document.getElementById('transactions-list');
    
    const transactionElement = document.createElement('div');
    transactionElement.className = 'transaction-item';
    
    if (transaction.status === 'Flagged') {
        transactionElement.classList.add('flagged');
    } else if (transaction.risk_score > 0.6) {
        transactionElement.classList.add('high-risk');
    }
    
    const riskClass = transaction.risk_score > 0.8 ? 'high' : 
                     transaction.risk_score > 0.6 ? 'medium' : 'low';
    
    const statusClass = transaction.status.toLowerCase();
    
    transactionElement.innerHTML = `
        <div class="transaction-header">
            <div class="transaction-id">${transaction.id}</div>
            <div class="transaction-time">${formatTime(transaction.timestamp)}</div>
        </div>
        <div class="transaction-details">
            <div class="detail-group">
                <div class="detail-label">Customer</div>
                <div class="detail-value">${transaction.customer_id}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Amount</div>
                <div class="detail-value transaction-amount">$${transaction.amount.toLocaleString()}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Merchant</div>
                <div class="detail-value">${transaction.merchant}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Location</div>
                <div class="detail-value">${transaction.location}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Category</div>
                <div class="detail-value">${transaction.category}</div>
            </div>
        </div>
        <div class="transaction-status">
            <div class="risk-indicator">
                <span>Risk:</span>
                <span class="risk-score ${riskClass}">${(transaction.risk_score * 100).toFixed(1)}%</span>
            </div>
            <span class="status-badge status-${statusClass}">${transaction.status}</span>
        </div>
    `;
    
    // Add to beginning of list
    list.insertBefore(transactionElement, list.firstChild);
    
    // Limit list to 8 items for better UX
    if (list.children.length > 8) {
        list.removeChild(list.lastChild);
    }
    
    // Update counters
    transactionCount++;
    totalVolume += transaction.amount;
    
    if (transaction.status === 'Flagged') {
        flaggedCount++;
    }
}

// Update statistics
function updateStats() {
    const tpmElement = document.getElementById('transactions-per-minute');
    const flaggedElement = document.getElementById('flagged-transactions');
    const volumeElement = document.getElementById('total-volume');
    const processingElement = document.getElementById('avg-processing-time');
    
    // Calculate transactions per minute (simplified)
    const tpm = Math.round(transactionCount / (Date.now() / 60000));
    
    // Calculate average processing time
    const avgProcessing = processingTimes.length > 0 
        ? Math.round(processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length)
        : 0;
    
    // Update with animation
    animateCounter(tpmElement, tpm);
    animateCounter(flaggedElement, flaggedCount);
    animateCounter(volumeElement, totalVolume, true);
    animateCounter(processingElement, avgProcessing, false, 'ms');
}

// Animate counter
function animateCounter(element, newValue, isCurrency = false, suffix = '') {
    const currentValue = parseFloat(element.textContent.replace(/[^0-9.-]/g, ''));
    const increment = (newValue - currentValue) / 10;
    let current = currentValue;
    
    const animate = () => {
        current += increment;
        if ((increment > 0 && current >= newValue) || (increment < 0 && current <= newValue)) {
            current = newValue;
        }
        
        if (isCurrency) {
            element.textContent = `$${Math.round(current).toLocaleString()}`;
        } else {
            element.textContent = Math.round(current) + suffix;
        }
        
        element.classList.add('counter-animation');
        setTimeout(() => element.classList.remove('counter-animation'), 500);
        
        if (current !== newValue) {
            requestAnimationFrame(animate);
        }
    };
    
    animate();
}

// Update charts
function updateCharts(transaction) {
    // Update volume chart
    const now = new Date();
    const timeLabel = now.toLocaleTimeString();
    
    volumeChart.data.labels.push(timeLabel);
    volumeChart.data.datasets[0].data.push(transaction.amount);
    
    // Keep only last 6 data points
    if (volumeChart.data.labels.length > 6) {
        volumeChart.data.labels.shift();
        volumeChart.data.datasets[0].data.shift();
    }
    
    volumeChart.update('none');
    
    // Update risk distribution (simplified - would need to recalculate from all transactions)
    const lowRisk = Math.floor(Math.random() * 10) + 5;
    const mediumRisk = Math.floor(Math.random() * 5) + 2;
    const highRisk = Math.floor(Math.random() * 3) + 1;
    
    riskChart.data.datasets[0].data = [lowRisk, mediumRisk, highRisk];
    riskChart.update('none');
}

// Update system status
function updateSystemStatus() {
    const statusItems = document.querySelectorAll('.status-item');
    
    statusItems.forEach((item, index) => {
        const dot = item.querySelector('.status-dot');
        
        // Simulate occasional status changes
        if (Math.random() < 0.1) {
            const statuses = ['online', 'warning', 'offline'];
            const currentStatus = dot.className.includes('online') ? 'online' : 
                                dot.className.includes('warning') ? 'warning' : 'offline';
            
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            if (newStatus !== currentStatus) {
                dot.className = `status-dot ${newStatus}`;
                
                // Show notification for status changes
                if (newStatus === 'offline') {
                    showNotification(`System component ${index + 1} is offline`, 'error');
                } else if (newStatus === 'warning') {
                    showNotification(`System component ${index + 1} has warnings`, 'warning');
                }
            }
        }
    });
}

// Show alert for flagged transactions
function showAlert(transaction) {
    const alertElement = document.createElement('div');
    alertElement.className = 'alert-pulse';
    alertElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fed7d7;
        color: #c53030;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
        max-width: 400px;
        animation: alertPulse 1s ease-in-out;
    `;
    
    alertElement.innerHTML = `
        <h3 style="margin: 0 0 10px 0; color: #c53030;">
            <i data-feather="alert-triangle"></i> Fraud Alert!
        </h3>
        <p style="margin: 0 0 10px 0;">
            Transaction ${transaction.id} has been flagged as suspicious.
        </p>
        <p style="margin: 0; font-size: 0.9em; opacity: 0.8;">
            Amount: $${transaction.amount.toLocaleString()}<br>
            Risk Score: ${(transaction.risk_score * 100).toFixed(1)}%
        </p>
        <button onclick="this.parentElement.remove()" style="
            background: #c53030;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            margin-top: 10px;
            cursor: pointer;
        ">Dismiss</button>
    `;
    
    document.body.appendChild(alertElement);
    feather.replace();
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertElement.parentElement) {
            alertElement.remove();
        }
    }, 5000);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#e53e3e' : type === 'warning' ? '#d69e2e' : '#667eea'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Utility functions
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes alertPulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.05); }
    }
`;
document.head.appendChild(style); 