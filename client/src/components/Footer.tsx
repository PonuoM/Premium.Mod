import React from 'react';
import { Gem, Instagram, Twitter, Facebook } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
    const location = useLocation();
    const isAdmin = location.pathname.includes('/admin');

    if (isAdmin) return null;

    return (
        <footer className="bg-background-light dark:bg-background-dark pt-24 pb-12 border-t border-gray-200">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-1 flex flex-col gap-6">
                        <div className="flex items-center gap-2">
                            <Gem className="text-primary w-6 h-6" />
                            <span className="font-serif text-xl font-semibold text-charcoal">Premium Mod</span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                            Architectural minimalism for the discerning individual. Crafted with purpose, designed for silence.
                        </p>
                        <div className="flex gap-4 mt-2">
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
                        </div>
                    </div>
                    
                    <div className="col-span-1">
                        <h4 className="font-serif font-medium text-lg mb-6 text-charcoal">Shop</h4>
                        <ul className="flex flex-col gap-3">
                            <li><a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">New Arrivals</a></li>
                            <li><a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Best Sellers</a></li>
                            <li><a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Accessories</a></li>
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h4 className="font-serif font-medium text-lg mb-6 text-charcoal">About</h4>
                        <ul className="flex flex-col gap-3">
                            <li><a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Our Story</a></li>
                            <li><a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">The Atelier</a></li>
                            <li><a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Sustainability</a></li>
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h4 className="font-serif font-medium text-lg mb-6 text-charcoal">Newsletter</h4>
                        <p className="text-sm text-gray-500 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="w-full bg-transparent border border-gray-300 rounded px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                            />
                            <button className="w-full bg-charcoal text-white text-xs font-bold uppercase tracking-widest py-3 rounded hover:bg-primary transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 gap-4">
                    <p className="text-xs text-gray-400">© 2024 Premium Mod. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-xs text-gray-400 hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="text-xs text-gray-400 hover:text-primary transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
