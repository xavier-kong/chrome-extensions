// redirect non playlist watching on youtube videos to motivational quote

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
            if (url.includes('watch?v')) {
                if (url.includes('list=')) {
                    insertHideCSS(tabId);
                    setTimeout(() => {
                        chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            files: ['./watch-focus/watchFocus.js'],
                        });
                        insertHideCSS(tabId);
                    }, 750);
                } else {
                    chrome.tabs.update(tabId, {
                        url: 'https://thejobwindow.files.wordpress.com/2013/10/ali.jpg',
                    });
                }
            }
            chrome.tabs.sendMessage(tabId, { command: 'hide-search' });
        }
    }, filter);
}

// refresh counts when window is created and date is not the same

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
        'hide-yt-search': {
            date: `${year}-${month}-${day}`,
            count: 5,
            forgive: false,
        },
    };
    await chrome.storage.local.set({
        'hide-yt-search': data['hide-yt-search'],
    });
}

function checkDate(date) {
    const { day, month, year } = createDate();
    const { day: testDay, month: testMonth, year: testYear } = createDate(date);

    return day === testDay && month === testMonth && year === testYear;
}

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
    const startHour = isWeekend() ? 15 : 18;
    if (currentHour >= startHour && currentHour < 21) {
        return true;
    } else {
        return false;
    }
}

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

// main logic for redirecting from youtube subcriptions page

function redirectToPrompt(count, redirectUrl, tabId) {
    let url;
    if (count > 0) {
        url = `./pages/redirect/redirect.html?url=${redirectUrl}`;
    } else {
        url = `./pages/no-more/no-more.html`;
    }
    chrome.tabs.update(tabId, {
        url: url,
    });
}

function insertHideCSS(tabId) {
    chrome.scripting.insertCSS({
        target: { tabId: tabId },
        files: ['./watch-focus/hide.css'],
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url.includes('www.youtube.com') && !allowedTime()) {
        chrome.tabs.update(tabId, {
            url: './pages/countdown/countdown.html',
        });
    } else if (
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

                chrome.webNavigation.onCommitted.addListener(
                    (details) => {
                        if (details.transitionType === 'reload') {
                            redirectToPrompt(count, details.url, tabId);
                        }
                    },
                    { url: [{ urlContains: 'youtube.com' }] }
                );
            } else {
                redirectToPrompt(count, changeInfo.url, tabId);
            }
        });
    } else if (
        !changeInfo.url.includes('chrome-extension://') &&
        changeInfo.url.includes('www.youtube.com/watch?v')
    ) {
        insertHideCSS(tabId);
        setTimeout(() => {
            insertHideCSS(tabId);
        }, 750);
    }
});
