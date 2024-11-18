// script.js

// Таймер
let stopwatchInterval;
let elapsedTime = 0;
let isRunning = false;

// Показать терминал после загрузки
window.onload = () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainInterface = document.getElementById('main-interface');

    setTimeout(() => {
        loadingScreen.style.display = 'none'; // Скрыть экран загрузки
        mainInterface.style.display = 'flex'; // Показать основной интерфейс
        startStopwatch(); // Запустить таймер
    }, 2000); // Задержка 2 секунды
};

// Запуск таймера
function startStopwatch() {
    if (!isRunning) {
        const startTime = Date.now() - elapsedTime;
        stopwatchInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            document.getElementById('stopwatch').textContent = formatTime(elapsedTime);
        }, 1000);
        isRunning = true;
    }
}

// Форматирование времени
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}