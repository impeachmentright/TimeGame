import express from 'express'; // Подключаем express
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch'; // Подключаем node-fetch для работы с API

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Подключение к базе данных SQLite
const db = new sqlite3.Database('./timegame.db', (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.message);
    } else {
        console.log('Подключено к базе данных SQLite.');
    }
});

// Middleware для обработки JSON
app.use(bodyParser.json());

// Настройка для отдачи статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для корневого URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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

// API для добавления пользователя
app.post('/api/add-user', (req, res) => {
    const { user_id, first_name } = req.body;

    db.get('SELECT * FROM users WHERE user_id = ?', [user_id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            db.run('INSERT INTO users (user_id, mined_time, stars, time_speed) VALUES (?, 0, 100, 1)', [user_id], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                console.log(`Пользователь ${first_name} добавлен`);
                res.json({ success: true });
            });
        } else {
            res.json({ message: 'Пользователь уже существует.' });
        }
    });
});

// API для обновления прогресса
app.post('/api/update-progress', (req, res) => {
    const { user_id, mined_time, stars, time_speed } = req.body;

    db.run(
        'UPDATE users SET mined_time = ?, stars = ?, time_speed = ? WHERE user_id = ?',
        [mined_time, stars, time_speed, user_id],
        (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true });
        }
    );
});

// Автоматическое обновление данных каждые 30 секунд
setInterval(() => {
    fetch('http://localhost:3000/api/update-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: 'example_user_id', // Замените на ID текущего пользователя
            mined_time: 100, // Замените на актуальное значение mined_time
            stars: 50, // Замените на актуальное значение stars
            time_speed: 1.2, // Замените на актуальное значение time_speed
        }),
    })
    .then((response) => response.json())
    .then((data) => console.log('Прогресс сохранён:', data))
    .catch((error) => console.error('Ошибка сохранения:', error));
}, 30000); // каждые 30 секунд

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});