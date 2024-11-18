// bot.js
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

// Создаем бота в режиме вебхуков
const bot = new TelegramBot(token, { webHook: true });

// Устанавливаем вебхук
bot.setWebHook(`${process.env.SERVER_URL}/bot${token}`);

// Обработка входящих сообщений
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  // Отправляем ответное сообщение
  bot.sendMessage(chatId, 'Ваше сообщение получено');
});

module.exports = bot;