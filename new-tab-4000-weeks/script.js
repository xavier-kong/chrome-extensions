let year;

try {
    chrome.storage.local.get(['birthYear'], (result) => {
        if (result) {
            const birthYear = result['birthYear'];
            year = birthYear;

            hidePrompt();
        }
    });
} catch (error) {}

function isValidInput(input) {
    const year = parseInt(input);
    if (input.length === 4 && year) {
        // the oldest living person in world Ms. Kane Tanaka was born in 1903
        if (year < new Date().getFullYear && year >= 1903) {
            return year;
        }
    }
    return false;
}

const generateError = () => {
    const errorContainer = document.getElementById('error');
    errorContainer.textContent = 'Please enter a valid year.';
    setTimeout(() => {
        errorContainer.textContent = '';
    }, 3500);
};

function hidePrompt() {
    const promptDiv = document.getElementById('prompt');
    promptDiv.style.display = 'none';
}

function calculateWeeks(year) {
    const currentYear = new Date().getFullYear;
    const yearsLeft = 88 - currentYear;
    const weeksLeft = 52 * yearsLeft;
    return weeksLeft;
}

function generateVisual() {
    const weeks = calculateWeeks(year);
}

const form = document.getElementById('form');
form.onsubmit = async (e) => {
    e.preventDefault();
    const userInput = isValidInput(document.getElementById('input').value);
    form.reset();
    if (userInput) {
        await chrome.storage.local.set({
            birthYear: userInput,
        });
        year = userInput;
        hidePrompt();

        const displayDiv = document.getElementById('display');
        displayDiv.style.display = 'block';
        generateVisual();
    } else {
        generateError();
    }
};
