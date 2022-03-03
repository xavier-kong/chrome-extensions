const eventList = ['onHistoryStateUpdated', 'onCompleted'];

const filter = {
    url: [
        {
            urlContains: 'youtube',
        },
    ],
};

for (const event of eventList) {
    chrome.webNavigation[event].addListener(async (details) => {
        const { tabId, url } = details;
        if (url.includes('youtube.com')) {
            if (url.includes('watch?v') && !url.includes('list=')) {
                chrome.tabs.update(tabId, { url: 'ali.jpg' });
            }
            chrome.tabs.sendMessage(tabId, { command: 'hide-search' });
        }
    }, filter);
}

chrome.windows.onCreated.addListener((window) => {
    chrome.storage.sync.get(['key'], function (result) {
        console.log('Value currently is ' + result.key);
    });
});

/*
ideas:
when youtube is fullscreen
set other window to dark to prevent distraction


chrome extension to only allow certain number of visits to a site each day aka only 5 vists to youtube subcriptions per day etc/ twitter

on open of chrome:
    check if last date is today
    refresh counts if needed

    chrome.runtime.onStartup.addListener(
  callback: function,
)

https://developer.chrome.com/docs/extensions/reference/storage/#usage


before navigation:
    prompt user with amount of visits remaining
    and if they would like to continue

For tracking counts:
    use local storage
    if date in storage != today's date then update counts and stuff
    upon visit of sites => decrement count

Upon visitng sites:
    if site in list:
        redirect to temp site
        basic html site
        text with redirect button to orignal url (need find way to create html with redirect link)
        if select redirect
            prompt user to enter random gen string (disable copy paste)
            redirect
        if select not to redirect
            um..... will have to see what happens
*/
