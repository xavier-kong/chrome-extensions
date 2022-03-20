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
    if (currentHour >= startHour && currentHour < 21) {
        return true;
    } else {
        return false;
    }
}

function isBadSite(url, sites) {
    for (let i = 0; i < sites.length; i++) {
        if (url.includes(sites[i])) {
            return true;
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

function visitAllowed(url) {
    chrome.storage.local.get(['stay-productive'], async (result) => {
        const { sites } = result['stay-productive'];

        for (let i = 0; i < sites.length; i++) {
            const site = sites[i];
            if (url.includes(site.name)) {
                if (site.forgive) {
                    return true;
                } else if (site.count === 1) {
                    return true;
                } else if (site.count === 0) {
                    return false;
                }
            }
        }
    });
}

/*
if forgive:
    allow to url without any redirection
if not forgive:
    if count = 1:
        redirect to check page
    else if count = 0:
        redirect to block page
*/

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (isBadSite(changeInfo.url, sites)) {
        if (allowedTime() && !changeInfo.url.includes('discord.com')) {
            // logic to check remaining visits
            // if 1 redirect to check
            // if 0 redirect to block page
            if (visitAllowed(changeInfo.url)) {
            } else {
            }
        } else {
            chrome.tabs.update(tabId, {
                url: './countdown/countdown.html',
            });
        }
    }
});
