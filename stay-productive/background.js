// to only allow use during allowed hours
// convert to same as youtube unify both:q
//

function isWeekend() {
    const currentDay = new Date().getDay();
    if (currentDay === 0 || currentDay === 6 || currentDay === 5) {
        return true;
    } else {
        return false;
    }
}

function allowedTime() {
    const currentHour = new Date().getHours();
    const startHour = isWeekend() ? 14 : 18;
    if (currentHour >= startHour && currentHour < 23) {
        return true;
    } else {
        return false;
    }
}

function checkIfBadSite(url, sites) {
    for (let i = 0; i < sites.length; i++) {
        if (url.includes(sites[i])) {
            return sites[i];
        }
    }
    return false;
}

// to set data on window created

function createDate(dateString) {
    const date = dateString ? new Date(dateString) : new Date();
    return {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
    };
}

async function setData() {
    const { day, month, year } = createDate();
    const data = {
        'stay-productive': {
            date: `${year}-${month}-${day}`,
            sites: [
                { name: 'twitter.com', count: 1, forgive: false },
                { name: 'instagram.com', count: 1, forgive: false },
                { name: 'facebook.com', count: 1, forgive: false },
                { name: 'linkedin.com', count: 1, forgive: false },
                { name: 'discord.com', count: 5, forgive: false },
            ],
        },
    };
    await chrome.storage.local.set({
        'stay-productive': data['stay-productive'],
    });
}

function checkDate(date) {
    const { day, month, year } = createDate();
    const { day: testDay, month: testMonth, year: testYear } = createDate(date);

    return day === testDay && month === testMonth && year === testYear;
}

chrome.windows.onCreated.addListener((window) => {
    chrome.storage.local.get(['stay-productive'], (result) => {
        if (result) {
            const { date } = result['stay-productive'];
            if (!checkDate(date)) {
                setData();
            }
        } else {
            setData();
        }
    });
});

// to redirect user based on site type, current time and remaining visits allowed

const sites = [
    'discord.com',
    'twitter.com',
    'instagram.com',
    'facebook.com',
    'linkedin.com',
];

async function getSiteFate(site) {
    const fate = await chrome.storage.local.get(
        ['stay-productive'],
        async (result) => {
            const { sites } = result['stay-productive'];

            for (let i = 0; i < sites.length; i++) {
                const { name, count, forgive } = sites[i];
                if (name === site) {
                    if (forgive) {
                        return 'forgive';
                    } else if (count >= 1) {
                        return 'redirect';
                    } else if (count === 0) {
                        return 'block';
                    }
                }
            }
        }
    );
    return fate;
}

function noRelatedTabs(result, name) {
    for (let i = 0; i < result.length; i++) {
        if (result[i].url.includes(name)) {
            return false;
        }
    }
    return true;
}

// use hash map to check if bad site
// if bad site fetch from cache
// if result check if date is today and commited: return (implicit allow)
// check if committed + done leetcode + cs study then update data
// if not then find what has not been done and open those pages

const badSites = ["youtube.com", "discord.com", "instagram.com", "facebook.com", "linkedin.com"];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const isBadSite = checkIfBadSite(changeInfo.url, badSites);

    if (isBadSite) {
        chrome.storage.local.get(['stay-productive'], async (result) => {

        })
    }






    if (site && !changeInfo.url.includes('chrome-extension://')) {
        if (allowedTime()) {
            chrome.storage.local.get(['stay-productive'], async (result) => {
                const { sites, date } = result['stay-productive'];

                for (let i = 0; i < sites.length; i++) {
                    const { name, count, forgive } = sites[i];
                    if (name === site) {
                        if (forgive) {
                            chrome.tabs.onRemoved.addListener((newTabId) => {
                                if (tabId === newTabId) {
                                    chrome.tabs.query({}, (result) => {
                                        if (noRelatedTabs(result, name)) {
                                            sites[i].forgive = false;
                                            const data = {
                                                'stay-productive': {
                                                    date: date,
                                                    sites: sites,
                                                },
                                            };

                                            chrome.storage.local.set({
                                                'stay-productive':
                                                    data['stay-productive'],
                                            });
                                        }
                                    });
                                }
                            });

                            if (name === 'linkedin.com') {
                                chrome.scripting.executeScript({
                                    target: { tabId: tabId },
                                    files: ['./linkedin.js'],
                                });
                            }
                        } else if (count >= 1) {
                            chrome.tabs.update(tabId, {
                                url: `./pages/redirect/redirect.html?url=${changeInfo.url}`,
                            });
                        } else if (count === 0) {
                            chrome.tabs.update(tabId, {
                                url: `./pages/block/block.html`,
                            });
                        }
                    }
                }
            });
        } else {
            chrome.tabs.update(tabId, {
                url: './pages/countdown/countdown.html',
            });
        }
    }
});
