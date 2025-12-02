import { ScanResult, Detection } from '../types';

// Load and display scan results
async function loadResults(): Promise<void> {
    try {
        const result = await chrome.storage.local.get('scanResult');
        const scanResult: ScanResult = result.scanResult;

        if (!scanResult || !scanResult.detections || scanResult.detections.length === 0) {
            showNoDetections();
            return;
        }

        displayStats(scanResult.detections);
        displayDetections(scanResult.detections);
        displayScanTime(scanResult.scannedAt);
    } catch (error) {
        console.error('Error loading results:', error);
        showNoDetections();
    }
}

/**
 * Display statistics
 */
function displayStats(detections: Detection[]): void {
    const stats = {
        critical: detections.filter(d => d.severity === 'critical').length,
        high: detections.filter(d => d.severity === 'high').length,
        medium: detections.filter(d => d.severity === 'medium').length,
        low: detections.filter(d => d.severity === 'low').length,
    };

    document.getElementById('critical-count')!.textContent = stats.critical.toString();
    document.getElementById('high-count')!.textContent = stats.high.toString();
    document.getElementById('medium-count')!.textContent = stats.medium.toString();
    document.getElementById('low-count')!.textContent = stats.low.toString();
}

/**
 * Display detections list
 */
function displayDetections(detections: Detection[]): void {
    const container = document.getElementById('detections-list')!;
    const detectionsContainer = document.getElementById('detections-container')!;
    const noDetectionsDiv = document.getElementById('no-detections')!;

    container.innerHTML = '';
    detectionsContainer.style.display = 'block';
    noDetectionsDiv.style.display = 'none';

    // Sort by severity
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const sortedDetections = [...detections].sort((a, b) => {
        return severityOrder[a.severity] - severityOrder[b.severity];
    });

    sortedDetections.forEach((detection) => {
        const item = createDetectionItem(detection);
        container.appendChild(item);
    });
}

/**
 * Create detection item element
 */
function createDetectionItem(detection: Detection): HTMLElement {
    const item = document.createElement('div');
    item.className = `detection-item ${detection.severity}`;

    const header = document.createElement('div');
    header.className = 'detection-header';

    const type = document.createElement('div');
    type.className = 'detection-type';
    type.textContent = detection.type;

    const badge = document.createElement('span');
    badge.className = `severity-badge ${detection.severity}`;
    badge.textContent = detection.severity;

    header.appendChild(type);
    header.appendChild(badge);

    const description = document.createElement('div');
    description.className = 'detection-description';
    description.textContent = detection.description;

    const location = document.createElement('div');
    location.className = 'detection-location';
    const sourceText = detection.source === 'Inline' ? 'Inline Code' : detection.source.split('/').pop() || detection.source;
    location.textContent = `${sourceText} • Line ${detection.line}, Column ${detection.column}`;
    location.title = detection.source; // Show full URL on hover

    const match = document.createElement('div');
    match.className = 'detection-match';
    match.textContent = detection.match;

    item.appendChild(header);
    item.appendChild(description);
    item.appendChild(location);
    item.appendChild(match);

    return item;
}

/**
 * Show no detections message
 */
function showNoDetections(): void {
    document.getElementById('detections-container')!.style.display = 'none';
    document.getElementById('no-detections')!.style.display = 'block';

    // Reset stats
    document.getElementById('critical-count')!.textContent = '0';
    document.getElementById('high-count')!.textContent = '0';
    document.getElementById('medium-count')!.textContent = '0';
    document.getElementById('low-count')!.textContent = '0';
}

/**
 * Display scan time
 */
function displayScanTime(timestamp: number): void {
    const scanTime = document.getElementById('scan-time')!;

    if (timestamp) {
        const date = new Date(timestamp);
        const timeStr = date.toLocaleTimeString();
        scanTime.textContent = `Last scanned: ${timeStr}`;
    } else {
        scanTime.textContent = 'No scan performed yet';
    }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
    loadResults();
});
