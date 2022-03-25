chrome.tabs.onCreated.addListener((tab) => {
    if (tab.title === 'New Tab' && tab.url === '') {
    }
});
