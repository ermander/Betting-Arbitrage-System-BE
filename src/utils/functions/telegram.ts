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

    async sendGeneralNotification(
        message: string,
        chatId: string = this.chatId,
        reply_to_message_id: undefined | number = undefined,
    ): Promise<void> {
        try {
            const messageTemplate = message;
            await this.bot.sendMessage(chatId, messageTemplate, {
                parse_mode: 'Markdown',
                disable_web_page_preview: true,
                reply_to_message_id,
            });
        } catch (error) {
            console.log('Error sending general notification', error);
        }
    }
}

export default Telegram;
