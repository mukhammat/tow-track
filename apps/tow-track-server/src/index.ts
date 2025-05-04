import { Hono } from "hono";
import router from "./routers"
import { HTTPException } from "hono/http-exception";

// Start a Hono app
const app = new Hono();

app.route("/api", router);
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
