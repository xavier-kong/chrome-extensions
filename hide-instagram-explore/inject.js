
chrome.webNavigation.onCompleted.addListener(() => {
    const observer = new MutationObserver(() => {
        const exploreButton = document.querySelectorAll("a[href='/explore/']");
        console.log(exploreButton)
        if (exploreButton && exploreButton[0]) {
            console.log(exploreButton[0])

        }
    });

    const config = { attributes: true, childList: true, subtree: true };

    observer.observe(document, config);
})
