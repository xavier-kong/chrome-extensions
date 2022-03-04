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
    
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    chrome.storage.local.get(['hide-yt-search'], (result) => {
        const { date, sites } = result['hide-yt-search'];
        const badSites = Object.keys(sites);

        if (badSites.some((site) => changeInfo.url.includes(site))) {
            // need to get site url
            if (sites[changeInfo.url].forgive) {
                /*
                dont need to redirect
                set forgive to false
                */
                const data = {
                    'hide-yt-search': {
                        date: date,
                        sites: {
                            ...result['hide-yt-search'].sites,
                        },
                    },
                };
            } else {
            }
            // chrome.tabs.update(tabId, { url: './redirect/redirect.html' });
            /*
            to do:
            1. figure out how to pass target url to page
            2. change page dynamically on click
                1. if remaining visits is 0 prevent user from accessing
            3. the test thingy
            4. decrement count
            5. figure out how to prevent loop
                if allow redirect
                    set site.forgive = true
                    then when page renders


            https://developer.chrome.com/docs/extensions/reference/history/#event-onVisited
            */
        }
    });
});

/*

    could do on tab update then redirect (easier to obtain url)
    only decrement count when user selects continue 
    */

/*
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
