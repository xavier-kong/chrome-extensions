chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
    console.log('hello', new Date());
    const tab = await getCurrentTab();
    chrome.tabs.sendMessage(tab.id, {command: 'hide-search'})
})

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
on receive message:
    set found = false
    while found = false:
        look for search bar div
            if display != none:
                set display to none
            else if display == none:
                set found to true
*/