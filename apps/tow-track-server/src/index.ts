import { Hono } from "hono";
import router from "./routers"
import { HTTPException } from "hono/http-exception";

// Start a Hono app
const app = new Hono();

app.route("/api", router);
/**
 * /api/orders/create               post
 * /api/orders/all                  get
 * /api/orders/cancel/:orderId      patch
 * /api/orders/complete/:orderId    patch
 * /api/orders/get/:orderId         get
 */

/**
 * /api/auth/login                  post
 * /api/auth/register               post
 */

/**
 * /api/offers/accept/:offerId      patch
 * /api/offers/create               post
 * /api/offers/all/:orderId         post
 */

/**
 * /api/chat/send                   post
 * /api/chat/all/:chatId            get                   
 */

// /api/partner

app.notFound((c) => {
    return c.text('Custom 404 Message', 404)
});

app.onError((err, c) => {
    if(err instanceof  HTTPException) {
        console.error(`${err}`)
        return c.json({"message": err.message}, err.status);
    }

    console.error(`${err}`)
    return c.json({"message": "Ошибка сервера"}, 500);
});

// Export the Hono app
export default app;
