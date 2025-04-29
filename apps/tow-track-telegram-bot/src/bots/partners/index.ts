import { Context, Hono } from "hono";

import callbacks from "./callbacks";
import commands from "./commans";
import messages from "./messages";

import { Env } from "@types";

// Start a Hono app
const app = new Hono();

// Обработка webhook от Telegram
app.post('/webhook', async (c: Context<{Bindings: Env}>) => {
	try {
		const update = await c.req.json();
		console.log('Received update:', JSON.stringify(update));
		const botToken = "7359280671:AAE5T6qpOT13LKu9y3QSGSGvLZRaAHUqblo";
		const towTrack = c.env.TowTrack;

		const message = update.message || update.edited_message || update.callback_query?.message;
		if (!message?.chat?.id) {
			return c.json({ error: "Invalid Telegram update" }, 400);
		}
		console.log('Received update:', JSON.stringify(update)); 
		
		// Распределение по типам обновлений
		if (update.message && update.message.text && update.message.text.startsWith('/')) {
			// Обработка команд
			const command = update.message.text.split(' ')[0].substring(1);
			const args = update.message.text.split(' ').slice(1);
			await commands(update.message, command, args, botToken, towTrack);
		} else if (update.message) {
			// Обработка обычных сообщений
			await messages(update.message, botToken, towTrack);
		} else if (update.callback_query) {
			// Обработка callback запросов (инлайн кнопки)
			await callbacks(update.callback_query, botToken, towTrack);
		}
		
		return c.json({ ok: true });
	} catch (error) {
		console.error('Error handling webhook:', error);
		return c.json({ ok: false, error: 'Internal server error' }, 500);
	}
});

export default app;
