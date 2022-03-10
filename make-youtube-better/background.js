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
            if (url.includes('watch?v') && !url.includes('list=')) {
                chrome.tabs.update(tabId, { url: 'ali.jpg' });
            }
            chrome.tabs.sendMessage(tabId, { command: 'hide-search' });
        }
    }, filter);
}

const createDate = (dateString = new Date()) => {
    const date = new Date(dateString);
    return {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
    };
};

const setData = async () => {
    const { day, month, year } = createDate();
    const data = {
        'hide-yt-search': {
            date: `${year}-${month}-${day}`,
            count: 10,
            forgive: false,
        },
    };
    await chrome.storage.local.set({
        'hide-yt-search': data['hide-yt-search'],
    });
};

const checkDate = (date) => {
    const { day, month, year } = createDate();
    const { day: testDay, month: testMonth, year: testYear } = createDate(date);

    return day === testDay && month === testMonth && year === testYear;
};

chrome.windows.onCreated.addListener((window) => {
    chrome.storage.local.get(['hide-yt-search'], (result) => {
        if (result) {
            const { date } = result['hide-yt-search'];
            if (!checkDate(date)) {
                setData();
            }
        } else {
            setData();
        }
    });
});

const redirectToPrompt = (sites, site, redirectUrl, tabId) => {
    let url;
    if (sites[site].count > 0) {
        url = `./redirect/redirect.html?url=${redirectUrl}&site=${site}`;
    } else {
        // redirect to site saying no more counts
        url = `./redirect/redirect.html?url=${redirectUrl}&site=${site}`;
    }
    chrome.tabs.update(tabId, {
        url: url,
    });
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
        !changeInfo.url.includes('chrome-extension://') &&
        changeInfo.url.includes('www.youtube.com/feed/subscriptions')
    ) {
        chrome.storage.local.get(['hide-yt-search'], async (result) => {
            const { date, count, forgive } = result['hide-yt-search'];

            if (forgive) {
                // redirect and set data with new forgive
                const data = {
                    'hide-yt-search': {
                        date: date,
                        count: count - 1,
                        forgive: false,
                    },
                };
                await chrome.storage.local.set({
                    'hide-yt-search': data['hide-yt-search'],
                });

                // only set on exit

                chrome.webNavigation.onCommitted.addListener(
                    (details) => {
                        if (details.transitionType === 'reload') {
                            redirectToPrompt(sites, site, details.url, tabId);
                        }
                    },
                    { url: [{ urlContains: 'youtube.com' }] }
                );
            } else {
                redirectToPrompt(sites, site, changeInfo.url, tabId);
            }
        });
    }
});
