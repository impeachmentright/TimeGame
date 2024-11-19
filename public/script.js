document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, работает ли приложение внутри Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;

        // Уведомляем Telegram, что приложение готово
        tg.ready();

        // Расширяем приложение на весь экран
        tg.expand();

        console.log('Приложение загружено и готово к работе');

        // Определяем язык интерфейса
        const userLang = navigator.language || navigator.userLanguage;
        const isRussian = userLang.startsWith('ru');

        // Получаем telegramId пользователя
        const telegramId = tg.initDataUnsafe?.user?.id;

        if (!telegramId) {
            tg.showAlert(isRussian ? 'Не удалось получить ваш Telegram ID.' : 'Failed to get your Telegram ID.');
            return;
        }

        // Переменные для майнинга
        let mining = false;
        let time = 0; // Количество $TIME
        let miningRate = 1; // Начальная скорость майнинга ($TIME в секунду)
        let lastActive = Date.now();
        let miningInterval;
        let miningTimeout;

        // Элементы интерфейса
        const timeDisplay = document.getElementById('timeDisplay');
        const startButton = document.getElementById('startButton');
        const mineButton = document.getElementById('mineButton');
        const upgradeButton = document.getElementById('upgradeButton');
        const friendsButton = document.getElementById('friendsButton');
        const earnButton = document.getElementById('earnButton');
        const friendsOptions = document.getElementById('friendsOptions');
        const referralLinkElem = document.getElementById('referralLink');
        const copyButton = document.getElementById('copyButton');
        const inviteButton = document.getElementById('inviteButton');
        const bottomButtons = document.querySelectorAll('.bottomButton');

        // Функция обновления отображения времени
        function updateTimeDisplay() {
            timeDisplay.textContent = `${time} $TIME`;
        }

        // Функция запуска майнинга
        function startMining() {
            if (mining) return;
            mining = true;
            startButton.classList.add('disabled');
            startButton.textContent = isRussian ? 'Майнинг' : 'Mining';

            // Сохраняем состояние майнинга на сервере
            saveUserData();

            // Обновляем время последней активности
            lastActive = Date.now();

            // Запускаем майнинг
            miningInterval = setInterval(() => {
                time += miningRate;
                updateTimeDisplay();
                lastActive = Date.now();
            }, 1000);

            // Сброс таймаута майнинга
            resetMiningTimeout();
        }

        // Функция остановки майнинга
        function stopMining() {
            mining = false;
            startButton.classList.remove('disabled');
            startButton.textContent = isRussian ? 'Старт' : 'Start';
            clearInterval(miningInterval);
            saveUserData();

            if (tg) {
                tg.showAlert(isRussian ? 'Майнинг остановлен из-за неактивности. Пожалуйста, начните снова.' : 'Mining stopped due to inactivity. Please start again.');
            } else {
                alert(isRussian ? 'Майнинг остановлен из-за неактивности. Пожалуйста, начните снова.' : 'Mining stopped due to inactivity. Please start again.');
            }
        }

        // Функция сохранения данных пользователя на сервере
        function saveUserData() {
            fetch('/api/updateUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    telegramId,
                    time,
                    mining,
                    miningRate,
                    lastActive: new Date(lastActive)
                })
            })
            .catch(error => {
                console.error('Ошибка при сохранении данных пользователя:', error);
            });
        }

        // Загрузка прогресса пользователя из базы данных
        fetch('/api/getUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telegramId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                time = data.time;
                mining = data.mining;
                miningRate = data.miningRate;
                lastActive = new Date(data.lastActive).getTime();
                updateTimeDisplay();

                // Проверяем, прошло ли 12 часов с последней активности
                const hoursDiff = (Date.now() - lastActive) / 36e5;
                if (hoursDiff >= 12) {
                    time = 0;
                    mining = false;
                    updateTimeDisplay();
                } else if (mining) {
                    startMining();
                }
            }
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных пользователя:', error);
        });

        // Обработчик события для кнопки "Старт"
        startButton.addEventListener('click', () => {
            if (startButton.classList.contains('disabled')) return;
            startMining();
        });

        // Обработчики для навигационных кнопок
        bottomButtons.forEach(button => {
            button.addEventListener('click', () => {
                bottomButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Скрываем все контенты
                document.getElementById('mainContent').style.display = 'none';
                friendsOptions.style.display = 'none';

                // Обработка нажатия кнопок
                switch (button.id) {
                    case 'mineButton':
                        // Показать главный экран
                        document.getElementById('mainContent').style.display = 'block';
                        break;
                    case 'upgradeButton':
                        // Открываем экран Upgrade
                        tg.showAlert(isRussian ? 'Раздел "Upgrade" в разработке.' : '"Upgrade" section is under development.');
                        document.getElementById('mainContent').style.display = 'block';
                        break;
                    case 'friendsButton':
                        // Открываем экран Friends
                        friendsOptions.style.display = 'block';
                        generateReferralLink();
                        break;
                    case 'earnButton':
                        // Открываем экран Earn
                        tg.showAlert(isRussian ? 'Раздел "Earn" в разработке.' : '"Earn" section is under development.');
                        document.getElementById('mainContent').style.display = 'block';
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

        copyButton.addEventListener('click', () => {
            const referralLink = `${window.location.origin}?referralId=${telegramId}`;
            navigator.clipboard.writeText(referralLink).then(() => {
                tg.showAlert(isRussian ? 'Реферальная ссылка скопирована в буфер обмена!' : 'Referral link copied to clipboard!');
            }, () => {
                tg.showAlert(isRussian ? 'Не удалось скопировать ссылку.' : 'Failed to copy the link.');
            });
        });

        inviteButton.addEventListener('click', () => {
            const referralLink = `${window.location.origin}?referralId=${telegramId}`;
            const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(isRussian ? 'Присоединяйся к $TIME!' : 'Join $TIME!')}`;
            window.open(telegramUrl, '_blank');
        });

        // Обработка реферальной ссылки при загрузке страницы
        const urlParams = new URLSearchParams(window.location.search);
        const referralId = urlParams.get('referralId');

        if (referralId && telegramId && referralId !== telegramId.toString()) {
            fetch('/api/addReferral', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    telegramId: telegramId.toString(),
                    referralId
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    tg.showAlert(isRussian ? 'Вы успешно присоединились по реферальной ссылке!' : 'You have successfully joined via a referral link!');
                }
            })
            .catch(error => {
                console.error('Ошибка при обработке реферальной ссылки:', error);
            });
        }

        // Проверяем, не прошло ли 12 часов с последней активности
        setInterval(() => {
            const hoursDiff = (Date.now() - lastActive) / 36e5;
            if (hoursDiff >= 12) {
                stopMining();
                time = 0;
                updateTimeDisplay();
                tg.showAlert(isRussian ? 'Прошло более 12 часов без активности. Ваш прогресс обнулен.' : 'More than 12 hours of inactivity. Your progress has been reset.');
            }
        }, 60000); // Проверяем каждые 60 секунд

        // Сброс таймаута майнинга при активности пользователя
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

        // Функция сброса таймаута майнинга
        function resetMiningTimeout() {
            if (miningTimeout) clearTimeout(miningTimeout);
            miningTimeout = setTimeout(() => {
                // Останавливаем майнинг после 12 часов неактивности
                stopMining();
            }, 12 * 60 * 60 * 1000); // 12 часов
        }

    } else {
        // Если Telegram.WebApp не доступен, показываем предупреждение
        alert('Приложение должно быть запущено внутри Telegram.');
    }
});