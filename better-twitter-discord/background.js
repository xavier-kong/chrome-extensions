['discord.com', 'twitter.com'].forEach((site) => {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (
            !changeInfo.url.includes('chrome-extension://') &&
            changeInfo.url.includes(site)
        ) {
            /*
            get data from storage
            if forgive
                create listners for on focus change for tab and window, on close 
                    set count - 1, forgive = false
                create listner for reload
                    redirect to prompt
            else if not forive
                redirec to prompt
            */
        }
    });
});
