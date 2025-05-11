import { Context, Hono } from "hono";
import { webhookCallback } from "grammy";

import { Env } from "@types";
import { createBot } from "./bot";

// Start a Hono app
const app = new Hono();

app.post('/webhook', async (c: Context<{Bindings: Env}>) => {
	const bot = createBot(c.env.TELEGRAM_TOKEN);
	const handleUpdate = webhookCallback(bot, "hono");
	return handleUpdate(c);
});

export default app;