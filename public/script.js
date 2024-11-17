// Telegram Web App initialization
const tg = window.Telegram.WebApp;

// Example of initializing WebApp
tg.ready();

// Get user info
const user = tg.initDataUnsafe?.user || { first_name: "Guest" };

// Example: update the header color
tg.MainButton.setText("Start Mining!");
tg.MainButton.show();

// Timer and UI logic
let stars = 0;
let elapsedTime = 0;
let isRunning = false;
let lastUpdateTime = Date.now();

const stopwatchDisplay = document.getElementById("stopwatch");
const starsDisplay = document.getElementById("starsDisplay");

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateUI() {
    stopwatchDisplay.textContent = formatTime(elapsedTime);
    starsDisplay.textContent = `⭐ ${stars}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        lastUpdateTime = Date.now();
        tg.MainButton.setText("Stop Mining");
        tg.MainButton.onClick(stopTimer);
    }
}

function stopTimer() {
    if (isRunning) {
        isRunning = false;
        stars += Math.floor(elapsedTime / 1000); // Example: 1 star per second
        updateUI();
        tg.MainButton.setText("Start Mining");
        tg.MainButton.onClick(startTimer);
    }
}

tg.MainButton.onClick(startTimer);

// Update the stopwatch display every second
setInterval(() => {
    if (isRunning) {
        const now = Date.now();
        elapsedTime += now - lastUpdateTime;
        lastUpdateTime = now;
        updateUI();
    }
}, 1000);