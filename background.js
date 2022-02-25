const filter = {
  url: [
    {
      urlMatches: 'https://www.youtube.com/',
    },
  ],
};

chrome.webNavigation.onCompleted.addListener(() => {
  console.log("The user has loaded my favorite website!");
}, filter);