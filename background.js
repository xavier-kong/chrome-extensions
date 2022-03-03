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

const createDate = (date = new Date()) => {
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
                'https://www.youtube.com/feed/subscriptions': 10,
                'twitter.com': 10,
                'discord.com': 10,
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

/*
ideas:
when youtube is fullscreen
set other window to dark to prevent distraction


chrome extension to only allow certain number of visits to a site each day aka only 5 vists to youtube subcriptions per day etc/ twitter


before navigation:
    prompt user with amount of visits remaining
    and if they would like to continue

For tracking counts:
    use local storage
    if date in storage != today's date then update counts and stuff
    upon visit of sites => decrement count

Upon visitng sites:
    if site in list:
        redirect to temp site
        basic html site
        text with redirect button to orignal url (need find way to create html with redirect link)
        if select redirect
            prompt user to enter random gen string (disable copy paste)
            redirect
        if select not to redirect
            um..... will have to see what happens
*/
