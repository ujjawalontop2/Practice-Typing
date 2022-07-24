const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerText;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
const result = document.querySelector(".hidden");

var timer = [0,0,0,0];
var interval;
var timerRunning = false;

// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time) {
    if (time <= 9) {
        time = "0" + time;
    }
    return time;
}

// Run a standard minute/second/hundredths timer:
function runTimer() {
    let currentTime = leadingZero(timer[0]) + ":" + leadingZero(timer[1]) + ":" + leadingZero(timer[2]);
    theTimer.innerHTML = currentTime;
    timer[3]++;

    timer[0] = Math.floor((timer[3]/100)/60);
    timer[1] = Math.floor((timer[3]/100) - (timer[0] * 60));
    timer[2] = Math.floor(timer[3] - (timer[1] * 100) - (timer[0] * 6000));
}

function getMatchLength(a, b) {
    const len = Math.min(a.length, b.length);
    let match = 0;
    for (let i = 0; i < len; i++) {
        match += a[i] === b[i] ? 1 : 0;
    }
    return match;
}

let keyStrokes = 0;

const ignoreKeysList = ["Shift", "CapsLock", "Backspace", "Tab", "Control", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

// Match the text entered with the provided text on the page:
function spellCheck(e) {
    console.log(e.key);
    if (ignoreKeysList.findIndex((key) => {
        return key === e.key;
    }) != -1) {
        return;
    }
    console.log(result.classList);
    if (result.classList.contains('hidden')) {
        result.classList.remove('hidden');
    } 
    keyStrokes += 1;
    let textEntered = testArea.value;
    let originTextMatch = originText.substring(0,textEntered.length);
    result.innerHTML = "Accuracy: " + Math.min(100, (getMatchLength(textEntered, originTextMatch) / keyStrokes * 100)).toFixed(2);
    if (textEntered == originText) {
        clearInterval(interval);
        testWrapper.style.borderColor = "#429890";
    } else {
        if (textEntered == originTextMatch) {
            testWrapper.style.borderColor = "#65CCf3";
        } else {
            testWrapper.style.borderColor = "#E95D0F";
        }
    }

}

// Start the timer:
function start() {
    let textEnterdLength = testArea.value.length;
    if (textEnterdLength === 0 && !timerRunning) {
        timerRunning = true;
        interval = setInterval(runTimer, 10);
    }
}

// Reset everything:
function reset() {
    clearInterval(interval);
    interval = null;
    timer = [0,0,0,0];
    timerRunning = false;
    keyStrokes = 0;
    result.classList.add('hidden');

    testArea.value = "";
    theTimer.innerHTML = "00:00:00";
    testWrapper.style.borderColor = "grey";
}

// Event listeners for keyboard input and the reset
testArea.addEventListener("keypress", start, false);
testArea.addEventListener("keyup", spellCheck, false);
resetButton.addEventListener("click", reset, false);
