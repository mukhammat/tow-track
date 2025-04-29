import { Hono } from "hono";
import { logger } from 'hono/logger';
import { Env } from "@types";
import clients from "./bots/clients";
import partners from "./bots/partners"

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();
// Middleware для логирования
app.use('*', logger());

app.route('/v1/clients', clients);
app.route('/v1/partners', partners);

export default app;