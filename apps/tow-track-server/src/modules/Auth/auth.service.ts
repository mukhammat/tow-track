import { drizzleClient, partners } from "@db"
import { RegisterDto } from "."
import { eq } from "drizzle-orm";

export interface IAuthService {
    login(d1: D1Database, telegram_id: number): Promise<number | false>
    register(d1: D1Database, data: RegisterDto): Promise<boolean>
}

export class AuthService implements IAuthService {
    constructor() {}

    async login(d1: D1Database, telegram_id: number) {
        const db = drizzleClient(d1);
        const partner = await db.query.partners.findFirst({
            where: eq(partners.telegram_id, telegram_id)
        });
        return partner?.telegram_id || false;
    }

    async register(d1: D1Database, data: RegisterDto) {
        console.log(data)
        const db = drizzleClient(d1);
        const partner = await db.insert(partners).values(data);
        return partner.success;
    }
}