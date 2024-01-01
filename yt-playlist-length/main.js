let added = false;

setTimeout(() => {
    function getSecondsFromString(string) {
        const time = string.split(':');
        if (time.length == 3) { // hours
            const hours = Number(time[0]);
            const minutes = Number(time[1]);
            const seconds = Number(time[2]);

            return (hours * 60 * 60) + (minutes * 60) + (seconds);
        } else {
            const minutes = Number(time[0]);
            const seconds = Number(time[1]);

            return  minutes * 60 + seconds;
        }
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
    }, 0);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const displayString = `(${hours} hours ${minutes} minutes ${seconds} seconds)`;

    let title = document.querySelector(
        'yt-dynamic-sizing-formatted-string#editable-title-display > div#container > yt-formatted-string#text'
    )

    if (window.location.href === 'https://www.youtube.com/playlist?list=WL') {
        title = document.querySelector(
            'yt-dynamic-sizing-formatted-string > div#container > yt-formatted-string#text'
        );
    }

    if(!title) {
        console.log('cant find title');
        return;
    }

    if (added) {
        console.log('already added bro');
        return;
    }

    const titleString = title.innerText;
    const newTitle = `${titleString}\n${displayString}`;
    title.innerText = newTitle;
    added = true;

}, 1000);
