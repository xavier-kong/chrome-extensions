function toggleDisplay(dstyle) {
    [
        '#masthead-container',
        '#meta-contents',
        '#comments',
        '#info-contents',
    ].forEach((element) => {
        document.querySelector(element).style.display = dstyle;
    });
}

function checkHidden() {
    const commentDisplay = document.querySelector('#masthead-container').style
        .display;
    if (commentDisplay === 'none' || commentDisplay === '') {
        return true;
    } else {
        return false;
    }
}

function hideThings() {
    const hidden = checkHidden();
    if (hidden) {
        toggleDisplay('block');
    } else if (!hidden) {
        toggleDisplay('none');
    }
}

document.body.onkeyup = (e) => {
    e.preventDefault();
    if (e.keyCode === 32 || e.keyCode === ' ') {
        if (!isFocused()) {
            hideThings();
        }
    }
};

function isFocused() {
    const creationBox = document.getElementById('creation-box');
    const inputContainer = document.getElementById('labelAndInputContainer');

    try {
        if (
            creationBox.classList.contains('focused') &&
            inputContainer.classList.contains('focused')
        ) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

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
