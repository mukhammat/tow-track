import { PartnerService, PartnerController } from "modules/Partner";
import {OrderController, OrderService, registerOrderEvents} from "./modules/Order";
import { AuthController, AuthService } from "modules/Auth";
import { OfferController, OfferService } from "modules/Offer";

export default {
    createOrder() {
        const orderSrv = new OrderService();
        registerOrderEvents(orderSrv);
        return new OrderController(orderSrv);
    },
    createAuth() {
        const authSrv = new AuthService();
        return new AuthController(authSrv);
    },
    createPartner() {
        const partnerSrv = new PartnerService();
        return new PartnerController(partnerSrv);
    },
    createOffer() {
        const offerSrv = new OfferService();
        return new OfferController(offerSrv);
    }
}