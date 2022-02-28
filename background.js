chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    console.log('hola', details);
})