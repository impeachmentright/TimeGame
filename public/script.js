let stopwatchInterval;
let stars = 100;
let timeSpeed = 1;
let elapsedTime = 0;
let lastUpdateTime = Date.now();
let isRunning = false;

// Получение элементов интерфейса
const startButton = document.getElementById('startButton');
const stopwatchDisplay = document.getElementById('stopwatch');

// Telegram Web App SDK
const tg = window.Telegram.WebApp;

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
        updateElapsedTime();
        displayElapsedTime();
        stopwatchInterval = setInterval(() => {
            updateElapsedTime();
            displayElapsedTime();
        }, 1000);
        isRunning = true;
        startButton.style.display = 'none';
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

// Управляем паузой при переключении вкладки или выходе из Telegram Web App
document.addEventListener('visibilitychange', () => {
    if (document.hidden || tg.isExpanded === false) {
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

// Обновление интерфейса
function updateUI() {
    document.getElementById('starsDisplay').textContent = `⭐ ${stars}`;
}

// Обработчики кнопок
document.getElementById('upgradeButton').addEventListener('click', () => {
    window.location.href = "upgrade.html";
});

document.getElementById('boxButton').addEventListener('click', () => {
    window.location.href = "box.html";
});

document.getElementById('earnButton').addEventListener('click', () => {
    alert("Функция 'Заработать' будет добавлена позже.");
});
// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Расширяет Web App на весь экран

// Получение информации о пользователе
const user = tg.initDataUnsafe?.user || {};
console.log("Telegram User Info:", user);

// Показ имени пользователя в игре (если нужно)
const userNameDisplay = document.createElement("div");
userNameDisplay.textContent = `Привет, ${user.first_name || "игрок"}!`;
document.body.insertBefore(userNameDisplay, document.body.firstChild);
fetch('/api/add-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        user_id: user.id,
        first_name: user.first_name
    }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Ошибка:', error));