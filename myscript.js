const hideSearch = (id) => {
    let found = false;

    while (!found) {
        try {
            document.getElementById(id).style.display = 'none';
            if (document.getElementById(id).style.display === 'none') {
                found = true;
                break;
            }
        } catch (error) {
            console.log(error);
        }
    }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'hide-search') {
        hideSearch('center');
        hideSearch('logo');
        hideSearch('logo-icon');
    }
});
