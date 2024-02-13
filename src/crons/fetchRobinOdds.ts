import axios from 'axios';
import Telegram from '@/utils/functions/telegram';
import RobinOddsBookmakersEnum from '@/constants/robinOddsBookmakersEnum';
import sleep from '@/utils/functions/sleep';
import moment from 'moment';

const telegramBot = new Telegram(
    process.env.TELEGRAM_TOKEN!,
    process.env.TELEGRAM_CHAT_ID!,
);

/**
 * Chiamata per richiedere tutti gli eventi dell'oddsmatcher
 * GET - https://robinodds.it/api/odds/v2/index.php?id_book=
 *
 * Devo inserire questi cookie:
 * cookieconsent_status=dismiss; flarum_remember=DrUi1BukyWbvSFPi7eYOixKxms5epW5EAtmtWzcq; _lscache_vary=a2564fcd5bc784b7ce399f6ea4cc0fda; wordpress_logged_in_fa686efef513bdb6e3e44099da671de0=ermander%7C1701776521%7CbdMLihWsnlBRjqVTHxUQnRlZvhE8e9nPukZeZk6qMsJ%7C124f6a4a298be2972e57fc87f7736ba3a4e5514762cf2fcd8841c1688b91c1aa
 *
 */

const cookie = `cookieconsent_status=dismiss; flarum_remember=zGYyZCc2u3iZp7LhSMs3ChBnBgQTjXKat1jlSNMg; wordpress_logged_in_fa686efef513bdb6e3e44099da671de0=ermander%7C1708007062%7C9iS5g0mjWpDbzMh1fMpp2JI3N51vZx6uAvHHEIIxFJt%7Cfd78b04934e8e28fb9f12a5785562301d9e14f7b95c3ee0e9ecf0441e59c8b30`;
const headers = { cookie };

export default async function fetchRobinOdds(): Promise<void> {
    try {
        const { data: oddsmatcherOdds }: any = await axios.get(
            'https://robinodds.it/api/odds/v2/index.php?id_book=2,21',
            {
                headers,
            },
        );

        // Devo fare 10 chiamate al dutcher, aggiungengo a start 50 ogni volta, e voglio concatenare i risultati
        const dutcherOdds = [];
        let start = 0;

        for (let i = 0; i < 10; i++) {
            const { data } = await axios.post(
                'https://robinodds.it/api/dutcher/v2/index.php',
                {
                    id_book: '2',
                    length: 50,
                    start: 50,
                    books: '14,28,2,3,4,5,7,9,11,10,38,27,12,43,13,16,18,1,23,39,25,20,21,22,8,24,26,37,30,29,35,32,44,33,40,42',
                    sports: '0,1,2',
                    mercati: 'DC,GG,O15,O25,O35,RIG,TT,TTB',
                    sortBy: 'rating',
                    sortMode: 'DESC',
                },
                {
                    headers,
                },
            );

            start += 50;
            dutcherOdds.push(...data.data);
        }

        const events: Array<any> = []
            .concat(...filterOddsmatcherOdds(oddsmatcherOdds, 2, 1.5, 97))
            .concat(...filterDutcherOdds(dutcherOdds, 2, 1.5, 97))
            .concat(...filterOddsmatcherOdds(oddsmatcherOdds, 21, 2, 95))
            .concat(...filterDutcherOdds(dutcherOdds, 21, 2, 95))
            .sort(
                (a: any, b: any) => parseFloat(b.rating) - parseFloat(a.rating),
            );

        // Prima di mandare i messaggi, voglio creare un

        await sendMessages(events);
    } catch (error) {
        console.error('Error fetching RobinOdds', error);
        telegramBot.sendGeneralNotification('Error fetching RobinOdds');
    }
}

const filterOddsmatcherOdds = (
    response: Array<any>,
    bookID: number,
    minOdd: number,
    minRating: number,
): Array<any> => {
    const events = response.filter((event: any) => {
        if (
            parseInt(event.id_book_1) === bookID &&
            parseFloat(event.back_odd) >= minOdd
        ) {
            const layStake =
                (parseFloat(event.back_odd) * 100) /
                (parseFloat(event.lay_odd) - 0.05);
            const finalProfit = layStake * (1 - 0.05) - 100;
            const rating = 100 - Math.abs(finalProfit);
            if (rating > minRating) {
                event.rating = rating.toFixed(2);
                event.type = 'oddsmatcher';
                return true;
            }
        }
    });

    return events;
};
const filterDutcherOdds = (
    response: Array<any>,
    bookId: number,
    minOdd: number,
    minRating: number,
): Array<any> => {
    const events = response.filter((event: any) => {
        if (
            event.rating > 97 &&
            parseInt(event.id_book_1) === bookId &&
            parseFloat(event.back_odd) >= minOdd &&
            event.rating <= minRating
        ) {
            event.type = 'dutcher';
            return true;
        }
    });

    return events;
};

const sendMessages = async (events: Array<any>): Promise<void> => {
    for (const event of events) {
        const messageArray = [
            `📈 ROI: ${event.rating}\n`,
            `🌐 ${
                event.type === 'oddsmatcher'
                    ? RobinOddsBookmakersEnum[parseInt(event.id_book_1)]
                    : event.book
            } - [${
                event.type === 'oddsmatcher'
                    ? RobinOddsBookmakersEnum[parseInt(event.id_book_2)]
                    : event.book2
            }](${event.url})\n`,
            `🏀 ${event.nation}. ${event.competition}\n`,
            `📅 ${moment(event.date).format('DD/MM/YYYY')} | 🕓 ${
                event.hour
            }\n`,
            `\n`,
            `➡️ ${event.home} v ${event.away}\n`,
            `------------------------\n`,
        ];

        // Se l'evento è di tipo oddsmatcher
        if (event.type === 'oddsmatcher') {
            messageArray.push(
                // Inserisco il mercato e la selezione
                `📊 Mercato: ${event.market}\n`,
                `🔍 Selezione: ${event.selection}\n`,
                `🎯 Quota punta: ${event.back_odd}\n`,
                `🎯 Quota bancata: ${event.lay_odd}\n`,
                `📈 Rating: ${event.rating}%\n`,
            );
        }

        const message = messageArray.join('');
        telegramBot.sendGeneralNotification(message);
        await sleep(2000);
    }
};
