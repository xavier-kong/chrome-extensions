chrome.tabs.onUpdated.addListender((tabId, changeInfo, tab) => {
    if (changeInfo.url.includes('https://www.youtube.com/playlist?list=')) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['./main.js'],
        });
    }
});
