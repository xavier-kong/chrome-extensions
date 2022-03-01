const hideSearch = () => {
    let found = false;

    while (!found) {
        console.log('running');
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
        console.log('im here!');
        if (message.command === 'hide-search') {
            hideSearch();
        }
    }
)