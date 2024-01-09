const executedMap: Record<number, boolean> = {};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(tabId in executedMap);
    if (tab?.url?.includes('https://www.youtube.com/watch?v=') && !(tabId in executedMap)) {

        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['./main.js'],
        });

        executedMap[tabId] = true;
    }
})

chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabId in executedMap) {
        delete executedMap[tabId];
    }
})
