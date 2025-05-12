import { DrizzleClient, partners } from "@db";
import { RegisterDto } from "."
import { eq } from "drizzle-orm";

export interface IAuthService {
    login(telegram_id: number): Promise<number>
    register(data: RegisterDto): Promise<number>
}

export class AuthService implements IAuthService {
    constructor(
        private db: DrizzleClient
    ) {}

    async login(telegram_id: number) {
        const partner = await this.db.query.partners.findFirst({
            where: eq(partners.telegram_id, telegram_id)
        });
        if(!partner) {
            throw Error("Not found");
        }
        return partner.telegram_id;
    }

    async register(data: RegisterDto) {
        const partner = await this.db.insert(partners).values(data);
        
        return data.telegram_id;
    }
}