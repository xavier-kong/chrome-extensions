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
    if (url) {
        for (let i = 0; i < sites.length; i++) {
            if (url.includes(sites[i])) {
                return true;
            }
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

function checkIfCommittedToday() {
    const graphArray = fetchContributionGraphArray('xavier-kong');
    const { latestCommitDay } = findMostRecentZeroContribution(graphArray);
    const todayDateString = buildDateString(0);
    const committedToday = latestCommitDay.then(day => {
        return day === todayDateString;
    })
    return committedToday;
}

function fetchContributionGraphArray(username) {
    const graphJSON = fetch(`https://github.com/users/${username}/contributions`)
        .then((res) => res.text())
        .then((graph) => convertGraphToArray(graph))
        .catch((e) => {
            console.log(e);
            return false;
        });
    return graphJSON;
}

function convertGraphToArray(graph) {
    let data;
    let re = /(data-count="\d+".*data-date="\d{4}-\d{2}-\d{2}")/g;
    let matches = graph.match(re);
    data = matches.map((match) => {
        return {
            count: +match.match(/data-count="(\d+)"/)[1],
            date: match.match(/data-date="(\d{4}-\d{2}-\d{2})"/)[1],
        };
    });
    return data;
}

function findMostRecentZeroContribution(contributionArray) {
    const latestCommitDayTemp = contributionArray.then(array => {
        for (const day of array) {
            if (day.count === 0) {
                lastZeroContribution = day.date;
            } else {
                latestCommitDay = day.date;
            }
        }

        graphStart = array[0].date;
        graphEnd = array[array.length - 1].date;
        return latestCommitDay
    })

    return {
        latestCommitDay: latestCommitDayTemp
    }
}

function buildDateString(days) {
    const date = new Date(new Date().setDate(new Date().getDate() - days));
    const monthString =
        date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const dateSting =
        date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    const fullDateString = `${date.getFullYear()}-${monthString}-${dateSting}`;
    return fullDateString;
}

// check if committed + done leetcode + cs study then update data

const badSites = ["youtube.com", "discord.com", "instagram.com", "facebook.com", "linkedin.com"];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url || (!changeInfo.title?.toLowerCase().includes('leetcode'))) {
        const isBadSite = checkIfBadSite(changeInfo.url, badSites);
        if (isBadSite) {
            chrome.storage.local.get(['stay-productive'], async (result) => {
                if ('stay-productive' in result) {
                    const { date, committedToday } = result['stay-productive'];
                    const dateIsToday = checkDate(date);
                    if (dateIsToday && committedToday) {
                        return;
                    }
                }

                checkIfCommittedToday().then(committedToday => {
                    if (committedToday) {
                        chrome.storage.local.set({
                            'stay-productive': {
                                date: createDate(),
                                committedToday: true
                            }
                        });
                    } else {
                        chrome.tabs.update(tabId, {
                            url: 'https://github.com/xavier-kong'
                        });
                    }
                });
            })
        }
    }
});
