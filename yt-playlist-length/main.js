setTimeout(() => {
    function getSecondsFromString(string) {
        const time = string.split(':');
        const minutes = Number(time[0]);
        const seconds = Number(time[1]);
        const totalSeconds = minutes * 60 + seconds;
        return totalSeconds;
    }

    function addStringToDom(string) {
        const title = document.querySelector(
            '#title > yt-formatted-string > a'
        );
        const titleString = title.innerText;
        const newTitle = `${titleString}\n${string}`;
        title.innerText = newTitle;
        added = true;
    }

    const overlayElements = Array.from(
        document.querySelectorAll(
            '.ytd-playlist-video-list-renderer .ytd-thumbnail-overlay-time-status-renderer'
        )
    );
    const timeStrings = overlayElements
        .filter((el) => {
            if (el.textContent) {
                return el;
            }
        })
        .map((el) => {
            const timeString = el.textContent.replace(/\s/g, '');
            const seconds = getSecondsFromString(timeString);
            return seconds;
        });
    const totalSeconds = timeStrings.reduce((a, b) => {
        return a + b;
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const displayString = `(${hours} hours ${minutes} minutes ${seconds} seconds)`;

    addStringToDom(displayString);
}, 1000);
