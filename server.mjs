// Импорт необходимых модулей
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Настройка приложения Express
const app = express();
const PORT = process.env.PORT || 3000;

// Получение текущего пути и директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware для обработки JSON и статических файлов
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Кеширование отключено
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обработка данных от Telegram Web App (например, для авторизации)
app.post('/web-data', (req, res) => {
    const telegramData = req.body;
    console.log('Получены данные от Telegram:', telegramData);
    res.status(200).json({ message: 'Данные успешно обработаны' });
});

// Обработка неправильных маршрутов
app.use((req, res) => {
    res.status(404).send('Страница не найдена');
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});