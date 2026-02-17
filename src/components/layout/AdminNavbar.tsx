"use client";

import { LogOut, Users, UsersRound, Shield, Download, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExportButton } from "@/components/admin/ExportButton";

interface AdminNavbarProps {
    user: { firstName: string; lastName: string; role: string } | null;
}

export function AdminNavbar({ user }: AdminNavbarProps) {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <header className="relative border-b border-white/5 bg-dark-base sticky top-0 z-40">
            {/* Gold accent line — thin, elegant */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-warm to-transparent" />

            <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4 md:py-5">
                <div className="flex items-center justify-between">

                    {/* Left: Logo + Identity Block */}
                    <div className="flex items-center gap-3 md:gap-5">
                        {/* Logo: Shield with inner cross/seal */}
                        <div className="relative">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-dark-elevated border border-gold-muted/30 rounded-xl flex items-center justify-center shadow-lg shadow-gold-warm/5">
                                <Shield className="w-5 h-5 md:w-6 md:h-6 text-gold-warm" />
                            </div>
                            {/* Live indicator */}
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-status-validated rounded-full border-2 border-dark-base animate-pulse-soft" />
                        </div>

                        {/* Vertical divider */}
                        <div className="w-px h-8 md:h-10 bg-white/10 hidden sm:block" />

                        {/* Title Block — Serif for authority */}
                        <div className="flex flex-col">
                            <h1
                                className="text-xl md:text-3xl leading-none text-text-primary"
                                style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
                            >
                                Dashboard
                            </h1>
                            <p className="text-[9px] md:text-xs text-text-muted mt-1 font-mono tracking-wide">
                                <span className="hidden md:inline">NATIONAL MEMBERSHIP PLATFORM · </span>SUPER ADMIN
                            </p>
                        </div>
                    </div>

                    {/* Right: Actions — Differentiated hierarchy */}
                    <div className="flex items-center gap-1 md:gap-2">
                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center gap-2">
                            <button
                                onClick={() => router.push('/admin/users')}
                                className="px-4 py-2.5 text-text-secondary hover:text-text-primary text-sm font-medium rounded-lg hover:bg-dark-elevated transition-all items-center gap-2"
                            >
                                <Users className="w-4 h-4" />
                                Users
                            </button>
                            <button
                                onClick={() => router.push('/admin/members')}
                                className="px-4 py-2.5 text-text-secondary hover:text-text-primary text-sm font-medium rounded-lg hover:bg-dark-elevated transition-all items-center gap-2"
                            >
                                <UsersRound className="w-4 h-4" />
                                Members
                            </button>
                            <div className="w-px h-8 bg-white/5 mx-1" />
                            <ExportButton className="relative px-5 py-2.5 bg-gold-warm hover:bg-gold-bright text-dark-void font-semibold text-sm rounded-lg transition-all shadow-[0_0_40px_rgba(201,168,76,0.12)] overflow-hidden group border-none" />
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2.5 text-text-muted hover:text-text-secondary rounded-lg hover:bg-dark-elevated transition-all"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="w-px h-6 bg-white/5 mx-1 hidden md:block" />

                        {/* Logout — Subtle, iconographic */}
                        <button
                            onClick={handleLogout}
                            className="p-2.5 text-text-muted hover:text-text-secondary rounded-lg hover:bg-dark-elevated transition-all"
                            title="Sign out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-[100%] left-0 right-0 bg-dark-base border-b border-white/10 shadow-2xl z-50 animate-in slide-in-from-top duration-300">
                    <nav className="flex flex-col p-4 space-y-2">
                        <button
                            onClick={() => { router.push('/admin/users'); setIsMobileMenuOpen(false); }}
                            className="flex items-center gap-3 px-4 py-4 text-text-secondary hover:text-text-primary hover:bg-dark-elevated rounded-xl transition-all"
                        >
                            <Users className="w-5 h-5" />
                            <span className="font-medium">Manage Users</span>
                        </button>
                        <button
                            onClick={() => { router.push('/admin/members'); setIsMobileMenuOpen(false); }}
                            className="flex items-center gap-3 px-4 py-4 text-text-secondary hover:text-text-primary hover:bg-dark-elevated rounded-xl transition-all"
                        >
                            <UsersRound className="w-5 h-5" />
                            <span className="font-medium">Registry Members</span>
                        </button>
                        <div className="pt-2">
                            <ExportButton className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gold-warm text-dark-void font-bold rounded-xl transition-all border-none" />
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
