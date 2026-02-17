"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
                scrolled
                    ? "border-white/5 bg-dark-base/80 backdrop-blur-xl py-3"
                    : "border-transparent bg-transparent py-5"
            )}
        >
            {/* Elegant gold accent line on scroll */}
            {scrolled && (
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-warm to-transparent" />
            )}

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="w-12 h-12 bg-dark-elevated border border-gold-muted/30 rounded-xl flex items-center justify-center shadow-lg shadow-gold-warm/5 group-hover:border-gold-warm/50 transition-all duration-500">
                                <Shield className="w-6 h-6 text-gold-warm" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-status-validated rounded-full border-2 border-dark-base animate-pulse-soft" />
                        </div>
                        <div className="hidden sm:block">
                            <h1
                                className="text-2xl leading-none text-text-primary group-hover:text-gold-warm transition-colors duration-500"
                                style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
                            >
                                National Platform
                            </h1>
                            <p className="text-[9px] text-text-muted mt-1 font-mono tracking-[0.3em] uppercase">
                                Official Registry
                            </p>
                        </div>
                    </Link>

                    {/* Navigation Links — Desktop */}
                    <div className="hidden md:flex items-center gap-8">
                        {['Features', 'Authority', 'National Security'].map((item) => (
                            <Link
                                key={item}
                                href="#"
                                className="text-xs font-mono tracking-widest text-text-secondary hover:text-gold-warm transition-colors uppercase"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="hidden sm:block">
                            <Button variant="ghost" className="text-xs font-mono tracking-widest text-text-muted hover:text-text-primary uppercase">
                                Admin Access
                            </Button>
                        </Link>

                        <Link href="/register">
                            <Button
                                className="bg-gold-warm hover:bg-gold-bright text-dark-void font-bold text-xs tracking-[0.1em] uppercase px-6 h-11 rounded-lg transition-all shadow-gold"
                            >
                                Start Registration
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-text-secondary hover:text-gold-warm transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 bg-dark-elevated border-b border-white/5 p-6 flex flex-col gap-6 md:hidden"
                >
                    {['Features', 'Authority', 'National Security'].map((item) => (
                        <Link
                            key={item}
                            href="#"
                            className="text-sm font-mono tracking-widest text-text-secondary hover:text-gold-warm transition-colors uppercase"
                        >
                            {item}
                        </Link>
                    ))}
                    <div className="h-px bg-white/5" />
                    <Link href="/login" className="text-sm font-mono tracking-widest text-gold-warm uppercase">
                        Admin Login
                    </Link>
                </motion.div>
            )}
        </motion.nav>
    );
}
