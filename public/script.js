// Проверяем, работает ли приложение внутри Telegram WebApp
const tg = window.Telegram.WebApp || null;

if (tg) {
  // Уведомляем Telegram, что приложение готово
  tg.ready();
  // Расширяем приложение на весь экран
  tg.expand();
} else {
  alert('Приложение должно быть запущено внутри Telegram.');
}

// Получаем telegramId пользователя
const telegramId = tg ? tg.initDataUnsafe.user.id : null;

if (!telegramId) {
  alert('Не удалось получить ваш Telegram ID.');
}

// Определяем язык интерфейса
const userLang = navigator.language || navigator.userLanguage;
const isRussian = userLang.startsWith('ru');

// Переменные
let mining = false;
let time = 0; // Количество $TIME
let miningRate = 1; // Начальная скорость майнинга ($TIME в секунду)
let lastActive = Date.now();
let miningInterval;
let miningTimeout;

// Элементы интерфейса
const timeDisplay = document.getElementById('stopwatch');
const startButton = document.getElementById('start-button');
const mineButton = document.getElementById('mine-button');
const upgradeButton = document.getElementById('upgrade-button');
const friendsButton = document.getElementById('friends-button');
const earnButton = document.getElementById('earn-button');
const bottomButtons = document.querySelectorAll('.nav-button');

const mainScreen = document.getElementById('main-screen');
const friendsScreen = document.getElementById('friends-screen');

const referralLinkElem = document.getElementById('referralLink');
const copyButton = document.getElementById('copyButton');
const inviteButton = document.getElementById('inviteButton');

// Обновление отображения времени
function updateTimeDisplay() {
  timeDisplay.textContent = `${time} $TIME`;
}

// Запуск процесса майнинга
function startMining() {
  if (mining) return;
  mining = true;

  // Деактивируем кнопку "Старт"
  startButton.disabled = true;
  startButton.classList.remove('green-button');
  startButton.classList.add('gray-button');
  startButton.textContent = isRussian ? 'Майнинг' : 'Mining';

  // Обновляем время последней активности
  lastActive = Date.now();

  // Запускаем майнинг
  miningInterval = setInterval(() => {
    time += miningRate;
    updateTimeDisplay();
    lastActive = Date.now();
  }, 1000);

  // Сбрасываем таймаут майнинга
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
  mining = false;
  clearInterval(miningInterval);

  // Активируем кнопку "Старт"
  startButton.disabled = false;
  startButton.classList.remove('gray-button');
  startButton.classList.add('green-button');
  startButton.textContent = isRussian ? 'Старт' : 'Start';

  // Сбрасываем прошедшее время
  time = 0;
  updateTimeDisplay();

  if (tg) {
    tg.showAlert(isRussian ? 'Майнинг остановлен из-за неактивности. Пожалуйста, начните снова.' : 'Mining stopped due to inactivity. Please start again.');
  } else {
    alert(isRussian ? 'Майнинг остановлен из-за неактивности. Пожалуйста, начните снова.' : 'Mining stopped due to inactivity. Please start again.');
  }
}

// Обработчик события для кнопки "Старт"
startButton.addEventListener('click', startMining);

// Навигационные кнопки
bottomButtons.forEach((button) => {
  button.addEventListener('click', function() {
    // Удаляем класс 'active' у всех кнопок
    bottomButtons.forEach((btn) => btn.classList.remove('active'));
    // Добавляем класс 'active' к нажатой кнопке
    this.classList.add('active');

    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach((screen) => (screen.style.display = 'none'));

    // Показываем выбранный экран
    switch (this.id) {
      case 'mine-button':
        mainScreen.style.display = 'flex';
        break;
      case 'upgrade-button':
        alert(isRussian ? 'Раздел "Upgrade" в разработке.' : '"Upgrade" section is under development.');
        mainScreen.style.display = 'flex';
        break;
      case 'friends-button':
        friendsScreen.style.display = 'flex';
        generateReferralLink();
        break;
      case 'earn-button':
        alert(isRussian ? 'Раздел "Earn" в разработке.' : '"Earn" section is under development.');
        mainScreen.style.display = 'flex';
        break;
    }
  });
});

// Функции для реферальной системы
function generateReferralLink() {
  const referralLink = `${window.location.origin}?referralId=${telegramId}`;
  referralLinkElem.textContent = isRussian
    ? `Ваша реферальная ссылка:\n${referralLink}`
    : `Your referral link:\n${referralLink}`;
}

copyButton?.addEventListener('click', () => {
  const referralLink = `${window.location.origin}?referralId=${telegramId}`;
  navigator.clipboard.writeText(referralLink).then(() => {
    if (tg) {
      tg.showAlert(isRussian ? 'Реферальная ссылка скопирована!' : 'Referral link copied!');
    } else {
      alert(isRussian ? 'Реферальная ссылка скопирована!' : 'Referral link copied!');
    }
  }, () => {
    if (tg) {
      tg.showAlert(isRussian ? 'Не удалось скопировать ссылку.' : 'Failed to copy the link.');
    } else {
      alert(isRussian ? 'Не удалось скопировать ссылку.' : 'Failed to copy the link.');
    }
  });
});

inviteButton?.addEventListener('click', () => {
  const referralLink = `${window.location.origin}?referralId=${telegramId}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(isRussian ? 'Присоединяйся к $TIME!' : 'Join $TIME!')}`;
  window.open(telegramUrl, '_blank');
});

// Обработка реферальной ссылки при загрузке страницы
const urlParams = new URLSearchParams(window.location.search);
const referralId = urlParams.get('referralId');

if (referralId && telegramId && referralId !== telegramId.toString()) {
  // Здесь вы можете отправить запрос на сервер для обработки реферала
  // Например, используя fetch('/api/addReferral', { ... })
}

// Сброс таймаута майнинга при активности пользователя
if (tg) {
  tg.onEvent('viewportChanged', () => {
    if (mining) {
      resetMiningTimeout();
    }
  });

  // Обработка закрытия приложения
  tg.onEvent('webAppClosing', () => {
    // Очистка перед закрытием, если необходимо
    if (mining) {
      stopMining();
    }
  });
}

// Проверяем, не прошло ли 12 часов с последней активности
setInterval(() => {
  const hoursDiff = (Date.now() - lastActive) / 36e5;
  if (hoursDiff >= 12) {
    stopMining();
  }
}, 60000); // Проверяем каждые 60 секунд