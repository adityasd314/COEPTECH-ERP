import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {users} from "./schema"
import { response } from "express";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

const response = await db.select().from(users)
console.log(response)
