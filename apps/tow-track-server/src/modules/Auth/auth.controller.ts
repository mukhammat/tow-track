import { Context, Hono } from "hono"
import { zValidator } from '@hono/zod-validator'
import { IAuthService, RegisterDto, RegisterDtoSchema } from "."

export interface IAuthController {
    readonly router: Hono;
}

export class AuthController {
    public readonly router;
    constructor(private authService: IAuthService) {
        this.router = new Hono();
        this.routers();
    }

    private routers() {
        this.router.post("/login", this.login.bind(this));
        this.router.post("/register", zValidator("json", RegisterDtoSchema), this.register.bind(this));
    }

    private async login(c: Context) {
        const { telegram_id } = await c.req.json();
        console.log("Login controller");
        console.log("telegram_id", telegram_id);
        const auth = await this.authService.login(c.env.DB, telegram_id);
        if(!auth)return c.json({"success": false, "message": "User not found"}, 404);
        return c.json({"success": true, "telegram_id": auth}, 200);
    }

    private async register(c: Context) {
        const data = await c.req.json() as unknown as RegisterDto;
        console.log("Register controller");
        console.log("register data", data);
        const result = await this.authService.register(c.env.DB, data);
        if(!result) return c.json({ success: false, message: "User already exists" }, 409);
        return c.json({ success: result }, 201);
    }
}