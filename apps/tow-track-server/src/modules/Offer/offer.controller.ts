import { Context, Hono } from "hono";
import { IOfferService } from ".";

export interface IOfferController {
    router: Hono;
}

class OfferController {
    public readonly router;
    constructor(private orderService: IOfferService) {
        this.router = new Hono();
        this.routers();
    }

    private routers() {
    }

    async acceptOfferAndOrder(c: Context) {
        const {offerId} = c.req.param();

        await this.orderService.acceptOffer(c.env.DB, Number(offerId));

        return c.json({}, 200);
    }
}