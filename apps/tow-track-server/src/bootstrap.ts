import { PartnerService, PartnerController } from "modules/Partner";
import {OrderController, OrderService, registerOrderEvents} from "./modules/Order";
import { AuthController, AuthService } from "modules/Auth";
import { OfferController, OfferService } from "modules/Offer";
import { CustomResponse } from "@utils";

export default {
    createOrder() {
        const orderSrv = new OrderService();
        registerOrderEvents(orderSrv);
        const customResponce = new CustomResponse();
        return new OrderController(orderSrv, customResponce);
    },
    createAuth() {
        const authSrv = new AuthService();
        const customResponce = new CustomResponse();
        return new AuthController(authSrv, customResponce);
    },
    createPartner() {
        const partnerSrv = new PartnerService();
        return new PartnerController(partnerSrv);
    },
    createOffer() {
        const offerSrv = new OfferService();
        const customResponce = new CustomResponse();
        return new OfferController(offerSrv, customResponce);
    }
}