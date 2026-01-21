import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../constants';
import { Product } from '../types';
import { Eye, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const Catalog: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            setIsLoading(true);
            const data = await fetchProducts();
            setProducts(data);
            setIsLoading(false);
        };
        loadProducts();
    }, []);
    return (
        <div className="min-h-screen bg-background-light pt-32 pb-20">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="mb-16 border-b border-gray-200 pb-12 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="max-w-2xl">
                        <span className="text-primary text-sm font-bold tracking-widest uppercase mb-4 block">Fall / Winter 2024</span>
                        <h1 className="text-5xl md:text-6xl font-serif font-light text-charcoal mb-6 leading-tight">
                            The Autumn Collection
                        </h1>
                        <p className="text-lg text-gray-500 font-light max-w-lg">
                            Curated pieces for the modern aesthetic. Exploring texture, warmth, and the quiet luxury of essential forms.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-6 text-sm font-medium">
                        <button className="text-charcoal border-b-2 border-primary pb-1">All</button>
                        <button className="text-gray-400 hover:text-charcoal transition-colors">New Arrivals</button>
                        <button className="text-gray-400 hover:text-charcoal transition-colors">Essentials</button>
                    </div>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                        {products.map((product, index) => (
                            <motion.article
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-gray-100 mb-5">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                                    />

                                    {product.isNew && (
                                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[10px] font-bold tracking-wider uppercase px-2 py-1 text-charcoal">
                                            New
                                        </span>
                                    )}
                                    {product.isBestSeller && (
                                        <span className="absolute top-3 left-3 bg-primary text-[10px] font-bold tracking-wider uppercase px-2 py-1 text-white">
                                            Best Seller
                                        </span>
                                    )}

                                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10 flex justify-center gap-3">
                                        <button className="bg-white/95 hover:bg-primary hover:text-white text-charcoal w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="bg-white/95 hover:bg-primary hover:text-white text-charcoal w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors">
                                            <ShoppingBag className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <h3 className="font-serif text-lg text-charcoal group-hover:text-primary transition-colors">{product.name}</h3>
                                    <p className="text-sm text-gray-500 font-medium">${Number(product.price).toFixed(2)}</p>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}

                <div className="mt-20 flex justify-center">
                    <button className="px-10 py-4 border border-gray-200 text-charcoal text-sm font-bold tracking-widest uppercase hover:border-primary hover:text-primary transition-colors rounded-full">
                        Load More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Catalog;
