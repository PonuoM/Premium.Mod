import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { MOCK_ORDERS } from '../constants';
import { Order } from '../types';

const Tracking: React.FC = () => {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [result, setResult] = useState<Order | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        // Simulate API delay
        setTimeout(() => {
            const found = MOCK_ORDERS.find(o => o.id === orderId || o.id === `#${orderId}`);
            if (found) {
                setResult(found);
            } else {
                setError('Order not found. Please check your details.');
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-background-light pt-32 pb-20 flex flex-col items-center">
             <div className="w-full max-w-5xl px-6">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[600px]">
                    
                    {/* Input Section */}
                    <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                        <div className="mb-8">
                            <h1 className="font-serif text-4xl text-charcoal mb-4">Locate Your Purchase</h1>
                            <p className="text-gray-500 text-sm">Enter your order ID and email to retrieve the latest status.</p>
                        </div>

                        <form onSubmit={handleSearch} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Order ID</label>
                                <input 
                                    type="text" 
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="e.g. #PM-8829"
                                    className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-charcoal"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-charcoal"
                                />
                            </div>
                            
                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full h-14 bg-primary hover:bg-primary-dark text-white font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? 'Locating...' : 'Track Order'}
                            </button>
                        </form>
                    </div>

                    {/* Result Visual Section */}
                    <div className="w-full md:w-1/2 bg-[#f4f2ed] border-l border-gray-100 p-10 md:p-16 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://picsum.photos/800/800?grayscale')] bg-cover bg-center"></div>
                        
                        {result ? (
                            <div className="relative z-10">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">Order</p>
                                            <p className="font-serif text-xl font-medium text-charcoal">{result.id}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">Expected</p>
                                            <p className="font-bold text-primary">Oct 28</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium text-charcoal">{result.items} Item(s)</p>
                                        <p className="text-sm font-bold text-charcoal">${result.total.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="space-y-8 pl-4">
                                    <div className={`relative pl-8 border-l-2 ${result.status === 'Processing' || result.status === 'Shipped' || result.status === 'Delivered' ? 'border-primary' : 'border-gray-200'}`}>
                                        <span className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-[#f4f2ed] ${result.status === 'Processing' || result.status === 'Shipped' || result.status === 'Delivered' ? 'bg-primary' : 'bg-gray-300'}`}></span>
                                        <h4 className="font-bold text-sm text-charcoal">Order Placed</h4>
                                        <p className="text-xs text-gray-500 mt-1">{result.date}</p>
                                    </div>
                                    <div className={`relative pl-8 border-l-2 ${result.status === 'Shipped' || result.status === 'Delivered' ? 'border-primary' : 'border-gray-200'}`}>
                                        <span className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-[#f4f2ed] ${result.status === 'Shipped' || result.status === 'Delivered' ? 'bg-primary' : 'bg-gray-300'}`}></span>
                                        <h4 className={`font-bold text-sm ${result.status === 'Shipped' || result.status === 'Delivered' ? 'text-charcoal' : 'text-gray-400'}`}>Shipped</h4>
                                        <p className="text-xs text-gray-500 mt-1">Via Premium Courier</p>
                                    </div>
                                    <div className={`relative pl-8 border-l-2 border-transparent`}>
                                        <span className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-[#f4f2ed] ${result.status === 'Delivered' ? 'bg-primary' : 'bg-gray-300'}`}></span>
                                        <h4 className={`font-bold text-sm ${result.status === 'Delivered' ? 'text-charcoal' : 'text-gray-400'}`}>Delivered</h4>
                                    </div>
                                </div>
                            </div>
                        ) : (
                             <div className="relative z-10 text-center text-gray-400">
                                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-sm font-medium">Search to view tracking details</p>
                            </div>
                        )}
                    </div>
                </div>
             </div>
        </div>
    );
};

export default Tracking;
