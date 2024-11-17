const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

// Подключаем базу данных
const db = new sqlite3.Database('./timegame.db', (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.message);
    } else {
        console.log('Подключено к базе данных SQLite.');
    }
});

// Middleware для обработки JSON
app.use(express.json());

// API для добавления или обновления данных пользователя
app.post('/api/user', (req, res) => {
    const { user_id, mined_time, stars, time_speed } = req.body;

    db.run(
        `INSERT INTO users (user_id, mined_time, stars, time_speed)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(user_id)
         DO UPDATE SET
         mined_time = mined_time + excluded.mined_time,
         stars = excluded.stars,
         time_speed = excluded.time_speed`,
        [user_id, mined_time, stars, time_speed],
        (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Данные успешно обновлены!' });
            }
        }
    );
});

// API для получения данных пользователя
app.get('/api/user/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM users WHERE user_id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ message: 'Пользователь не найден.' });
        } else {
            res.json(row);
        }
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});