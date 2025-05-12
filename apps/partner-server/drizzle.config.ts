import { defineConfig } from "drizzle-kit";
console.log('DATABASE_URL', process.env.DATABASE_URL);
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/common/db/pg/schema',
  out: './migrations',
  dbCredentials:{
    url: process.env.DATABASE_URL || "false",
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  }
});