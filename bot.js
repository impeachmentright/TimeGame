const TelegramBot = require('node-telegram-bot-api');

// Вставьте ваш реальный токен бота
const token = '7295546912:AAHb8CCF3reVfVOje4-UE1P_pneszMiXt2c';

// Создаем бота
const bot = new TelegramBot(token, { polling: true });

// URL вашего веб-приложения
const webAppUrl = 'https://time-game-snowy.vercel.app/'; // Замените на ваш URL

// Обрабатываем команду /start
// Обрабатываем команду /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    // Отправляем сообщение с кнопкой веб-приложения
    bot.sendMessage(chatId, 'Нажмите кнопку ниже, чтобы открыть приложение.', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Открыть $TIME', web_app: { url: webAppUrl } }]
            ]
        }
    }).catch((error) => {
        if (error.response && error.response.statusCode === 403) {
            console.log(`Пользователь с chat_id ${chatId} заблокировал бота.`);
        } else {
            console.error('Ошибка при отправке сообщения:', error);
        }
    });
});