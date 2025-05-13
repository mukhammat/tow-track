import { DrizzleClient, partners } from "@src/common/db";
import { RegisterDto } from "."
import { eq } from "drizzle-orm";
import { JWT } from "@fastify/jwt";

export interface IAuthService {
    login(telegram_id: number): Promise<string>
    register(data: RegisterDto): Promise<string>
}

export class AuthService implements IAuthService {
    constructor(
        private db: DrizzleClient,
        private jwt: JWT
    ) {}

    async login(telegram_id: number) {
        const partner = await this.db.query.partners.findFirst({
            where: eq(partners.telegram_id, telegram_id)
        });
        if(!partner) {
            throw Error("Not found!");
        }

        const token = this.jwt.sign({ telegram_id: partner.telegram_id }, {
            expiresIn: '24h'
        })
        return token;
    }

    async register(data: RegisterDto) {
        const partner = await this.db.insert(partners).values(data).returning({ telegram_id: partners.telegram_id });
        const token = this.jwt.sign({ telegram_id: partner[0].telegram_id }, { expiresIn: '24h' })
        return token;
    }
}