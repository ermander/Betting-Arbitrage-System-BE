import telegramBot from '../index';
import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import PlanetwinService from '@/resources/planetwin/planetwin.service';

const planetwinService = new PlanetwinService();

export default async function fetchPlanetwin365(): Promise<void> {
    try {
        const options = new chrome.Options();
        // options.addArguments('--headless');
        const driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        await driver.get(
            'https://www.planetwin365.it/it/scommesse/eventi/7937,7944,7882,7909,7916,7918,7910,1332553,8125,7844,7922,7915',
        );

        console.log('Fetching Planetwin365');

        // Trovo tutte le tr di classe "dgAItem"
        const tableRows = await driver.findElements(By.className('dgAItem'));
        const matches = [];

        for (const row of tableRows) {
            const match = await row
                .findElement(By.className('nmInc'))
                .getText();

            const [casa, ospite] = match.split(' - ');
            const data = await row.getAttribute('data-datainizio');
            const odds = await row.findElements(By.className('oddsQ'));

            const matchOdds: string[] = [];
            for (const odd of odds) {
                matchOdds.push(await odd.getText());
            }

            const event = {
                // La key è univoca per ogni evento ed è composta da data, casa e ospite
                key: `${data}-${casa}-${ospite}`,
                data,
                casa,
                ospite,
                odds: {
                    'ESITO FINALE 1X2': [
                        {
                            descrizione: '1',
                            quota: matchOdds[0],
                        },
                        {
                            descrizione: 'X',
                            quota: matchOdds[1],
                        },
                        {
                            descrizione: '2',
                            quota: matchOdds[2],
                        },
                    ],
                    'DOPPIA CHANCE': [
                        {
                            descrizione: '1X',
                            quota: matchOdds[3],
                        },
                        {
                            descrizione: '12',
                            quota: matchOdds[4],
                        },
                        {
                            descrizione: 'X2',
                            quota: matchOdds[5],
                        },
                    ],
                    'U/O 1.5': [
                        {
                            descrizione: 'UNDER',
                            quota: matchOdds[6],
                        },
                        {
                            descrizione: 'OVER',
                            quota: matchOdds[7],
                        },
                    ],
                    'U/O 2.5': [
                        {
                            descrizione: 'UNDER',
                            quota: matchOdds[8],
                        },
                        {
                            descrizione: 'OVER',
                            quota: matchOdds[9],
                        },
                    ],
                    'GOAL/NO GOAL': [
                        {
                            descrizione: 'GOAL',
                            quota: matchOdds[10],
                        },
                        {
                            descrizione: 'NO GOAL',
                            quota: matchOdds[11],
                        },
                    ],
                },
            };

            await planetwinService.createOrUpdatePlanetwin365(event);
        }

        await driver.quit();
        // telegramBot.sendGeneralNotification(matches);
    } catch (error) {
        console.error('Error fetching Planetwin365', error);
        telegramBot.sendGeneralNotification('Error fetching Planetwin365');
    }
}
