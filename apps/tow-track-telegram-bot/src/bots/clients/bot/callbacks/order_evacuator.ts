export const orderEvacuator = async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Пожалуйста, отправьте свою геолокацию или укажите адрес.");
};
