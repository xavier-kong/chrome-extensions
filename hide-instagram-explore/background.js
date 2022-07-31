const filter = {
    url: [
        {
            urlContains: 'instagram',
        },
    ],
};

for (const event of ['onHistoryStateUpdated', 'onCompleted']) {
    chrome.webNavigation[event].addListener(async (details) => {
        const { tabId, url } = details;
        if (url.includes('instagram.com')) {
					chrome.scripting.executeScript({
						target: { tabId: tabId },
						files: ['./hideExploreButton.js'],
					})
				}
    }, filter);
}
