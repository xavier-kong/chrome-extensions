/*
1. if no start date in storage, ask user to add streak start date
2. find latest contribution and create contribution in last year, curr streak and longest streak
3. if see gap in user streak, update streak start date and longest streak info
4. display date
*/
if (checkIfOnProfile()) {
    const username = getUsername();
    const startDate = getStartDateIfExists(username);
    if (startDate) {
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
    } else {
        // get user to enter data do this later

        chrome.storage.local.set({
            'github-streak': {
                'xavier-kong': {
                    startDate: '2021-06-27',
                },
            },
        });
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
    let startDate = false;
    chrome.storage.local.get(['github-streak'], (result) => {
        if (result && 'github-streak' in result) {
            if (username in result['github-streak']) {
                startDate = result['github-streak'][username].startDate;
            }
        }
    });
    return startDate;
}

function fetchContributionGraphArray(username) {
    const graphJSON = fetch(
        `https://github.com/users/${username}/contributions`
    )
        .then((res) => res.text())
        .then((graph) => convertGraphToJson(graph))
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
