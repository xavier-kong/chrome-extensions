setInterval(() => {
    try {
        document.getElementById('center').style.display = 'none';
    } catch (error) {
        console.log(error);
    }
    console.log('active');
}, 10000)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('mione', message);
}
)