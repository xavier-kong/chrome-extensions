chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url.includes('youtube.com')) {
        chrome.tabs.update(tabId, {
            url: 'https://thejobwindow.files.wordpress.com/2013/10/ali.jpg',
        });
    }
});
