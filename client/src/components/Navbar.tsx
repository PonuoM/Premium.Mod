import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Gem, Menu, X } from 'lucide-react';
import { fetchSettings } from '../constants';

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [customEnabled, setCustomEnabled] = useState(false);
    const location = useLocation();

    // Hide navbar on admin routes for a cleaner dashboard look
    const isAdmin = location.pathname.includes('/admin');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch settings to check if Custom page is enabled
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const settings = await fetchSettings();
                setCustomEnabled(settings.custom_page_enabled === 'true');
            } catch (e) {
                console.error('Error loading settings');
            }
        };
        loadSettings();
    }, []);

    if (isAdmin) return null;

    // Pages with dark hero sections that need white navbar text
    const hasDarkHero = location.pathname === '/' || location.pathname === '/about';

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between text-charcoal dark:text-white">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <Gem className={`h-6 w-6 text-primary transition-transform duration-700 group-hover:rotate-180`} />
                    <span className={`font-serif text-xl font-semibold tracking-tight ${!scrolled && hasDarkHero ? 'text-white' : 'text-charcoal'}`}>
                        Premium Mod
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className={`hidden md:flex items-center gap-8 ${!scrolled && hasDarkHero ? 'text-white/90' : 'text-charcoal/80'}`}>
                    <Link to="/" className="text-sm font-medium hover:text-primary transition-colors tracking-wide">Home</Link>
                    <Link to="/catalog" className="text-sm font-medium hover:text-primary transition-colors tracking-wide">Collections</Link>
                    {customEnabled && (
                        <Link to="/custom" className="text-sm font-medium hover:text-primary transition-colors tracking-wide">Custom</Link>
                    )}
                    <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors tracking-wide">Story</Link>
                    <Link to="/tracking" className="text-sm font-medium hover:text-primary transition-colors tracking-wide">Track Order</Link>
                    <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors tracking-wide">Admin</Link>
                </nav>

                {/* Actions */}
                <div className={`flex items-center gap-4 ${!scrolled && hasDarkHero ? 'text-white' : 'text-charcoal'}`}>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
                        <ShoppingBag className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                    </button>
                    <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(true)}>
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-background-light flex flex-col justify-center items-center text-center">
                    <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 p-2">
                        <X className="w-8 h-8 text-charcoal" />
                    </button>
                    <nav className="flex flex-col gap-8">
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="font-serif text-2xl text-charcoal">Home</Link>
                        <Link to="/catalog" onClick={() => setMobileMenuOpen(false)} className="font-serif text-2xl text-charcoal">Collections</Link>
                        {customEnabled && (
                            <Link to="/custom" onClick={() => setMobileMenuOpen(false)} className="font-serif text-2xl text-charcoal">Custom</Link>
                        )}
                        <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="font-serif text-2xl text-charcoal">Story</Link>
                        <Link to="/tracking" onClick={() => setMobileMenuOpen(false)} className="font-serif text-2xl text-charcoal">Track Order</Link>
                        <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="font-serif text-2xl text-charcoal">Admin Access</Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
