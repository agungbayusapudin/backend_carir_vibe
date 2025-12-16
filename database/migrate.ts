import { db } from "./db";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
    try {
        const migrationFile = path.join(__dirname, "migrations", "002_add_career_features.sql");
        const sql = fs.readFileSync(migrationFile, "utf8");

        console.log("Running migrations...");

        await db.execute(sql);

        console.log("Migrations completed successfully!");
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

runMigrations();
