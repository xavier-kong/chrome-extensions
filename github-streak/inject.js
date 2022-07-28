// refactor everything!
async function main() {
    const onProfile = checkIfOnProfile();
    if (onProfile) {
        const username = getUsername();
        const { longestStreak, currentStreak } = await getData(username);
        if (currentStreak) {
            const graphArray = await fetchContributionGraphArray(username);
            const totalContributions = getTotalContributions();
            const {
                lastZeroContribution,
                latestCommitDay,
                graphStart,
                graphEnd,
            } = findMostRecentZeroContribution(graphArray);
            const todayDateString = buildDateString(0);
            let currentStreakStartDate = currentStreak.startDate;
            let currentStreakEndDate = todayDateString;
            let currentLongestStreak = longestStreak ? longestStreak : { length: 0 };
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

            if (currentStreakLength > currentLongestStreak.length) {
                currentLongestStreak = {
                    startDay: currentStreakStartDate,
                    endDay: currentStreakEndDate,
                    length: currentStreakLength,
                };
            }

            await updateData({
                username,
                currentLongestStreak,
                currentStreak: {
                    length: currentStreakLength,
                    startDate: currentStreakStartDate,
                },
            });

            const streakHtml = buildHtml({
                latestCommitDay,
                longestStreak: currentLongestStreak,
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

            appendStreakStatsHtml(streakHtml);

            const committedTodayCheckHtml = `<div class="committedToday">${username} ${latestCommitDay === todayDateString ? 'has' : '<span style="color: red"> has NOT</span>'} committed today.</div>`;
            appendCommittedTodayCheck(committedTodayCheckHtml);
        } else {
            const startDateForm = createStartDateForm(username);
            injectStartDateForm(startDateForm);
        }
    }
}

function checkIfOnProfile() {
    const el = document.getElementsByClassName('js-yearly-contributions');
    return el.length > 0;
}

function getUsername() {
    const url = window.location.href;
    let username;
    if (url.includes('?tab=overview')) {
        const regexTest = /https:\/\/github\.com\/(?<username>.*)\?tab=overview(?<rest>.*)/
        const res = url.match(regexTest)
        username = res.groups.username;
    } else {
        username = url.replace('https://github.com/', '');
    }
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

function createStartDateForm(username) {
    return `
        <div class="startDateFormContainer" >
            <form id="startDateForm">
                <label for="currentStreakStartDate">
                    Please Enter Current Streak Start Date for ${username}:
                </label>
                <br />
                <input
                    type="date"
                    id="currentStreakStartDate"
                    name="currentStreakStartDate"
                <button type="button" id="startDateFormSubmitButton">Submit</button>
            </form>
        </div>
    `;
}

async function onStartDateFormClick(event) {
    event.preventDefault();
    const username = getUsername();
    const currentStreakStartDate = document.getElementById(
        'currentStreakStartDate'
    ).value;
    const currentStreak = {
        startDate: currentStreakStartDate,
    };
    await updateData({
        username: username,
        currentStreak,
        currentStreak,
    });
}

function injectStartDateForm(startDateForm) {
    const graph = document.getElementsByClassName(
        'graph-before-activity-overview'
    )[0];
    const formContainer = document.createElement('div');
    formContainer.classList.add('start-date-form');
    formContainer.innerHTML = startDateForm;
    graph.appendChild(formContainer);

    const button = document.getElementById('startDateFormSubmitButton');
    button.addEventListener('click', onStartDateFormClick);
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
            const text = (nodes[i].textContent).replaceAll('\n', '').replace(/  +/g, ' ');
            const regexTest = /(?<contributions>.*) contributions in (?<rest>.*)/;
            const number = regexTest.exec(text).groups.contributions;
            return number;
        }
    }
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
            `${longestStreak.length} ${longestStreak.length === 1 ? 'day' : 'days'}`,
            `${longestStreak.startDay} - ${longestStreak.endDay}`,
        ],
        [
            'Current streak',
            `${currentStreak.length} ${currentStreak.length === 1 ? 'day' : 'days'}`,
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

function createCommittedTodayCheckHtml({ username, committedToday }) {
    return `<div class="committedToday">${username} ${committedToday ? 'has' : '<span style="color: red"> has NOT</span>'} committed today.</div>`
}

function appendCommittedTodayCheck(html) {
    const streakGraph = document.getElementsByClassName('original-streak')[0];
    const container = document.createElement('div');
    container.innerHTML = html;
    if (!document.querySelector('.committedToday')) {
        streakGraph.appendChild(container);
    }
}

main();
