import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config(); // Look for .env in the root when running from root

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Turso Connection
const client = createClient({
    url: process.env.TURSO_DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN || "",
});

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: !!process.env.TURSO_DATABASE_URL });
});

// Upload image to Cloudinary
app.post('/api/upload-image', async (req, res) => {
    try {
        const { image } = req.body; // base64 image string

        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            return res.status(500).json({ error: 'Cloudinary not configured' });
        }

        const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${image}`, {
            folder: 'premium-mod',
            transformation: [
                { width: 1920, height: 1080, crop: 'limit' }, // Max size
                { quality: 'auto:good' }, // Auto compress
                { fetch_format: 'webp' } // Convert to WebP
            ]
        });

        res.json({ success: true, url: result.secure_url });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ error: "Failed to upload image", details: error.message });
    }
});

// Get Hero Slides
app.get('/api/hero-slides', async (req, res) => {
    try {
        const result = await client.execute("SELECT * FROM hero_slides ORDER BY id");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching hero slides:", error);
        res.status(500).json({ error: "Failed to fetch hero slides" });
    }
});

// Add Hero Slide
app.post('/api/hero-slides', async (req, res) => {
    try {
        const { image, title, subtitle, cta } = req.body;
        const result = await client.execute({
            sql: "INSERT INTO hero_slides (image, title, subtitle, cta) VALUES (?, ?, ?, ?)",
            args: [image, title, subtitle, cta]
        });
        res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
        console.error("Error adding hero slide:", error);
        res.status(500).json({ error: "Failed to add hero slide" });
    }
});

// Update Hero Slide
app.put('/api/hero-slides/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { image, title, subtitle, cta } = req.body;
        await client.execute({
            sql: "UPDATE hero_slides SET image = ?, title = ?, subtitle = ?, cta = ? WHERE id = ?",
            args: [image, title, subtitle, cta, id]
        });
        res.json({ success: true });
    } catch (error) {
        console.error("Error updating hero slide:", error);
        res.status(500).json({ error: "Failed to update hero slide" });
    }
});

// Delete Hero Slide
app.delete('/api/hero-slides/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await client.execute({ sql: "DELETE FROM hero_slides WHERE id = ?", args: [id] });
        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting hero slide:", error);
        res.status(500).json({ error: "Failed to delete hero slide" });
    }
});

// Get Products
app.get('/api/products', async (req, res) => {
    try {
        const result = await client.execute("SELECT * FROM products");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// Add Product
app.post('/api/products', async (req, res) => {
    try {
        const { name, price, category, image, isNew, isBestSeller } = req.body;
        const result = await client.execute({
            sql: "INSERT INTO products (id, name, price, category, image, isNew, isBestSeller) VALUES (?, ?, ?, ?, ?, ?, ?)",
            args: [Date.now().toString(), name, price, category, image, isNew ? 1 : 0, isBestSeller ? 1 : 0]
        });
        res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: "Failed to add product" });
    }
});

// Update Product
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, image, isNew, isBestSeller } = req.body;
        await client.execute({
            sql: "UPDATE products SET name = ?, price = ?, category = ?, image = ?, isNew = ?, isBestSeller = ? WHERE id = ?",
            args: [name, price, category, image, isNew ? 1 : 0, isBestSeller ? 1 : 0, id]
        });
        res.json({ success: true });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Failed to update product" });
    }
});

// Delete Product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await client.execute({ sql: "DELETE FROM products WHERE id = ?", args: [id] });
        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Failed to delete product" });
    }
});

// Get About Content
app.get('/api/about', async (req, res) => {
    try {
        const result = await client.execute("SELECT * FROM about_content");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching about content:", error);
        res.status(500).json({ error: "Failed to fetch about content" });
    }
});

// Update About Content
app.put('/api/about/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        await client.execute({
            sql: "UPDATE about_content SET content = ? WHERE id = ?",
            args: [content, id]
        });
        res.json({ success: true });
    } catch (error) {
        console.error("Error updating about content:", error);
        res.status(500).json({ error: "Failed to update about content" });
    }
});

// Get Home Content
app.get('/api/home-content', async (req, res) => {
    try {
        const result = await client.execute("SELECT * FROM home_content");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching home content:", error);
        res.status(500).json({ error: "Failed to fetch home content" });
    }
});

// Update Home Content
app.put('/api/home-content/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        await client.execute({
            sql: "UPDATE home_content SET content = ? WHERE id = ?",
            args: [content, id]
        });
        res.json({ success: true });
    } catch (error) {
        console.error("Error updating home content:", error);
        res.status(500).json({ error: "Failed to update home content" });
    }
});

// ============== CUSTOM CONFIGURATOR APIs ==============

// --- Site Settings ---
app.get('/api/settings', async (req, res) => {
    try {
        const result = await client.execute("SELECT * FROM site_settings");
        const settings = {};
        result.rows.forEach(row => { settings[row.id] = row.value; });
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch settings" });
    }
});

app.put('/api/settings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { value } = req.body;
        await client.execute({
            sql: "INSERT OR REPLACE INTO site_settings (id, value) VALUES (?, ?)",
            args: [id, value]
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to update setting" });
    }
});

// --- Custom SKUs ---
app.get('/api/custom/skus', async (req, res) => {
    try {
        const result = await client.execute("SELECT * FROM custom_skus ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch SKUs" });
    }
});

app.get('/api/custom/skus/active', async (req, res) => {
    try {
        const result = await client.execute("SELECT * FROM custom_skus WHERE is_active = 1 ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch active SKUs" });
    }
});

app.get('/api/custom/skus/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sku = await client.execute({ sql: "SELECT * FROM custom_skus WHERE id = ?", args: [id] });
        const parts = await client.execute({ sql: "SELECT * FROM custom_parts WHERE sku_id = ? ORDER BY layer_order ASC", args: [id] });

        // Get options for each part
        const partsWithOptions = await Promise.all(parts.rows.map(async (part) => {
            const options = await client.execute({ sql: "SELECT * FROM custom_options WHERE part_id = ? ORDER BY sort_order ASC", args: [part.id] });
            return { ...part, options: options.rows };
        }));

        res.json({ ...sku.rows[0], parts: partsWithOptions });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch SKU" });
    }
});

app.post('/api/custom/skus', async (req, res) => {
    try {
        const { name, base_price, is_active } = req.body;
        const id = Date.now().toString();
        await client.execute({
            sql: "INSERT INTO custom_skus (id, name, base_price, is_active) VALUES (?, ?, ?, ?)",
            args: [id, name, base_price || 0, is_active ? 1 : 0]
        });
        res.json({ id, success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to create SKU" });
    }
});

app.put('/api/custom/skus/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, base_price, is_active } = req.body;
        await client.execute({
            sql: "UPDATE custom_skus SET name = ?, base_price = ?, is_active = ? WHERE id = ?",
            args: [name, base_price || 0, is_active ? 1 : 0, id]
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to update SKU" });
    }
});

app.delete('/api/custom/skus/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Delete options first
        await client.execute({ sql: "DELETE FROM custom_options WHERE part_id IN (SELECT id FROM custom_parts WHERE sku_id = ?)", args: [id] });
        // Delete parts
        await client.execute({ sql: "DELETE FROM custom_parts WHERE sku_id = ?", args: [id] });
        // Delete SKU
        await client.execute({ sql: "DELETE FROM custom_skus WHERE id = ?", args: [id] });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete SKU" });
    }
});

// --- Custom Parts ---
app.post('/api/custom/parts', async (req, res) => {
    try {
        const { sku_id, name, layer_order } = req.body;
        const id = Date.now().toString();
        await client.execute({
            sql: "INSERT INTO custom_parts (id, sku_id, name, layer_order) VALUES (?, ?, ?, ?)",
            args: [id, sku_id, name, layer_order || 0]
        });
        res.json({ id, success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to create part" });
    }
});

app.put('/api/custom/parts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, layer_order } = req.body;
        await client.execute({
            sql: "UPDATE custom_parts SET name = ?, layer_order = ? WHERE id = ?",
            args: [name, layer_order || 0, id]
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to update part" });
    }
});

app.delete('/api/custom/parts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await client.execute({ sql: "DELETE FROM custom_options WHERE part_id = ?", args: [id] });
        await client.execute({ sql: "DELETE FROM custom_parts WHERE id = ?", args: [id] });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete part" });
    }
});

// --- Custom Options ---
app.post('/api/custom/options', async (req, res) => {
    try {
        const { part_id, name, image, product_code, price, sort_order } = req.body;
        const id = Date.now().toString();
        await client.execute({
            sql: "INSERT INTO custom_options (id, part_id, name, image, product_code, price, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
            args: [id, part_id, name, image || '', product_code || '', price || 0, sort_order || 0]
        });
        res.json({ id, success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to create option" });
    }
});

app.put('/api/custom/options/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, product_code, price, sort_order } = req.body;
        await client.execute({
            sql: "UPDATE custom_options SET name = ?, image = ?, product_code = ?, price = ?, sort_order = ? WHERE id = ?",
            args: [name, image || '', product_code || '', price || 0, sort_order || 0, id]
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to update option" });
    }
});

app.delete('/api/custom/options/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await client.execute({ sql: "DELETE FROM custom_options WHERE id = ?", args: [id] });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete option" });
    }
});

// --- Custom Quotes ---
app.get('/api/custom/quotes', async (req, res) => {
    try {
        const result = await client.execute("SELECT * FROM custom_quotes ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch quotes" });
    }
});

app.get('/api/custom/quotes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await client.execute({
            sql: "SELECT * FROM custom_quotes WHERE id = ?",
            args: [id]
        });
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Quote not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch quote" });
    }
});

app.post('/api/custom/quotes', async (req, res) => {
    try {
        const { sku_id, sku_name, selections, total_price, customer_name, customer_phone, customer_email, customer_note, preview_image } = req.body;
        const id = Date.now().toString();
        await client.execute({
            sql: "INSERT INTO custom_quotes (id, sku_id, sku_name, selections, total_price, customer_name, customer_phone, customer_email, customer_note, preview_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            args: [id, sku_id, sku_name, JSON.stringify(selections), total_price || 0, customer_name, customer_phone, customer_email, customer_note || '', preview_image || '']
        });
        res.json({ id, success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to create quote" });
    }
});

app.put('/api/custom/quotes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await client.execute({
            sql: "UPDATE custom_quotes SET status = ? WHERE id = ?",
            args: [status, id]
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to update quote" });
    }
});

app.delete('/api/custom/quotes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await client.execute({ sql: "DELETE FROM custom_quotes WHERE id = ?", args: [id] });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete quote" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
