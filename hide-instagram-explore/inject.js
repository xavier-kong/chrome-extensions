const observer = new MutationObserver(() => {
    const exploreButton = document.querySelectorAll("a[href='/explore/']");
    if (exploreButton && exploreButton[0]) {
        exploreButton[0].style = {
            display: 'none'
        }

    }
});

const config = { attributes: true, childList: true, subtree: true };

window.onload = function() {
    observer.observe(document, config);
}
