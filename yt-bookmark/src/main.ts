function addBookmark({ title, secs }: { title: string; secs: number }) {
    chrome.storage.local.get(['yt-bookmark'], (result) => {
        const data: Record<string, number> = result['yt-bookmark'] ?? {};
        data[title] = secs;
        chrome.storage.local.set({ 'yt-bookmark': data });
    })
}

function createButton() {
    const button = document.createElement(
        "button"
    );
    button.id = "thebutton";
    button.style.cssText += "margin-left: 10px;border-radius: 10em;width: 3em;background-color: rgb(48, 52, 54);border: 0px"

    button.addEventListener('click', (e) => {
        const titleNode = document.querySelectorAll('h1.ytd-watch-metadata > yt-formatted-string.ytd-watch-metadata');
        const titleString = titleNode[0].innerHTML;

        const video = document.getElementsByClassName('video-stream')[0];
        // @ts-ignore: Unreachable code error
        const videoTimestampSecs = video.currentTime as number;
        const wholeSecs = Math.floor(videoTimestampSecs);
        addBookmark({ title: titleString, secs: wholeSecs });

        chrome.storage.local.get(['yt-bookmark-popups'], (res) => {
            const data: Record<string, boolean> = res['yt-bookmark-popups'] ?? {};
            const url = window.location.href;
            const newData = { ...data, [url]: true };
            chrome.storage.local.set({ 'yt-bookmark-popups': newData });
        })

    })

    return button;
}

chrome.storage.local.get(['yt-bookmark'], (res) => {
    const data: Record<string, number> = res['yt-bookmark'] ?? {};
    const titleNode = document.querySelectorAll('h1.ytd-watch-metadata > yt-formatted-string.ytd-watch-metadata');
    const titleString = titleNode[0].innerHTML;

    if (!(titleString in data)) {
        return;
    }

    chrome.storage.local.get(['yt-bookmark-popups'], (res) => {
        const data: Record<string, boolean> = res['yt-bookmark-popups'] ?? {};
        const url = window.location.href;
        if (!(data?.[url])) {
            const newData = { ...data, [url]: true };
            chrome.storage.local.set({ 'yt-bookmark-popups': newData });
            if (window.confirm("Would you like to continue this video from your last bookmark?")) {
                const urlWithTs = `${window.location.href}&t=${data[titleString]}s`;
                window.location.href = urlWithTs;
            }
        }
    })
})

const toolbarDiv = document.querySelectorAll('ytd-menu-renderer.ytd-watch-metadata');

if (toolbarDiv[0]) {
    const existingButton = document.getElementById("thebutton");
    if (!existingButton) {
        toolbarDiv[0].appendChild(createButton());
    } else {
        console.log('button exists');
    }
} else {
    console.log('no tool bar div');
}
