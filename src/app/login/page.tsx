'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Redirect to admin dashboard
            router.push('/admin/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-void p-6">
            {/* 
                DESIGN RULE: "Institutional Authority + African Modernity"
                Ambient background with grid and spotlight.
            */}
            <div className="fixed inset-0 -z-10">
                {/* Base background */}
                <div className="absolute inset-0 bg-dark-base" />

                {/* Spotlight effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-warm/5 rounded-full blur-[140px]" />

                {/* Grid pattern — subtle and authoritative */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(to right, #c9a84c 1px, transparent 1px),
                                         linear-gradient(to bottom, #c9a84c 1px, transparent 1px)`,
                        backgroundSize: '100px 100px'
                    }}
                />

                {/* Noise texture overlay */}
                <div
                    className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10 px-0 sm:px-4"
            >
                <Card variant="glass" className="border-border-gold/20 shadow-elevated relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
                    {/* Gold accent line — signature redesign */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-warm to-transparent opacity-80" />

                    <CardHeader className="space-y-4 text-center pt-8 md:pt-10 pb-6 md:pb-8">
                        {/* Logo: Shield with inner cross/seal */}
                        <div className="flex justify-center">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-dark-elevated border border-gold-muted/30 rounded-2xl flex items-center justify-center shadow-lg shadow-gold-warm/10">
                                <Shield className="w-6 h-6 md:w-8 md:h-8 text-gold-warm" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1
                                className="text-3xl md:text-4xl text-text-primary tracking-tight font-normal"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Institutional Access
                            </h1>
                            <p className="text-[9px] md:text-[10px] text-text-muted font-mono tracking-[0.2em] uppercase">
                                National Membership Platform
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="px-6 md:px-8 pb-8 md:pb-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="p-3.5 rounded-xl bg-status-rejected/10 border border-status-rejected/20 text-status-rejected text-xs flex items-center gap-2.5"
                                >
                                    <XCircle className="w-4 h-4 flex-shrink-0" />
                                    <span className="font-medium text-[11px] md:text-xs">{error}</span>
                                </motion.div>
                            )}

                            <div className="space-y-2.5">
                                <Label htmlFor="email" className="text-text-secondary text-[10px] md:text-[11px] font-semibold uppercase tracking-wider ml-1">
                                    Official Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@institution.ng"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="bg-dark-base border-border-default focus:border-gold-warm transition-all h-11 md:h-12"
                                />
                            </div>

                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between px-1">
                                    <Label htmlFor="password" className="text-text-secondary text-[10px] md:text-[11px] font-semibold uppercase tracking-wider">
                                        Secure Password
                                    </Label>
                                    <button
                                        type="button"
                                        className="text-[9px] md:text-[10px] font-mono text-gold-muted hover:text-gold-warm transition-colors uppercase tracking-widest"
                                    >
                                        Recovery
                                    </button>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="bg-dark-base border-border-default focus:border-gold-warm transition-all h-11 md:h-12"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full relative h-12 md:h-14 bg-gold-warm hover:bg-gold-bright text-dark-void font-bold text-sm tracking-wide shadow-gold transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Authenticated Entrance <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </span>
                                )}
                            </Button>

                            <div className="text-center pt-6 md:pt-8 border-t border-white/5 mt-4">
                                <p className="text-[9px] md:text-[10px] text-text-muted font-mono tracking-widest uppercase mb-4">
                                    System Security Protocol
                                </p>
                                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                                    <button
                                        type="button"
                                        onClick={() => router.push('/')}
                                        className="text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 group"
                                    >
                                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                                        Return Home
                                    </button>
                                    <div className="hidden md:block w-px h-4 bg-white/10" />
                                    <span className="text-xs text-text-muted flex items-center gap-2">
                                        <Lock className="w-3.5 h-3.5" /> Encrypted
                                    </span>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Technical Footnote — very small and classy */}
                <div className="text-center mt-8 md:mt-10">
                    <p className="text-[8px] md:text-[9px] text-text-muted/40 font-mono tracking-[0.3em] uppercase px-4">
                        AUTHORIZED PERSONNEL ONLY · NIGERIAN NATIONAL RECORDS · V.4.0
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

// Minimal missing component for the login page (XCircle)
function XCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
        </svg>
    );
}
