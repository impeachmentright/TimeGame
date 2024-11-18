// server.js
const express = require('express');
const bodyParser = require('body-parser');
const bot = require('./bot'); // Connect your bot file

const app = express();
app.use(bodyParser.json());

// Route for handling Telegram webhooks
app.post(`/bot${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Optional: Handling other requests
app.get('/', (req, res) => {
  res.send('Server is running');
});

module.exports = app;