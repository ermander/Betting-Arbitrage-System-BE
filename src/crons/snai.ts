import telegramBot from '../index';
import puppeteer from 'puppeteer';
import { SnaiLinks } from '@/constants/links';

export async function fetchSnai(): Promise<void> {
    try {
        console.log('Fetching Snai');
        // Navigo verso la pagina delle scommesse
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        for (const link of SnaiLinks) {
            await page.goto(link);
            console.log('Navigating to', link);

            /**
             * Ogni link è formato tipo https://www.snai.it/sport/CALCIO/CHAMPIONS%20LEAGUE
             * Devo cercare tutti i div che come id contengono l'ultima parte del link
             * togliendo %20 ed eliminando lo spazio (se presente). L'id è composto anche da altri caratteri, quindi devo usare
             * una stringa regex.
             * Devo lasciare un po' di tempo per caricare la pagina, quindi aspetto 5 secondi.
             * Poi stampo il numero di matches trovati.
             */
            const linkParts = link.split('/');
            const lastPart = linkParts[linkParts.length - 1]
                .replace(/%20/g, ' ')
                .replace(' ', '');

            await page.waitForSelector(`div[id*="${lastPart}"]`);
            const matches = await page.$$(`div[id*="${lastPart}"]`);
            console.log('Matches found:', matches.length);

            // Per ogni match, cerco gli a con proprietà 'ng-click="selectPalAvv(avvenimento)"'
            // subito figli di uno span e mi salvo il testo di ogni a.

            // for (const match of matches) {
            //     await match
            //         .waitForSelector('a[ng-click="selectPalAvv(avvenimento)"]')
            //         .catch((err) => console.error(err));
            //     const matchName = await match.$$eval(
            //         'a[ng-click="selectPalAvv(avvenimento)"]',
            //         (as) => as.map((a) => a.textContent),
            //     );

            //     console.log(matchName.map((name: any) => name.trim()));
            // }

            for (const match of matches) {
                // Cerco i div di classe ""col-xs-12 nopaddingLeftRight whiteOneMargin firstCOLor""
                // e ne stampo il testo. Devo eliminare gli spazi e i newline.
                const matchNames = await match.$$(
                    'div[class="col-xs-12 nopaddingLeftRight whiteOneMargin firstCOLor"]',
                );

                for (const matchName of matchNames) {
                    const name = await matchName.evaluate(
                        (el) => el.textContent?.replace(/\s/g, ''),
                    );
                    console.log(name);
                }
                // console.log(
                //     await matchName[0]?.evaluate(
                //         (el) => el.textContent?.replace(/\s/g, ''
                //),
                //     ),
                // );
            }
        }

        /**
         * Cerco un div con id "CALCIO_0", ed all'interno di esso cerco tutti
         * gli a con href che contengono "/sport/CALCIO/".
         * Una volta trovati, mi salvo l'href di ogni a in un array.
         * L'href portebbe tornare null, quindi devo fare un controllo.
         */
        // const links = await page.evaluate(() => {
        //     const links = Array.from(document.querySelectorAll('#CALCIO_0 a'))
        //         .map((a) => a.getAttribute('href'))
        //         .filter((href) => href);
        //     return links;
        // });

        // console.log('Links:', JSON.stringify(links, null, 2));

        await browser.close();
    } catch (error) {
        console.error('Error fetching Snai', error);
        telegramBot.sendGeneralNotification('Error fetching Snai');
    }
}
