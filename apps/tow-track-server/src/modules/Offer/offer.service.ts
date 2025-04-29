import { drizzleClient, offers } from "@db"
import { eq } from "drizzle-orm";
import { CreateOfferDto, GetOfferDto, UpdateOfferDto } from "."

export interface IOfferService {
    create(d1: D1Database, data: CreateOfferDto):Promise<GetOfferDto>
}

export class OfferService {
    constructor() {}

    public async create(d1: D1Database, data: CreateOfferDto) {
        const db = drizzleClient(d1);
        const offer = await db.insert(offers).values(data).returning().get();
        return offer;
    }

    private async update(d1: D1Database, id: number, data: UpdateOfferDto) {
        const db = drizzleClient(d1);
        const offer = await db.update(offers).set(data).where(eq(offers.id, id)).returning().get();
        return offer;
    }
    
    private async findById(d1: D1Database, id: number) {
        const db = drizzleClient(d1);
        const offer = await db.select().from(offers).where(eq(offers.id, id)).get();
        return offer;
    }

    private async findByOrderId(d1: D1Database, orderId: number) {
        const db = drizzleClient(d1);
        const offer = await db.select().from(offers).where(eq(offers.order_id, orderId)).get();
        return offer;
    }

    private async findByPartnerId(d1: D1Database, partnerId: number) {
        const db = drizzleClient(d1);
        const offer = await db.select().from(offers).where(eq(offers.partner_id, partnerId)).get();
        return offer;
    }

}