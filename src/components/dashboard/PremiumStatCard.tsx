"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: number;
    change?: string;
    icon: React.ElementType;
    variant?: 'primary' | 'success' | 'warning' | 'error';
    delay?: number;
}

const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Easing function (easeOutExpo)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setCount(Math.floor(easeProgress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return count;
};

export function PremiumStatCard({
    title,
    value,
    change,
    icon: Icon,
    variant = 'primary',
    delay = 0
}: StatCardProps) {
    const count = useCountUp(value);

    // Initial check for successful/positive change vs negative
    const isPositiveChange = change && !change.startsWith('-');

    const variants = {
        primary: {
            gradient: 'from-gold-400 to-gold-600',
            border: 'border-gold-500/30',
            iconBg: 'bg-gold-400/10',
            iconColor: 'text-gold-400',
            textGradient: 'from-white to-gold-100',
            glow: 'shadow-[0_0_20px_-10px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.4)]',
            accent: 'bg-gold-500'
        },
        success: {
            gradient: 'from-emerald-400 to-emerald-600',
            border: 'border-emerald-500/30',
            iconBg: 'bg-emerald-400/10',
            iconColor: 'text-emerald-400',
            textGradient: 'from-white to-emerald-100',
            glow: 'shadow-[0_0_20px_-10px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_-5px_rgba(52,211,153,0.4)]',
            accent: 'bg-emerald-500'
        },
        warning: {
            gradient: 'from-amber-400 to-amber-600',
            border: 'border-amber-500/30',
            iconBg: 'bg-amber-400/10',
            iconColor: 'text-amber-400',
            textGradient: 'from-white to-amber-100',
            glow: 'shadow-[0_0_20px_-10px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.4)]',
            accent: 'bg-amber-500'
        },
        error: {
            gradient: 'from-rose-400 to-rose-600',
            border: 'border-rose-500/30',
            iconBg: 'bg-rose-400/10',
            iconColor: 'text-rose-400',
            textGradient: 'from-white to-rose-100',
            glow: 'shadow-[0_0_20px_-10px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.4)]',
            accent: 'bg-rose-500'
        },
    };

    const style = variants[variant];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={cn(
                "relative overflow-hidden rounded-2xl p-6 transition-all duration-300 group cursor-default",
                "bg-dark-800/80 backdrop-blur-md border border-neutral-700/50 hover:border-opacity-100",
                style.glow
            )}
        >
            {/* Top Border Accent */}
            <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-80", style.gradient)} />

            {/* Ambient Background Gradient */}
            <div className={cn(
                "absolute -right-20 -top-20 w-60 h-60 rounded-full blur-[80px] opacity-[0.08] transition-opacity duration-500 group-hover:opacity-[0.15]",
                style.accent
            )} />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-4">
                    {/* Icon Container */}
                    <div className={cn(
                        "p-3 rounded-xl border border-white/5 shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                        style.iconBg
                    )}>
                        <Icon className={cn("w-6 h-6", style.iconColor)} />
                    </div>

                    {/* Change Indicator */}
                    {change && (
                        <div className={cn(
                            "flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm",
                            isPositiveChange
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        )}>
                            {isPositiveChange ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {change}
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-1">
                        {title}
                    </h3>
                    <div className="flex items-baseline gap-1">
                        <span className={cn(
                            "text-4xl font-bold text-white tracking-tight transition-all duration-300 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r",
                            style.textGradient
                        )}>
                            {count.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
