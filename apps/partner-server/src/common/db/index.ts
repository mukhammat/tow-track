export * from "./schema";

import * as schema from "./schema";
import { drizzle } from 'drizzle-orm/node-postgres';
import { FastifyPluginAsync } from "fastify";
import { Pool } from "pg";
import fp from 'fastify-plugin';

export type DrizzleClient = ReturnType<typeof createDrizzleClient>;

function createDrizzleClient(connectionString: string) {
  const pool = new Pool({ connectionString });
  return drizzle({
    client:pool,
    schema,
    casing: 'snake_case'
  });
}

interface DrizzlePluginOptions {
  connectionString?: string;
}

const drizzlePlugin: FastifyPluginAsync<DrizzlePluginOptions> = async (fastify, options) => {
  const connectionString = options.connectionString || process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('Database connection string is required');
  }
  
  const db = createDrizzleClient(connectionString);
  
  // Регистрация клиента как декоратора Fastify
  fastify.decorate('db', db);
  
  // Закрытие соединения при завершении работы сервера
  fastify.addHook('onClose', async (instance) => {
    const pool = (db as any).driver?.pool;
    if (pool && typeof pool.end === 'function') {
      await pool.end();
    }
  });
};

// Используем fastify-plugin для доступа к декораторам из других плагинов
export default fp(drizzlePlugin, {
  name: 'drizzle-db'
});

// Декларация типов для Fastify
declare module 'fastify' {
  interface FastifyInstance {
    db: DrizzleClient;
  }
}