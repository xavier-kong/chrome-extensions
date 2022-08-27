function checkIfBadSite(url) {
    const badSites = ["youtube.com", "discord.com", "instagram.com", "facebook.com", "linkedin.com"];
    if (url) {
        for (let i = 0; i < badSites.length; i++) {
            if (url.includes(badSites[i])) {
                return true;
            }
        }
    }
    return false;
}

function createDate(dateString) {
    const date = dateString ? new Date(dateString) : new Date();
    return {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
    };
}

function checkDate(date) {
    const { day, month, year } = createDate();
    const { day: testDay, month: testMonth, year: testYear } = createDate(date);

    return day === testDay && month === testMonth && year === testYear;
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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url || (!changeInfo.title?.toLowerCase().includes('leetcode'))) {
        const isBadSite = checkIfBadSite(changeInfo.url);
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
