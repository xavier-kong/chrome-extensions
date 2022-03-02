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
            if (url.includes('watch?v') && !(url.includes('list='))) {
                chrome.tabs.update(tabId, { url: 'https://www.google.com' })
            }
            chrome.tabs.sendMessage(tabId, {command: 'hide-search'})
        }
    }, filter)
}

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

/*
ideas:
when youtube is fullscreen
set other window to dark to prevent distraction

on new tab created:
    if includes watch and no playlist:
        if referrer is not youtube playlist/subs/google sheets or if referrer is none
            redirect

key events:
on new tab opened created
tab history updated (url change)
onCompleted

methods to watch a vid:
open a vid on playlist (allowed) 
open from subscription (not allowed)
open from channel (not allowed)
open from google search (not allowed)
open from external website (not allowed)
open from direct link entry (not allowed)
open from bookmark (not allowed)

so actually only have to: if link includes watch but no list then redirect lol


and

if came from youtube.com/watch from site that is not subscription redirect from subs
aka 
can only watch vids if came from watch later or subs or playlist


chrome extension to only allow certain number of visits to a site each day aka only 5 vists to youtube subcriptions per day etc/ twitter
*/