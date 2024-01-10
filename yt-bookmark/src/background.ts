chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab?.url?.includes('https://www.youtube.com/watch?v=')) {
        chrome.scripting.executeScript({
            target: { tabId },
            files: ['./main.js'],
        });
    }
})
