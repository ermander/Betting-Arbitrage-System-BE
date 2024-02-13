import axios from 'axios';
import telegramBot from '../index';
import sleep from '@/utils/functions/sleep';
import { Driver } from 'selenium-webdriver/chrome';

export default async function fetchPlanetwin365(): Promise<void> {
    try {
        ('https://www.planetwin365.it/it/scommesse/palinsesto-sport');
    } catch (error) {
        console.error('Error fetching Planetwin365', error);
        telegramBot.sendGeneralNotification('Error fetching Planetwin365');
    }
}
