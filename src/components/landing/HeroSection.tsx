"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Globe, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1,
            ease: [0.16, 1, 0.3, 1] as any,
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* 
                DESIGN RULE: "Institutional Authority + African Modernity"
                Ambient background with grid, spotlight, and noise.
            */}
            <div className="absolute inset-0 -z-10 bg-dark-base overflow-hidden">
                {/* Spotlight effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gold-warm/5 rounded-full blur-[160px]" />

                {/* Grid pattern — subtle and authoritative */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(to right, #c9a84c 1px, transparent 1px),
                                         linear-gradient(to bottom, #c9a84c 1px, transparent 1px)`,
                        backgroundSize: '100px 100px'
                    }}
                />

                {/* Floating institutional orbs */}
                <motion.div
                    animate={{
                        y: [0, -40, 0],
                        scale: [1, 1.05, 1],
                        opacity: [0.05, 0.1, 0.05]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-20 right-[15%] w-[600px] h-[600px] bg-gold-warm/20 rounded-full blur-[120px]"
                />

                {/* Noise texture */}
                <div
                    className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                <motion.div
                    variants={heroVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-5xl mx-auto"
                >
                    {/* Badge — Editorial style */}
                    <motion.div variants={itemVariants} className="flex justify-center mb-10">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-dark-surface/40 backdrop-blur-md border border-white/5 rounded-full shadow-lg cursor-default">
                            <div className="w-2 h-2 rounded-full bg-gold-warm animate-pulse-soft" />
                            <span className="text-[10px] font-mono font-semibold text-gold-warm tracking-[0.25em] uppercase">
                                Federal Digital Infrastructure
                            </span>
                        </div>
                    </motion.div>

                    {/* Heading — Typographic contrast is the design */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl mb-10 leading-[0.95] tracking-tight text-text-primary"
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
                    >
                        National <br />
                        <span className="text-gold-warm italic">Registry</span>
                    </motion.h1>

                    {/* Subheading — Thin and elegant */}
                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-2xl text-text-secondary mb-14 max-w-3xl mx-auto leading-relaxed font-light font-body px-4 md:px-0"
                    >
                        The definitive unified ecosystem for secure identity validation,
                        nationwide membership management, and institutional record integrity.
                    </motion.p>

                    {/* CTAs — Breaking the grid */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-24 px-4 sm:px-0"
                    >
                        <Link href="/register" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto h-14 md:h-16 px-10 text-lg bg-gold-warm hover:bg-gold-bright text-dark-void font-bold rounded-xl shadow-gold transition-all duration-300">
                                <span className="flex items-center gap-3">
                                    Begin Registration
                                    <ArrowRight className="w-5 h-5" />
                                </span>
                            </Button>
                        </Link>
                        <Link href="#features" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full sm:w-auto h-14 md:h-16 px-10 text-lg border-border-default hover:bg-dark-elevated text-text-primary rounded-xl transition-all">
                                Explore Capabilities
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Trust Indicators — Data-precise style */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto px-4 md:px-0"
                    >
                        {[
                            { icon: Shield, title: "SECURE", text: "ASymmetric Encryption" },
                            { icon: Globe, title: "NATIONAL", text: "Federated Distribution" },
                            { icon: Lock, title: "VERIFIED", text: "Multi-Tier Authority" }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-row md:flex-col items-center gap-4 md:gap-3 p-4 md:p-6 bg-dark-surface/30 backdrop-blur-sm border border-white/5 rounded-2xl group hover:border-gold-muted/30 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-dark-elevated flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-5 h-5 text-gold-warm" />
                                </div>
                                <div className="text-left md:text-center">
                                    <span className="block text-[10px] font-mono font-bold text-gold-warm tracking-widest uppercase mb-1 md:mb-0">
                                        {item.title}
                                    </span>
                                    <span className="block text-xs text-text-muted uppercase tracking-wider font-medium">
                                        {item.text}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator — Minimal */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <div className="w-px h-16 bg-gradient-to-b from-gold-warm/50 to-transparent" />
            </motion.div>
        </section>
    );
}
