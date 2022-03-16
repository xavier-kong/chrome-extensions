setTimeout(() => {
    const time = Array.from(
        document.querySelectorAll(
            '.ytd-playlist-video-list-renderer .ytd-thumbnail-overlay-time-status-renderer'
        )
    )
        .filter((el) => {
            if (el.textContent) {
                return el;
            }
        })
        .map((el) => el.textContent.replace(/\s/g, ''))
        .forEach((el) => {
            /*
            regex check for mins, secs
            add to secs
            */
        });

    console.log(time);
}, 1000);
