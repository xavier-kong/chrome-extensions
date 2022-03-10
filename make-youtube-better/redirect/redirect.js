const url = window.location.href;

const regexUrl = /\S+url=(?<redirectUrl>\S+)/;
const match = regexUrl.exec(url);

const { redirectUrl } = match.groups;

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

/*
        if select redirect
            prompt user to enter random gen string (disable copy paste)
            redirect
        if select not to redirect
            um..... will have to see what happens
*/
