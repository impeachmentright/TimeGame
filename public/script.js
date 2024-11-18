// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Уведомляем Telegram, что приложение готово
tg.ready();

// Расширяем приложение на весь экран
tg.expand();

// Логирование для отладки
console.log('Приложение загружено и готово к работе');

// Переменные секундомера
let stopwatchInterval;
let elapsedTime = 0; // в секундах
let miningActive = false;
let miningTimeout;

// Обновление отображения секундомера
function updateStopwatchDisplay() {
    let hours = Math.floor(elapsedTime / 3600).toString().padStart(2, '0');
    let minutes = Math.floor((elapsedTime % 3600) / 60).toString().padStart(2, '0');
    let seconds = (elapsedTime % 60).toString().padStart(2, '0');
    document.getElementById('stopwatch').textContent = `${hours}:${minutes}:${seconds}`;
}

// Запуск процесса майнинга
function startMining() {
    if (miningActive) return;
    miningActive = true;

    // Запускаем секундомер
    stopwatchInterval = setInterval(() => {
        elapsedTime++;
        updateStopwatchDisplay();
    }, 1000);

    // Деактивируем кнопку "Start"
    const startButton = document.getElementById('start-button');
    startButton.disabled = true;
    startButton.classList.remove('green-button');
    startButton.classList.add('gray-button');

    // Устанавливаем таймаут майнинга на 12 часов
    resetMiningTimeout();
}

// Сброс таймаута майнинга
function resetMiningTimeout() {
    if (miningTimeout) clearTimeout(miningTimeout);
    miningTimeout = setTimeout(() => {
        // Останавливаем майнинг после 12 часов неактивности
        stopMining();
    }, 12 * 60 * 60 * 1000); // 12 часов
}

// Остановка процесса майнинга
function stopMining() {
    miningActive = false;
    clearInterval(stopwatchInterval);

    // Активируем кнопку "Start"
    const startButton = document.getElementById('start-button');
    startButton.disabled = false;
    startButton.classList.remove('gray-button');
    startButton.classList.add('green-button');

    // Сбрасываем прошедшее время
    elapsedTime = 0;
    updateStopwatchDisplay();

    // Используем tg.showAlert вместо alert()
    tg.showAlert('Майнинг остановлен из-за неактивности. Пожалуйста, начните снова.');
}

// Обработчик события для кнопки "Start"
document.getElementById('start-button').addEventListener('click', startMining);

// Навигационные кнопки
document.querySelectorAll('.nav-button').forEach((button) => {
    button.addEventListener('click', function() {
        // Удаляем класс 'active' у всех кнопок
        document.querySelectorAll('.nav-button').forEach((btn) => btn.classList.remove('active'));
        // Добавляем класс 'active' к нажатой кнопке
        this.classList.add('active');

        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach((screen) => (screen.style.display = 'none'));

        // Показываем выбранный экран
        const screenId = this.id.replace('-button', '-screen');
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.style.display = 'flex';
        }
    });
});

// Сброс таймаута майнинга при активности пользователя
tg.onEvent('viewportChanged', () => {
    if (miningActive) {
        resetMiningTimeout();
    }
});

// Обработка закрытия приложения
tg.onEvent('webAppClosing', () => {
    // Очистка перед закрытием, если необходимо
    if (miningActive) {
        stopMining();
    }
});