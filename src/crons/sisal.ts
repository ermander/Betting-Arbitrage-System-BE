import axios from 'axios';
import { SisalLinks } from '@/constants/links';
import Telegram from '@/utils/functions/telegram';
import SisalService from '@/resources/sisal/sisal.service';
import sleep from '@/utils/functions/sleep';

const sisalService = new SisalService();

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

        // Come prima cosa prendo tutto tutta l'alberatura prematch
        const { data: palinsesto } = await axios.get(
            SisalLinks.AlberaturaPrematch,
            { headers },
        );

        // Mi salvo tutti gli ID delle competizioni
        const competizioniIds = Object.entries(
            palinsesto.manifestazioneMap,
        ).map(([id, manifestazione]: [string, any]) => ({
            key: manifestazione.key,
            descrizione: manifestazione.descrizione,
            descrizioneAAMS: manifestazione.descrizioneAAMS,
        }));

        // Ciclo tutte le competizioni per prendere tutti gli eventi

        for (const competizione of competizioniIds) {
            const { data: response } = await axios.get(
                `https://betting.sisal.it/api/lettura-palinsesto-sport/palinsesto/prematch/schedaManifestazione/0/${competizione.key}/27/1000001?offerId=0`,
                { headers },
            );

            /**
             * All'interno di "avvenimentoFeList" ci sono tutti gli eventi.
             * La chiave "key" è l'ID dell'evento.
             *
             * All'interno di "infoAggiuntivaMap" ci sono le quote.
             * Se unisto le chiavi "codicePalinsesto" e "codiceAvvenimento" come "codicePalinsesto-codiceAvvenimento" ottengo l'ID dell'evento.
             */

            // Creo un oggetto di tipo Map per associare le quote agli eventi
            const events = new Map();
            for (const event of response.avvenimentoFeList) {
                const key = event.key;
                events.set(key, {
                    key: event.key,
                    campionato: competizione.descrizione,
                    campionatoAAMS: competizione.descrizioneAAMS,
                    data: event.data,
                    descrizione: event.descrizione,
                    casa: event.firstCompetitor?.description ?? '',
                    ospite: event.secondCompetitor?.description ?? '',
                    odds: {},
                });
            }
            //

            // Adesso ciclio all'interno di "infoAggiuntivaMap" per associare le quote agli eventi
            // infoAggiuntivaMap è un oggetto, quindi uso Object.entries per ciclarlo
            for (const [key, quote] of Object.entries(
                response.infoAggiuntivaMap,
            ) as [any, any][]) {
                const key = `${quote.codicePalinsesto}-${quote.codiceAvvenimento}`;
                const event = events.get(key);
                if (event) {
                    event.odds[quote.descrizione] = quote.esitoList.map(
                        (esito: any) => ({
                            descrizione: esito.descrizione,
                            quota: esito.quota,
                        }),
                    );
                }
            }

            /**
             * Adesso salvo tutti gli evento nel database.
             * Se l'evento esiste già, aggiorno le quote.
             * Se l'evento non esiste, lo creo.
             */

            console.log('events', events);

            for (const event of events.values()) {
                await sisalService.createOrUpdateSisal(event);
            }

            await sleep(5000);
        }

        console.log('Sisal fetched');

        telegramBot.sendGeneralNotification('Sisal fetched');
    } catch (error) {
        console.error('Error fetching Sisal', error);
        telegramBot.sendGeneralNotification('Error fetching Sisal');
    }
}
