import { sendKeyboard } from '@utils';

export async function start(chatId: number, userId: number, botToken: string) {
    const welcomeMessage = `
    Привет! 👋 Я бот для работы с вашим сервисом.

    Используйте /help для получения списка доступных команд.
    `;

    const keyboard = [
        [{ text: "Заказать эвакуатор", callback_data: "order" }],
        [{ text: "Статус системы", callback_data: "status" }],
        [{ text: "Помощь", callback_data: "help" }]
    ];

    await sendKeyboard(botToken, chatId, welcomeMessage, keyboard);
}