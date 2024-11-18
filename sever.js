// server.js
const express = require('express');
const bodyParser = require('body-parser');
const bot = require('./bot'); // Подключаем ваш файл бота

const app = express();
app.use(bodyParser.json());

// Маршрут для обработки вебхуков от Telegram
app.post(`/bot${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Обработка остальных запросов (опционально)
app.get('/', (req, res) => {
  res.send('Сервер работает');
});

module.exports = app;