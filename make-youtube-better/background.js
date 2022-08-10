

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
            count: 4,
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
    const startHour = isWeekend() ? 14 : 18;
    if (currentHour >= startHour && currentHour < 23) {
        return true;
    } else {
        return false;
    }
}


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

function checkIfCommittedToday() {
    const graphArray = fetchContributionGraphArray('xavier-kong');
    const { latestCommitDay } = findMostRecentZeroContribution(graphArray);
    const todayDateString = buildDateString(0);
    return todayDateString === latestCommitDay;
}

function fetchContributionGraphArray(username) {
    const graphJSON = fetch(
        `https://github.com/users/${username}/contributions`
    )
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
    let lastZeroContribution;
    let latestCommitDay;
    for (const day of contributionArray) {
        if (day.count === 0) {
            lastZeroContribution = day.date;
        } else {
            latestCommitDay = day.date;
        }
    }

    return {
        lastZeroContribution,
        latestCommitDay,
        graphStart: contributionArray[0].date,
        graphEnd: contributionArray[contributionArray.length - 1].date,
    };
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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url.includes('www.youtube.com')) {
        chrome.storage.local.get(['allow-youtube'], (result) => {
            let cachedData;
            if ('allow-youtube' in result) {
                const cachedDate = result['allow-youtube'].date;
                const dateIsToday = checkDate(cachedDate);
                if (!dateIsToday) {
                    result['allow-youtube'].date = createDate();
                    cachedData = result['allow-youtube'];
                }
            } else {
                cachedData = {
                    date: createDate(),
                    committedToday: false
                };
            }

            if (!cachedData.committedToday) {
            const committedToday = checkIfCommittedToday();
                if (committedToday) {
                    cachedData.committedToday = true
                    chrome.storage.local.set({
                        'allow-youtube': cachedData
                    });
                } else {
                    chrome.tabs.update(tabId, {
                        url: 'https://github.com/xavier-kong'
                    })
                }
            }
        })

    }
})

