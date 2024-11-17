let stopwatchInterval;
let elapsedTime = 0;
let isRunning = false;

// Показать терминал после загрузки
window.onload = () => {
    const loadingScreen = document.getElementById('loading-screen');
    const terminal = document.getElementById('terminal');

    setTimeout(() => {
        loadingScreen.style.display = 'none';
        terminal.style.display = 'flex';
        startStopwatch();
    }, 2000); // Загрузка 2 секунды
};

// Таймер
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

// Формат времени
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Переход между вкладками
function goTo(section) {
    const contentSection = document.getElementById('content-section');
    if (section === 'upgrade') {
        contentSection.innerHTML = `
            <h2>Доступные улучшения</h2>
            <button onclick="createInvoice('speed')">Купить ускорение</button>
            <button onclick="createInvoice('offline')">Купить оффлайн-прогресс</button>
        `;
    } else {
        contentSection.innerHTML = `<p>Вы выбрали раздел: ${section}</p>`;
    }
}

// Создание инвойса
async function createInvoice(item) {
    try {
        const response = await fetch('/create-invoice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: '<USER_CHAT_ID>',
                title: item === 'speed' ? 'Ускорение' : 'Оффлайн-прогресс',
                description: 'Покупка через Telegram Stars',
                payload: item,
                currency: 'XTR',
                prices: [{ label: 'Purchase', amount: item === 'speed' ? 500 : 1000 }],
            }),
        });

        const result = await response.json();
        if (result.ok) {
            alert('Инвойс создан. Проверьте Telegram.');
        } else {
            alert(`Ошибка: ${result.description}`);
        }
    } catch (error) {
        console.error(error);
        alert('Ошибка при создании инвойса.');
    }
}