let year;

chrome.storage.local.get(['birthYear'], (result) => {
    if (result) {
        const birthYear = result['birthYear'];
        year = birthYear;

        const promptDiv = document.getElementById('prompt');
        promptDiv.style.display = 'none';
    }
});

function isValidInput(input) {
    // return true if number is a valid year
}

const generateError = () => {
    const errorContainer = document.getElementById('error');
    errorContainer.textContent = 'Please enter a valid year.';
    setTimeout(() => {
        errorContainer.textContent = '';
    }, 3500);
};

const form = document.getElementById('form');
form.onsubmit = (e) => {
    e.preventDefault();
    const userInput = document.getElementById('input').value;
    if (isValidInput(userInput)) {
        await chrome.storage.local.set({
            birthYear: userInput,
        });
    } else {
        generateError();
    }
};

// set value to browser
// set global value
// prompt display none, diplay display block
