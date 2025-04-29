import { Hono } from "hono";
import router from "./routers"

// Start a Hono app
const app = new Hono();

/**
 * /createOrder
 * /updateOrder
 * /getOrders
 * /createChat
 * /setPartner
 * /changeStatus
 */

app.route("/api", router);
app.notFound((c) => {
    return c.text('Custom 404 Message', 404)
});
app.onError((err, c) => {
    console.error(`${err}`)
    return c.json({"message": "Ошибка сервера"}, 500);
});

// Export the Hono app
export default app;
