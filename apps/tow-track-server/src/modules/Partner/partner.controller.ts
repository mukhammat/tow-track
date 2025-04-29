import { Hono, Context } from "hono"
import { IPartnerService } from "."

export interface IPartnerController {
    readonly router: Hono;
}

export class PartnerController {
    public readonly router;
    constructor(private partnerService: IPartnerService) {
        this.router = new Hono();
        this.routers();
    }

    private routers() {
    }

}