function getDiff() {
    const final = new Date();
    if (final.getHours() > 21) {
        final.setDate(final.getDate() + 1);
    }
    final.setHours(18);
    final.setMinutes(0);
    final.setSeconds(0);
    final.setMilliseconds(0);

    const now = new Date();
    const diff = final.getTime() - now.getTime();
    return diff;
}

function timer() {
    const diff = getDiff();

    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);
    hours <= 9 ? (hours = `0${hours}`) : hours;
    minutes <= 9 ? (minutes = `0${minutes}`) : minutes;
    seconds <= 9 ? (seconds = `0${seconds}`) : seconds;

    const timeString = `${hours} : ${minutes} : ${seconds}`;

    document.querySelector('#countdown').textContent = timeString;
}

timer();

setInterval(timer, 1000);
