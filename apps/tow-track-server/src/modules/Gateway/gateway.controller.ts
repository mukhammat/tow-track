import { Hono, Context } from "hono";

export class GatewayController {
    public readonly router;
    constructor() {
        this.router = new Hono();
        this.routers();
    }

    private routers() {
    }
}