/*
1. if no start date in storage, ask user to add streak start date
2. find latest contribution and create contribution in last year, curr streak and longest streak
3. if see gap in user streak, update streak start date and longest streak info
4. display date
*/

async function main() {
    if (checkIfOnProfile()) {
        const username = getUsername();
        const startDate = await getStartDateIfExists(username);
        if (startDate) {
            const graphArray = await fetchContributionGraphArray(username);
        } else {
            console.log('hjere');
        }

        /*
        get contributions in last year from html
        traverse the graph to find day where commits = 0
        if find most recent empty day:
            if none found:
                streak = curr day - start day
                update longest streak
            if earlier than today:
                update start day
                update longest streak
                streak = curr day - start day
            if today is empty:
                streak = curr day - start day - 1
        */
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

function getStartDateIfExists(username) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['github-streak'], function (result) {
            if (
                result &&
                'github-streak' in result &&
                username in result['github-streak']
            ) {
                resolve(result['github-streak'][username].startDate);
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

main();

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

// this information was accurate on the 26th of June 2022
const data = [
    [
        'Contributions in the last year',
        '1462 total',
        'Jun 27 2021 - Jun 26 2022',
    ],
    ['Longest streak', ' 365 days', 'Jun 27 2021 - Jun 26 2022'],
    ['Current streak', '365 days', 'Jun 27 2021 - Jun 26 2022'],
];

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
