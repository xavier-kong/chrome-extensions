chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
    const { id, url } = await getCurrentTab();
    if (url.includes('youtube.com')) {
        chrome.tabs.sendMessage(id, {command: 'hide-search'})
    }
})

chrome.webNavigation.onCompleted.addListener(async (details) => {
    const { tabId, url } = details;
    if (url.includes('youtube.com')) {
        chrome.tabs.sendMessage(tabId, {command: 'hide-search'})
    }
})

const eventList = ['onHistoryStateUpdated', ]

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}


/*
on new url:
    if url includes youtube:
        wait for DOM to load
        send message to tab to initiate hide search bar


ideas:
when youtube is fullscreen
set other window to dark to prevent distraction

and

if came from youtube.com/watch from site that is not subscription redirect from subs
aka 
can only watch vids if came from watch later or subs or playlist
*/