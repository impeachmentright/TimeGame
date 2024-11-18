// public/script.js
const userLang = navigator.language || navigator.userLanguage;
const isRussian = userLang.startsWith('ru');

// Тексты на разных языках
const texts = {
  title: isRussian ? 'Добро пожаловать в TimeGame' : 'Welcome to TimeGame',
  start: isRussian ? 'Старт' : 'Start',
  mining: isRussian ? 'Майнинг' : 'Mining',
  mine: isRussian ? 'Майнить' : 'Mine',
  referral: isRussian ? 'Реферал' : 'Referral',
  settings: isRussian ? 'Настройки' : 'Settings',
};

// Элементы DOM
const titleElement = document.getElementById('title');
const counterElement = document.getElementById('counter');
const startButton = document.getElementById('startButton');
const mineButton = document.getElementById('mineButton');
const referralButton = document.getElementById('referralButton');
const settingsButton = document.getElementById('settingsButton');

// Установка текстов
titleElement.textContent = texts.title;
startButton.textContent = texts.start;
mineButton.textContent = texts.mine;
referralButton.textContent = texts.referral;
settingsButton.textContent = texts.settings;

// Логика приложения
let telegramUser = null;
let time = 0;
let mining = false;
let timer = null;

// Получаем данные пользователя из Telegram Web App
window.Telegram.WebApp.ready();

telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
if (!telegramUser) {
  alert(isRussian ? 'Ошибка: пользователь Telegram не найден.' : 'Error: Telegram user not found.');
}

// Получаем или создаем пользователя на сервере
fetch('/api/user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ telegramId: telegramUser.id }),
})
  .then((res) => res.json())
  .then((data) => {
    time = data.time;
    counterElement.textContent = `${time} $TIME`;
  });

// Обработчик нажатия кнопки старт
startButton.addEventListener('click', () => {
  if (!mining) {
    mining = true;
    startButton.textContent = texts.mining;
    startButton.classList.add('mining');

    timer = setInterval(() => {
      time += 1;
      counterElement.textContent = `${time} $TIME`;

      // Отправляем обновленное время на сервер
      fetch('/api/updateTime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: telegramUser.id, time }),
      });
    }, 1000);
  }
});

// Обработчик кнопки Mine
mineButton.addEventListener('click', () => {
  // Возвращаемся на главный экран
  window.location.href = '/';
});

// Другие обработчики кнопок (реферал, настройки) можно добавить по аналогии

// Проверка на неактивность более 12 часов
setInterval(() => {
  // Проверяем время последней активности
  fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramId: telegramUser.id }),
  })
    .then((res) => res.json())
    .then((data) => {
      const lastActive = new Date(data.lastActive);
      const hoursDiff = (new Date() - lastActive) / 36e5;
      if (hoursDiff >= 12) {
        // Останавливаем майнинг
        mining = false;
        clearInterval(timer);
        time = 0;
        counterElement.textContent = `${time} $TIME`;
        startButton.textContent = texts.start;
        startButton.classList.remove('mining');
        alert(isRussian ? 'Вы были неактивны более 12 часов. Прогресс обнулен.' : 'You were inactive for more than 12 hours. Progress reset.');
      }
    });
}, 60000); // Проверяем каждые 60 секунд