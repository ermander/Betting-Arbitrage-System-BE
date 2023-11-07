import axios from 'axios';
import Telegram from '@/utils/functions/telegram';

async function fetchBetBurger(): Promise<void> {
    try {
        const access_token: string = 'f79c74c2dd0d40ff388c670f7efe7445';
        const locale: string = 'en';
        const url: string =
            'https://rest-api-pr.betburger.com/api/v1/arbs/pro_search';

        const data: any = {
            auto_update: true,
            notification_sound: false,
            notification_popup: false,
            show_event_arbs: true,
            grouped: true,
            per_page: 20,
            sort_by: 'percent',
            koef_format: 'decimal',
            mode: '',
            event_id: '',
            q: '',
            event_arb_types: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            search_filter: [724958],
            is_live: false,
            bk_ids: [
                1, 3, 4, 8, 9, 10, 11, 13, 14, 15, 16, 18, 19, 35, 40, 42, 43,
                44, 47, 48, 49, 54, 55, 59, 62, 63, 66, 67, 69, 72, 75, 77, 78,
                79, 81, 82, 83, 84, 86, 88, 89, 90, 91, 93, 95, 96, 98, 99, 100,
                101, 102, 103, 104, 105, 106, 107, 108, 109, 111, 112, 113, 114,
                115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 127, 128,
                129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141,
                142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154,
                155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167,
                168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180,
                181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193,
                194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 210,
                211, 212, 213, 220, 221, 222, 223, 224, 245, 246, 247, 248, 249,
                250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262,
                263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275,
                276, 277, 278, 279, 281, 282, 283, 284, 285, 286, 287, 288, 289,
                290, 291, 292, 293, 294, 295, 296, 297, 298,
            ],
        };

        // Serializza l'oggetto data in una stringa URL-encoded
        const formData: string = new URLSearchParams(data).toString();

        const response: any = await axios.post(url, formData, {
            headers: {
                'Content-Type':
                    'application/x-www-form-urlencoded; charset=UTF-8',
            },
            params: {
                access_token,
                locale,
            },
        });

        const dataResponse: any = response.data;

        const arbs: any[] = dataResponse.arbs;

        const telegramBot = new Telegram(
            process.env.TELEGRAM_TOKEN!,
            process.env.TELEGRAM_CHAT_ID!,
        );

        arbs.forEach((arb: any, i: number) => {
            let { bet1_id, bet2_id, bet3_id } = arb;
            const bet1 = dataResponse.bets.find(
                (bet: any) => bet.id === bet1_id,
            );
            const bet2 = dataResponse.bets.find(
                (bet: any) => bet.id === bet2_id,
            );
            const bet3 = dataResponse.bets.find(
                (bet: any) => bet.id === bet3_id,
            );
            if (i === 0) {
                telegramBot.sendNotification({
                    arb,
                    bet1,
                    bet2,
                    bet3,
                });
            }
        });

        return;
    } catch (error: any) {
        console.log("C'è stato un errore in fetchBetBurger cron job", error);
        return;
    }
}

async function sendTelegramNotification(data: any): Promise<void> {
    try {
    } catch (error: any) {
        console.log("C'è stato un errore in sendTelegramNotification", error);
        return;
    }
}

export default fetchBetBurger;
