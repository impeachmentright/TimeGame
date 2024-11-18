// server.mjs
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Connect to the database
let db;
const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect().then(() => {
  db = client.db('timegame'); // Your database name
  console.log('Connected to the database');
});

// API to get or create a user
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
    // Check if 12 hours have passed since last activity
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

// API to update user's time
app.post('/api/updateTime', async (req, res) => {
  const { telegramId, time } = req.body;
  await db.collection('users').updateOne(
    { telegramId },
    { $set: { time, lastActive: new Date() } }
  );
  res.sendStatus(200);
});

// API to add a referral
app.post('/api/addReferral', async (req, res) => {
  const { telegramId, referralId } = req.body;

  // Ensure the referral is not the user themselves
  if (telegramId === referralId) {
    return res.status(400).json({ error: 'You cannot refer yourself' });
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

// Serve static files from 'public' directory
app.use(express.static('public'));

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running');
});