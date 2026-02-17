"use client";

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { motion } from "framer-motion"

interface StepsProps {
    steps: string[];
    currentStep: number;
}

export function Steps({ steps, currentStep }: StepsProps) {
    return (
        <div className="w-full py-8">
            <div className="relative flex items-center justify-between">
                {/* 
                    Line Connecting Steps 
                    Uses Warm Obsidian line style 
                */}
                <div className="absolute left-0 top-1/2 -z-10 h-[1px] w-full -translate-y-1/2 bg-white/5" />

                {/* Progress bar */}
                <motion.div
                    className="absolute left-0 top-1/2 -z-10 h-[1px] -translate-y-1/2 bg-gold-warm transition-all duration-300 shadow-[0_0_10px_rgba(201,168,76,0.3)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div key={step} className="flex flex-col items-center px-4 relative">
                            {/* Circle Indicator */}
                            <div
                                className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 bg-dark-base",
                                    isCompleted ? "border-gold-warm bg-gold-warm text-dark-void shadow-gold" :
                                        isCurrent ? "border-gold-warm text-gold-warm shadow-[0_0_20px_rgba(201,168,76,0.1)]" : "border-white/10 text-text-muted"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-5 w-5 stroke-[3]" />
                                ) : (
                                    <span className="text-[12px] font-mono font-bold">{index + 1}</span>
                                )}
                            </div>

                            {/* Label */}
                            <span className={cn(
                                "absolute -bottom-8 whitespace-nowrap text-[10px] font-mono font-bold tracking-[0.2em] uppercase transition-colors duration-300",
                                isCurrent || isCompleted ? "text-gold-warm" : "text-text-muted"
                            )}>
                                {step}
                            </span>

                            {/* Glow effect for current step */}
                            {isCurrent && (
                                <motion.div
                                    layoutId="step-glow"
                                    className="absolute -inset-2 bg-gold-warm/5 blur-xl rounded-full -z-20"
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
