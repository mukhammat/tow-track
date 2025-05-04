import { Hono } from "hono";

const router = new Hono();

import bootstrap  from "./bootstrap";

const orderRouter = bootstrap.createOrder().router;
const authRouter = bootstrap.createAuth().router;
const offerRouter = bootstrap.createOffer().router;
const partnerRouter = bootstrap.createPartner().router;
const chatRouter = bootstrap.createChat().router;

router.route("/orders", orderRouter);
router.route("/auth", authRouter);
router.route("/offers", offerRouter);
router.route("/partner", partnerRouter);
router.route("/chat", chatRouter);

export default router;