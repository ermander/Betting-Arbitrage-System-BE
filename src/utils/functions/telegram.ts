import TelegramBot from 'node-telegram-bot-api';
import moment from 'moment';

class Telegram {
    token: string;
    chatId: string;

    constructor(token: string, chatId: string) {
        this.token = token;
        this.chatId = chatId;
        this.start();
    }

    start(): void {
        const bot: TelegramBot = new TelegramBot(this.token);
    }

    async sendNotification({ arb, bet1, bet2, bet3 }: any): Promise<void> {
        const bot: TelegramBot = new TelegramBot(this.token, {
            polling: false,
        });

        console.log(arb, bet1, bet2, bet3);

        const messageTemplate = `

            📈 ROI: ${arb.percent}%
        🌐 BetinAsia - Sisal
        🏀 ${arb.league}
        📅 ${new Date(arb.started_at)}

        ➡️ ${arb.home} v ${arb.away}
        `;

        await bot.sendMessage(this.chatId, messageTemplate);
    }
}

export default Telegram;
