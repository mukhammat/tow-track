import { drizzleClient, partners } from "@db"
import { CreatePartnerDto, GetPartnerDto, UpdatePartnerDto } from "."
import { eq } from "drizzle-orm";

export interface IPartnerService {
    updatePhone(d1: D1Database, partner_id: number, phone: string): Promise<GetPartnerDto>;
}

export class PartnerService implements IPartnerService {
    constructor() {}

    public async updatePhone(d1: D1Database, partner_id: number, phone: string) {
        const partner = await this.updateParner(d1, partner_id, {  phone});
        return partner;
    }

    private async updateParner(d1: D1Database, partner_id: number, data: UpdatePartnerDto) {
        const db = drizzleClient(d1);
        const partner = await db.update(partners).set(data).where(eq(partners.id, partner_id)).returning().get();
        return partner;
    }
}