import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const client = createClient({
    url: process.env.TURSO_DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN || "",
});

async function migrate() {
    try {
        console.log("Adding preview_image column to custom_quotes...");
        await client.execute(`ALTER TABLE custom_quotes ADD COLUMN preview_image TEXT`);
        console.log("Migration completed successfully!");
    } catch (error) {
        if (error.message.includes('duplicate column')) {
            console.log("Column preview_image already exists, skipping...");
        } else {
            console.error("Migration failed:", error);
        }
    }
}

migrate();
