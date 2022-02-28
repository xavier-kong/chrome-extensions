chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
    console.log('hello', new Date());
    const tab = await getCurrentTab();
    chrome.tabs.sendMessage(tab.id, {message: 'hello'})
})

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}