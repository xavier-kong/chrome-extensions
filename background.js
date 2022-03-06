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
            sites: {
                'https://www.youtube.com/feed/subscriptions': {
                    count: 10,
                    forgive: false,
                },
                'twitter.com': {
                    count: 10,
                    forgive: false,
                },
                'discord.com': {
                    count: 10,
                    forgive: false,
                },
            },
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
            const { date, sites } = result['hide-yt-search'];
            if (!checkDate(date)) {
                setData();
            }
        } else {
            setData();
        }
    });
});

const getBadSite = (sites, url) => {
    for (const site of sites) {
        if (url.includes(site)) {
            return site;
        }
    }
    return false;
};

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
    if (!changeInfo.url.includes('chrome-extension://')) {
        chrome.storage.local.get(['hide-yt-search'], async (result) => {
            const { date, sites } = result['hide-yt-search'];
            const badSites = Object.keys(sites);
            const site = getBadSite(badSites, changeInfo.url);

            if (site) {
                if (sites[site].forgive) {
                    // redirect and set data with new forgive
                    const data = {
                        'hide-yt-search': {
                            date: date,
                            sites: {
                                ...result['hide-yt-search'].sites,
                                [site]: {
                                    count: (result['hide-yt-search'].sites[
                                        site
                                    ].count -= 1),
                                    forgive: false,
                                },
                            },
                        },
                    };

                    await chrome.storage.local.set({
                        'hide-yt-search': data['hide-yt-search'],
                    });

                    chrome.webNavigation.onCommitted.addListener(
                        (details) => {
                            if (details.transitionType === 'reload') {
                                redirectToPrompt(
                                    sites,
                                    site,
                                    details.url,
                                    tabId
                                );
                            }
                        },
                        { url: [{ urlContains: `${changeInfo.url}` }] }
                    );
                } else {
                    redirectToPrompt(sites, site, changeInfo.url, tabId);
                }
            }
        });
    }
});
