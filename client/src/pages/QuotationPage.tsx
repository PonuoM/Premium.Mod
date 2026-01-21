import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer } from 'lucide-react';

interface QuoteData {
    id: string;
    sku_id: string;
    sku_name: string;
    selections: any[];
    total_price: number;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    customer_note: string;
    status: string;
    created_at: string;
}

const QuotationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [quote, setQuote] = useState<QuoteData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const response = await fetch(`http://localhost:3002/api/custom/quotes/${id}`);
                const data = await response.json();
                if (typeof data.selections === 'string') {
                    data.selections = JSON.parse(data.selections);
                }
                setQuote(data);
            } catch (error) {
                console.error('Failed to fetch quote:', error);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchQuote();
    }, [id]);

    const handlePrint = () => window.print();
    const handleDownloadPDF = () => window.print();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f7f5]">
                <div className="animate-spin w-10 h-10 border-2 border-[#0f2757] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!quote) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f7f5]">
                <p className="text-gray-500 mb-4">ไม่พบใบเสนอราคา</p>
                <button onClick={() => navigate('/admin')} className="text-[#0f2757] hover:underline">กลับหน้า Admin</button>
            </div>
        );
    }

    const formatDateEN = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const selections = quote.selections || [];

    return (
        <div className="min-h-screen bg-[#f8f7f5] print:bg-white print:min-h-0">
            {/* Action Bar */}
            <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 print:hidden">
                <div className="max-w-[800px] mx-auto px-4 py-3 flex justify-between items-center">
                    <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-gray-600 hover:text-[#0f2757] transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">กลับ</span>
                    </button>
                    <div className="flex gap-3">
                        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                            <Printer className="w-4 h-4" />
                            <span className="text-sm">พิมพ์</span>
                        </button>
                        <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-4 py-2 bg-[#0f2757] text-white rounded hover:bg-[#1a3a6e] transition-colors">
                            <Download className="w-4 h-4" />
                            <span className="text-sm">ดาวน์โหลด PDF</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Quotation Document */}
            <div className="pt-16 pb-8 px-4 flex justify-center print:pt-0 print:pb-0 print:px-0">
                <div className="bg-white w-full max-w-[210mm] print:max-w-none print:w-[210mm] shadow-sm print:shadow-none border border-gray-100 print:border-0">

                    {/* Header Band */}
                    <div className="bg-[#0f2757] text-white px-8 py-5 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 border-2 border-[#d4af37] rounded-full flex items-center justify-center">
                                <span className="font-serif font-bold text-lg text-[#d4af37]">PM</span>
                            </div>
                            <div>
                                <h1 className="font-serif font-bold text-lg tracking-wide">PREMIUM MOD</h1>
                                <p className="text-[10px] text-white/60 uppercase tracking-[0.2em]">Luxury Watch Customization</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="font-serif text-xl tracking-[0.15em]">QUOTATION</h2>
                            <p className="text-[10px] text-white/60 mt-0.5">ใบเสนอราคา</p>
                        </div>
                    </div>

                    <div className="p-8 print:p-6">
                        {/* Quote Info */}
                        <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
                            <div className="text-xs text-gray-500">
                                <p>Date: <span className="text-gray-900">{formatDateEN(quote.created_at)}</span></p>
                                <p className="mt-1">Quote No: <span className="text-gray-900 font-medium">QT-{String(quote.id).slice(-6)}</span></p>
                            </div>
                        </div>

                        {/* Customer & Product */}
                        <div className="flex gap-6 mb-6 text-xs">
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
                                <p className="font-medium text-gray-900">{quote.customer_name || '-'}</p>
                                <p className="text-gray-500 mt-1">{quote.customer_phone || '-'}</p>
                                {quote.customer_email && <p className="text-gray-500">{quote.customer_email}</p>}
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Product</p>
                                <p className="font-medium text-gray-900">{quote.sku_name || 'Custom Watch'}</p>
                                <p className="text-gray-500 mt-1">Custom Configuration</p>
                            </div>
                        </div>

                        {/* Items Table */}
                        <table className="w-full text-xs mb-6">
                            <thead>
                                <tr className="border-y border-gray-200">
                                    <th className="py-3 text-left font-medium text-gray-400 uppercase tracking-wider text-[10px]">Item</th>
                                    <th className="py-3 text-left font-medium text-gray-400 uppercase tracking-wider text-[10px]">Description</th>
                                    <th className="py-3 text-right font-medium text-gray-400 uppercase tracking-wider text-[10px]">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selections.map((sel: any, idx: number) => (
                                    <tr key={idx} className="border-b border-gray-50">
                                        <td className="py-3 text-gray-900">{sel.part_name || '-'}</td>
                                        <td className="py-3 text-gray-500">{sel.option_name || '-'}</td>
                                        <td className="py-3 text-right font-medium text-gray-900">฿{(sel.price || 0).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Total */}
                        <div className="flex justify-end mb-6">
                            <div className="w-56">
                                <div className="flex justify-between py-2 text-xs text-gray-500">
                                    <span>Subtotal</span>
                                    <span>฿{(quote.total_price || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-3 border-t-2 border-[#0f2757]">
                                    <span className="font-medium text-gray-900">Total</span>
                                    <span className="font-serif font-bold text-lg text-[#0f2757]">฿{(quote.total_price || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="text-[10px] text-gray-400 mb-8 space-y-1">
                            {quote.customer_note && <p><span className="text-gray-500">Note:</span> {quote.customer_note}</p>}
                            <p>• ราคานี้มีผลภายใน 15 วันนับจากวันที่ออกใบเสนอราคา</p>
                            <p>• การชำระเงิน: ธนาคารกสิกรไทย | Premium Mod Co., Ltd.</p>
                        </div>

                        {/* Signatures */}
                        <div className="flex gap-16 pt-6 border-t border-gray-100">
                            <div className="flex-1 text-center">
                                <div className="h-10 border-b border-gray-200 mb-2"></div>
                                <p className="text-[10px] text-gray-500">Customer Signature</p>
                            </div>
                            <div className="flex-1 text-center">
                                <div className="h-10 border-b border-gray-200 mb-2"></div>
                                <p className="text-[10px] text-gray-500">Authorized Signature</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="h-1 bg-gradient-to-r from-[#0f2757] via-[#d4af37] to-[#0f2757]"></div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    @page { size: A4 portrait; margin: 10mm; }
                    html, body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    .print\\:hidden { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default QuotationPage;
