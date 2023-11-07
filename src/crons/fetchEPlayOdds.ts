import axios from 'axios';
import Telegram from '@/utils/functions/telegram';

/**
 * Chiamata per richiedere tutti gli eventi prematch
 * GET - https://api2.cplay.it/api/Palinsesto/GetAllEventsPrematch
 */

/**  Chiamata per richiedere le quote principali
"https://api2.cplay.it/api/Palinsesto_V3/GetManifestazioneCore?v=5f1bc66dee3b67a1952288191226f9a45f1a32c9c8ee3cbc55c7517b8757882b"
 Request body:
    {
        "BetTypeIdString": null,
        "DateFrom": null,
        "DateTo": null,
        "GroupId": 33,
        "IndexDateTo": null,
        "TypeOnly": false,
        "isQuery": false
    }
*/

async function fetchEPlayOdds(): Promise<void> {
    const telegramBot = new Telegram(
        process.env.TELEGRAM_TOKEN!,
        process.env.TELEGRAM_CHAT_ID!,
    );

    try {
        const { data: response }: any = await axios.get(
            'https://api2.cplay.it/api/Palinsesto/GetAllEventsPrematch',
        );

        const palinsesto: Map<string, any[]> = new Map();

        response
            .filter((e: any) => e.Sport_Desc === 'Calcio')
            .forEach((match: any) => {
                const { Category_Desc, Group_Name, Group_id } = match;

                if (!palinsesto.has(Category_Desc)) {
                    palinsesto.set(Category_Desc, []);
                }

                const categoryMap: any[] | undefined =
                    palinsesto.get(Category_Desc);

                if (categoryMap) {
                    const existingGroup = categoryMap.find(
                        (group) => group.Group_id === Group_id,
                    );

                    if (existingGroup) {
                        existingGroup.matches.push(match);
                    } else {
                        categoryMap.push({
                            Group_id,
                            Group_Name,
                            matches: [match],
                        });
                    }
                }

                const existingGroup = categoryMap?.find(
                    (group) => group.Group_id === Group_id,
                );

                if (existingGroup) {
                    existingGroup.matches.push(match);
                } else {
                    categoryMap?.push({
                        Group_id,
                        Group_Name,
                        matches: [match],
                    });
                }
            });

        const telegramBot = new Telegram(
            process.env.TELEGRAM_TOKEN!,
            process.env.TELEGRAM_CHAT_ID!,
        );

        telegramBot.sendGeneralNotification(
            'Palinsesto Eplay scrapato correttamente',
        );
    } catch (error) {
        console.log("C'è stato un errore in fetchEPlayOdds cron job", error);
        telegramBot.sendGeneralNotification(
            "C'è stato un errore in fetchEPlayOdds cron job: " + error,
        );
    }
}

export default fetchEPlayOdds;
