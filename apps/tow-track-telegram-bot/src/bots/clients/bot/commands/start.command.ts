import { Context } from "grammy";
import { InlineKeyboard } from "grammy";

export const startCommand = async (ctx: Context) => {
  const keyboard = new InlineKeyboard()
    .text("🚗 Заказать эвакуатор", "order_evacuator")
    .text("📞 Контакты", "contacts")
    .row()
    .text("ℹ️ Помощь", "help");

  await ctx.reply("Выберите действие:", { reply_markup: keyboard });
};
