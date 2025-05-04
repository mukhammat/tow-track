import { chats, drizzleClient, offers } from "@db"
import { eq } from "drizzle-orm";
import { NotAvailableException } from "@exceptions";

export interface IChatService {
    createChat(d1: D1Database, offer_id: number): Promise<number>;
}

export class ChatService implements IChatService {
    constructor() {
    }

    async createChat(d1: D1Database, offerId: number) {
        const db = drizzleClient(d1);

        const offer = await db.query.offers.findFirst({
            where: eq(offers.id, offerId)
        });

        if(offer.status !== "accepted") {
            throw new NotAvailableException({
                entity: "Offer",
                id: offerId
            })
        }

        const chat = await db.insert(chats).values({
            offer_id: offer.id
        }).returning().get();
        console.log("Offer is created");

        return chat.id;
    }
}