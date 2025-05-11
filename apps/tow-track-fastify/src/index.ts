import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { config } from "dotenv"; config();

// Импорт роутеров
import router from "./routers";

const app = fastify({ logger: true });
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Регистрация плагинов
app.register(fastifyCors);

// Корневой маршрут
app.get('/', async (_request, _reply) => {
  return { status: "ok" };
});

// Регистрация API роутов
app.register(router, { prefix: '/api' });

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