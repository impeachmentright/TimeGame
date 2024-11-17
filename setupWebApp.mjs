import fetch from 'node-fetch';

const BOT_TOKEN = '7295546912:AAHb8CCF3reVfVOje4-UE1P_pneszMiXt2c';
const WEB_APP_URL = 'https://timegame.vercel.app';

// Функция для установки Web App URL
async function setupWebApp() {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            menu_button: {
                type: 'web_app',
                text: 'Open Time Game',
                web_app: {
                    url: WEB_APP_URL,
                },
            },
        }),
    });

    const data = await response.json();

    if (data.ok) {
        console.log('Web App успешно настроен!');
    } else {
        console.error('Ошибка при настройке Web App:', data);
    }
}

setupWebApp().catch((error) => console.error('Ошибка выполнения скрипта:', error));