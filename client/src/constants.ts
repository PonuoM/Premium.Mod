import { Product, Order } from './types';

export const HERO_SLIDES = [
    {
        id: 1,
        image: "https://picsum.photos/1920/1080?grayscale&blur=2",
        title: "Premium Mod",
        subtitle: "Architectural minimalism for the modern era.",
        cta: "Explore Collection"
    },
    {
        id: 2,
        image: "https://picsum.photos/1920/1081?grayscale",
        title: "Autumn Essence",
        subtitle: "Warmth and texture woven into silence.",
        cta: "View Lookbook"
    },
    {
        id: 3,
        image: "https://picsum.photos/1920/1082?grayscale",
        title: "Timeless Leather",
        subtitle: "Handcrafted perfection that ages with you.",
        cta: "Shop Accessories"
    }
];

export const fetchHeroSlides = async (): Promise<any[]> => {
    try {
        const response = await fetch('http://localhost:3002/api/hero-slides');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch hero slides:", error);
        return HERO_SLIDES; // Fallback to static
    }
};

export const addHeroSlide = async (slide: { image: string; title: string; subtitle: string; cta: string }) => {
    const response = await fetch('http://localhost:3002/api/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slide)
    });
    return response.json();
};

export const updateHeroSlide = async (id: number, slide: { image: string; title: string; subtitle: string; cta: string }) => {
    const response = await fetch(`http://localhost:3002/api/hero-slides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slide)
    });
    return response.json();
};

export const deleteHeroSlide = async (id: number) => {
    const response = await fetch(`http://localhost:3002/api/hero-slides/${id}`, {
        method: 'DELETE'
    });
    return response.json();
};

export const uploadImage = async (file: File): Promise<string | null> => {
    // Compress image before upload
    const compressImage = (file: File, maxWidth: number, quality: number): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new window.Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Convert to WebP with compression
                    const base64 = canvas.toDataURL('image/webp', quality).split(',')[1];
                    resolve(base64);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    try {
        // Compress to max 1920px width, 80% quality
        const compressedBase64 = await compressImage(file, 1920, 0.8);

        const response = await fetch('http://localhost:3002/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: compressedBase64 })
        });
        const data = await response.json();
        if (data.success) {
            return data.url;
        } else {
            console.error('Upload failed:', data);
            return null;
        }
    } catch (error) {
        console.error('Upload error:', error);
        return null;
    }
};

export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch('http://localhost:3002/api/products');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data as Product[];
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
};

export const addProduct = async (product: { name: string; price: number; category: string; image: string; isNew?: boolean; isBestSeller?: boolean }) => {
    const response = await fetch('http://localhost:3002/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    return response.json();
};

export const updateProduct = async (id: string, product: { name: string; price: number; category: string; image: string; isNew?: boolean; isBestSeller?: boolean }) => {
    const response = await fetch(`http://localhost:3002/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    return response.json();
};

export const deleteProduct = async (id: string) => {
    const response = await fetch(`http://localhost:3002/api/products/${id}`, {
        method: 'DELETE'
    });
    return response.json();
};

export const fetchAboutContent = async (): Promise<any[]> => {
    try {
        const response = await fetch('http://localhost:3002/api/about');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch about content:", error);
        return [];
    }
};

export const updateAboutContent = async (id: string, content: string) => {
    const response = await fetch(`http://localhost:3002/api/about/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    });
    return response.json();
};

export const fetchHomeContent = async (): Promise<Record<string, string>> => {
    try {
        const response = await fetch('http://localhost:3002/api/home-content');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        // Convert array to object for easier access
        const contentMap: Record<string, string> = {};
        data.forEach((item: { id: string; content: string }) => {
            contentMap[item.id] = item.content;
        });
        return contentMap;
    } catch (error) {
        console.error("Failed to fetch home content:", error);
        return {};
    }
};

export const updateHomeContent = async (id: string, content: string) => {
    const response = await fetch(`http://localhost:3002/api/home-content/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    });
    return response.json();
};

export const PRODUCTS: Product[] = [
    {
        id: "1",
        name: "The Structured Wool Coat",
        price: 1250.00,
        category: "Outerwear",
        image: "https://picsum.photos/600/800?random=1"
    },
    // ... remaining mock data (kept for brevity in constants, but we fetch now)
];

export const MOCK_ORDERS: Order[] = [
    {
        id: "#PM-8829",
        customerName: "Sarah Jenkins",
        email: "sarah@example.com",
        date: "Oct 24, 2023",
        total: 320.00,
        status: "Pending",
        items: 1
    }
];

// ============== CUSTOM CONFIGURATOR APIs ==============

const API_BASE = 'http://localhost:3002/api';

// Settings
export const fetchSettings = async () => {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
};

export const updateSetting = async (id: string, value: string) => {
    const res = await fetch(`${API_BASE}/settings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
    });
    return res.json();
};

// SKUs
export const fetchCustomSkus = async () => {
    const res = await fetch(`${API_BASE}/custom/skus`);
    return res.json();
};

export const fetchActiveSkus = async () => {
    const res = await fetch(`${API_BASE}/custom/skus/active`);
    return res.json();
};

export const fetchCustomSku = async (id: string) => {
    const res = await fetch(`${API_BASE}/custom/skus/${id}`);
    return res.json();
};

export const createCustomSku = async (data: { name: string; base_price: number; is_active: boolean }) => {
    const res = await fetch(`${API_BASE}/custom/skus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
};

export const updateCustomSku = async (id: string, data: { name: string; base_price: number; is_active: boolean }) => {
    const res = await fetch(`${API_BASE}/custom/skus/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
};

export const deleteCustomSku = async (id: string) => {
    const res = await fetch(`${API_BASE}/custom/skus/${id}`, { method: 'DELETE' });
    return res.json();
};

// Parts
export const createCustomPart = async (data: { sku_id: string; name: string; layer_order: number }) => {
    const res = await fetch(`${API_BASE}/custom/parts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
};

export const updateCustomPart = async (id: string, data: { name: string; layer_order: number }) => {
    const res = await fetch(`${API_BASE}/custom/parts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
};

export const deleteCustomPart = async (id: string) => {
    const res = await fetch(`${API_BASE}/custom/parts/${id}`, { method: 'DELETE' });
    return res.json();
};

// Options
export const createCustomOption = async (data: { part_id: string; name: string; image: string; product_code: string; price: number; sort_order: number }) => {
    const res = await fetch(`${API_BASE}/custom/options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
};

export const updateCustomOption = async (id: string, data: { name: string; image: string; product_code: string; price: number; sort_order: number }) => {
    const res = await fetch(`${API_BASE}/custom/options/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
};

export const deleteCustomOption = async (id: string) => {
    const res = await fetch(`${API_BASE}/custom/options/${id}`, { method: 'DELETE' });
    return res.json();
};

// Quotes
export const fetchCustomQuotes = async () => {
    const res = await fetch(`${API_BASE}/custom/quotes`);
    return res.json();
};

export const createCustomQuote = async (data: any) => {
    const res = await fetch(`${API_BASE}/custom/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
};

export const updateCustomQuote = async (id: string, status: string) => {
    const res = await fetch(`${API_BASE}/custom/quotes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    return res.json();
};

export const deleteCustomQuote = async (id: string) => {
    const res = await fetch(`${API_BASE}/custom/quotes/${id}`, { method: 'DELETE' });
    return res.json();
};
