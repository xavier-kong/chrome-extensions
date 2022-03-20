// to only allow use during allowed hours

function isWeekend() {
    const currentDay = new Date().getDay();
    if (currentDay === 0 || currentDay === 6 || current === 5) {
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

const sites = [
    'discord.com',
    'twitter.com',
    'instagram.com',
    'facebook.com',
    'linkedin.com',
];

sites.forEach((site) => {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.url.includes(site)) {
            if (!allowedTime()) {
                chrome.tabs.update(tabId, {
                    url: './countdown/countdown.html',
                });
            }
        }
    });
});

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
            'twitter.com': 1,
            'instagram.com': 1,
            'facebook.com': 1,
            'linkedin.com': 1,
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

// to redirect user based on remaining visits allowed

