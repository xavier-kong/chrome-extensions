// getting the URL to redirect to

const url = window.location.href;

const regexUrl = /\S+url=(?<redirectUrl>\S+)/;
const match = regexUrl.exec(url);

const { redirectUrl } = match.groups;

// to display the remaining amount of visits remaining

chrome.storage.local.get(['hide-yt-search'], (result) => {
    const displayCount = document.getElementById('display-count');
    displayCount.textContent = `You have ${result['hide-yt-search'].count} visits remaining`;
});

// handles the no button on initial render

const startNoButton = document.getElementById('start-no');
startNoButton.onclick = (e) => {
    e.preventDefault();
    window.location.href =
        'https://www.amazon.jobs/en/teams/aws-software-development-engineer';
};

// handles the yes button on initial render

const startYesButton = document.getElementById('start-yes');
startYesButton.onclick = () => {
    generatePassword();

    const startDiv = document.getElementById('start');
    startDiv.style.display = 'none';

    const testDiv = document.getElementById('test');
    testDiv.style.display = 'block';
};

// for handling password check and redirect logic

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

const generateError = () => {
    const errorContainer = document.getElementById('error');
    errorContainer.textContent = 'Wrong Password';
    setTimeout(() => {
        errorContainer.textContent = '';
    }, 3500);
};

const generatePassword = () => {
    const textDiv = document.getElementById('test-text');
    const password = Math.random().toString(36).slice(-8);
    textDiv.textContent = password;
};

const testForm = document.getElementById('test-form');
testForm.onsubmit = (e) => {
    e.preventDefault();
    const userInput = document.getElementById('form-input').value;
    const password = document.getElementById('test-text').textContent;
    if (userInput === password) {
        redirectToUrl();
    } else {
        generateError();
        generatePassword();
    }
};
