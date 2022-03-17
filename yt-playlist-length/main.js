setTimeout(() => {
    function getSecondsFromString(string) {
        const time = string.split(':');
        const minutes = Number(time[0]);
        const seconds = Number(time[1]);
        const totalSeconds = minutes * 60 + seconds;
        return totalSeconds;
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
    const seconds = timeStrings.reduce((a, b) => {
        return a + b;
    });

    
}, 1000);
