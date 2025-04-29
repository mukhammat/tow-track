import { Hono } from "hono";

const router = new Hono();

import bootstrap  from "./bootstrap";

const orderRouter = bootstrap.createOrder().router;
const authRouter = bootstrap.createAuth().router;

router.route("/orders", orderRouter);
router.route("/auth", authRouter);

export default router;