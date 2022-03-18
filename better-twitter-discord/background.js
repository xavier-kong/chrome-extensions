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
