import { Bot } from "grammy";
import { session } from "grammy";
import { startCommand } from "./commands/start.command";
//import { helpCommand } from "./commands/help.command";
import { orderEvacuator } from "./callbacks/order_evacuator";

export function createBot(token: string) {
  const bot = new Bot(token);

  bot.use(session({ initial: () => ({}) }));

  bot.command("start", startCommand);
  //bot.command("help", helpCommand);

  bot.callbackQuery("order_evacuator", orderEvacuator);

  return bot;
}
