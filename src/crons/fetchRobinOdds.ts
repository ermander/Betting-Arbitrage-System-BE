import axios from 'axios';
import Telegram from '@/utils/functions/telegram';

/**
 * Chiamata per richiedere tutti gli eventi dell'oddsmatcher
 * GET - https://robinodds.it/api/odds/v2/index.php?id_book=
 *
 * Devo inserire questi cookie:
 * cookieconsent_status=dismiss; flarum_remember=DrUi1BukyWbvSFPi7eYOixKxms5epW5EAtmtWzcq; _lscache_vary=a2564fcd5bc784b7ce399f6ea4cc0fda; wordpress_logged_in_fa686efef513bdb6e3e44099da671de0=ermander%7C1701776521%7CbdMLihWsnlBRjqVTHxUQnRlZvhE8e9nPukZeZk6qMsJ%7C124f6a4a298be2972e57fc87f7736ba3a4e5514762cf2fcd8841c1688b91c1aa
 *
 */

const cookie = `cookieconsent_status=dismiss; flarum_remember=DrUi1BukyWbvSFPi7eYOixKxms5epW5EAtmtWzcq; _lscache_vary=a2564fcd5bc784b7ce399f6ea4cc0fda; wordpress_logged_in_fa686efef513bdb6e3e44099da671de0=ermander%7C1701776521%7CbdMLihWsnlBRjqVTHxUQnRlZvhE8e9nPukZeZk6qMsJ%7C124f6a4a298be2972e57fc87f7736ba3a4e5514762cf2fcd8841c1688b91c1aa`;

async function fetchRobinsOddsOddsmatcher(): Promise<void> {
    const { data: response }: any = await axios.get(
        'https://robinodds.it/api/odds/v2/index.php?id_book=',
        {
            headers: {
                cookie,
            },
        },
    );
}

export default fetchRobinsOddsOddsmatcher;
