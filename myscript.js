let freq = 1000;

const search = setInterval(() => {
    try {
        if (document.getAnimations('center')) {
            document.getElementById('center').style.display = 'none';
            freq = 100000
            console.log('found', freq);
        } else {
            freq = 1000;
            console.log('not found', freq);
        }
    } catch (error) {
        console.log(error);
    }
}, freq)

search();

let found = false;