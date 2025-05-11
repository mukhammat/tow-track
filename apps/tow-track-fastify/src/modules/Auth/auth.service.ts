import { DrizzleClient, partners } from "@db";
import { RegisterDto } from "."
import { eq } from "drizzle-orm";

export interface IAuthService {
    login(telegram_id: number): Promise<number | false>
    register(data: RegisterDto): Promise<boolean>
}

export class AuthService implements IAuthService {
    constructor(
        private db: DrizzleClient
    ) {}

    async login(telegram_id: number) {
        const partner = await this.db.query.partners.findFirst({
            where: eq(partners.telegram_id, telegram_id)
        });
        return partner?.telegram_id || false;
    }

    async register(data: RegisterDto) {
        const partner = await this.db.insert(partners).values(data).returning();
        return partner ? true : false;
    }
}