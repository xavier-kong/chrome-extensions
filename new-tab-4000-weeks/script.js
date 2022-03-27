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
        if (year < new Date().getFullYear() && year >= 1903) {
            return year;
        }
    }
    return false;
}

function generateError() {
    const errorContainer = document.getElementById('error');
    errorContainer.textContent = 'Please enter a valid year.';
    setTimeout(() => {
        errorContainer.textContent = '';
    }, 3500);
}

function hidePrompt() {
    const promptDiv = document.getElementById('prompt');
    promptDiv.style.display = 'none';
}

function getWeeks() {
    currentDate = new Date();
    startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

    return Math.ceil((currentDate.getDay() + 1 + days) / 7);
}

function calculateWeeks(year) {
    const today = new Date();
    const age = today.getFullYear() - year;
    const yearsLeft = 87 - age;
    const remainingWeeksInYear = 52 - getWeeks();
    const weeksLeft = 52 * yearsLeft + remainingWeeksInYear;
    return {
        weeksLeft,
        percentage: weeksLeft * 100,
    };
}

function generateVisual() {
    calculateWeeks(year);
}

const form = document.getElementById('form');
form.onsubmit = async (e) => {
    e.preventDefault();
    const userInput = isValidInput(document.getElementById('input').value);
    form.reset();
    if (userInput) {
        // await chrome.storage.local.set({
        //     birthYear: userInput,
        // });
        year = userInput;
        hidePrompt();

        const displayDiv = document.getElementById('display');
        displayDiv.style.display = 'block';
        generateVisual();
    } else {
        generateError();
    }
};

generateVisual();
