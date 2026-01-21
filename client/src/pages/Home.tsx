import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { fetchHeroSlides, fetchHomeContent } from '../constants';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [heroSlides, setHeroSlides] = useState<any[]>([]);
    const [homeContent, setHomeContent] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [slides, content] = await Promise.all([
                fetchHeroSlides(),
                fetchHomeContent()
            ]);
            setHeroSlides(slides);
            setHomeContent(content);
            setIsLoading(false);
        };
        loadData();
    }, []);

    // Slide timer
    useEffect(() => {
        if (heroSlides.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [heroSlides]);

    if (isLoading) return (
        <div className="h-screen w-full flex items-center justify-center bg-background-dark">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (heroSlides.length === 0) return null;

    return (
        <div className="w-full overflow-hidden">
            {/* Hero Section */}
            <section className="relative h-screen w-full flex flex-col justify-center items-center bg-background-dark">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0.8, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0 z-0"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10" />
                        <img
                            src={heroSlides[currentSlide].image}
                            alt={heroSlides[currentSlide].title}
                            className="w-full h-full object-cover object-center"
                        />
                    </motion.div>
                </AnimatePresence>

                <div className="relative z-20 text-center px-6 max-w-5xl mx-auto flex flex-col items-center gap-8 mt-16">
                    <motion.h1
                        key={`h1-${currentSlide}`}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-tight leading-tight"
                    >
                        {heroSlides[currentSlide].title}
                    </motion.h1>
                    <motion.p
                        key={`p-${currentSlide}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 0.9 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-gray-200 text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto"
                    >
                        {heroSlides[currentSlide].subtitle}
                    </motion.p>
                    <motion.div
                        key={`btn-${currentSlide}`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                    >
                        <Link to="/catalog" className="group relative px-10 py-4 overflow-hidden rounded-sm bg-white/10 backdrop-blur-sm border border-white/30 text-white transition-all duration-300 hover:bg-primary hover:border-primary hover:text-charcoal">
                            <span className="relative z-10 text-sm font-bold uppercase tracking-widest">{heroSlides[currentSlide].cta}</span>
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
                >
                    <span className="text-xs uppercase tracking-widest text-white/70">Scroll</span>
                    <ChevronDown className="text-primary w-5 h-5" />
                </motion.div>
            </section>

            {/* Scrollytelling Section: The Philosophy */}
            <section className="relative bg-background-light py-24 md:py-32">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5 }}
                            className="w-full md:w-1/2 flex flex-col gap-6 order-2 md:order-1"
                        >
                            <motion.span
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-primary text-sm font-bold uppercase tracking-[0.2em]"
                            >
                                {homeContent.philosophy_label || 'The Philosophy'}
                            </motion.span>
                            <motion.h2
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.1]"
                            >
                                {homeContent.philosophy_title || 'Silence over'} <br /><span className="italic font-light text-gray-500">{homeContent.philosophy_title_italic || 'noise.'}</span>
                            </motion.h2>
                            <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                whileInView={{ opacity: 1, scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="w-12 h-[2px] bg-primary my-2 origin-left"
                            />
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="text-lg text-gray-600 font-light leading-relaxed max-w-md"
                            >
                                {homeContent.philosophy_description || 'Designed for the discerning few who understand that true luxury lies in what is removed, not what is added.'}
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="pt-4"
                            >
                                <Link to="/about" className="inline-flex items-center gap-2 text-charcoal font-medium hover:text-primary transition-colors group">
                                    {homeContent.philosophy_link_text || 'Our Story'}
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1 }}
                            className="w-full md:w-1/2 order-1 md:order-2"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] group rounded-sm">
                                <img src={homeContent.philosophy_image || "https://picsum.photos/800/1000?grayscale"} alt="Minimalist architecture" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/30 rounded-full blur-3xl z-0"></div>
                                <div className="absolute -top-8 -right-8 w-24 h-24 bg-charcoal/20 rounded-full blur-2xl z-0"></div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Parallax Quote */}
            <div className="w-full h-[60vh] bg-fixed bg-cover bg-center relative flex items-center justify-center" style={{ backgroundImage: `url('${homeContent.quote_image || "https://picsum.photos/1920/1083?grayscale&blur=1"}')` }}>
                <div className="absolute inset-0 bg-charcoal/50"></div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center px-6"
                >
                    <blockquote className="font-serif text-3xl md:text-5xl text-white italic leading-tight max-w-4xl mx-auto">
                        "{homeContent.quote_text || 'Simplicity is the ultimate sophistication.'}"
                    </blockquote>
                    <cite className="block mt-6 text-primary font-display text-sm tracking-widest uppercase not-italic">— {homeContent.quote_author || 'Leonardo da Vinci'}</cite>
                </motion.div>
            </div>

            {/* Scrollytelling Section: The Craft */}
            <section className="relative bg-white py-24 md:py-32">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="w-full md:w-1/2 relative"
                        >
                            <div className="relative aspect-square overflow-hidden shadow-2xl group">
                                <img src={homeContent.craft_image_1 || "https://picsum.photos/1000/1000?random=1&grayscale"} alt="Craftsmanship" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                            </div>
                            <div className="hidden md:block absolute -bottom-12 -right-12 w-48 h-48 overflow-hidden shadow-xl border-4 border-white z-10">
                                <img src={homeContent.craft_image_2 || "https://picsum.photos/400/400?random=2&grayscale"} alt="Detail" className="w-full h-full object-cover" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="w-full md:w-1/2 flex flex-col gap-6 md:pl-10"
                        >
                            <motion.span
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-primary text-sm font-bold uppercase tracking-[0.2em]"
                            >
                                {homeContent.craft_label || 'The Craft'}
                            </motion.span>
                            <motion.h2
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.1]"
                            >
                                {homeContent.craft_title || 'Timeless'} <br /> <span className="italic font-light text-gray-500">{homeContent.craft_title_italic || 'Elegance.'}</span>
                            </motion.h2>
                            <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                whileInView={{ opacity: 1, scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="w-12 h-[2px] bg-primary my-2 origin-left"
                            />
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="text-lg text-gray-600 font-light leading-relaxed max-w-md"
                            >
                                {homeContent.craft_description || 'Every piece is a testament to meticulous curation.'}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="grid grid-cols-2 gap-8 mt-4 pt-4 border-t border-gray-100"
                            >
                                <div>
                                    <motion.h4
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.7 }}
                                        className="text-3xl font-serif text-charcoal mb-1"
                                    >
                                        {homeContent.craft_stat_1_value || '100+'}
                                    </motion.h4>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">{homeContent.craft_stat_1_label || 'Hours of Craft'}</p>
                                </div>
                                <div>
                                    <motion.h4
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.8 }}
                                        className="text-3xl font-serif text-charcoal mb-1"
                                    >
                                        {homeContent.craft_stat_2_value || 'Ltd.'}
                                    </motion.h4>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">{homeContent.craft_stat_2_label || 'Editions Only'}</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.9 }}
                                className="pt-6"
                            >
                                <Link to="/catalog" className="inline-block px-8 py-3 bg-transparent border border-charcoal text-charcoal font-bold text-sm tracking-widest uppercase hover:bg-charcoal hover:text-white transition-all duration-300">
                                    {homeContent.craft_button_text || 'View Collection'}
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
