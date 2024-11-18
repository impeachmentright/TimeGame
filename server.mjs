// server.mjs
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';
import bot from './bot.js'; // Подключение вашего бота

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

// API для получения или создания пользователя с обработкой referralId
app.post('/api/user', async (req, res) => {
  const { telegramId, referralId } = req.body;
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

      // Если есть referralId, добавляем его как реферала
      if (referralId) {
        await db.collection('users').updateOne(
          { telegramId: referralId },
          {
            $push: { referrals: telegramId },
            $inc: { time: 10000 } // Начисляем бонус
          }
        );
      }
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

// Остальные маршруты остаются без изменений

// Обслуживание статических файлов из папки public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Обработка остальных маршрутов, отправка index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});