import { Hono, Context } from "hono";
import { zValidator } from "@hono/zod-validator";
import { IPartnerService, PhoneSchema } from "."
import { ICustomResponse } from "@utils";


export interface IPartnerController {
    readonly router: Hono;
}

export class PartnerController {
    public readonly router;
    constructor(
        private partnerService: IPartnerService,
        private customResponse: ICustomResponse,
    ) {
        this.router = new Hono();
        this.routers();
    }

    private routers() {
        this.router.patch("/update-phone", zValidator("json", PhoneSchema), this.updatePhone.bind(this));
    }

    private async updatePhone(c: Context) {
        const { id } = c.get("partner");
        const { phone } = await c.req.json();
        const partner = await this.partnerService.updatePhone(c.env.DB, id, phone);
        return c.json(...this.customResponse.success({data: { partnerId: partner.id }}));
    }
}