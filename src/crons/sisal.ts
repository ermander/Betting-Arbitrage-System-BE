import axios from 'axios';
import { SisalLinks } from '@/constants/links';
import Telegram from '@/utils/functions/telegram';

const telegramBot = new Telegram(
    process.env.TELEGRAM_TOKEN!,
    process.env.TELEGRAM_CHAT_ID!,
);

// fetchSisal è una funzione asincrona che non ritorna nulla, quindi void

const headers = {
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language':
        'it-IT,it;q=0.9,es-IT;q=0.8,es;q=0.7,en-US;q=0.6,en;q=0.5',
    Connection: 'keep-alive',
    Host: 'betting.sisal.it',
    'If-None-Match': '"1bed8742e8ab18b6dad137a556ea0591"',
    Origin: 'https://www.sisal.it',
    Referer: 'https://www.sisal.it/',
    'Sec-Ch-Ua':
        '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"macOS"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
};

export default async function fetchSisal(): Promise<void> {
    // Your code here
    try {
        console.log('Fetching Sisal');

        await axios.get(
            'https://betting.sisal.it/api/lettura-palinsesto-sport/palinsesto/prematch/schedaManifestazione/0/1-209?offerId=0',
            { headers },
        );

        console.log('Sisal fetched');
        telegramBot.sendGeneralNotification('Sisal fetched');
    } catch (error) {
        console.error('Error fetching Sisal', error);
        telegramBot.sendGeneralNotification('Error fetching Sisal');
    }
}
