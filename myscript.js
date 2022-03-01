const hideSearch = () => {
    let found = false;

    while (!found) {
        try {
            document.getElementById('center').style.display = 'none';
            if (document.getElementById('center').style.display === 'none') {
                found = true;
                break;
            }
        } catch (error) {
            console.log(error);
        }
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.command === 'hide-search') {
            console.log('serach party');
            hideSearch();
        }
    }
)