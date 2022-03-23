// to only allow use during allowed hours

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
    const startHour = isWeekend() ? 16 : 18;
    if (currentHour >= startHour && currentHour < 22) {
        return true;
    } else {
        return false;
    }
}

function isBadSite(url, sites) {
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
                { name: 'instagram.com', count: 2, forgive: false },
                { name: 'facebook.com', count: 1, forgive: false },
                { name: 'linkedin.com', count: 2, forgive: false },
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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const site = isBadSite(changeInfo.url, sites);
    if (site && !changeInfo.url.includes('chrome-extension://')) {
        if (allowedTime()) {
            chrome.storage.local.get(['stay-productive'], async (result) => {
                const { sites } = result['stay-productive'];

                for (let i = 0; i < sites.length; i++) {
                    const { name, count, forgive } = sites[i];
                    if (name === site && !forgive) {
                        if (count === 1) {
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
                url: './countdown/countdown.html',
            });
        }
    }
});
