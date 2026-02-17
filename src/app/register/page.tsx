"use client";

import { useRegistrationStore } from "@/store/registration-store";
import { Steps } from "@/components/ui/steps";
import PersonalStep from "@/components/registration/PersonalStep";
import LocationStep from "@/components/registration/LocationStep";
import DenominationStep from "@/components/registration/DenominationStep";
import ReviewStep from "@/components/registration/ReviewStep";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

const steps = ["Personal Info", "Location", "Religious & Civic", "Review"];

export default function RegisterPage() {
    const { currentStep } = useRegistrationStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <PersonalStep />;
            case 1:
                return <LocationStep />;
            case 2:
                return <DenominationStep />;
            case 3:
                return <ReviewStep />;
            default:
                return <PersonalStep />;
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-dark-base selection:bg-gold-warm/20 selection:text-gold-warm py-12 md:py-24 px-4 sm:px-6 lg:px-8">
            {/* Ambient Background — Matches Landing/Login */}
            <div className="absolute inset-0 -z-10 bg-dark-void">
                <div className="absolute top-[10%] left-[5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gold-warm/5 rounded-full blur-[80px] md:blur-[140px]" />
                <div className="absolute bottom-[20%] right-[10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-royal-500/5 rounded-full blur-[80px] md:blur-[140px]" />
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(to right, #c9a84c 1px, transparent 1px),
                                         linear-gradient(to bottom, #c9a84c 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                {/* Header Block */}
                <div className="text-center mb-10 md:mb-16">
                    <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-text-muted hover:text-gold-warm transition-all uppercase tracking-[0.2em] mb-8 md:mb-12 group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        Back to Core System
                    </Link>

                    <div className="flex justify-center mb-6 md:mb-8">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-dark-elevated border border-gold-muted/20 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-gold-warm/5">
                            <Shield className="w-6 h-6 md:w-8 md:h-8 text-gold-warm" />
                        </div>
                    </div>

                    <h2
                        className="text-4xl md:text-6xl text-text-primary mb-4 md:mb-6"
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
                    >
                        National <span className="italic text-gold-warm">Enrolment</span>
                    </h2>

                    <div className="max-w-xl md:max-w-2xl mx-auto px-2">
                        <p className="text-base md:text-lg text-text-secondary font-body font-light leading-relaxed">
                            Join the secure national registry. Please provide accurate information
                            for institutional validation.
                        </p>
                    </div>
                </div>

                {/* Progress Steps — Hidden or condensed on very small screens? No, Steps component should handle it */}
                <div className="max-w-3xl mx-auto mb-12 md:mb-20">
                    <Steps steps={steps} currentStep={currentStep} />
                </div>

                {/* Step Content */}
                <div className="mt-8 md:mt-12">
                    {renderStep()}
                </div>

                {/* Footer system info */}
                <div className="mt-16 md:mt-24 pt-8 border-t border-white/5 text-center px-4">
                    <p className="text-[9px] md:text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] md:tracking-[0.3em] leading-relaxed">
                        SECURE ENROLMENT PROTOCOL v4.0.2 · NMVR SYSTEM
                    </p>
                </div>
            </div>
        </div>
    );
}
