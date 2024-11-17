// Переменные для таймера и игрового процесса
let stopwatchInterval;
let stars = 0; // Начальное количество звезд
let timeSpeed = 1; // Начальная скорость времени
let elapsedTime = 0; // Общее прошедшее время
let isRunning = false; // Флаг состояния таймера
let lastUpdateTime = Date.now(); // Время последнего обновления

// Получение элементов из DOM
const startButton = document.getElementById('startButton');
const stopwatchDisplay = document.getElementById('stopwatch');
const starsDisplay = document.getElementById('starsDisplay');

// Функция форматирования времени
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Обновление прошедшего времени
function updateElapsedTime() {
    const now = Date.now();
    elapsedTime += (now - lastUpdateTime) * timeSpeed;
    lastUpdateTime = now;
}

// Отображение времени на экране
function displayElapsedTime() {
    stopwatchDisplay.textContent = formatTime(elapsedTime);
}

// Запуск таймера
function startStopwatch() {
    if (!isRunning) {
        lastUpdateTime = Date.now();
        stopwatchInterval = setInterval(() => {
            updateElapsedTime();
            displayElapsedTime();
        }, 1000);
        isRunning = true;
        startButton.style.display = 'none'; // Скрыть кнопку "Старт"
    }
}

// Остановка таймера
function stopStopwatch() {
    if (isRunning) {
        updateElapsedTime();
        clearInterval(stopwatchInterval);
        isRunning = false;
    }
}

// Обновление интерфейса
function updateUI() {
    starsDisplay.textContent = `⭐ ${stars}`;
}

// Обработка кнопок
document.getElementById('upgradeButton').addEventListener('click', () => {
    window.location.href = "upgrade.html"; // Переход на страницу улучшений
});

document.getElementById('boxButton').addEventListener('click', () => {
    window.location.href = "box.html"; // Переход на страницу коробки
});

document.getElementById('earnButton').addEventListener('click', () => {
    alert("Функция 'Заработать' будет добавлена в будущем.");
});

// Управление состоянием таймера при смене вкладок
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopStopwatch();
    } else {
        startStopwatch();
    }
});

// Инициализация при загрузке
window.addEventListener('load', () => {
    startStopwatch();
    updateUI();
});