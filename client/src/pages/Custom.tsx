import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Send, CheckCircle, Loader2, ZoomIn, RotateCw, Save, Share2 } from 'lucide-react';
import { fetchActiveSkus, fetchCustomSku, createCustomQuote } from '../constants';

interface Option {
    id: string;
    part_id: string;
    name: string;
    image: string;
    product_code: string;
    price: number;
    sort_order: number;
}

interface Part {
    id: string;
    sku_id: string;
    name: string;
    layer_order: number;
    options: Option[];
}

interface SKU {
    id: string;
    name: string;
    base_price: number;
    is_active: number;
    parts: Part[];
}

const Custom: React.FC = () => {
    const [skus, setSkus] = useState<{ id: string; name: string }[]>([]);
    const [selectedSkuId, setSelectedSkuId] = useState<string>('');
    const [skuData, setSkuData] = useState<SKU | null>(null);
    const [selections, setSelections] = useState<Record<string, Option | null>>({});
    const [activePartId, setActivePartId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showQuoteForm, setShowQuoteForm] = useState(false);
    const [quoteSubmitted, setQuoteSubmitted] = useState(false);
    const [customerForm, setCustomerForm] = useState({ name: '', phone: '', email: '', note: '' });

    // Load active SKUs
    useEffect(() => {
        const load = async () => {
            const data = await fetchActiveSkus();
            setSkus(data);
            if (data.length > 0) {
                setSelectedSkuId(data[0].id);
            }
            setIsLoading(false);
        };
        load();
    }, []);

    // Load SKU details when selected
    useEffect(() => {
        if (!selectedSkuId) return;
        const load = async () => {
            setIsLoading(true);
            const data = await fetchCustomSku(selectedSkuId);
            setSkuData(data);

            // Set default selections (first option of each part)
            const defaults: Record<string, Option | null> = {};
            data.parts?.forEach((part: Part) => {
                if (part.options && part.options.length > 0) {
                    defaults[part.id] = part.options[0];
                }
            });
            setSelections(defaults);

            // Set first part as active
            if (data.parts && data.parts.length > 0) {
                const sortedParts = [...data.parts].sort((a, b) => b.layer_order - a.layer_order);
                setActivePartId(sortedParts[0].id);
            }

            setIsLoading(false);
        };
        load();
    }, [selectedSkuId]);

    // Calculate total price
    const totalPrice = Object.values(selections).reduce((sum, opt) => sum + (opt?.price || 0), 0) + (skuData?.base_price || 0);

    // Handle option selection
    const handleSelectOption = (partId: string, option: Option) => {
        setSelections(prev => ({ ...prev, [partId]: option }));
    };

    // Get sorted parts
    const sortedParts = skuData?.parts?.slice().sort((a, b) => b.layer_order - a.layer_order) || [];
    const activePart = sortedParts.find(p => p.id === activePartId);

    // Submit quote
    const handleSubmitQuote = async () => {
        if (!customerForm.name || !customerForm.phone) {
            alert('กรุณากรอกชื่อและเบอร์โทร');
            return;
        }
        setIsSubmitting(true);

        const quoteData = {
            sku_id: selectedSkuId,
            sku_name: skuData?.name,
            selections: Object.entries(selections).map(([partId, opt]) => ({
                part_id: partId,
                part_name: skuData?.parts.find(p => p.id === partId)?.name,
                option_id: (opt as Option)?.id,
                option_name: (opt as Option)?.name,
                product_code: (opt as Option)?.product_code,
                price: (opt as Option)?.price,
                image: (opt as Option)?.image
            })),
            total_price: totalPrice,
            customer_name: customerForm.name,
            customer_phone: customerForm.phone,
            customer_email: customerForm.email,
            customer_note: customerForm.note
        };
        await createCustomQuote(quoteData);
        setIsSubmitting(false);
        setQuoteSubmitted(true);
    };

    if (isLoading && skus.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
                <Loader2 className="w-8 h-8 animate-spin text-[#0f2757]" />
            </div>
        );
    }

    if (skus.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F7] text-center px-6">
                <Package className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-2xl font-serif text-[#0f2757] mb-2">ไม่มีสินค้า Custom ในขณะนี้</h2>
                <p className="text-gray-500">กรุณาติดต่อเราสำหรับข้อมูลเพิ่มเติม</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-[#F9F9F7] overflow-hidden">
            {/* Main Content - Full height split layout */}
            <main className="flex flex-1 overflow-hidden pt-16 flex-col lg:flex-row">
                {/* Left: Preview Area */}
                <div className="relative flex-1 bg-[#F9F9F7] flex flex-col items-center justify-center overflow-hidden group/canvas">
                    {/* Subtle radial gradient background */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,1)_0%,_rgba(249,249,247,0)_60%)] pointer-events-none" />

                    {isLoading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-[#0f2757]" />
                    ) : (
                        <>
                            {/* Product Preview */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                                className="relative z-10 w-[80%] max-w-[500px] aspect-square transition-transform duration-700 ease-out transform group-hover/canvas:scale-105 flex items-center justify-center bg-[#F9F9F7]"
                            >
                                {/* Layered images */}
                                {skuData?.parts
                                    .slice()
                                    .sort((a, b) => a.layer_order - b.layer_order)
                                    .map((part) => {
                                        const selected = selections[part.id];
                                        if (!selected?.image) return null;
                                        return (
                                            <motion.img
                                                key={part.id}
                                                src={selected.image}
                                                alt={selected.name}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.4 }}
                                                className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                                                style={{ zIndex: part.layer_order }}
                                            />
                                        );
                                    })}
                                {Object.values(selections).every(s => !s?.image) && (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-300">
                                        <Package className="w-24 h-24 mb-4" />
                                        <span className="text-sm text-gray-400">Select options to preview</span>
                                    </div>
                                )}
                            </motion.div>

                            {/* Preview Controls */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                                <div className="flex gap-1 p-1 bg-white/90 backdrop-blur-md rounded-lg border border-gray-200 shadow-lg">
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-50 text-gray-500 hover:text-[#0f2757] transition-all">
                                        <RotateCw className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Rotate</span>
                                    </button>
                                    <div className="w-px bg-gray-200 my-2" />
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-50 text-gray-500 hover:text-[#0f2757] transition-all">
                                        <ZoomIn className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Zoom</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Right: Configuration Panel */}
                <div className="w-full lg:w-[480px] bg-[#F9F9F7] border-l border-gray-200 flex flex-col shadow-xl z-20 h-[50vh] lg:h-auto">
                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto">
                        {/* Header */}
                        <div className="p-8 pb-4">
                            <h1 className="text-[#0f2757] font-serif text-3xl font-bold leading-tight mb-2">
                                {skuData?.name || 'Custom Product'}
                            </h1>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Customize your perfect piece. Select your components to create a unique design.
                            </p>
                        </div>

                        {/* Tab Navigation */}
                        <div className="sticky top-0 bg-[#F9F9F7]/95 backdrop-blur z-10 border-b border-gray-200 px-6">
                            <div className="flex gap-6 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                {sortedParts.map((part) => (
                                    <button
                                        key={part.id}
                                        onClick={() => setActivePartId(part.id)}
                                        className={`flex flex-col items-center pb-3 pt-4 border-b-2 transition-colors min-w-max ${activePartId === part.id
                                            ? 'border-[#0f2757] text-[#0f2757]'
                                            : 'border-transparent text-gray-400 hover:text-[#0f2757]'
                                            }`}
                                    >
                                        <span className="text-sm font-bold tracking-wide uppercase">{part.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Options Content */}
                        <div className="p-6 space-y-6">
                            <AnimatePresence mode="wait">
                                {activePart && (
                                    <motion.section
                                        key={activePart.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {/* Section Header */}
                                        <div className="flex justify-between items-end mb-4">
                                            <h3 className="text-[#0f2757] font-serif text-lg">{activePart.name}</h3>
                                            <span className="text-[#C9A961] text-sm font-medium">
                                                {selections[activePart.id]?.name || 'Select...'}
                                            </span>
                                        </div>

                                        {/* Options Grid - 2 columns */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {activePart.options.map((option) => {
                                                const isSelected = selections[activePart.id]?.id === option.id;
                                                const priceModifier = option.price;
                                                return (
                                                    <motion.button
                                                        key={option.id}
                                                        onClick={() => handleSelectOption(activePart.id, option)}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className={`relative group flex items-center p-3 gap-3 rounded-lg border bg-white shadow-sm transition-all ${isSelected
                                                            ? 'border-[#C9A961] ring-1 ring-[#C9A961]/20 shadow-[0_0_15px_-5px_rgba(201,169,97,0.3)]'
                                                            : 'border-gray-200 hover:border-gray-400'
                                                            }`}
                                                    >
                                                        {/* Option Thumbnail */}
                                                        <div className="w-14 h-14 rounded-full shadow-inner overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 flex-shrink-0">
                                                            {option.image ? (
                                                                <img
                                                                    src={option.image}
                                                                    alt={option.name}
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-sm text-gray-400 font-bold">
                                                                    {option.name.slice(0, 2).toUpperCase()}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Option Info */}
                                                        <div className="text-left flex-1 min-w-0">
                                                            <p className={`text-sm font-bold truncate transition-colors ${isSelected ? 'text-[#0f2757]' : 'text-gray-600 group-hover:text-[#0f2757]'
                                                                }`}>
                                                                {option.name}
                                                            </p>
                                                            <p className={`text-xs font-medium ${isSelected ? 'text-[#C9A961]' : 'text-gray-400'
                                                                }`}>
                                                                {priceModifier === 0 ? 'Included' : `+฿${priceModifier.toLocaleString()}`}
                                                            </p>
                                                        </div>

                                                        {/* Selected Indicator */}
                                                        {isSelected && (
                                                            <div className="absolute top-3 right-3 text-[#C9A961]">
                                                                <CheckCircle className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    </motion.section>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Sticky Footer */}
                    <div className="p-6 bg-white border-t border-gray-200 z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
                        <div className="flex flex-col gap-4">
                            {/* Price Display */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Investment</p>
                                    <motion.p
                                        key={totalPrice}
                                        initial={{ scale: 1.05 }}
                                        animate={{ scale: 1 }}
                                        className="text-[#0f2757] font-serif text-2xl font-bold"
                                    >
                                        ฿{totalPrice.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                                    </motion.p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#C9A961] text-xs font-medium">Est. Delivery: 2-3 Weeks</p>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <motion.button
                                onClick={() => setShowQuoteForm(true)}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full h-14 bg-[#0f2757] hover:bg-[#163673] text-white rounded-md flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-[#0f2757]/20 group"
                            >
                                <span className="text-sm font-bold tracking-[0.05em] uppercase">Commission Piece</span>
                                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            {/* Secondary Actions */}
                            <div className="flex justify-center gap-6 mt-1">
                                <button className="text-gray-500 hover:text-[#0f2757] text-xs font-medium flex items-center gap-1 transition-colors">
                                    <Save className="w-3.5 h-3.5" /> Save Configuration
                                </button>
                                <button className="text-gray-500 hover:text-[#0f2757] text-xs font-medium flex items-center gap-1 transition-colors">
                                    <Share2 className="w-3.5 h-3.5" /> Share Design
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Quote Form Modal */}
            <AnimatePresence>
                {showQuoteForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                        >
                            {quoteSubmitted ? (
                                <div className="text-center py-8">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-[#0f2757] mb-2">ส่งคำขอเรียบร้อย!</h3>
                                    <p className="text-gray-500 mb-6">เราจะติดต่อกลับโดยเร็วที่สุด</p>
                                    <button
                                        onClick={() => { setShowQuoteForm(false); setQuoteSubmitted(false); }}
                                        className="px-6 py-2 bg-[#0f2757] text-white rounded-lg hover:bg-[#163673] transition-colors"
                                    >
                                        ปิด
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold text-[#0f2757] mb-6">ขอใบเสนอราคา</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">ชื่อ *</label>
                                            <input
                                                type="text"
                                                value={customerForm.name}
                                                onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                                                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0f2757] outline-none"
                                                placeholder="ชื่อของคุณ"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">เบอร์โทร *</label>
                                            <input
                                                type="tel"
                                                value={customerForm.phone}
                                                onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                                                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0f2757] outline-none"
                                                placeholder="08x-xxx-xxxx"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={customerForm.email}
                                                onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                                                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0f2757] outline-none"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">หมายเหตุ</label>
                                            <textarea
                                                value={customerForm.note}
                                                onChange={(e) => setCustomerForm({ ...customerForm, note: e.target.value })}
                                                rows={3}
                                                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0f2757] outline-none resize-none"
                                                placeholder="ข้อความเพิ่มเติม..."
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={() => setShowQuoteForm(false)}
                                            className="flex-1 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            ยกเลิก
                                        </button>
                                        <button
                                            onClick={handleSubmitQuote}
                                            disabled={isSubmitting}
                                            className="flex-1 py-3 bg-[#0f2757] text-white rounded-lg font-medium hover:bg-[#163673] disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                                        >
                                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                            ส่งคำขอ
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Custom;
