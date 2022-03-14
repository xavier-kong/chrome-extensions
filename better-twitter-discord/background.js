// function createDate(dateString = new Date()) {
//     const date = new Date(dateString);
//     return {
//         day: date.getDate(),
//         month: date.getMonth(),
//         year: date.getFullYear(),
//     };
// }

// function checkDate(date) {
//     const { day, month, year } = createDate();
//     const { day: testDay, month: testMonth, year: testYear } = createDate(date);

//     return day === testDay && month === testMonth && year === testYear;
// }

// async function setData(site) {
//     const { day, month, year } = createDate();
//     const data = {
//         [site]: {
//             date: `${year}-${month}-${day}`,
//             count: 5,
//             forgive: false,
//         },
//     };
//     await chrome.storage.local.set({
//         [site]: data[site],
//     });
// }

// function redirectToPrompt(count, redirectUrl, tabId) {
//     let url;
//     if (count > 0) {
//         url = `./pages/redirect/redirect.html?url=${redirectUrl}&site=${site}`;
//     } else {
//         url = `./pages/no-more/no-more.html`;
//     }
//     chrome.tabs.update(tabId, {
//         url: url,
//     });
// }

// async function resetForgive(site, date, count) {
//     const data = {
//         [site]: {
//             date: date,
//             count: count - 1,
//             forgive: false,
//         },
//     };

//     await chrome.storage.local.set({
//         [site]: data[site],
//     });
// }

// ['discord.com', 'twitter.com'].forEach((site) => {
//     chrome.windows.onCreated.addListener((window) => {
//         chrome.storage.local.get([site], (result) => {
//             if (result) {
//                 const { date } = result[site];
//                 if (!checkDate(date)) {
//                     setData(site);
//                 }
//             } else {
//                 setData(site);
//             }
//         });
//     });

//     chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//         if (
//             !changeInfo.url.includes('chrome-extension://') &&
//             changeInfo.url.includes(site)
//         ) {
//             chrome.storage.local.get([site], async (result) => {
//                 const { date, count, forgive } = result[site];

//                 if (forgive) {
//                     chrome.tabs.onRemoved.addListener(
//                         (newTabId, removeInfo) => {
//                             if (newTabId === tabId) {
//                                 resetForgive(site, date, count);
//                             }
//                         }
//                     );

//                     chrome.tabs.onUpdated.addListener(
//                         (newTabId, newChangeInfo, newTab) => {
//                             if (newTabId === tabId) {
//                                 resetForgive(site, date, count);
//                             }
//                         }
//                     );

//                     chrome.windows.onFocusChanged.addListener((windowId) => {
//                         resetForgive(site, date, count);
//                     });

//                     chrome.windows.onRemoved.addListener((windowId) => {
//                         resetForgive(site, date, count);
//                     });

//                     chrome.webNavigation.onCommitted.addListener(
//                         (details) => {
//                             if (details.transitionType === 'reload') {
//                                 redirectToPrompt(count, details.url, tabId);
//                             }
//                         },
//                         { url: [{ urlContains: site }] }
//                     );
//                 } else {
//                     redirectToPrompt(count, changeInfo.url, tabId);
//                 }
//             });
//         }
//     });
// });

function allowedTime() {
    const currentHour = new Date().getHours();
    if (currentHour >= 18 && currentHour < 21) {
        return true;
    } else {
        return false;
    }
}

['discord.com', 'twitter.com'].forEach((site) => {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.url.includes(site)) {
            if (!allowedTime()) {
                chrome.tabs.update(tabId, {
                    url: './redirect/redirect.html',
                });
            }
        }
    });
});
