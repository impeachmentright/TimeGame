// server.mjs
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Подключение к базе данных
let db;
const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect().then(() => {
  db = client.db('timegame'); // Имя вашей базы данных
  console.log('Подключено к базе данных');
});

// API для получения или создания пользователя
app.post('/api/user', async (req, res) => {
  const { telegramId } = req.body;
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
        { $set: { time: 0 } }
      );
    }
  }

  res.json(user);
});

// API для обновления времени пользователя
app.post('/api/updateTime', async (req, res) => {
  const { telegramId, time } = req.body;
  await db.collection('users').updateOne(
    { telegramId },
    { $set: { time, lastActive: new Date() } }
  );
  res.sendStatus(200);
});

// API для добавления реферала
app.post('/api/addReferral', async (req, res) => {
  const { telegramId, referralId } = req.body;

  // Проверяем, что реферал не является самим пользователем
  if (telegramId === referralId) {
    return res.status(400).json({ error: 'Нельзя добавить себя в качестве реферала' });
  }

  const user = await db.collection('users').findOne({ telegramId });
  if (!user.referrals.includes(referralId)) {
    user.referrals.push(referralId);
    user.time += 10000;
    await db.collection('users').updateOne(
      { telegramId },
      { $set: { referrals: user.referrals, time: user.time } }
    );
  }

  res.sendStatus(200);
});

// Обработка остальных запросов
app.use(express.static('public'));

app.listen(process.env.PORT || 3000, () => {
  console.log('Сервер запущен');
});