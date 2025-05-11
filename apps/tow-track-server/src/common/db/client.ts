// db.ts
import { drizzle } from "drizzle-orm/d1";
import * as schema from "."

export const drizzleClient = (db: D1Database) => {
  return drizzle(db, {
    schema
  });
};

const globalDb = globalThis.db as D1Database | undefined;
export const db = () => {
  return drizzle(globalDb, {schema});
}