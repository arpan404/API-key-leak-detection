// Background service worker for the extension

chrome.runtime.onInstalled.addListener(() => {
    console.log('Security Leak Detector installed');

    // Initialize storage
    chrome.storage.local.set({
        scanResult: {
            detections: [],
            scannedAt: 0,
            url: '',
        },
    });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'UPDATE_BADGE') {
        const count = message.count || 0;

        // Update badge
        if (sender.tab?.id) {
            if (count > 0) {
                chrome.action.setBadgeText({
                    text: count.toString(),
                    tabId: sender.tab.id,
                });

                // Set badge color based on count
                const color = count >= 5 ? '#dc2626' : count >= 3 ? '#ea580c' : '#f59e0b';
                chrome.action.setBadgeBackgroundColor({
                    color: color,
                    tabId: sender.tab.id,
                });
            } else {
                chrome.action.setBadgeText({
                    text: '',
                    tabId: sender.tab.id,
                });
            }
        }

        sendResponse({ success: true });
    }

    return true;
});

// Clear badge when tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, _tab) => {
    if (changeInfo.status === 'loading') {
        chrome.action.setBadgeText({ text: '', tabId });
    }
});
