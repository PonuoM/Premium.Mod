import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Users, BarChart3, Settings, LogOut, Plus, Search, MoreVertical, Trash2, Edit2, X, Check, Save, Image, Home, FileText, Layers, ChevronDown, ChevronUp, ToggleLeft, ToggleRight, Eye, EyeOff, FileQuestion, ZoomIn } from 'lucide-react';
import { MOCK_ORDERS, fetchProducts, fetchHeroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide, uploadImage, fetchHomeContent, updateHomeContent, addProduct, updateProduct, deleteProduct, fetchAboutContent, updateAboutContent, fetchSettings, updateSetting, fetchCustomSkus, fetchCustomSku, createCustomSku, updateCustomSku, deleteCustomSku, createCustomPart, updateCustomPart, deleteCustomPart, createCustomOption, updateCustomOption, deleteCustomOption, fetchCustomQuotes, updateCustomQuote, deleteCustomQuote } from '../constants';
import { Link, useNavigate } from 'react-router-dom';
import { Product, Order, OrderStatus } from '../types';


const Admin: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');

    // State for managing data
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
    const [heroSlides, setHeroSlides] = useState<any[]>([]);
    const [homeContentData, setHomeContentData] = useState<Record<string, string>>({});
    const [aboutContentData, setAboutContentData] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Custom Configurator State
    const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
    const [customSkus, setCustomSkus] = useState<any[]>([]);
    const [customQuotes, setCustomQuotes] = useState<any[]>([]);
    const [expandedSkuId, setExpandedSkuId] = useState<string | null>(null);
    const [expandedPartId, setExpandedPartId] = useState<string | null>(null);
    const [editingSku, setEditingSku] = useState<any | null>(null);
    const [editingPart, setEditingPart] = useState<any | null>(null);
    const [editingOption, setEditingOption] = useState<any | null>(null);

    // Quote Detail Modal State
    const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
    const [previewZoomImages, setPreviewZoomImages] = useState<string[] | null>(null);

    // Fetch data from database on mount
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const [productsData, slidesData, homeData, aboutData, settingsData, skusData, quotesData] = await Promise.all([
                fetchProducts(),
                fetchHeroSlides(),
                fetchHomeContent(),
                fetchAboutContent(),
                fetchSettings(),
                fetchCustomSkus(),
                fetchCustomQuotes()
            ]);
            setProducts(productsData);
            setHeroSlides(slidesData);
            setHomeContentData(homeData);
            // Convert about array to object
            const aboutMap: Record<string, string> = {};
            aboutData.forEach((item: any) => { aboutMap[item.id] = item.content; });
            setAboutContentData(aboutMap);
            setSiteSettings(settingsData);
            setCustomSkus(skusData);
            setCustomQuotes(quotesData);
            setIsLoading(false);
        };
        loadData();
    }, []);

    // Hero Slide Modal State
    const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<any | null>(null);
    const [slideForm, setSlideForm] = useState({ image: '', title: '', subtitle: '', cta: '' });
    const [isUploading, setIsUploading] = useState(false);

    // Product Modal State
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productForm, setProductForm] = useState<Partial<Product>>({
        name: '', price: 0, category: '', image: '', isNew: false, isBestSeller: false
    });

    // --- Actions ---

    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };

    const handleDeleteProduct = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
            const productsData = await fetchProducts();
            setProducts(productsData);
        }
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            // Edit
            await updateProduct(editingProduct.id, {
                name: productForm.name || '',
                price: productForm.price || 0,
                category: productForm.category || '',
                image: productForm.image || '',
                isNew: productForm.isNew || false,
                isBestSeller: productForm.isBestSeller || false
            });
        } else {
            // Add
            await addProduct({
                name: productForm.name || '',
                price: productForm.price || 0,
                category: productForm.category || '',
                image: productForm.image || '',
                isNew: productForm.isNew || false,
                isBestSeller: productForm.isBestSeller || false
            });
        }
        // Refresh data
        const productsData = await fetchProducts();
        setProducts(productsData);
        closeProductModal();
    };

    const openAddProduct = () => {
        setEditingProduct(null);
        setProductForm({ name: '', price: 0, category: '', image: '', isNew: false, isBestSeller: false });
        setIsProductModalOpen(true);
    };

    const openEditProduct = (product: Product) => {
        setEditingProduct(product);
        setProductForm(product);
        setIsProductModalOpen(true);
    };

    const closeProductModal = () => {
        setIsProductModalOpen(false);
        setEditingProduct(null);
    };

    // --- Render Content Sections ---

    const renderOverview = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Total Revenue</p>
                    <div className="flex items-end gap-3">
                        <h3 className="text-3xl font-bold text-charcoal">$42,500</h3>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full mb-1">+12.5%</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Active Orders</p>
                    <div className="flex items-end gap-3">
                        <h3 className="text-3xl font-bold text-charcoal">{orders.filter(o => o.status !== 'Delivered').length}</h3>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full mb-1">Processing</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Total Products</p>
                    <div className="flex items-end gap-3">
                        <h3 className="text-3xl font-bold text-charcoal">{products.length}</h3>
                        <span className="text-xs font-medium text-charcoal bg-gray-100 px-2 py-1 rounded-full mb-1">Items</span>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table (Snippet) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-charcoal">Recent Activity</h3>
                    <button onClick={() => setActiveTab('Orders')} className="text-sm text-primary hover:underline">View All</button>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Order ID</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.slice(0, 3).map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-charcoal">{order.id}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                        ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                            order.status === 'Processing' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    'bg-gray-100 text-gray-700 border-gray-200'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-charcoal text-right">${order.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderOrders = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-serif text-charcoal">
                    Quote Requests & Orders
                    {customQuotes.length > 0 && (
                        <span className="ml-2 text-sm font-normal text-gray-500">({customQuotes.length} รายการ)</span>
                    )}
                </h2>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search quotes..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                    </div>
                </div>
            </div>

            {customQuotes.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
                    <FileQuestion className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">ยังไม่มีคำขอใบเสนอราคา</p>
                    <p className="text-sm">เมื่อลูกค้าส่งคำขอจากหน้า Custom จะแสดงที่นี่</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-4 py-4 font-semibold">Preview</th>
                                <th className="px-4 py-4 font-semibold">Customer</th>
                                <th className="px-4 py-4 font-semibold">Product</th>
                                <th className="px-4 py-4 font-semibold">Date</th>
                                <th className="px-4 py-4 font-semibold">Total</th>
                                <th className="px-4 py-4 font-semibold">Status</th>
                                <th className="px-4 py-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {customQuotes.map((quote: any) => {
                                const createdAt = quote.created_at ? new Date(quote.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
                                return (
                                    <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                                        {/* Preview Image - Rendered from selections */}
                                        <td className="px-4 py-3">
                                            {(() => {
                                                // Parse selections JSON to get images
                                                let selections: any[] = [];
                                                try {
                                                    selections = typeof quote.selections === 'string'
                                                        ? JSON.parse(quote.selections)
                                                        : (quote.selections || []);
                                                } catch (e) {
                                                    selections = [];
                                                }

                                                const images = selections.filter((s: any) => s?.image).map((s: any) => s.image);

                                                if (images.length === 0) {
                                                    return (
                                                        <div className="w-16 h-16 rounded-lg border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-400">
                                                            No Image
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div
                                                        className="relative w-16 h-16 rounded-lg border border-gray-200 bg-[#F9F9F7] overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                                                        onClick={() => setPreviewZoomImages(images)}
                                                        title="คลิกเพื่อขยาย"
                                                    >
                                                        {images.map((img: string, idx: number) => (
                                                            <img
                                                                key={idx}
                                                                src={img}
                                                                alt={`Layer ${idx}`}
                                                                className="absolute inset-0 w-full h-full object-contain"
                                                                style={{ zIndex: idx }}
                                                            />
                                                        ))}
                                                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                            <ZoomIn className="w-5 h-5 text-white drop-shadow-lg" />
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        {/* Customer Info */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                    {quote.customer_name?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-gray-900 font-medium">{quote.customer_name || 'ไม่ระบุชื่อ'}</p>
                                                    <p className="text-xs text-gray-400">{quote.customer_phone || '-'}</p>
                                                    {quote.customer_email && <p className="text-xs text-gray-400">{quote.customer_email}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        {/* Product */}
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-charcoal">{quote.sku_name || 'Custom Order'}</p>
                                            {quote.customer_note && <p className="text-xs text-gray-400 truncate max-w-[150px]" title={quote.customer_note}>📝 {quote.customer_note}</p>}
                                        </td>
                                        {/* Date */}
                                        <td className="px-4 py-3 text-gray-500">{createdAt}</td>
                                        {/* Total */}
                                        <td className="px-4 py-3 font-bold text-charcoal">฿{(quote.total_price || 0).toLocaleString()}</td>
                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <select
                                                value={quote.status || 'pending'}
                                                onChange={async (e) => {
                                                    await updateCustomQuote(quote.id, e.target.value);
                                                    const quotesData = await fetchCustomQuotes();
                                                    setCustomQuotes(quotesData);
                                                }}
                                                className={`text-xs font-medium border rounded px-2 py-1 cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none
                                                    ${quote.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        quote.status === 'contacted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                            quote.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                                                'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                    }`}
                                            >
                                                <option value="pending">รอติดต่อ</option>
                                                <option value="contacted">ติดต่อแล้ว</option>
                                                <option value="completed">เสร็จสิ้น</option>
                                                <option value="cancelled">ยกเลิก</option>
                                            </select>
                                        </td>
                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => navigate(`/quotation/${quote.id}`)}
                                                    className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                                                    title="ดูใบเสนอราคา"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm('ลบคำขอนี้?')) {
                                                            await deleteCustomQuote(quote.id);
                                                            const quotesData = await fetchCustomQuotes();
                                                            setCustomQuotes(quotesData);
                                                        }
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                    title="ลบ"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );


    const renderProducts = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-serif text-charcoal">Product Catalog</h2>
                <button onClick={openAddProduct} className="px-4 py-2 bg-charcoal text-white rounded-lg text-sm font-medium hover:bg-primary transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group relative">
                        <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button onClick={() => openEditProduct(product)} className="p-2 bg-white rounded-full hover:bg-primary hover:text-white transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-charcoal text-sm truncate pr-2">{product.name}</h3>
                                <span className="font-medium text-gray-900 text-sm">${product.price}</span>
                            </div>
                            <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Hero Slides Actions
    const openAddSlide = () => {
        setEditingSlide(null);
        setSlideForm({ image: 'https://picsum.photos/1920/1080?grayscale', title: '', subtitle: '', cta: 'Explore' });
        setIsSlideModalOpen(true);
    };

    const openEditSlide = (slide: any) => {
        setEditingSlide(slide);
        setSlideForm({ image: slide.image, title: slide.title, subtitle: slide.subtitle, cta: slide.cta });
        setIsSlideModalOpen(true);
    };

    const closeSlideModal = () => {
        setIsSlideModalOpen(false);
        setEditingSlide(null);
    };

    const handleSaveSlide = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSlide) {
            await updateHeroSlide(editingSlide.id, slideForm);
        } else {
            await addHeroSlide(slideForm);
        }
        // Refresh data
        const slidesData = await fetchHeroSlides();
        setHeroSlides(slidesData);
        closeSlideModal();
    };

    const handleDeleteSlide = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this slide?')) {
            await deleteHeroSlide(id);
            const slidesData = await fetchHeroSlides();
            setHeroSlides(slidesData);
        }
    };

    const renderHeroSlides = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-serif text-charcoal">Hero Slides</h2>
                <button onClick={openAddSlide} className="px-4 py-2 bg-charcoal text-white rounded-lg text-sm font-medium hover:bg-primary transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Slide
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {heroSlides.map((slide) => (
                    <div key={slide.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group relative">
                        <div className="aspect-video bg-gray-100 relative overflow-hidden">
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button onClick={() => openEditSlide(slide)} className="p-2 bg-white rounded-full hover:bg-primary hover:text-white transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteSlide(slide.id)} className="p-2 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-charcoal text-sm truncate">{slide.title}</h3>
                            <p className="text-xs text-gray-500 truncate">{slide.subtitle}</p>
                            <span className="text-[10px] uppercase tracking-wide text-primary font-bold mt-2 block">{slide.cta}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Handle Home Content Update
    const handleHomeContentUpdate = async (id: string, value: string) => {
        setHomeContentData(prev => ({ ...prev, [id]: value }));
    };

    const saveHomeContent = async () => {
        setIsSaving(true);
        try {
            const promises = Object.entries(homeContentData).map(([id, content]) =>
                updateHomeContent(id, content as string)
            );
            await Promise.all(promises);
            alert('Home content saved successfully!');
        } catch (error) {
            console.error('Error saving home content:', error);
            alert('Failed to save. Please try again.');
        }
        setIsSaving(false);
    };

    const renderHomeContent = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-serif text-charcoal">Home Page Content</h2>
                <button
                    onClick={saveHomeContent}
                    disabled={isSaving}
                    className="px-4 py-2 bg-charcoal text-white rounded-lg text-sm font-medium hover:bg-primary transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save All Changes
                        </>
                    )}
                </button>
            </div>

            {/* The Philosophy Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                <h3 className="font-bold text-charcoal border-b pb-2">📖 The Philosophy Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Label</label>
                        <input
                            type="text"
                            value={homeContentData.philosophy_label || ''}
                            onChange={(e) => handleHomeContentUpdate('philosophy_label', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Link Text</label>
                        <input
                            type="text"
                            value={homeContentData.philosophy_link_text || ''}
                            onChange={(e) => handleHomeContentUpdate('philosophy_link_text', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Title</label>
                        <input
                            type="text"
                            value={homeContentData.philosophy_title || ''}
                            onChange={(e) => handleHomeContentUpdate('philosophy_title', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Title (Italic)</label>
                        <input
                            type="text"
                            value={homeContentData.philosophy_title_italic || ''}
                            onChange={(e) => handleHomeContentUpdate('philosophy_title_italic', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
                    <textarea
                        value={homeContentData.philosophy_description || ''}
                        onChange={(e) => handleHomeContentUpdate('philosophy_description', e.target.value)}
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Image URL</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={homeContentData.philosophy_image || ''}
                            onChange={(e) => handleHomeContentUpdate('philosophy_image', e.target.value)}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                            <Image className="w-4 h-4" />
                            Upload
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const url = await uploadImage(file);
                                        if (url) handleHomeContentUpdate('philosophy_image', url);
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Quote Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                <h3 className="font-bold text-charcoal border-b pb-2">💬 Parallax Quote Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Quote Text</label>
                        <input
                            type="text"
                            value={homeContentData.quote_text || ''}
                            onChange={(e) => handleHomeContentUpdate('quote_text', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Author</label>
                        <input
                            type="text"
                            value={homeContentData.quote_author || ''}
                            onChange={(e) => handleHomeContentUpdate('quote_author', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Background Image URL</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={homeContentData.quote_image || ''}
                            onChange={(e) => handleHomeContentUpdate('quote_image', e.target.value)}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                            <Image className="w-4 h-4" />
                            Upload
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const url = await uploadImage(file);
                                        if (url) handleHomeContentUpdate('quote_image', url);
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* The Craft Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                <h3 className="font-bold text-charcoal border-b pb-2">🎨 The Craft Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Label</label>
                        <input
                            type="text"
                            value={homeContentData.craft_label || ''}
                            onChange={(e) => handleHomeContentUpdate('craft_label', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Button Text</label>
                        <input
                            type="text"
                            value={homeContentData.craft_button_text || ''}
                            onChange={(e) => handleHomeContentUpdate('craft_button_text', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Title</label>
                        <input
                            type="text"
                            value={homeContentData.craft_title || ''}
                            onChange={(e) => handleHomeContentUpdate('craft_title', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Title (Italic)</label>
                        <input
                            type="text"
                            value={homeContentData.craft_title_italic || ''}
                            onChange={(e) => handleHomeContentUpdate('craft_title_italic', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
                    <textarea
                        value={homeContentData.craft_description || ''}
                        onChange={(e) => handleHomeContentUpdate('craft_description', e.target.value)}
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Main Image URL</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={homeContentData.craft_image_1 || ''}
                                onChange={(e) => handleHomeContentUpdate('craft_image_1', e.target.value)}
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                            />
                            <label className="cursor-pointer px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
                                <Image className="w-4 h-4" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const url = await uploadImage(file);
                                            if (url) handleHomeContentUpdate('craft_image_1', url);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Detail Image URL</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={homeContentData.craft_image_2 || ''}
                                onChange={(e) => handleHomeContentUpdate('craft_image_2', e.target.value)}
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                            />
                            <label className="cursor-pointer px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
                                <Image className="w-4 h-4" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const url = await uploadImage(file);
                                            if (url) handleHomeContentUpdate('craft_image_2', url);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Stat 1 Value</label>
                        <input
                            type="text"
                            value={homeContentData.craft_stat_1_value || ''}
                            onChange={(e) => handleHomeContentUpdate('craft_stat_1_value', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Stat 1 Label</label>
                        <input
                            type="text"
                            value={homeContentData.craft_stat_1_label || ''}
                            onChange={(e) => handleHomeContentUpdate('craft_stat_1_label', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Stat 2 Value</label>
                        <input
                            type="text"
                            value={homeContentData.craft_stat_2_value || ''}
                            onChange={(e) => handleHomeContentUpdate('craft_stat_2_value', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Stat 2 Label</label>
                        <input
                            type="text"
                            value={homeContentData.craft_stat_2_label || ''}
                            onChange={(e) => handleHomeContentUpdate('craft_stat_2_label', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    // Handle About/Story Content Update
    const handleAboutContentUpdate = async (id: string, value: string) => {
        setAboutContentData(prev => ({ ...prev, [id]: value }));
    };

    const saveAboutContent = async () => {
        setIsSaving(true);
        try {
            const promises = Object.entries(aboutContentData).map(([id, content]) =>
                updateAboutContent(id, content as string)
            );
            await Promise.all(promises);
            alert('Story content saved successfully!');
        } catch (error) {
            console.error('Error saving about content:', error);
            alert('Failed to save. Please try again.');
        }
        setIsSaving(false);
    };

    const renderStoryContent = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-serif text-charcoal">Story Page Content</h2>
                <button
                    onClick={saveAboutContent}
                    disabled={isSaving}
                    className="px-4 py-2 bg-charcoal text-white rounded-lg text-sm font-medium hover:bg-primary transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? (
                        <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> Saving...</>
                    ) : (
                        <><Save className="w-4 h-4" /> Save All Changes</>
                    )}
                </button>
            </div>

            {/* Hero Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                <h3 className="font-bold text-charcoal border-b pb-2">🎯 Hero Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Title</label>
                        <input type="text" value={aboutContentData.hero_title || ''} onChange={(e) => handleAboutContentUpdate('hero_title', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Subtitle</label>
                        <input type="text" value={aboutContentData.hero_subtitle || ''} onChange={(e) => handleAboutContentUpdate('hero_subtitle', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tagline</label>
                        <input type="text" value={aboutContentData.hero_tagline || ''} onChange={(e) => handleAboutContentUpdate('hero_tagline', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                <h3 className="font-bold text-charcoal border-b pb-2">📖 About Section</h3>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Section Title</label>
                    <input type="text" value={aboutContentData.about_title || ''} onChange={(e) => handleAboutContentUpdate('about_title', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
                    <textarea value={aboutContentData.about_description || ''} onChange={(e) => handleAboutContentUpdate('about_description', e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Image</label>
                    <div className="flex gap-2">
                        <input type="text" value={aboutContentData.about_image || ''} onChange={(e) => handleAboutContentUpdate('about_image', e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" />
                        <label className="cursor-pointer px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors flex items-center gap-1">
                            <Image className="w-4 h-4" />
                            <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const url = await uploadImage(file); if (url) handleAboutContentUpdate('about_image', url); } }} />
                        </label>
                    </div>
                    {aboutContentData.about_image && <img src={aboutContentData.about_image} alt="Preview" className="w-40 h-28 object-cover rounded mt-2" />}
                </div>
            </div>

            {/* Contact Channels */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                <h3 className="font-bold text-charcoal border-b pb-2">📱 Contact Channels</h3>

                {/* Facebook */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-gray-100">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">📘 Facebook Name</label>
                        <input type="text" value={aboutContentData.facebook_name || ''} onChange={(e) => handleAboutContentUpdate('facebook_name', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">📘 Facebook URL</label>
                        <input type="text" value={aboutContentData.facebook_url || ''} onChange={(e) => handleAboutContentUpdate('facebook_url', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">📘 Icon (Optional)</label>
                        <div className="flex gap-2 items-center">
                            <label className="cursor-pointer px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors flex items-center gap-1">
                                <Image className="w-4 h-4" /> Upload
                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const url = await uploadImage(file); if (url) handleAboutContentUpdate('facebook_icon', url); } }} />
                            </label>
                            {aboutContentData.facebook_icon && <img src={aboutContentData.facebook_icon} alt="FB Icon" className="w-8 h-8 object-contain rounded" />}
                        </div>
                    </div>
                </div>

                {/* LINE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-gray-100">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">💚 LINE ID</label>
                        <input type="text" value={aboutContentData.line_id || ''} onChange={(e) => handleAboutContentUpdate('line_id', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">💚 LINE URL</label>
                        <input type="text" value={aboutContentData.line_url || ''} onChange={(e) => handleAboutContentUpdate('line_url', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">💚 Icon (Optional)</label>
                        <div className="flex gap-2 items-center">
                            <label className="cursor-pointer px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors flex items-center gap-1">
                                <Image className="w-4 h-4" /> Upload
                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const url = await uploadImage(file); if (url) handleAboutContentUpdate('line_icon', url); } }} />
                            </label>
                            {aboutContentData.line_icon && <img src={aboutContentData.line_icon} alt="LINE Icon" className="w-8 h-8 object-contain rounded" />}
                        </div>
                    </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">📧 Email</label>
                        <div className="flex gap-2">
                            <input type="email" value={aboutContentData.email || ''} onChange={(e) => handleAboutContentUpdate('email', e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" />
                            <label className="cursor-pointer px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
                                <Image className="w-4 h-4" />
                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const url = await uploadImage(file); if (url) handleAboutContentUpdate('email_icon', url); } }} />
                            </label>
                            {aboutContentData.email_icon && <img src={aboutContentData.email_icon} alt="Email Icon" className="w-8 h-8 object-contain rounded" />}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">📞 Phone</label>
                        <div className="flex gap-2">
                            <input type="text" value={aboutContentData.phone || ''} onChange={(e) => handleAboutContentUpdate('phone', e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" />
                            <label className="cursor-pointer px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
                                <Image className="w-4 h-4" />
                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const url = await uploadImage(file); if (url) handleAboutContentUpdate('phone_icon', url); } }} />
                            </label>
                            {aboutContentData.phone_icon && <img src={aboutContentData.phone_icon} alt="Phone Icon" className="w-8 h-8 object-contain rounded" />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Business Info */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                <h3 className="font-bold text-charcoal border-b pb-2">🏢 Business Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">📍 Address</label>
                        <input type="text" value={aboutContentData.address || ''} onChange={(e) => handleAboutContentUpdate('address', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">🕐 Business Hours</label>
                        <input type="text" value={aboutContentData.hours || ''} onChange={(e) => handleAboutContentUpdate('hours', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                </div>
            </div>
        </div>
    );

    // ============== CUSTOM CONFIGURATOR RENDER ==============
    const reloadCustomData = async () => {
        const [skusData, quotesData] = await Promise.all([fetchCustomSkus(), fetchCustomQuotes()]);
        setCustomSkus(skusData);
        setCustomQuotes(quotesData);
    };

    const handleToggleCustomPage = async () => {
        const newValue = siteSettings.custom_page_enabled === 'true' ? 'false' : 'true';
        await updateSetting('custom_page_enabled', newValue);
        setSiteSettings(prev => ({ ...prev, custom_page_enabled: newValue }));
    };

    const handleCreateSku = async () => {
        const name = prompt('Enter SKU name:');
        if (!name) return;
        await createCustomSku({ name, base_price: 0, is_active: true });
        reloadCustomData();
    };

    const handleDeleteSku = async (id: string) => {
        if (!confirm('Delete this SKU and all its parts/options?')) return;
        await deleteCustomSku(id);
        reloadCustomData();
    };

    const handleCreatePart = async (skuId: string) => {
        const name = prompt('Enter Part name (e.g., Case, Bracelet):');
        if (!name) return;
        const maxOrder = customSkus.find(s => s.id === skuId)?.parts?.length || 0;
        await createCustomPart({ sku_id: skuId, name, layer_order: maxOrder });
        const updated = await fetchCustomSku(skuId);
        setCustomSkus(prev => prev.map(s => s.id === skuId ? { ...s, parts: updated.parts } : s));
    };

    const handleDeletePart = async (partId: string, skuId: string) => {
        if (!confirm('Delete this part and all its options?')) return;
        await deleteCustomPart(partId);
        const updated = await fetchCustomSku(skuId);
        setCustomSkus(prev => prev.map(s => s.id === skuId ? { ...s, parts: updated.parts } : s));
    };

    const handleMovePartLayer = async (skuId: string, partId: string, direction: 'up' | 'down') => {
        const sku = customSkus.find(s => s.id === skuId);
        if (!sku?.parts) return;

        const sortedParts = [...sku.parts].sort((a: any, b: any) => a.layer_order - b.layer_order);
        const idx = sortedParts.findIndex((p: any) => p.id === partId);

        if (direction === 'up' && idx > 0) {
            const current = sortedParts[idx];
            const prev = sortedParts[idx - 1];
            await updateCustomPart(current.id, { name: current.name, layer_order: prev.layer_order });
            await updateCustomPart(prev.id, { name: prev.name, layer_order: current.layer_order });
        } else if (direction === 'down' && idx < sortedParts.length - 1) {
            const current = sortedParts[idx];
            const next = sortedParts[idx + 1];
            await updateCustomPart(current.id, { name: current.name, layer_order: next.layer_order });
            await updateCustomPart(next.id, { name: next.name, layer_order: current.layer_order });
        }

        const updated = await fetchCustomSku(skuId);
        setCustomSkus(prev => prev.map(s => s.id === skuId ? { ...s, parts: updated.parts } : s));
    };

    const handleCreateOption = async (partId: string, skuId: string) => {
        const name = prompt('Enter Option name:');
        if (!name) return;
        await createCustomOption({ part_id: partId, name, image: '', product_code: '', price: 0, sort_order: 0 });
        const updated = await fetchCustomSku(skuId);
        setCustomSkus(prev => prev.map(s => s.id === skuId ? { ...s, parts: updated.parts } : s));
    };

    const handleDeleteOption = async (optionId: string, skuId: string) => {
        if (!confirm('Delete this option?')) return;
        await deleteCustomOption(optionId);
        const updated = await fetchCustomSku(skuId);
        setCustomSkus(prev => prev.map(s => s.id === skuId ? { ...s, parts: updated.parts } : s));
    };

    const handleOptionImageUpload = async (optionId: string, file: File, skuId: string) => {
        const url = await uploadImage(file);
        if (!url) return;
        // Get current option data
        const sku = customSkus.find(s => s.id === skuId);
        for (const part of sku?.parts || []) {
            const opt = part.options?.find((o: any) => o.id === optionId);
            if (opt) {
                await updateCustomOption(optionId, { ...opt, image: url });
                break;
            }
        }
        const updated = await fetchCustomSku(skuId);
        setCustomSkus(prev => prev.map(s => s.id === skuId ? { ...s, parts: updated.parts } : s));
    };

    const renderCustomConfigurator = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header with toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold font-serif text-charcoal">Custom Configurator</h2>
                    <p className="text-sm text-gray-500">Manage SKUs, Parts, and Options for product customization</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleToggleCustomPage}
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${siteSettings.custom_page_enabled === 'true' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                    >
                        {siteSettings.custom_page_enabled === 'true' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        {siteSettings.custom_page_enabled === 'true' ? 'Visible on Navbar' : 'Hidden from Navbar'}
                    </button>
                    <button onClick={handleCreateSku} className="px-4 py-2 bg-charcoal text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary transition-colors">
                        <Plus className="w-4 h-4" /> Add SKU
                    </button>
                </div>
            </div>

            {/* SKUs List */}
            {customSkus.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No SKUs yet. Click "Add SKU" to create your first one.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {customSkus.map(sku => (
                        <div key={sku.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                            {/* SKU Header */}
                            <div
                                onClick={async () => {
                                    if (expandedSkuId === sku.id) {
                                        setExpandedSkuId(null);
                                    } else {
                                        const full = await fetchCustomSku(sku.id);
                                        setCustomSkus(prev => prev.map(s => s.id === sku.id ? full : s));
                                        setExpandedSkuId(sku.id);
                                    }
                                }}
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-3">
                                    <Layers className="w-5 h-5 text-primary" />
                                    <div>
                                        <h3 className="font-bold text-charcoal">{sku.name}</h3>
                                        <p className="text-xs text-gray-500">Base: ฿{(sku.base_price || 0).toLocaleString()} • {sku.is_active ? '🟢 Active' : '🔴 Inactive'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteSku(sku.id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                    {expandedSkuId === sku.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                </div>
                            </div>

                            {/* SKU Expanded - Parts */}
                            {expandedSkuId === sku.id && (
                                <div className="border-t border-gray-100 p-4 bg-gray-50">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-sm text-charcoal">Parts (Layer Order ↓)</h4>
                                        <button onClick={() => handleCreatePart(sku.id)} className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium flex items-center gap-1">
                                            <Plus className="w-3 h-3" /> Add Part
                                        </button>
                                    </div>

                                    {(!sku.parts || sku.parts.length === 0) ? (
                                        <p className="text-sm text-gray-400 text-center py-4">No parts yet. Add parts to start.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {sku.parts.slice().sort((a: any, b: any) => b.layer_order - a.layer_order).map((part: any, idx: number, arr: any[]) => (
                                                <div key={part.id} className="bg-white rounded-lg border border-gray-100">
                                                    {/* Part Header */}
                                                    <div
                                                        onClick={() => setExpandedPartId(expandedPartId === part.id ? null : part.id)}
                                                        className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded font-medium">{idx === 0 ? '🔝 บนสุด' : idx === arr.length - 1 ? '🔻 ล่างสุด' : `Layer ${part.layer_order}`}</span>
                                                            <span className="font-medium text-charcoal">{part.name}</span>
                                                            <span className="text-xs text-gray-400">({part.options?.length || 0} options)</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleMovePartLayer(sku.id, part.id, 'down'); }}
                                                                disabled={idx === 0}
                                                                className={`p-1 rounded ${idx === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-200'}`}
                                                                title="Move up (higher layer)"
                                                            >
                                                                <ChevronUp className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleMovePartLayer(sku.id, part.id, 'up'); }}
                                                                disabled={idx === arr.length - 1}
                                                                className={`p-1 rounded ${idx === arr.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-200'}`}
                                                                title="Move down (lower layer)"
                                                            >
                                                                <ChevronDown className="w-3 h-3" />
                                                            </button>
                                                            <button onClick={(e) => { e.stopPropagation(); handleDeletePart(part.id, sku.id); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3" /></button>
                                                            {expandedPartId === part.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                                        </div>
                                                    </div>

                                                    {/* Part Options */}
                                                    {expandedPartId === part.id && (
                                                        <div className="border-t border-gray-100 p-3 bg-gray-50">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <span className="text-xs font-bold text-gray-500">OPTIONS</span>
                                                                <button onClick={() => handleCreateOption(part.id, sku.id)} className="px-2 py-1 bg-charcoal text-white rounded text-xs flex items-center gap-1">
                                                                    <Plus className="w-3 h-3" /> Add
                                                                </button>
                                                            </div>
                                                            {(!part.options || part.options.length === 0) ? (
                                                                <p className="text-xs text-gray-400 text-center py-2">No options</p>
                                                            ) : (
                                                                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2">
                                                                    {part.options.map((opt: any) => (
                                                                        <div key={opt.id} className="bg-white border border-gray-200 rounded p-1.5 text-center relative group">
                                                                            <div className="w-full aspect-square bg-gray-100 rounded overflow-hidden mb-1 flex items-center justify-center">
                                                                                {opt.image ? (
                                                                                    <img src={opt.image} alt={opt.name} className="w-full h-full object-contain" />
                                                                                ) : (
                                                                                    <label className="cursor-pointer flex flex-col items-center text-gray-400">
                                                                                        <Image className="w-4 h-4" />
                                                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleOptionImageUpload(opt.id, f, sku.id); }} />
                                                                                    </label>
                                                                                )}
                                                                            </div>
                                                                            <p className="text-[10px] font-medium text-charcoal truncate">{opt.name}</p>
                                                                            <input
                                                                                type="text"
                                                                                defaultValue={opt.product_code || ''}
                                                                                placeholder="Code"
                                                                                onBlur={async (e) => { await updateCustomOption(opt.id, { ...opt, product_code: e.target.value }); const updated = await fetchCustomSku(sku.id); setCustomSkus(prev => prev.map(s => s.id === sku.id ? { ...s, parts: updated.parts } : s)); }}
                                                                                className="w-full text-[9px] text-gray-500 border-b border-transparent hover:border-gray-200 focus:border-primary outline-none text-center bg-transparent"
                                                                            />
                                                                            <input
                                                                                type="number"
                                                                                defaultValue={opt.price || 0}
                                                                                placeholder="Price"
                                                                                onBlur={async (e) => { await updateCustomOption(opt.id, { ...opt, price: parseFloat(e.target.value) || 0 }); const updated = await fetchCustomSku(sku.id); setCustomSkus(prev => prev.map(s => s.id === sku.id ? { ...s, parts: updated.parts } : s)); }}
                                                                                className="w-full text-[10px] text-primary font-medium border-b border-transparent hover:border-gray-200 focus:border-primary outline-none text-center bg-transparent"
                                                                            />
                                                                            <button
                                                                                onClick={() => handleDeleteOption(opt.id, sku.id)}
                                                                                className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                            >
                                                                                <X className="w-2.5 h-2.5" />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )
            }

            {/* Quotes Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <FileQuestion className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-charcoal">Quote Requests ({customQuotes.length})</h3>
                </div>
                {customQuotes.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No quote requests yet.</p>
                ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {customQuotes.map(q => (
                            <div key={q.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-start">
                                <div>
                                    <p className="font-medium text-charcoal">{q.customer_name || 'Unknown'} • {q.customer_phone}</p>
                                    <p className="text-xs text-gray-500">{q.sku_name} • ฿{(q.total_price || 0).toLocaleString()}</p>
                                    <p className="text-xs text-gray-400">{new Date(q.created_at).toLocaleString('th-TH')}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${q.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                    {q.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );

    const renderPlaceholder = (title: string) => (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 animate-in fade-in duration-500">
            <Settings className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-xl font-bold text-gray-300">{title} Module</h2>
            <p className="text-sm">This section is under development.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-charcoal">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 z-30 hidden lg:flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold font-serif">P</div>
                    <div>
                        <h3 className="font-bold text-sm">Admin Console</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Premium Mod</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {[
                        { name: 'Overview', icon: LayoutDashboard },
                        { name: 'Orders', icon: ShoppingCart, count: customQuotes.filter((q: any) => q.status === 'pending' || !q.status).length },
                        { name: 'Products', icon: Package, count: products.length },
                        { name: 'Hero Slides', icon: Image, count: heroSlides.length },
                        { name: 'Home Content', icon: Home },
                        { name: 'Story Content', icon: FileText },
                        { name: 'Custom Configurator', icon: Layers },
                        { name: 'Customers', icon: Users },
                        { name: 'Analytics', icon: BarChart3 },
                        { name: 'Settings', icon: Settings },
                    ].map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.name
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-charcoal'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                            {item.count !== undefined && item.count > 0 && (
                                <span className="ml-auto bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.count}</span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Link to="/" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-500">
                        <LogOut className="w-5 h-5" />
                        Back to Store
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-8">
                {/* Mobile Header (simplified) */}
                <div className="lg:hidden mb-6 flex justify-between items-center">
                    <span className="font-bold text-lg">Admin Console</span>
                    <button className="p-2 border rounded"><MoreVertical className="w-5 h-5" /></button>
                </div>

                {activeTab === 'Overview' && renderOverview()}
                {activeTab === 'Orders' && renderOrders()}
                {activeTab === 'Products' && renderProducts()}
                {activeTab === 'Hero Slides' && renderHeroSlides()}
                {activeTab === 'Home Content' && renderHomeContent()}
                {activeTab === 'Story Content' && renderStoryContent()}
                {activeTab === 'Custom Configurator' && renderCustomConfigurator()}
                {activeTab === 'Customers' && renderPlaceholder('Customers')}
                {activeTab === 'Analytics' && renderPlaceholder('Analytics')}
                {activeTab === 'Settings' && renderPlaceholder('Settings')}
            </main>

            {/* Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <button onClick={closeProductModal} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={productForm.name}
                                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Category</label>
                                    <select
                                        value={productForm.category}
                                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none bg-white"
                                    >
                                        <option value="">Select...</option>
                                        <option value="Outerwear">Outerwear</option>
                                        <option value="Tops">Tops</option>
                                        <option value="Bottoms">Bottoms</option>
                                        <option value="Knits">Knits</option>
                                        <option value="Footwear">Footwear</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Image</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={productForm.image}
                                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                        placeholder="https://... or upload below"
                                    />
                                </div>
                                <div className="mt-2">
                                    <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isUploading ? 'bg-gray-300 cursor-wait' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                        {isUploading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Image className="w-4 h-4" />
                                                Upload Image
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            disabled={isUploading}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setIsUploading(true);
                                                    const url = await uploadImage(file);
                                                    setIsUploading(false);
                                                    if (url) {
                                                        setProductForm({ ...productForm, image: url });
                                                    } else {
                                                        alert('Upload failed! Please try again.');
                                                    }
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                            {productForm.image && (
                                <div className="aspect-[3/4] max-w-[200px] rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                    <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}

                            {/* Tags */}
                            <div className="flex gap-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={productForm.isNew || false}
                                        onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm font-medium text-charcoal">🆕 New</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={productForm.isBestSeller || false}
                                        onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm font-medium text-charcoal">⭐ Best Seller</span>
                                </label>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={closeProductModal} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-charcoal text-white rounded-lg text-sm font-medium hover:bg-primary transition-colors">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Hero Slide Modal */}
            {isSlideModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg">{editingSlide ? 'Edit Slide' : 'Add New Slide'}</h3>
                            <button onClick={closeSlideModal} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveSlide} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={slideForm.title}
                                    onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                    placeholder="e.g. Premium Mod"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Subtitle</label>
                                <input
                                    type="text"
                                    required
                                    value={slideForm.subtitle}
                                    onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                    placeholder="e.g. Architectural minimalism for the modern era."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Button Text (CTA)</label>
                                <input
                                    type="text"
                                    required
                                    value={slideForm.cta}
                                    onChange={(e) => setSlideForm({ ...slideForm, cta: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                    placeholder="e.g. Explore Collection"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Image</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={slideForm.image}
                                        onChange={(e) => setSlideForm({ ...slideForm, image: e.target.value })}
                                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                        placeholder="https://... or upload below"
                                    />
                                </div>
                                <div className="mt-2">
                                    <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isUploading ? 'bg-gray-300 cursor-wait' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                        {isUploading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Image className="w-4 h-4" />
                                                Upload Image
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            disabled={isUploading}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setIsUploading(true);
                                                    const url = await uploadImage(file);
                                                    setIsUploading(false);
                                                    if (url) {
                                                        setSlideForm({ ...slideForm, image: url });
                                                    } else {
                                                        alert('Upload failed! Please try again.');
                                                    }
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                            {slideForm.image && (
                                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                                    <img src={slideForm.image} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={closeSlideModal} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-charcoal text-white rounded-lg text-sm font-medium hover:bg-primary transition-colors">Save Slide</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Quote Detail Modal - Formal Quotation Format */}
            {selectedQuote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedQuote(null)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="px-8 py-6 border-b-4 border-primary bg-gradient-to-r from-[#0f2757] to-[#1a3a6e] text-white relative">
                            <button onClick={() => setSelectedQuote(null)} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold font-serif">ใบเสนอราคา</h2>
                                    <p className="text-sm text-white/70 mt-1">QUOTATION</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold">Premium Mod</p>
                                    <p className="text-xs text-white/70">Luxury Watch Customization</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6 bg-gray-50">
                            {/* Quote Info */}
                            <div className="flex justify-between text-sm">
                                <div className="space-y-1">
                                    <p><span className="text-gray-500">เลขที่:</span> <span className="font-bold">QT-{selectedQuote.id}</span></p>
                                    <p><span className="text-gray-500">วันที่:</span> {selectedQuote.created_at ? new Date(selectedQuote.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className={`font-medium px-2 py-0.5 rounded text-xs inline-block ${selectedQuote.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        selectedQuote.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                                            selectedQuote.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {selectedQuote.status === 'completed' ? 'เสร็จสิ้น' :
                                            selectedQuote.status === 'contacted' ? 'ติดต่อแล้ว' :
                                                selectedQuote.status === 'cancelled' ? 'ยกเลิก' : 'รอติดต่อ'}
                                    </p>
                                </div>
                            </div>

                            {/* Customer Info Box */}
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <h4 className="text-xs font-bold uppercase text-gray-500 mb-3 border-b pb-2">ข้อมูลลูกค้า / Customer Information</h4>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                    <div className="flex">
                                        <span className="text-gray-500 w-16 flex-shrink-0">ชื่อ:</span>
                                        <span className="font-medium">{selectedQuote.customer_name || '-'}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-gray-500 w-16 flex-shrink-0">โทร:</span>
                                        <span className="font-medium">{selectedQuote.customer_phone || '-'}</span>
                                    </div>
                                    <div className="flex col-span-2">
                                        <span className="text-gray-500 w-16 flex-shrink-0">อีเมล:</span>
                                        <span className="font-medium">{selectedQuote.customer_email || '-'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Product Name */}
                            <div className="text-center py-2">
                                <h3 className="font-bold text-lg text-[#0f2757]">{selectedQuote.sku_name || 'Custom Watch'}</h3>
                            </div>

                            {/* Items Table */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-[#0f2757] text-white">
                                        <tr>
                                            <th className="px-4 py-3 text-center font-semibold w-12">#</th>
                                            <th className="px-4 py-3 text-left font-semibold">รายละเอียด (DESCRIPTION)</th>
                                            <th className="px-4 py-3 text-left font-semibold w-28">รหัสสินค้า</th>
                                            <th className="px-4 py-3 text-center font-semibold w-16">จำนวน</th>
                                            <th className="px-4 py-3 text-right font-semibold w-28">ราคา/หน่วย</th>
                                            <th className="px-4 py-3 text-right font-semibold w-32">จำนวนเงิน</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {(() => {
                                            let selections: any[] = [];
                                            try {
                                                selections = typeof selectedQuote.selections === 'string' ? JSON.parse(selectedQuote.selections) : (selectedQuote.selections || []);
                                            } catch (e) { selections = []; }
                                            return selections.map((sel: any, idx: number) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-center text-gray-500">{idx + 1}</td>
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium text-gray-900">{sel.part_name || '-'}</p>
                                                        <p className="text-xs text-gray-500">{sel.option_name || '-'}</p>
                                                    </td>
                                                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{sel.product_code || '-'}</td>
                                                    <td className="px-4 py-3 text-center">1</td>
                                                    <td className="px-4 py-3 text-right">{(sel.price || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                                    <td className="px-4 py-3 text-right font-medium">{(sel.price || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                                </tr>
                                            ));
                                        })()}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary */}
                            <div className="flex justify-end">
                                <div className="w-72 bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <div className="px-4 py-3 flex justify-between border-b border-gray-100">
                                        <span className="text-gray-600">รวมเป็นเงิน</span>
                                        <span className="font-medium">฿{(selectedQuote.total_price || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="px-4 py-4 bg-[#0f2757] text-white flex justify-between items-center">
                                        <span className="font-bold">จำนวนเงินทั้งสิ้น</span>
                                        <span className="text-xl font-bold">฿{(selectedQuote.total_price || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Remarks */}
                            {selectedQuote.customer_note && (
                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">หมายเหตุ / REMARKS</h4>
                                    <p className="text-sm text-gray-700">{selectedQuote.customer_note}</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-4 border-t border-gray-200 bg-white flex justify-end gap-3">
                            <button onClick={() => setSelectedQuote(null)} className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">ปิด</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Zoom Modal */}
            {previewZoomImages && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setPreviewZoomImages(null)}>
                    <div className="relative w-full max-w-lg aspect-square animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                        <div className="absolute inset-0 bg-[#F9F9F7] rounded-2xl shadow-2xl overflow-hidden">
                            {previewZoomImages.map((img: string, idx: number) => (
                                <img key={idx} src={img} alt={`Layer ${idx}`} className="absolute inset-0 w-full h-full object-contain" style={{ zIndex: idx }} />
                            ))}
                        </div>
                        <button
                            onClick={() => setPreviewZoomImages(null)}
                            className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
