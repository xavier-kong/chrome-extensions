chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
        tab.url.includes('https://www.youtube.com/playlist?list=') ||
        changeInfo.url.includes('https://www.youtube.com/playlist?list=')
    ) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['./main.js'],
        });
    }
});
