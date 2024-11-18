// bot.js
const TelegramBot = require('node-telegram-bot-api');

// Получаем токен бота из переменных окружения
const token = process.env.TELEGRAM_BOT_TOKEN;

// URL вашего веб-приложения
const webAppUrl = 'https://time-game-snowy.vercel.app/; // Замените на ваш URL

// Создаем бота с использованием вебхуков
const bot = new TelegramBot(token, {
  webHook: {
    port: process.env.PORT || 3000,
  },
});

// Устанавливаем вебхук
const webhookUrl = process.env.WEBHOOK_URL || 'https://your-vercel-app.vercel.app/api/bot'; // Замените на ваш URL и путь
bot.setWebHook(`${webhookUrl}/bot${token}`);

// Обрабатываем команду /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot
    .sendMessage(chatId, 'Нажмите кнопку ниже, чтобы открыть приложение.', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Открыть $TIME', web_app: { url: webAppUrl } }],
        ],
      },
    })
    .catch((error) => {
      if (error.response && error.response.statusCode === 403) {
        console.log(`Пользователь с chat_id ${chatId} заблокировал бота.`);
      } else {
        console.error('Ошибка при отправке сообщения:', error);
      }
    });
});