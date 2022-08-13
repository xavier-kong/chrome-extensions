// add exception if video channel is neetcode

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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'loading' && tab.url.includes('www.youtube.com') && (changeInfo.title && !changeInfo.title.toLowerCase().includes('leetcode'))) {
        chrome.storage.local.get(['allow-youtube'], (result) => {
            if ('allow-youtube' in result) {
                const { date, committedToday } = result['allow-youtube'];
                const dateIsToday = checkDate(date);
                if (dateIsToday && committedToday) {
                    return;
                }
            }

            checkIfCommittedToday().then(committedToday => {
                if (committedToday) {
                    chrome.storage.local.set({
                        'allow-youtube': {
                            date: createDate(),
                            committedToday: true
                        }
                    });
                } else {
                    chrome.tabs.update(tabId, {
                        url: 'https://github.com/xavier-kong'
                    })
                }
            })
        })
    }
})

