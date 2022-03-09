const url = window.location.href;

const regexUrl = /\S+url=(?<redirectUrl>\S+)&site=(?<siteName>\S+)/;
const match = regexUrl.exec(url);

const { redirectUrl, siteName } = match.groups;

const redirectButton = document.getElementById('redirect-button');

const redirectToUrl = () => {
    chrome.storage.local.get(['hide-yt-search'], async (result) => {
        if (result) {
            const data = {
                'hide-yt-search': {
                    date: result['hide-yt-search'].date,
                    sites: {
                        ...result['hide-yt-search'].sites,
                        [siteName]: {
                            ...result['hide-yt-search'].sites,
                            forgive: true,
                        },
                    },
                },
            };
            await chrome.storage.local.set({
                'hide-yt-search': data['hide-yt-search'],
            });
            window.location.href = redirectUrl;
        }
    });
};

redirectButton.addEventListener('click', redirectToUrl);

/*
        if select redirect
            prompt user to enter random gen string (disable copy paste)
            redirect
        if select not to redirect
            um..... will have to see what happens
*/
