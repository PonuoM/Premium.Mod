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

async function seed() {
    try {
        console.log("Creating tables...");
        await client.execute(`
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                category TEXT NOT NULL,
                image TEXT NOT NULL,
                isNew INTEGER DEFAULT 0,
                isBestSeller INTEGER DEFAULT 0
            )
        `);

        await client.execute(`
            CREATE TABLE IF NOT EXISTS hero_slides (
                id INTEGER PRIMARY KEY,
                image TEXT NOT NULL,
                title TEXT NOT NULL,
                subtitle TEXT NOT NULL,
                cta TEXT NOT NULL
            )
        `);

        await client.execute(`
            CREATE TABLE IF NOT EXISTS about_content (
                id TEXT PRIMARY KEY,
                section TEXT NOT NULL,
                content TEXT NOT NULL
            )
        `);

        // Custom Configurator Tables
        await client.execute(`
            CREATE TABLE IF NOT EXISTS custom_skus (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                base_price REAL DEFAULT 0,
                is_active INTEGER DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.execute(`
            CREATE TABLE IF NOT EXISTS custom_parts (
                id TEXT PRIMARY KEY,
                sku_id TEXT NOT NULL,
                name TEXT NOT NULL,
                layer_order INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sku_id) REFERENCES custom_skus(id)
            )
        `);

        await client.execute(`
            CREATE TABLE IF NOT EXISTS custom_options (
                id TEXT PRIMARY KEY,
                part_id TEXT NOT NULL,
                name TEXT NOT NULL,
                image TEXT,
                product_code TEXT,
                price REAL DEFAULT 0,
                sort_order INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (part_id) REFERENCES custom_parts(id)
            )
        `);

        await client.execute(`
            CREATE TABLE IF NOT EXISTS custom_quotes (
                id TEXT PRIMARY KEY,
                sku_id TEXT NOT NULL,
                sku_name TEXT,
                selections TEXT,
                total_price REAL DEFAULT 0,
                customer_name TEXT,
                customer_phone TEXT,
                customer_email TEXT,
                customer_note TEXT,
                preview_image TEXT,
                status TEXT DEFAULT 'pending',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.execute(`
            CREATE TABLE IF NOT EXISTS site_settings (
                id TEXT PRIMARY KEY,
                value TEXT
            )
        `);

        // Default settings
        await client.execute({
            sql: "INSERT OR IGNORE INTO site_settings (id, value) VALUES (?, ?)",
            args: ["custom_page_enabled", "true"]
        });

        console.log("Seeding products...");
        const products = [
            { id: "1", name: "The Structured Wool Coat", price: 1250.00, category: "Outerwear", image: "https://picsum.photos/600/800?random=1" },
            { id: "2", name: "Asymmetric Silk Tunic", price: 480.00, category: "Tops", image: "https://picsum.photos/600/800?random=2", isNew: 1 },
            { id: "3", name: "Pleated Midi Skirt", price: 650.00, category: "Bottoms", image: "https://picsum.photos/600/800?random=3" },
            { id: "4", name: "Cashmere Wrap Sweater", price: 320.00, category: "Knits", image: "https://picsum.photos/600/800?random=4", isBestSeller: 1 },
            { id: "5", name: "Leather Ankle Boots", price: 890.00, category: "Footwear", image: "https://picsum.photos/600/800?random=5" },
            { id: "6", name: "Oversized Blazer", price: 750.00, category: "Outerwear", image: "https://picsum.photos/600/800?random=6" }
        ];

        for (const p of products) {
            await client.execute({
                sql: "INSERT OR REPLACE INTO products (id, name, price, category, image, isNew, isBestSeller) VALUES (?, ?, ?, ?, ?, ?, ?)",
                args: [p.id, p.name, p.price, p.category, p.image, p.isNew || 0, p.isBestSeller || 0]
            });
        }

        console.log("Seeding hero slides...");
        const slides = [
            { id: 1, image: "https://picsum.photos/1920/1080?grayscale&blur=2", title: "Premium Mod", subtitle: "Architectural minimalism for the modern era.", cta: "Explore Collection" },
            { id: 2, image: "https://picsum.photos/1920/1081?grayscale", title: "Autumn Essence", subtitle: "Warmth and texture woven into silence.", cta: "View Lookbook" },
            { id: 3, image: "https://picsum.photos/1920/1082?grayscale", title: "Timeless Leather", subtitle: "Handcrafted perfection that ages with you.", cta: "Shop Accessories" }
        ];

        for (const s of slides) {
            await client.execute({
                sql: "INSERT OR IGNORE INTO hero_slides (id, image, title, subtitle, cta) VALUES (?, ?, ?, ?, ?)",
                args: [s.id, s.image, s.title, s.subtitle, s.cta]
            });
        }

        console.log("Seeding about content...");
        const aboutContent = [
            // Hero Section
            { id: "hero_title", section: "hero", content: "Premium Mod" },
            { id: "hero_subtitle", section: "hero", content: "Elevate Your Style" },
            { id: "hero_tagline", section: "hero", content: "สินค้าคุณภาพ สำหรับผู้ที่มีรสนิยม" },

            // About Section  
            { id: "about_title", section: "about", content: "เกี่ยวกับเรา" },
            { id: "about_description", section: "about", content: "Premium Mod คือแบรนด์สินค้าแฟชั่นที่คัดสรรมาเป็นพิเศษ เราเชื่อในความเรียบง่ายที่หรูหรา และคุณภาพที่ยั่งยืน ทุกชิ้นงานของเราถูกเลือกมาอย่างพิถีพิถัน เพื่อตอบสนองผู้ที่มีรสนิยมและต้องการความแตกต่าง" },
            { id: "about_image", section: "about", content: "https://picsum.photos/800/600?grayscale" },

            // Contact Channels
            { id: "facebook_name", section: "contact", content: "Premium Mod Official" },
            { id: "facebook_url", section: "contact", content: "https://facebook.com/premiummod" },
            { id: "facebook_icon", section: "contact", content: "" },
            { id: "line_id", section: "contact", content: "@premiummod" },
            { id: "line_url", section: "contact", content: "https://line.me/ti/p/@premiummod" },
            { id: "line_icon", section: "contact", content: "" },
            { id: "email", section: "contact", content: "contact@premiummod.com" },
            { id: "email_icon", section: "contact", content: "" },
            { id: "phone", section: "contact", content: "02-xxx-xxxx" },
            { id: "phone_icon", section: "contact", content: "" },

            // Business Info
            { id: "address", section: "business", content: "กรุงเทพมหานคร ประเทศไทย" },
            { id: "hours", section: "business", content: "จันทร์ - ศุกร์ 9:00 - 18:00 น." }
        ];

        for (const item of aboutContent) {
            await client.execute({
                sql: "INSERT OR IGNORE INTO about_content (id, section, content) VALUES (?, ?, ?)",
                args: [item.id, item.section, item.content]
            });
        }

        // Create home_content table
        await client.execute(`
            CREATE TABLE IF NOT EXISTS home_content (
                id TEXT PRIMARY KEY,
                section TEXT NOT NULL,
                content TEXT NOT NULL
            )
        `);

        console.log("Seeding home content...");
        const homeContent = [
            // The Philosophy Section
            { id: "philosophy_label", section: "philosophy", content: "The Philosophy" },
            { id: "philosophy_title", section: "philosophy", content: "Silence over" },
            { id: "philosophy_title_italic", section: "philosophy", content: "noise." },
            { id: "philosophy_description", section: "philosophy", content: "Designed for the discerning few who understand that true luxury lies in what is removed, not what is added. We strip away the unnecessary to reveal the essential beauty of form and function." },
            { id: "philosophy_image", section: "philosophy", content: "https://picsum.photos/800/1000?grayscale" },
            { id: "philosophy_link_text", section: "philosophy", content: "Our Story" },

            // Parallax Quote Section
            { id: "quote_text", section: "quote", content: "Simplicity is the ultimate sophistication." },
            { id: "quote_author", section: "quote", content: "Leonardo da Vinci" },
            { id: "quote_image", section: "quote", content: "https://picsum.photos/1920/1083?grayscale&blur=1" },

            // The Craft Section
            { id: "craft_label", section: "craft", content: "The Craft" },
            { id: "craft_title", section: "craft", content: "Timeless" },
            { id: "craft_title_italic", section: "craft", content: "Elegance." },
            { id: "craft_description", section: "craft", content: "Every piece is a testament to meticulous curation. We partner with master artisans who have honed their skills over generations." },
            { id: "craft_image_1", section: "craft", content: "https://picsum.photos/1000/1000?random=1&grayscale" },
            { id: "craft_image_2", section: "craft", content: "https://picsum.photos/400/400?random=2&grayscale" },
            { id: "craft_stat_1_value", section: "craft", content: "100+" },
            { id: "craft_stat_1_label", section: "craft", content: "Hours of Craft" },
            { id: "craft_stat_2_value", section: "craft", content: "Ltd." },
            { id: "craft_stat_2_label", section: "craft", content: "Editions Only" },
            { id: "craft_button_text", section: "craft", content: "View Collection" }
        ];

        for (const item of homeContent) {
            await client.execute({
                sql: "INSERT OR REPLACE INTO home_content (id, section, content) VALUES (?, ?, ?)",
                args: [item.id, item.section, item.content]
            });
        }

        console.log("Seeding completed successfully!");
    } catch (error) {
        console.error("Seeding failed:", error);
    }
}

seed();
