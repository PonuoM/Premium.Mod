import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Facebook, MessageCircle, Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchAboutContent } from '../constants';

const About: React.FC = () => {
    const [content, setContent] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            const data = await fetchAboutContent();
            // Convert array to object
            const contentMap: Record<string, string> = {};
            data.forEach((item: any) => {
                contentMap[item.id] = item.content;
            });
            setContent(contentMap);
            setIsLoading(false);
        };
        loadContent();
    }, []);

    const get = (id: string, fallback: string) => content[id] || fallback;

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-background-light">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    const contactChannels = [
        {
            icon: Facebook,
            customIcon: get('facebook_icon', ''),
            title: 'Facebook',
            value: get('facebook_name', 'Premium Mod Official'),
            link: get('facebook_url', '#'),
            color: 'bg-blue-600',
            hoverColor: 'hover:bg-blue-700'
        },
        {
            icon: MessageCircle,
            customIcon: get('line_icon', ''),
            title: 'LINE Official',
            value: get('line_id', '@premiummod'),
            link: get('line_url', '#'),
            color: 'bg-green-500',
            hoverColor: 'hover:bg-green-600'
        },
        {
            icon: Mail,
            customIcon: get('email_icon', ''),
            title: 'Email',
            value: get('email', 'contact@premiummod.com'),
            link: `mailto:${get('email', 'contact@premiummod.com')}`,
            color: 'bg-charcoal',
            hoverColor: 'hover:bg-gray-800'
        },
        {
            icon: Phone,
            customIcon: get('phone_icon', ''),
            title: 'โทรศัพท์',
            value: get('phone', '02-xxx-xxxx'),
            link: `tel:${get('phone', '')}`,
            color: 'bg-primary',
            hoverColor: 'hover:bg-amber-600'
        }
    ];

    return (
        <div className="min-h-screen bg-background-light">
            {/* Hero Section */}
            <section className="relative h-[60vh] bg-charcoal flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-charcoal/90 z-10"></div>
                <div className="absolute inset-0">
                    <img
                        src={get('about_image', 'https://picsum.photos/1920/1080?grayscale')}
                        alt="About"
                        className="w-full h-full object-cover opacity-40"
                    />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative z-20 text-center px-6"
                >
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-primary text-sm font-bold tracking-[0.3em] uppercase mb-4 block"
                    >
                        {get('hero_subtitle', 'Elevate Your Style')}
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-5xl md:text-7xl font-serif font-light text-white mb-6"
                    >
                        {get('hero_title', 'Premium Mod')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-lg text-white/70 font-light"
                    >
                        {get('hero_tagline', 'สินค้าคุณภาพ สำหรับผู้ที่มีรสนิยม')}
                    </motion.p>
                </motion.div>
            </section>

            {/* About Section */}
            <section className="py-20 md:py-28">
                <div className="max-w-[1200px] mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase mb-4 block">About Us</span>
                            <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-6 leading-tight">
                                {get('about_title', 'เกี่ยวกับเรา')}
                            </h2>
                            <div className="w-12 h-[2px] bg-primary mb-6"></div>
                            <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                                {get('about_description', 'Premium Mod คือแบรนด์สินค้าแฟชั่นที่คัดสรรมาเป็นพิเศษ เราเชื่อในความเรียบง่ายที่หรูหรา และคุณภาพที่ยั่งยืน')}
                            </p>
                            <Link to="/catalog" className="inline-flex items-center gap-2 text-charcoal font-medium hover:text-primary transition-colors group">
                                ดูสินค้าของเรา
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="aspect-[4/3] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] rounded-sm">
                                <img
                                    src={get('about_image', 'https://picsum.photos/800/600?grayscale')}
                                    alt="About Premium Mod"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contact Channels */}
            <section className="py-20 bg-white">
                <div className="max-w-[1200px] mx-auto px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase mb-4 block">Contact Us</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-charcoal">ช่องทางติดต่อ</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactChannels.map((channel, index) => (
                            <motion.a
                                key={channel.title}
                                href={channel.link}
                                target={channel.link.startsWith('http') ? '_blank' : undefined}
                                rel={channel.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 ${channel.color} ${channel.hoverColor} rounded-full flex items-center justify-center mx-auto mb-4 transition-colors overflow-hidden`}>
                                    {channel.customIcon ? (
                                        <img src={channel.customIcon} alt={channel.title} className="w-8 h-8 object-contain" />
                                    ) : (
                                        <channel.icon className="w-6 h-6 text-white" />
                                    )}
                                </div>
                                <h3 className="font-bold text-charcoal mb-1">{channel.title}</h3>
                                <p className="text-gray-500 text-sm">{channel.value}</p>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Business Info */}
            <section className="py-16 bg-charcoal">
                <div className="max-w-[1200px] mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-4 justify-center md:justify-start"
                        >
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-1">ที่อยู่</h4>
                                <p className="text-gray-400 text-sm">{get('address', 'กรุงเทพมหานคร ประเทศไทย')}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex items-center gap-4 justify-center md:justify-start"
                        >
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-1">เวลาทำการ</h4>
                                <p className="text-gray-400 text-sm">{get('hours', 'จันทร์ - ศุกร์ 9:00 - 18:00 น.')}</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
