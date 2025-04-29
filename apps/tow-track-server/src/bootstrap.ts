import { PartnerService, PartnerController } from "modules/Partner";
import {OrderController, OrderService} from "./modules/Order";
import { AuthController, AuthService } from "modules/Auth";

export default {
    createOrder() {
        const orderSrv = new OrderService();
        return new OrderController(orderSrv);
    },
    createAuth() {
        const authSrv = new AuthService();
        return new AuthController(authSrv);
    },
    createPartner() {
        const partnerSrv = new PartnerService();
        return new PartnerController(partnerSrv);
    }
}