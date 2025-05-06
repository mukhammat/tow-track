import { eventBus } from "@libs";
import { IChatService } from ".";

// chat.events.ts
export function registerChatEvents(orderService: IChatService) {
  eventBus.on("offer.accepted", async ({ offerId, db }) => {
    await orderService.createChat(db, offerId); // если метод приватный
  });
}