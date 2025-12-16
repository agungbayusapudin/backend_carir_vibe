import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

pool.on("error", (err: Error) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});

export const db = drizzle(pool, { schema });

export async function testConnection() {
    try {
        const client = await pool.connect();
        console.log("✅ Database connected successfully");
        client.release();
        return true;
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        return false;
    }
}
