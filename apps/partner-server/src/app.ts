import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from "@fastify/cookie"
import {FastifyReply, FastifyRequest } from "fastify";
import { config } from "dotenv"; config();
import { HttpResponse } from "@utils";
const httpResponse = new HttpResponse

// Импорт роутеров
import plugins from "./plugins";

const app = fastify({ logger: true });

// Регистрация плагинов
app.register(fastifyCors);
app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || 'a-very-secret-cookie-key'
});
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'super-secret-key',
});
app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.send(err)
  }
});

// Регистрация API роутов
app.register(plugins, { prefix: '/api' });

// Корневой маршрут
app.get('/health', async (_request, _reply) => {
  return { status: "ok" };
});

app.setErrorHandler((err, req, reply) => {
  if (err.validation) {
    return reply.status(400).send({ success: false, errors: err.validation });
  }
  const [payload, status] = httpResponse.error({});
  reply.status(status).send(payload);
});

app.setNotFoundHandler((_request, reply) => {
  const [payload, status] = httpResponse.error({status: 404, message: "Not found!"});
  reply.status(status).send(payload);
});

export default app;