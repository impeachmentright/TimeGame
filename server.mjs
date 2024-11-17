import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// Ваш токен бота Telegram
const BOT_TOKEN = '7295546912:AAHb8CCF3reVfVOje4-UE1P_pneszMiXt2c';

// Адрес вашего веб-приложения
const WEB_APP_URL = 'https://time-game-snowy.vercel.app';

// Создаем маршруты для обработки покупки
app.use(express.json());

// Генерация ссылки на покупку через Telegram Stars
app.post('/purchase/:item', async (req, res) => {
    const { item } = req.params;

    // Цены на предметы (в копейках, 1 звезда = 100 копеек)
    const prices = {
        upgrade: [{ label: "Ускорение времени", amount: 500 * 100 }], // 500 звезд
        earn: [{ label: "Получение награды", amount: 300 * 100 }], // 300 звезд
        box: [{ label: "Секретная коробка", amount: 1000 * 100 }], // 1000 звезд
    };

    if (!prices[item]) {
        return res.status(400).json({ success: false, message: "Неверный предмет для покупки." });
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendInvoice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: req.body.chat_id, // ID пользователя Telegram
                title: `Покупка: ${item}`,
                description: `Купить ${item} для Time Game.`,
                payload: `purchase-${item}`,
                provider_token: '', // Токен провайдера для цифровых товаров
                currency: 'XTR', // Оплата звездами (Stars)
                prices: prices[item],
                start_parameter: `purchase-${item}`, // Идентификатор платежа
            }),
        });

        const data = await response.json();

        if (data.ok) {
            res.json({ success: true, message: "Счет успешно отправлен." });
        } else {
            console.error('Ошибка создания счета:', data.description);
            res.status(500).json({ success: false, message: data.description });
        }
    } catch (error) {
        console.error('Ошибка сервера при создании счета:', error);
        res.status(500).json({ success: false, message: "Ошибка сервера." });
    }
});

// Вебхук для обработки успешных платежей
app.post('/webhook', (req, res) => {
    const update = req.body;

    if (update.message && update.message.successful_payment) {
        const paymentInfo = update.message.successful_payment;

        console.log('Успешный платеж:', paymentInfo);

        // Добавьте логику для начисления бонусов в игре, если требуется
    }

    res.sendStatus(200);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});