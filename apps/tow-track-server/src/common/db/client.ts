// db.ts
import { drizzle } from "drizzle-orm/d1";
import * as schema from "."

export const drizzleClient = (db: D1Database) => {
  return drizzle(db, {
    schema
  });
};