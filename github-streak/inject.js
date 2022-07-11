/*
1. if no start date in storage, ask user to add streak start date
2. find latest contribution and create contribution in last year, curr streak and longest streak
3. if see gap in user streak, update streak start date and longest streak info
4. display date
*/

async function main() {
    const onProfile = checkIfOnProfile();
    if (onProfile) {
        const username = getUsername();
        const { longestStreak, currentStreak } = await getData(username);
        if (currentStreak) {
            const graphArray = await fetchContributionGraphArray(username);
            const {
                lastZeroContribution,
                latestCommitDay,
                graphStart,
                graphEnd,
            } = getTotalContributions(graphArray);
            const todayDateString = buildDateString(0);
            let currentStreakStartDate = currentStreak.startDate;
            let currentStreakEndDate = todayDateString;
            if (lastZeroContribution) {
                if (lastZeroContribution === todayDateString) {
                    // change end date to ytd
                    currentStreakEndDate = buildDateString(1);
                } else {
                    currentStreakStartDate = todayDateString;
                }
            }

            const currentStreakLength = calculateStreakLength(
                currentStreakStartDate,
                currentStreakEndDate
            );

            if (currentStreakLength > longestStreak.length) {
                longestStreak = {
                    startDay: currentStreakStartDate,
                    endDay: currentStreakEndDate,
                    length: currentStreakLength,
                };
            }

            await updateData({
                username,
                longestStreak,
                currentStreak: {
                    length: currentStreakLength,
                    startDate: currentStreakStartDate,
                },
            });

            const streakHtml = buildHtml({
                latestCommitDay,
                longestStreak,
                currentStreak: {
                    length: currentStreakLength,
                    startDate: currentStreakStartDate,
                },
                totalContributions,
                graph: {
                    startDate: graphStart,
                    endDate: graphEnd,
                },
            });

            /*


            pattern:
                in all cases, the streak is pretty much today - startDate
                and if longer than longest streak update all params
            */

            /*
            fetch real time
                total contributions
                graph start and end data
                latestCommitDay

            fetch
                longestStreak:
                    length
                    startDay
                    endDay
                currentStreak
                    length
                    startDate
            */
        } else {
            // add form and ask user to enter data
        }
    }
}

function checkIfOnProfile() {
    const el = document.getElementsByClassName('js-yearly-contributions');
    return el.length > 0;
}

function getUsername() {
    const url = window.location.href;
    const username = url.replace('https://github.com/', '');
    return username;
}

function getData(username) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['github-streak'], function (result) {
            if (
                result &&
                'github-streak' in result &&
                username in result['github-streak']
            ) {
                resolve(result['github-streak'][username]);
            } else {
                resolve(false);
            }
        });
    });
}

const readLocalStorage = async (key) => {};

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

function createStartDateForm() {}

function injectStartDateForm(startDateForm) {
    const graph = document.getElementsByClassName(
        'graph-before-activity-overview'
    )[0];
    const formContainer = document.createElement('div');
    formContainer.classList.add('start-date-form');
    formContainer.innerHTML = startDateForm;
    graph.appendChild(formContainer);
}

function appendStreakStatsHtml(html) {
    const contributionsCalendar = document.getElementsByClassName(
        'graph-before-activity-overview'
    )[0];
    const container = document.createElement('div');
    container.innerHTML = html;
    container.classList.add('original-streak');
    if (!document.querySelector('.original-streak')) {
        contributionsCalendar.appendChild(container);
    }
}

function getTotalContributions() {
    const nodes = document.getElementsByClassName('f4 text-normal mb-2');
    for (i in nodes) {
        if (
            nodes[i].innerHTML &&
            nodes[i].innerHTML.includes('contributions')
        ) {
            const number = [];
            for (const k of nodes[i].innerHTML) {
                if (!isNaN(k) && k != '\n' && k != ' ') {
                    number.push(k);
                }
            }
            const contributionsString = parseInt(number.join(''));
            return contributionsString;
        }
    }
}

function findMostRecentZeroContribution(contributionArray) {
    let lastZeroContribution;
    let lastestCommitDay;
    for (const day of contributionArray) {
        if (day.count === 0) {
            lastZeroContribution = day.date;
        } else {
            lastestCommitDay = day.date;
        }
    }

    return {
        lastZeroContribution,
        lastestCommitDay,
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

function calculateStreakLength(endDate, startDate) {
    endDate = createDateFromDateString(endDate);
    startDate = createDateFromDateString(startDate);

    const oneDay = 24 * 60 * 60 * 1000;
    const newStreak = Math.round(Math.abs((endDate - startDate) / oneDay));
    return newStreak;
}

function createDateFromDateString(dateString) {
    const regexTest = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
    const match = regexTest.exec(dateString);
    const { year, month, day } = match.groups;
    const date = new Date(year, month, day);
    return date;
}

async function updateData({ username, longestStreak, currentStreak }) {
    chrome.storage.local.get(['github-streak'], async (res) => {
        const data = res['github-streak'];
        await chrome.storage.local.set({
            'github-streak': {
                ...data,
                [username]: {
                    longestStreak,
                    currentStreak,
                },
            },
        });
    });
}

function buildHtml({
    latestCommitDay,
    longestStreak,
    currentStreak,
    totalContributions,
    graph,
}) {
    const htmlData = createHtmlData({
        latestCommitDay,
        longestStreak,
        currentStreak,
        totalContributions,
        graph,
    });
    const streakHtml = getStreakHTML(htmlData);
    return streakHtml;
}

function createHtmlData({
    latestCommitDay,
    longestStreak,
    currentStreak,
    totalContributions,
    graph,
}) {
    const data = [
        [
            'Contributions in the last year',
            `${totalContributions}`,
            `${graph.startDate} - ${graph.endDate}`,
        ],
        [
            'Longest streak',
            `${longestStreak.length}`,
            `${longestStreak.startDay} - ${longestStreak.endDay}`,
        ],
        [
            'Current streak',
            `${currentStreak.length}`,
            `${currentStreak.startDate} - ${latestCommitDay}`,
        ],
    ];
    return data;
}

function getStreakHTML(data) {
    return data
        .map((item, index) => {
            return `
        <div class="contrib-column table-column ${
            index === 0 ? 'contrib-column-first' : ''
        }">
            <span class="text-muted">${item[0]}</span>
            <span class="contrib-number">${item[1]}</span>
            <span class="text-muted">${item[2]}</span>
        </div>
        `;
        })
        .join('\n');
}

main();

// async function main() {
//     if (checkIfOnProfile()) {
//         const username = getUsername();
//         const { longestStreak, currentStreak } = await getData(username);
//         if (currentStreak) {
//             const todayDateString = buildTodayDateString();
//             let newStreak = calculateNewStreak(todayDateString, startDate);
//             let newLongestStreak;
//             let newStartDate = startDate;
//             const graphArray = await fetchContributionGraphArray(username);
//             const lastZeroContribution =
//                 findMostRecentZeroContribution(graphArray);
//             if (lastZeroContribution) {
//                 if (lastZeroContribution === todayDateString) {
//                     newStreak -= 1;
//                 } else {
//                     newStartDate = lastZeroContribution;
//                     newLongestStreak = newStreak;
//                 }
//             } else {
//                 newLongestStreak = currentStreak;

//                 // build and insert html
//                 // update new data
//             }
//         } else {
//             // no start date found
//         }
//     }
// }
