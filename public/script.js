// script.js

window.onload = () => {
    const loadingScreen = document.getElementById('loading-screen');
    const appContainer = document.getElementById('app-container');

    setTimeout(() => {
        loadingScreen.style.display = 'none';
        appContainer.style.display = 'flex';
    }, 3000);
};

// Переменные
let seconds = 0;
let miningInterval = null;
let miningSpeed = 1;

const stopwatch = document.getElementById("stopwatch");
const startButton = document.getElementById("start-button");

function updateStopwatch() {
    seconds += miningSpeed;
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    stopwatch.textContent = `${hrs}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

startButton.addEventListener("click", () => {
    if (!miningInterval) {
        miningInterval = setInterval(updateStopwatch, 1000);
        startButton.disabled = true;
        startButton.classList.remove('green-button');
        startButton.classList.add('gray-button');
    }
});

// Навигация
document.getElementById("mine-btn").addEventListener("click", showMainScreen);
document.getElementById("upgrade-btn").addEventListener("click", showUpgradeScreen);
document.getElementById("friends-btn").addEventListener("click", showFriendsScreen);
document.getElementById("earn-btn").addEventListener("click", showEarnScreen);

function showMainScreen() {
    hideAllScreens();
    document.getElementById('main-screen').style.display = 'flex';
}

function showUpgradeScreen() {
    hideAllScreens();
    document.getElementById('upgrade-screen').style.display = 'flex';
}

function showFriendsScreen() {
    hideAllScreens();
    document.getElementById('friends-screen').style.display = 'flex';
}

function showEarnScreen() {
    hideAllScreens();
    document.getElementById('earn-screen').style.display = 'flex';
}

function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.style.display = 'none';
    });
}

// Upgrade функциональность
const currentSpeedDisplay = document.getElementById('current-speed');
const upgradeButton = document.getElementById('upgrade-button');
let upgradeLevels = [1.15, 1.3, 1.5, 2, 4];
let currentUpgradeIndex = 0;

upgradeButton.addEventListener('click', () => {
    if (currentUpgradeIndex < upgradeLevels.length) {
        miningSpeed = upgradeLevels[currentUpgradeIndex];
        currentUpgradeIndex++;
        currentSpeedDisplay.textContent = miningSpeed.toFixed(2);
    } else {
        alert('Максимальный уровень улучшений достигнут.');
    }
});