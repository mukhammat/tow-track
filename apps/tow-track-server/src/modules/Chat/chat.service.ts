import { chats, drizzleClient, messages, offers } from "@db"
import { eq } from "drizzle-orm";
import { NotAvailableException } from "@exceptions";

export interface IChatService {
    createChat(d1: D1Database, offer_id: number): Promise<number>;
    sendMessage(d1: D1Database, data: CreateMessageDto): Promise<GetMesssageType>;
    deleteMessage(d1: D1Database, messageId: number): Promise<number>;
    updateMessage(d1: D1Database, messageId: number, message: string): Promise<number>;
}

export class ChatService implements IChatService {
    constructor() {
    }

    async createChat(d1: D1Database, offerId: number) {
        console.log("Create chat...");
        const db = drizzleClient(d1);

        const offer = await db.query.offers.findFirst({
            where: eq(offers.id, offerId)
        });

        console.log("Checking: is status accepted before...")
        if(offer.status !== "accepted") {
            throw new NotAvailableException({
                entity: "Offer",
                id: offerId
            })
        }

        const chat = await db.insert(chats).values({
            offer_id: offer.id
        }).returning().get();
        console.log("Chat is created");

        return chat.id;
    }

    async sendMessage(d1: D1Database, data: CreateMessageDto) {
        const db = drizzleClient(d1);
        const result = await db.insert(messages).values(data).returning().get();
        return result;
    }

    async deleteMessage(d1: D1Database, messageId: number) {
        const db = drizzleClient(d1);
        const result = await db.delete(messages).where(eq(messages.id, messageId)).returning().get();
        return result.id;
    }

    async updateMessage(d1: D1Database, messageId: number, message: string) {
        const db = drizzleClient(d1);
        const result = await db.update(messages).set({
            message
        }).where(eq(messages.id, messageId)).returning().get();
        return result.id;
    }

    async getMessages(d1: D1Database, chatId: number) {
        const db = drizzleClient(d1);
        const result = await db.query.messages.findMany({
            where: eq(messages.chat_id, chatId)
        });

        if(result.length === 0) {
            throw new NotAvailableException({
                entity: "Chat",
                id: chatId
            })
        }

        return result;
    }
}