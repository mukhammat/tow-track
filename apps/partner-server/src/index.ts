import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from "@fastify/cookie"
import {FastifyReply, FastifyRequest } from "fastify";
import { config } from "dotenv"; config();

// Импорт роутеров
import plugins from "./plugins";

const app = fastify({ logger: true });
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

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

app.setNotFoundHandler((_request, reply) => {
  reply.status(404).send({ message: "Not found" });
});

const start = async () => {
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 Server listening on port ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();