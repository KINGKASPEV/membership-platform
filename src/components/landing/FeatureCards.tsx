"use client";

import { motion } from "framer-motion";
import { Shield, Users, BarChart3, Database, Fingerprint, ShieldAlert } from "lucide-react";

const features = [
    {
        icon: Fingerprint,
        title: "Biometric Validation",
        description: "Multi-tier identity verification system rooted in local parish authentication and national records.",
        delay: 0
    },
    {
        icon: Database,
        title: "Institutional Ledger",
        description: "Hierarchical data management organized by State, LGA, Ward, and Parish for absolute structural integrity.",
        delay: 0.1
    },
    {
        icon: ShieldAlert,
        title: "Encryption Protocol",
        description: "Bank-grade data protection ensuring the privacy and security of 40M+ institutional records.",
        delay: 0.2
    }
];

export function FeatureCards() {
    return (
        <section id="features" className="py-32 relative overflow-hidden bg-dark-base">
            {/* Subtle background texture */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#c9a84c_1px,transparent_1px)] [background-size:40px_40px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-12 mb-16 md:mb-24">
                    <div className="max-w-2xl">
                        <div className="w-12 h-1 bg-gold-warm mb-6 md:mb-8" />
                        <h2
                            className="text-4xl md:text-6xl text-text-primary mb-6 md:mb-8 leading-tight"
                            style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
                        >
                            Engineered for <br className="hidden md:block" />
                            <span className="italic text-gold-warm">National Trust</span>
                        </h2>
                        <p className="text-lg md:text-xl text-text-secondary leading-relaxed font-body font-light">
                            Enterprise-grade infrastructure designed for the specific needs
                            of a sovereign institution managing millions of active memberships.
                        </p>
                    </div>

                    <div className="hidden lg:block">
                        <div className="text-right">
                            <p className="text-[10px] text-text-muted font-mono tracking-[0.3em] uppercase mb-4">
                                System Capabilities
                            </p>
                            <div className="flex items-center gap-4 text-gold-warm font-mono text-sm uppercase tracking-widest">
                                <span>SECURE</span>
                                <div className="w-2 h-2 rounded-full border border-gold-muted" />
                                <span>SCALABLE</span>
                                <div className="w-2 h-2 rounded-full border border-gold-muted" />
                                <span>SOVEREIGN</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: feature.delay, duration: 0.6 }}
                            className="group relative bg-dark-surface border border-white/5 p-8 md:p-10 rounded-[1.5rem] md:rounded-[2rem] shadow-card hover:border-gold-muted/30 transition-all duration-500 hover:shadow-elevated"
                        >
                            {/* Feature Number — Mono style */}
                            <div className="absolute top-6 md:top-8 right-6 md:right-8 text-text-muted/10 font-mono text-4xl md:text-5xl group-hover:text-gold-warm/5 transition-colors">
                                0{index + 1}
                            </div>

                            <div className="relative z-10">
                                {/* Icon — Gold & Dark */}
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-dark-elevated border border-white/5 flex items-center justify-center mb-8 md:mb-10 group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500 shadow-lg">
                                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-gold-warm" />
                                </div>

                                <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-4 md:mb-6 tracking-tight group-hover:text-gold-warm transition-colors">
                                    {feature.title}
                                </h3>

                                <p className="text-text-secondary leading-relaxed font-body font-light text-sm md:text-base opacity-80 group-hover:opacity-100 transition-opacity">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Decorative line — Gold Scarce */}
                            <div className="absolute bottom-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-gold-warm/0 to-transparent group-hover:via-gold-warm/20 transition-all duration-1000" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
