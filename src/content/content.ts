import { SecurityScanner } from '../detectors/scanner';
import { Detection, ScanResult } from '../types';

// Initialize scanner
const scanner = new SecurityScanner();
let allDetections: Detection[] = [];
const scannedUrls = new Set<string>();
const uniqueDetectionKeys = new Set<string>();

/**
 * Adds detections if they haven't been seen before
 */
function addUniqueDetections(detections: Detection[]): void {
    detections.forEach(detection => {
        // Create a unique key for the detection
        const key = `${detection.type}|${detection.source}|${detection.line}|${detection.column}|${detection.match}`;

        if (!uniqueDetectionKeys.has(key)) {
            uniqueDetectionKeys.add(key);
            allDetections.push(detection);
        }
    });
}

/**
 * Scans code blocks on the page
 */
async function scanCodeBlocks(): Promise<void> {
    // Common code block selectors
    const codeSelectors = [
        'pre',
        'code',
        '.highlight',
        '.code-block',
        '.blob-code',
        '[class*="language-"]',
        '[class*="code"]',
        'textarea[class*="code"]',
    ];

    const codeElements = document.querySelectorAll(codeSelectors.join(', '));

    codeElements.forEach((element) => {
        // Skip if already scanned
        if ((element as HTMLElement).dataset.securityScanned === 'true') {
            return;
        }

        const detections = scanner.scanElement(element);

        if (detections.length > 0) {
            // Add detections to global list
            addUniqueDetections(detections);

            // Highlight the element
            highlightElement(element as HTMLElement, detections);
        }
    });

    // Scan external scripts
    await scanExternalScripts();

    // Store results
    storeResults();
}

/**
 * Scans external script files
 */
async function scanExternalScripts(): Promise<void> {
    const scripts = document.querySelectorAll('script[src]');

    for (const script of Array.from(scripts)) {
        const src = (script as HTMLScriptElement).src;

        // Skip if already scanned or if it's a chrome extension script
        if (scannedUrls.has(src) || src.startsWith('chrome-extension://')) {
            continue;
        }

        scannedUrls.add(src);

        try {
            const response = await fetch(src);
            const text = await response.text();

            const detections = scanner.scan(text, src);

            if (detections.length > 0) {
                addUniqueDetections(detections);
                console.log(`Found ${detections.length} leaks in ${src}`);
            }
        } catch (error) {
            console.warn(`Failed to scan script: ${src}`, error);
        }
    }
}

/**
 * Highlights elements with detected leaks
 */
function highlightElement(element: HTMLElement, detections: Detection[]): void {
    // Don't highlight if already highlighted
    if (element.dataset.securityScanned === 'true') {
        return;
    }

    element.dataset.securityScanned = 'true';

    // Add visual indicator
    const indicator = document.createElement('div');
    indicator.className = 'security-leak-indicator';
    indicator.style.cssText = `
    position: absolute;
    top: 0;
    right: 0;
    background: #ff4444;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    z-index: 10000;
    cursor: pointer;
  `;

    const maxSeverity = getMaxSeverity(detections);
    indicator.textContent = `⚠️ ${detections.length} leak${detections.length > 1 ? 's' : ''} (${maxSeverity})`;
    indicator.title = 'Click to view details';

    // Set color based on severity
    switch (maxSeverity) {
        case 'critical':
            indicator.style.background = '#dc2626';
            break;
        case 'high':
            indicator.style.background = '#ea580c';
            break;
        case 'medium':
            indicator.style.background = '#f59e0b';
            break;
        case 'low':
            indicator.style.background = '#3b82f6';
            break;
    }

    // Make element position relative if not already positioned
    const position = window.getComputedStyle(element).position;
    if (position === 'static') {
        element.style.position = 'relative';
    }

    // Add border to highlight
    element.style.border = `2px solid ${indicator.style.background}`;
    element.style.borderRadius = '4px';

    // Add click handler
    indicator.addEventListener('click', () => {
        showDetectionDetails(detections);
    });

    element.appendChild(indicator);
}

/**
 * Gets the maximum severity from detections
 */
function getMaxSeverity(detections: Detection[]): string {
    const severityOrder = ['critical', 'high', 'medium', 'low'];
    for (const severity of severityOrder) {
        if (detections.some(d => d.severity === severity)) {
            return severity;
        }
    }
    return 'low';
}

/**
 * Shows detection details in console
 */
function showDetectionDetails(detections: Detection[]): void {
    console.group('🔒 Security Leak Detections');
    detections.forEach((detection, index) => {
        console.log(`\n${index + 1}. ${detection.type} (${detection.severity})`);
        console.log(`   Description: ${detection.description}`);
        console.log(`   Location: Line ${detection.line}, Column ${detection.column}`);
        console.log(`   Match: ${detection.match}`);
        if (detection.context) {
            console.log(`   Context:\n${detection.context}`);
        }
    });
    console.groupEnd();
}

/**
 * Stores scan results in chrome storage
 */
function storeResults(): void {
    const result: ScanResult = {
        detections: allDetections,
        scannedAt: Date.now(),
        url: window.location.href,
    };

    chrome.storage.local.set({ scanResult: result }, () => {
        console.log(`Security scan complete: ${allDetections.length} leaks detected`);
    });

    // Update badge
    chrome.runtime.sendMessage({
        type: 'UPDATE_BADGE',
        count: allDetections.length,
    });
}

/**
 * Initialize scanning
 */
function init(): void {
    console.log('🔒 Security Leak Detector: Initializing...');

    // Reset detections
    allDetections = [];
    uniqueDetectionKeys.clear();

    // Scan immediately
    scanCodeBlocks();

    // Observe DOM changes
    const observer = new MutationObserver(() => {
        scanCodeBlocks();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    console.log('🔒 Security Leak Detector: Active');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'GET_DETECTIONS') {
        sendResponse({ detections: allDetections });
    }
    return true;
});
