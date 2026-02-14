// Evidence Management JavaScript
let currentEvidenceId = null;
let allEvidence = [];
let filteredEvidence = [];

// Initialize evidence management
document.addEventListener('DOMContentLoaded', function() {
    loadEvidenceData();
    setupSearchListener();
    updateStats();
});

// Load evidence data
async function loadEvidenceData() {
    try {
        // Simulate evidence data
        allEvidence = generateSampleEvidence();
        filteredEvidence = [...allEvidence];
        displayEvidence();
        updateStats();
    } catch (error) {
        console.error('Error loading evidence data:', error);
    }
}

// Generate sample evidence data
function generateSampleEvidence() {
    const evidenceTypes = ['System Log', 'Access Log', 'Security Log', 'IP Address', 'User Agent', 'Device ID', 'Session ID', 'Network Trace'];
    const caseIds = ['CASE-001', 'CASE-002', 'CASE-003', 'CASE-004', 'CASE-005'];
    const evidence = [];

    for (let i = 1; i <= 25; i++) {
        const type = evidenceTypes[Math.floor(Math.random() * evidenceTypes.length)];
        const caseId = caseIds[Math.floor(Math.random() * caseIds.length)];
        const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        
        evidence.push({
            id: `EVID-${i.toString().padStart(3, '0')}`,
            type: type,
            caseId: caseId,
            timestamp: timestamp.toISOString(),
            hash: generateHash(),
            signature: generateSignature(),
            encryption: 'AES-256',
            status: Math.random() > 0.1 ? 'verified' : Math.random() > 0.5 ? 'warning' : 'error',
            content: generateEvidenceContent(type),
            chainOfCustody: generateChainOfCustody()
        });
    }

    return evidence;
}

// Generate hash
function generateHash() {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}

// Generate signature
function generateSignature() {
    const chars = '0123456789abcdef';
    let signature = '';
    for (let i = 0; i < 128; i++) {
        signature += chars[Math.floor(Math.random() * chars.length)];
    }
    return signature;
}

// Generate evidence content
function generateEvidenceContent(type) {
    const contents = {
        'System Log': `[${new Date().toISOString()}] System: User session initiated\n[${new Date().toISOString()}] System: Authentication successful\n[${new Date().toISOString()}] System: Transaction processing started`,
        'Access Log': `GET /api/transaction HTTP/1.1 200 OK\nPOST /api/verify HTTP/1.1 200 OK\nGET /api/status HTTP/1.1 200 OK`,
        'Security Log': `[SECURITY] Login attempt from IP: 192.168.1.100\n[SECURITY] Risk assessment completed\n[SECURITY] Fraud detection triggered`,
        'IP Address': '192.168.1.100',
        'User Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Device ID': 'DEV-789456-ABC123',
        'Session ID': 'SESS-123456789-ABCDEF',
        'Network Trace': `Packet 1: Source 192.168.1.100 -> Destination 10.0.0.1\nPacket 2: Source 10.0.0.1 -> Destination 192.168.1.100\nPacket 3: Source 192.168.1.100 -> Destination 10.0.0.1`
    };
    
    return contents[type] || 'Evidence content not available';
}

// Generate chain of custody
function generateChainOfCustody() {
    return [
        {
            action: 'Evidence Collected',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            user: 'Investigator Smith',
            details: 'Evidence automatically collected from system'
        },
        {
            action: 'Hash Generated',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            user: 'System',
            details: 'SHA-256 hash generated and stored'
        },
        {
            action: 'Encrypted',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            user: 'System',
            details: 'Evidence encrypted using AES-256'
        },
        {
            action: 'Stored in Database',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            user: 'System',
            details: 'Evidence stored in secure database'
        },
        {
            action: 'Integrity Verified',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            user: 'Investigator Johnson',
            details: 'Hash verification completed successfully'
        }
    ];
}

// Setup search listener
function setupSearchListener() {
    const searchInput = document.getElementById('evidence-search');
    searchInput.addEventListener('input', function() {
        searchEvidence();
    });
}

// Search evidence
function searchEvidence() {
    const searchTerm = document.getElementById('evidence-search').value.toLowerCase();
    
    if (searchTerm === '') {
        filteredEvidence = [...allEvidence];
    } else {
        filteredEvidence = allEvidence.filter(evidence => 
            evidence.id.toLowerCase().includes(searchTerm) ||
            evidence.type.toLowerCase().includes(searchTerm) ||
            evidence.caseId.toLowerCase().includes(searchTerm) ||
            evidence.hash.toLowerCase().includes(searchTerm)
        );
    }
    
    displayEvidence();
}

// Display evidence
function displayEvidence() {
    const list = document.getElementById('evidence-list');
    list.innerHTML = '';

    filteredEvidence.forEach(evidence => {
        const evidenceElement = createEvidenceElement(evidence);
        list.appendChild(evidenceElement);
    });
}

// Create evidence element
function createEvidenceElement(evidence) {
    const element = document.createElement('div');
    element.className = `evidence-item ${evidence.status}`;
    element.onclick = () => viewEvidence(evidence);

    element.innerHTML = `
        <div class="evidence-header">
            <div class="evidence-id">${evidence.id}</div>
            <div class="evidence-type">${evidence.type}</div>
        </div>
        <div class="evidence-details">
            <div class="evidence-detail">
                <div class="evidence-label">Case ID</div>
                <div class="evidence-value">${evidence.caseId}</div>
            </div>
            <div class="evidence-detail">
                <div class="evidence-label">Timestamp</div>
                <div class="evidence-value">${formatDateTime(evidence.timestamp)}</div>
            </div>
            <div class="evidence-detail">
                <div class="evidence-label">Hash</div>
                <div class="evidence-hash">${evidence.hash.substring(0, 16)}...</div>
            </div>
            <div class="evidence-detail">
                <div class="evidence-label">Encryption</div>
                <div class="evidence-value">${evidence.encryption}</div>
            </div>
        </div>
        <div class="evidence-status">
            <div class="integrity-indicator">
                <span class="integrity-dot ${evidence.status}"></span>
                <span>${evidence.status.charAt(0).toUpperCase() + evidence.status.slice(1)}</span>
            </div>
            <div class="evidence-actions">
                <button class="action-btn view-btn" onclick="event.stopPropagation(); viewEvidence('${evidence.id}')">
                    <i data-feather="eye"></i> View
                </button>
                <button class="action-btn verify-btn" onclick="event.stopPropagation(); verifyEvidence('${evidence.id}')">
                    <i data-feather="shield-check"></i> Verify
                </button>
            </div>
        </div>
    `;

    return element;
}

// Show evidence tab
function showEvidenceTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter evidence based on tab
    if (tabName === 'all') {
        filteredEvidence = [...allEvidence];
    } else {
        filteredEvidence = allEvidence.filter(evidence => {
            const type = evidence.type.toLowerCase();
            return type.includes(tabName.toLowerCase());
        });
    }
    
    displayEvidence();
}

// View evidence details
function viewEvidence(evidenceId) {
    const evidence = typeof evidenceId === 'string' 
        ? allEvidence.find(e => e.id === evidenceId)
        : evidenceId;
    
    if (!evidence) return;
    
    currentEvidenceId = evidence.id;
    
    // Populate modal
    document.getElementById('evidence-modal-title').textContent = `Evidence Details - ${evidence.id}`;
    document.getElementById('modal-evidence-id').textContent = evidence.id;
    document.getElementById('modal-evidence-type').textContent = evidence.type;
    document.getElementById('modal-case-id').textContent = evidence.caseId;
    document.getElementById('modal-timestamp').textContent = formatDateTime(evidence.timestamp);
    document.getElementById('modal-hash').textContent = evidence.hash;
    document.getElementById('modal-signature').textContent = evidence.signature;
    document.getElementById('modal-encryption').textContent = evidence.encryption;
    
    // Display evidence content
    document.getElementById('evidence-content-display').textContent = evidence.content;
    
    // Display chain of custody
    displayChainOfCustody(evidence.chainOfCustody);
    
    openEvidenceModal();
}

// Display chain of custody
function displayChainOfCustody(chain) {
    const timeline = document.getElementById('custody-timeline');
    timeline.innerHTML = '';
    
    chain.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'custody-event';
        
        eventElement.innerHTML = `
            <div class="custody-event-content">
                <div class="custody-event-title">${event.action}</div>
                <div class="custody-event-details">${event.details}</div>
            </div>
            <div class="custody-event-time">${formatDateTime(event.timestamp)}</div>
        `;
        
        timeline.appendChild(eventElement);
    });
}

// Perform integrity check
async function performIntegrityCheck() {
    const button = document.querySelector('.btn-primary');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i data-feather="loader" class="loading-spinner"></i> Checking...';
    button.classList.add('integrity-checking');
    
    // Simulate integrity check
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update integrity status
    updateIntegrityStatus();
    
    button.innerHTML = originalText;
    button.classList.remove('integrity-checking');
    
    showNotification('Integrity check completed successfully', 'success');
    feather.replace();
}

// Update integrity status
function updateIntegrityStatus() {
    const verifiedCount = allEvidence.filter(e => e.status === 'verified').length;
    const totalCount = allEvidence.length;
    
    document.getElementById('verified-evidence').textContent = verifiedCount;
    document.getElementById('total-evidence').textContent = totalCount;
    document.getElementById('encrypted-evidence').textContent = totalCount;
    
    // Update alerts
    const alertsList = document.getElementById('alerts-list');
    alertsList.innerHTML = `
        <div class="alert-item info">
            <i data-feather="check-circle"></i>
            <div>
                <h4>Integrity Check Complete</h4>
                <p>${verifiedCount} of ${totalCount} evidence items verified</p>
            </div>
        </div>
    `;
    
    feather.replace();
}

// Verify evidence
async function verifyEvidence(evidenceId) {
    const evidence = allEvidence.find(e => e.id === evidenceId);
    if (!evidence) return;
    
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update evidence status
    evidence.status = 'verified';
    
    // Update display
    displayEvidence();
    updateStats();
    
    showNotification(`Evidence ${evidenceId} verified successfully`, 'success');
}

// Export evidence
function exportEvidence() {
    const dataStr = JSON.stringify(filteredEvidence, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `evidence_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Evidence exported successfully', 'success');
}

// Download evidence
function downloadEvidence() {
    if (!currentEvidenceId) return;
    
    const evidence = allEvidence.find(e => e.id === currentEvidenceId);
    if (!evidence) return;
    
    const dataStr = JSON.stringify(evidence, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${evidence.id}_evidence.json`;
    link.click();
    
    showNotification(`Evidence ${evidence.id} downloaded`, 'success');
}

// Export evidence chain
function exportEvidenceChain() {
    if (!currentEvidenceId) return;
    
    const evidence = allEvidence.find(e => e.id === currentEvidenceId);
    if (!evidence) return;
    
    const chainData = {
        evidenceId: evidence.id,
        chainOfCustody: evidence.chainOfCustody,
        exportTimestamp: new Date().toISOString(),
        exportedBy: 'System User'
    };
    
    const dataStr = JSON.stringify(chainData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${evidence.id}_chain_of_custody.json`;
    link.click();
    
    showNotification(`Chain of custody for ${evidence.id} exported`, 'success');
}

// Update stats
function updateStats() {
    const totalEvidence = allEvidence.length;
    const verifiedEvidence = allEvidence.filter(e => e.status === 'verified').length;
    const encryptedEvidence = allEvidence.length; // All evidence is encrypted
    
    document.getElementById('total-evidence').textContent = totalEvidence;
    document.getElementById('verified-evidence').textContent = verifiedEvidence;
    document.getElementById('encrypted-evidence').textContent = encryptedEvidence;
}

// Modal functions
function openEvidenceModal() {
    document.getElementById('evidence-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeEvidenceModal() {
    document.getElementById('evidence-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
    currentEvidenceId = null;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('evidence-modal');
    if (event.target === modal) {
        closeEvidenceModal();
    }
}

// Utility functions
function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#e53e3e' : type === 'warning' ? '#d69e2e' : '#667eea'};
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

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .loading-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style); 