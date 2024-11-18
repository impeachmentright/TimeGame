// Wait for the window to load
window.onload = function() {
    // Hide the loading screen after a short delay
    setTimeout(function() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';
    }, 2000); // 2-second delay
};

// Stopwatch variables
let stopwatchInterval;
let elapsedTime = 0; // in seconds
let miningActive = false;
let miningTimeout;

// Update the stopwatch display
function updateStopwatchDisplay() {
    let hours = Math.floor(elapsedTime / 3600).toString().padStart(2, '0');
    let minutes = Math.floor((elapsedTime % 3600) / 60).toString().padStart(2, '0');
    let seconds = (elapsedTime % 60).toString().padStart(2, '0');
    document.getElementById('stopwatch').textContent = `${hours}:${minutes}:${seconds}`;
}

// Start the mining process
function startMining() {
    if (miningActive) return;
    miningActive = true;

    // Start the stopwatch
    stopwatchInterval = setInterval(function() {
        elapsedTime++;
        updateStopwatchDisplay();
    }, 1000);

    // Disable the start button
    const startButton = document.getElementById('start-button');
    startButton.disabled = true;
    startButton.classList.remove('green-button');
    startButton.classList.add('gray-button');

    // Set the mining timeout to 12 hours
    resetMiningTimeout();
}

// Reset the mining timeout
function resetMiningTimeout() {
    if (miningTimeout) clearTimeout(miningTimeout);
    miningTimeout = setTimeout(function() {
        // Stop mining after 12 hours of inactivity
        stopMining();
    }, 12 * 60 * 60 * 1000); // 12 hours
}

// Stop the mining process
function stopMining() {
    miningActive = false;
    clearInterval(stopwatchInterval);

    // Enable the start button
    const startButton = document.getElementById('start-button');
    startButton.disabled = false;
    startButton.classList.remove('gray-button');
    startButton.classList.add('green-button');

    // Reset elapsed time
    elapsedTime = 0;
    updateStopwatchDisplay();

    alert('Mining has stopped due to inactivity. Please start again.');
}

// Event listener for the Start button
document.getElementById('start-button').addEventListener('click', function() {
    startMining();
});

// Navigation buttons
document.querySelectorAll('.nav-button').forEach(function(button) {
    button.addEventListener('click', function() {
        // Remove 'active' class from all buttons
        document.querySelectorAll('.nav-button').forEach(function(btn) {
            btn.classList.remove('active');
        });
        // Add 'active' class to the clicked button
        this.classList.add('active');

        // Hide all screens
        document.querySelectorAll('.screen').forEach(function(screen) {
            screen.style.display = 'none';
        });

        // Show the selected screen
        const screenId = this.id.replace('-button', '-screen');
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.style.display = 'flex';
        }
    });
});

// Reset mining timeout on user activity
window.addEventListener('focus', function() {
    if (miningActive) {
        resetMiningTimeout();
    }
});