// script.js

// Показать главный экран после загрузки
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
let miningSpeed = 1; // Начальная скорость

// Элементы
const stopwatch = document.getElementById("stopwatch");
const startButton = document.getElementById("start-button");

// Функция обновления секундомера
function updateStopwatch() {
    seconds += miningSpeed;
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    stopwatch.textContent = `${hrs}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Событие на кнопку старт
if (startButton) {
    startButton.addEventListener("click", () => {
        if (!miningInterval) {
            miningInterval = setInterval(updateStopwatch, 1000);
            startButton.disabled = true;
            startButton.classList.remove('green-button');
            startButton.classList.add('gray-button');
        }
    });
}

// Навигационные кнопки
document.getElementById("mine-btn").addEventListener("click", showMainScreen);
document.getElementById("upgrade-btn").addEventListener("click", showUpgradeScreen);
document.getElementById("friends-btn").addEventListener("click", showFriendsScreen);
document.getElementById("earn-btn").addEventListener("click", showEarnScreen);

// Функции отображения экранов
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

// Функциональность Upgrade
let upgradeLevels = [1.15, 1.3, 1.5, 2, 4];
let currentUpgradeIndex = 0;

const currentSpeedDisplay = document.getElementById('current-speed');
const upgradeButton = document.getElementById('upgrade-button');
const backFromUpgradeButton = document.getElementById('back-from-upgrade');

function updateCurrentSpeedDisplay() {
    currentSpeedDisplay.textContent = miningSpeed.toFixed(2);
}

if (upgradeButton) {
    upgradeButton.addEventListener('click', () => {
        if (currentUpgradeIndex < upgradeLevels.length) {
            miningSpeed = upgradeLevels[currentUpgradeIndex];
            currentUpgradeIndex++;
            updateCurrentSpeedDisplay();
        } else {
            alert('Maximum upgrade level reached.');
        }
    });
}

if (backFromUpgradeButton) {
    backFromUpgradeButton.addEventListener('click', showMainScreen);
}

// Friends функциональность
const referralLinkInput = document.getElementById('referral-link');
const copyLinkButton = document.getElementById('copy-link-button');
const backFromFriendsButton = document.getElementById('back-from-friends');

function generateReferralLink() {
    const userId = 'USER_ID'; // Замените на актуальный
    return `https://t.me/YourBotName?start=${userId}`;
}

if (copyLinkButton) {
    copyLinkButton.addEventListener('click', () => {
        referralLinkInput.select();
        document.execCommand('copy');
        alert('Referral link copied to clipboard.');
    });
}

if (backFromFriendsButton) {
    backFromFriendsButton.addEventListener('click', showMainScreen);
}

// Earn функциональность
const backFromEarnButton = document.getElementById('back-from-earn');
const taskButtons = document.querySelectorAll('.task-button');

if (backFromEarnButton) {
    backFromEarnButton.addEventListener('click', showMainScreen);
}

taskButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const task = e.target.getAttribute('data-task');
        if (task === 'subscribe') {
            window.open('https://t.me/YourChannelName', '_blank');
        } else if (task === 'watch-ad') {
            alert('Ad watched! Rewards credited.');
        }
        alert('Task completed! You have earned rewards.');
    });
});