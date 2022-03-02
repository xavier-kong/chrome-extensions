const eventList = ['onHistoryStateUpdated', 'onCompleted'];

const filter = {
  url: [
    {
      urlContains: 'youtube',
    },
  ],
};

for (const event of eventList) {
    chrome.webNavigation[event].addListener(async (details) => {
        const { tabId, url } = details;
        if (url.includes('youtube.com')) {
            if (url.includes('watch?v') && !(url.includes('list='))) {
                chrome.tabs.update(tabId, { url: 'ali.jpg' })
            }
            chrome.tabs.sendMessage(tabId, {command: 'hide-search'})
        }
    }, filter)
}

/*
ideas:
when youtube is fullscreen
set other window to dark to prevent distraction


chrome extension to only allow certain number of visits to a site each day aka only 5 vists to youtube subcriptions per day etc/ twitter
*/