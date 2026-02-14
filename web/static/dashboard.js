// Dashboard JavaScript
let currentCaseId = null;
let riskChart = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    initializeChart();
    setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
});

// Load dashboard data
async function loadDashboardData() {
    try {
        const response = await fetch('/api/flagged-cases');
        const cases = await response.json();
        
        updateStats(cases);
        updateCasesTable(cases);
        updateActivityList(cases);
        updateChart(cases);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Update statistics
function updateStats(cases) {
    const totalCases = cases.length;
    const pendingCases = cases.filter(c => c.status === 'New' || c.status === 'Under Investigation').length;
    const resolvedCases = cases.filter(c => c.status === 'Case Closed').length;
    const evidenceCount = cases.reduce((sum, c) => sum + c.evidence_count, 0);

    document.getElementById('total-cases').textContent = totalCases;
    document.getElementById('pending-cases').textContent = pendingCases;
    document.getElementById('resolved-cases').textContent = resolvedCases;
    document.getElementById('evidence-collected').textContent = evidenceCount;
}

// Update cases table
function updateCasesTable(cases) {
    const tbody = document.getElementById('cases-tbody');
    tbody.innerHTML = '';

    // Limit to 8 cases for better UX
    const limitedCases = cases.slice(0, 8);

    limitedCases.forEach(caseData => {
        const row = document.createElement('tr');
        
        const riskClass = caseData.risk_score > 0.8 ? 'high' : 
                         caseData.risk_score > 0.6 ? 'medium' : 'low';
        
        const statusClass = caseData.status.toLowerCase().replace(' ', '-');
        
        row.innerHTML = `
            <td class="case-id">${caseData.id}</td>
            <td>${caseData.customer_id}</td>
            <td>$${caseData.transaction_amount.toLocaleString()}</td>
            <td class="risk-score ${riskClass}">${(caseData.risk_score * 100).toFixed(1)}%</td>
            <td><span class="status-badge status-${statusClass}">${caseData.status}</span></td>
            <td>
                <button class="action-btn view-btn" onclick="viewCase('${caseData.id}')">
                    <i data-feather="eye"></i> View
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    feather.replace();
}

// Update activity list
function updateActivityList(cases) {
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';

    // Get recent cases (last 3)
    const recentCases = cases.slice(0, 3);
    
    recentCases.forEach(caseData => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const timeAgo = getTimeAgo(caseData.timestamp);
        
        activityItem.innerHTML = `
            <h4>${caseData.id} - ${caseData.status}</h4>
            <p>${caseData.customer_id} • $${caseData.transaction_amount.toLocaleString()} • ${timeAgo}</p>
        `;
        
        activityList.appendChild(activityItem);
    });
}

// Initialize chart
function initializeChart() {
    const ctx = document.getElementById('riskChart').getContext('2d');
    riskChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['High Risk', 'Medium Risk', 'Low Risk'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    '#e53e3e',
                    '#d69e2e',
                    '#38a169'
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
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// Update chart data
function updateChart(cases) {
    const highRisk = cases.filter(c => c.risk_score > 0.8).length;
    const mediumRisk = cases.filter(c => c.risk_score > 0.6 && c.risk_score <= 0.8).length;
    const lowRisk = cases.filter(c => c.risk_score <= 0.6).length;

    riskChart.data.datasets[0].data = [highRisk, mediumRisk, lowRisk];
    riskChart.update();
}

// View case details
async function viewCase(caseId) {
    currentCaseId = caseId;
    
    try {
        const response = await fetch('/api/flagged-cases');
        const cases = await response.json();
        const caseData = cases.find(c => c.id === caseId);
        
        if (caseData) {
            populateModal(caseData);
            await loadCaseEvidence(caseId);
            openModal();
        }
    } catch (error) {
        console.error('Error loading case details:', error);
    }
}

// Populate modal with case data
function populateModal(caseData) {
    document.getElementById('modal-title').textContent = `Case Details - ${caseData.id}`;
    document.getElementById('modal-case-id').textContent = caseData.id;
    document.getElementById('modal-customer-id').textContent = caseData.customer_id;
    document.getElementById('modal-amount').textContent = `$${caseData.transaction_amount.toLocaleString()}`;
    document.getElementById('modal-risk-score').textContent = `${(caseData.risk_score * 100).toFixed(1)}%`;
    document.getElementById('modal-location').textContent = caseData.location;
    document.getElementById('modal-merchant').textContent = caseData.merchant;
    document.getElementById('modal-category').textContent = caseData.category;
    
    // Populate suspicious patterns
    const patternsContainer = document.getElementById('modal-patterns');
    patternsContainer.innerHTML = '';
    caseData.suspicious_patterns.forEach(pattern => {
        const tag = document.createElement('span');
        tag.className = 'pattern-tag';
        tag.textContent = pattern;
        patternsContainer.appendChild(tag);
    });
}

// Load case evidence
async function loadCaseEvidence(caseId) {
    try {
        const response = await fetch(`/api/evidence/${caseId}`);
        const evidence = await response.json();
        
        // Show logs by default
        showEvidenceTab('logs', evidence);
    } catch (error) {
        console.error('Error loading evidence:', error);
    }
}

// Show evidence tab
function showEvidenceTab(tabName, evidence = null) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const content = document.getElementById('evidence-content');
    
    if (!evidence) {
        // If evidence not provided, load it
        loadCaseEvidence(currentCaseId).then(evidence => {
            displayEvidence(tabName, evidence);
        });
    } else {
        displayEvidence(tabName, evidence);
    }
}

// Display evidence content
function displayEvidence(tabName, evidence) {
    const content = document.getElementById('evidence-content');
    
    if (tabName === 'logs') {
        content.innerHTML = evidence.logs.map(log => `
            <div class="evidence-item">
                <h4>${log.type}</h4>
                <p><strong>Timestamp:</strong> ${log.timestamp}</p>
                <p><strong>Message:</strong> ${log.message}</p>
                <p><strong>Hash:</strong> <span class="evidence-hash">${log.hash}</span></p>
            </div>
        `).join('');
    } else if (tabName === 'metadata') {
        content.innerHTML = evidence.metadata.map(meta => `
            <div class="evidence-item">
                <h4>${meta.type}</h4>
                <p><strong>Value:</strong> ${meta.value}</p>
                <p><strong>Hash:</strong> <span class="evidence-hash">${meta.hash}</span></p>
            </div>
        `).join('');
    } else if (tabName === 'session') {
        content.innerHTML = evidence.session_info.map(session => `
            <div class="evidence-item">
                <h4>${session.type}</h4>
                <p><strong>Value:</strong> ${session.value}</p>
                <p><strong>Hash:</strong> <span class="evidence-hash">${session.hash}</span></p>
            </div>
        `).join('');
    }
}

// Update case status
async function updateCaseStatus(newStatus) {
    if (!currentCaseId) return;
    
    try {
        const response = await fetch('/api/update-case-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                case_id: currentCaseId,
                status: newStatus
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Refresh dashboard data
            loadDashboardData();
            closeModal();
            
            // Show success message
            showNotification(`Case ${currentCaseId} status updated to ${newStatus}`, 'success');
        }
    } catch (error) {
        console.error('Error updating case status:', error);
        showNotification('Error updating case status', 'error');
    }
}

// Refresh cases
function refreshCases() {
    loadDashboardData();
    showNotification('Dashboard refreshed', 'info');
}

// Modal functions
function openModal() {
    document.getElementById('case-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('case-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
    currentCaseId = null;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('case-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Utility functions
function getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMinutes = Math.floor((now - past) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#e53e3e' : '#667eea'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            margin-left: 10px;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
} 