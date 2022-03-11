const toggleDisplay = (dstyle) => {
    [
        '#masthead-container',
        '#info-contents',
        '#meta-contents',
        '#comments',
    ].forEach((element) => {
        document.querySelector(element).style.display = dstyle;
    });
};

const checkHidden = () => {
    const commentDisplay = document.querySelector('#masthead-container').style
        .display;
    if (commentDisplay === 'none' || commentDisplay === '') {
        return true;
    } else {
        return false;
    }
};

const hideThings = () => {
    const hidden = checkHidden();
    if (hidden) {
        toggleDisplay('block');
    } else if (!hidden) {
        toggleDisplay('none');
    }
};

document.body.onkeyup = (e) => {
    e.preventDefault();
    if (e.keyCode === 32 || e.keyCode === ' ') {
        hideThings();
    }
};

document.querySelector(
    '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > button'
).onclick = (e) => {
    e.preventDefault();
    hideThings();
};

document.querySelector(
    '#movie_player > div.html5-video-container > video'
).onclick = (e) => {
    e.preventDefault();
    hideThings();
};
