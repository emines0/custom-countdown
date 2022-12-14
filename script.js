const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');
const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownElBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');
const completeEl = document.getElementById('complete');
const completeElinfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button')

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown = {};

//in miliseconds because get time returning value in miliseconds
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input Min with Today's Date
let today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// Populate Countdown / Complete UI
function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;
        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour); //% - reminder operator
        const minutes = Math.floor((distance % hour) / minute); //% - reminder operator
        const seconds = Math.floor((distance % minute) / second); //% - reminder operator

        // Hide Input container
        inputContainer.hidden = true;

        // If the countdown has ended, show complete
        if(distance < 0) {

            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElinfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false

        } else { 

        // Populate Countdown values - Show countdown in progress
        countdownElTitle.textContent = `${countdownTitle}`;
        timeElements[0].textContent = `${days}`;
        timeElements[1].textContent = `${hours}`;
        timeElements[2].textContent = `${minutes}`;
        timeElements[3].textContent = `${seconds}`;
        completeEl.hidden = true;
        countdownEl.hidden = false;
        }

    },second); 
}

// Take Values from Form Input
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;

    //storing data to localStorage
    savedCountdown =  {
        title:countdownTitle,
        date: countdownDate,
    };

    localStorage.setItem('countdown', JSON.stringify(savedCountdown)); //JSON.stringify parse JSON to the string

    // Check for valid date
    if(countdownDate === '') {
        alert('Please select a date for countdown')
    } else {
        // Get number version of current Date, updateDOM
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }

}

// Reset All Values
function reset() {
    // Hide Countdowns/Complete, show Input
    completeEl.hidden = true;
    countdownEl.hidden = true;
    inputContainer.hidden = false;

    // Stop the countdown
    clearInterval(countdownActive);
    // Reset values
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

//Restor previous countdown from localstorage
function restorePreviousCountdown() {
    if(localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown')); //convert string to JSON
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// Event Listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownElBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

//On Load, check localStorage
restorePreviousCountdown();