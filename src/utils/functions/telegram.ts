import TelegramBot from 'node-telegram-bot-api';
import moment from 'moment';
import betBurgerBookmakersMap from '@/assets/betburger/bookmakers';

class Telegram {
    token: string;
    chatId: string;
    bot: TelegramBot;

    constructor(token: string, chatId: string) {
        this.token = token;
        this.chatId = chatId;
        this.bot = new TelegramBot(this.token);
    }

    async sendNotification({ arb, bet1, bet2, bet3 }: any): Promise<void> {
        console.log(betBurgerBookmakersMap);
        console.log(bet1);
        const messageTemplate = `
        📈 ROI: ${arb.percent}%
🌐 ${betBurgerBookmakersMap.get(
            bet1.bookmaker_id,
        )} - ${betBurgerBookmakersMap.get(bet2.bookmaker_id)}
🏀 ${arb.league}
📅 ${moment(arb.started_at * 1000).format('DD/MM/YYYY')} | 🕓 ${moment(
            arb.started_at * 1000,
        ).format('HH:mm')}
❱❱ Bet: 1 | [@${bet1.koef}](https://www.youtube.com/watch?v=bdTCz129UNY)
❱❱ Bet: 2 | [@${bet2.koef}](https://www.youtube.com/watch?v=bdTCz129UNY)
`;

        await this.bot.sendMessage(this.chatId, messageTemplate, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
        });
    }

    async sendGeneralNotification(message: string): Promise<void> {
        const messageTemplate = `
            ${message}
        `;

        await this.bot.sendMessage(this.chatId, messageTemplate);
    }
}

export default Telegram;
