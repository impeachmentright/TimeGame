let stopwatchInterval;
let elapsedTime = 0;
let isRunning = false;

// Функция форматирования времени
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Функция запуска таймера
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

// Функция остановки таймера
function stopStopwatch() {
    if (isRunning) {
        clearInterval(stopwatchInterval);
        isRunning = false;
    }
}

// Управление таймером при переключении вкладок
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopStopwatch();
    } else {
        startStopwatch();
    }
});

// Переключение разделов
function goTo(section) {
    alert(`Переход в раздел: ${section}`);
}

// Функция для создания инвойса
async function createInvoice(item) {
    try {
        const response = await fetch('/create-invoice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: '<ID_ПОЛЬЗОВАТЕЛЯ>',
                title: item === 'speed' ? 'Ускорение' : 'Оффлайн-прогресс',
                description: item === 'speed' ? 'Повышение скорости майнинга' : 'Оффлайн-прогресс времени',
                payload: `purchase_${item}`,
                currency: 'XTR',
                prices: [{ label: item, amount: item === 'speed' ? 500 : 1000 }],
            }),
        });

        const data = await response.json();

        if (data.success) {
            alert('Инвойс успешно создан! Проверьте Telegram.');
        } else {
            alert(`Ошибка: ${data.message}`);
        }
    } catch (error) {
        console.error('Ошибка при создании инвойса:', error);
        alert('Не удалось создать инвойс.');
    }
}

// Запуск таймера при загрузке страницы
window.onload = () => {
    startStopwatch();
};