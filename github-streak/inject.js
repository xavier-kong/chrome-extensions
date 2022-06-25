/*
0. get username
    how to tell if user name?
1. fetch the data
2. parse the result to get the data we need
3. generate correct css and html
4. append to correct node
*/

function checkIfOnProfile() {
    const el = document.getElementsByClassName('js-yearly-contributions');
    return el.length > 0;
}

function getUsername() {
    const url = window.location.href;
    const username = url.replace('https://github.com/', '');
    return username;
}

function fetchData(username) {
    const myInit = {
        mode: 'no-cors',
        method: 'GET',
    };

    fetch(
        `https://github-readme-streak-stats.herokuapp.com/?user=${username}`,
        myInit
    )
        .then((res) => res.text())
        .then((str) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(str, 'image/svg+xml');
            return doc;
        })
        .then((doc) => {
            console.log(doc);
        });
}

if (checkIfOnProfile()) {
    const username = getUsername();
    fetchData(username);
}
