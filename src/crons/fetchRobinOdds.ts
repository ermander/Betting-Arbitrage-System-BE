import axios from 'axios';
import Telegram from '@/utils/functions/telegram';
import RobinOddsBookmakersEnum from '@/constants/robinOddsBookmakersEnum';
import sleep from '@/utils/functions/sleep';

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

const cookie = `cookieconsent_status=dismiss; flarum_remember=jorxQ95TANmA9QatWUW9ghgxqvJOp7llWC0KrEKY; wordpress_logged_in_fa686efef513bdb6e3e44099da671de0=ermander%7C1707685484%7CfGwNfaCaf6jFRFpf5lUUJJtfVPx29zo4I6k1FdV9Q5L%7C4be6ae361aa461ccd28c3b10f9fd42d0ad1e03b3e8de74f8fd76ac1c20e13ca3`;
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

        const odds: Array<any> = []
            .concat(...filterOddsmatcherOdds(oddsmatcherOdds, 2, 1.5, 97))
            .concat(...filterDutcherOdds(dutcherOdds, 2, 1.5, 97))
            .concat(...filterOddsmatcherOdds(oddsmatcherOdds, 21, 2, 95))
            .concat(...filterDutcherOdds(dutcherOdds, 21, 2, 95));

        for (const event of odds) {
            const message = `📈 ROI: ${event.rating}% \n🌐 ${event.home} - ${
                event.away
            } \n📅 ${event.date} | 🕓 ${event.hour} \n👉🏻Book 1: ${
                event.type === 'oddsmatcher'
                    ? RobinOddsBookmakersEnum[parseInt(event.id_book_1)]
                    : event.book
            } | 👉🏻Book 2: ${
                event.type === 'oddsmatcher'
                    ? RobinOddsBookmakersEnum[parseInt(event.id_book_2)]
                    : event.book2
            } \n❱❱ Bet: 1 | ${event.back_odd} \n❱❱ Bet: 2 | ${event.lay_odd}`;
            telegramBot.sendGeneralNotification(message);
            await sleep(2000);
        }
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
