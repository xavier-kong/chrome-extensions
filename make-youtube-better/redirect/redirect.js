const url = window.location.href;

// const regexUrl = /\S+url=(?<redirectUrl>\S+)/;
// const match = regexUrl.exec(url);

// const { redirectUrl } = match.groups;

const redirectToUrl = () => {
    chrome.storage.local.get(['hide-yt-search'], async (result) => {
        if (result) {
            const data = {
                'hide-yt-search': {
                    ...result['hide-yt-search'],
                    forgive: true,
                },
            };
            await chrome.storage.local.set({
                'hide-yt-search': data['hide-yt-search'],
            });

            window.location.href = redirectUrl;
        }
    });
};

const redirectButton = document.getElementById('redirect-button');
redirectButton.addEventListener('click', redirectToUrl);

const startNoButton = document.getElementById('start-no');
startNoButton.onclick = (e) => {
    e.preventDefault();
    window.location.href =
        'https://www.amazon.jobs/en/teams/aws-software-development-engineer';
};

const startYesButton = document.getElementById('start-yes');
startYesButton.onclick = () => {
    const startDiv = document.getElementById('start');
    startDiv.style.display = 'none';
    const testDiv = document.getElementById('test');
    testDiv.style.display = 'block';
};

const testForm = document.getElementById('test-form');
testForm.onsubmit = () => {};
