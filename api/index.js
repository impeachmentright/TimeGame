// api/index.js
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bot = require('../bot'); // Подключение вашего бота

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Подключение к базе данных
let db;
const client = new MongoClient(process.env.MONGODB_URI);

client.connect()
  .then(() => {
    db = client.db('timegame'); // Ваше название базы данных
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error('Failed to connect to the database', err);
  });

// Маршрут для обработки вебхуков Telegram
app.post(`/bot${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// API для получения или создания пользователя
app.post('/api/user', async (req, res) => {
  const { telegramId } = req.body;
  try {
    let user = await db.collection('users').findOne({ telegramId });

    if (!user) {
      user = {
        telegramId,
        time: 0,
        lastActive: new Date(),
        referrals: [],
      };
      await db.collection('users').insertOne(user);
    } else {
      // Проверяем, прошло ли 12 часов с последней активности
      const hoursDiff = (new Date() - new Date(user.lastActive)) / 36e5;
      if (hoursDiff >= 12) {
        user.time = 0;
        await db.collection('users').updateOne(
          { telegramId },
          { $set: { time: 0, lastActive: new Date() } }
        );
      }
    }

    res.json(user);
  } catch (error) {
    console.error('Error in /api/user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API для обновления времени пользователя
app.post('/api/updateTime', async (req, res) => {
  const { telegramId, time } = req.body;
  try {
    await db.collection('users').updateOne(
      { telegramId },
      { $set: { time, lastActive: new Date() } }
    );
    res.sendStatus(200);
  } catch (error) {
    console.error('Error in /api/updateTime:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API для добавления реферала
app.post('/api/addReferral', async (req, res) => {
  const { telegramId, referralId } = req.body;

  // Проверяем, что пользователь не рефирует сам себя
  if (telegramId === referralId) {
    return res.status(400).json({ error: 'Вы не можете реферировать себя' });
  }

  try {
    const user = await db.collection('users').findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    if (!user.referrals.includes(referralId)) {
      user.referrals.push(referralId);
      user.time += 10000;
      await db.collection('users').updateOne(
        { telegramId },
        { $set: { referrals: user.referrals, time: user.time } }
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error in /api/addReferral:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обработка других запросов
app.get('/', (req, res) => {
  res.send('Сервер работает');
});

// Экспортируем приложение без вызова app.listen()
module.exports = app;