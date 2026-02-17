'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight, ShieldCheck, Database, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureCards } from '@/components/landing/FeatureCards';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-dark-base text-text-primary selection:bg-gold-warm/20 selection:text-gold-warm">
      {/* 
          UNIFIED BACKGROUND SYSTEM
          Applied at the root of the landing page to provide continuity.
      */}
      <div className="fixed inset-0 -z-10 bg-dark-void">
        {/* Spotlight elements */}
        <div className="absolute top-[20%] left-[10%] w-[800px] h-[800px] bg-gold-warm/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-royal-500/5 rounded-full blur-[140px]" />

        {/* Global Grid — very faint */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, #c9a84c 1px, transparent 1px),
                                   linear-gradient(to bottom, #c9a84c 1px, transparent 1px)`,
            backgroundSize: '120px 120px'
          }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeatureCards />

        {/* CTA Section — Institutional Style */}
        <section className="max-w-7xl mx-auto px-6 py-24 md:py-40 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 bg-dark-surface border border-white/5 rounded-[2rem] md:rounded-[3rem] p-8 md:p-32 text-center shadow-elevated overflow-hidden"
          >
            {/* Background elements for CTA */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-warm/5 to-transparent opacity-50" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 md:h-24 bg-gradient-to-b from-gold-warm to-transparent" />

            <div className="relative z-10">
              <ShieldCheck className="w-12 h-12 md:w-20 md:h-20 text-gold-warm mx-auto mb-8 md:mb-10 opacity-80" />

              <h2
                className="text-4xl md:text-7xl text-text-primary mb-6 md:mb-8 tracking-tight leading-tight"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
              >
                Secure Your <br className="md:hidden" /> <span className="italic">Membership</span>
              </h2>

              <p className="text-text-secondary text-lg md:text-2xl mb-10 md:mb-12 max-w-2xl mx-auto font-body font-light leading-relaxed">
                Join the national registry through a verified protocol.
                Your data is protected by sovereign encryption.
              </p>

              <Link href="/register" className="inline-block w-full sm:w-auto">
                <Button
                  className="group w-full sm:w-auto h-14 md:h-16 px-10 bg-gold-warm hover:bg-gold-bright text-dark-void font-bold text-lg rounded-xl shadow-gold transition-all duration-300"
                >
                  Initiate Registration
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <p className="mt-8 text-[9px] md:text-[10px] text-text-muted font-mono tracking-[0.3em] uppercase">
                Verification required by local authority
              </p>
            </div>
          </motion.div>
        </section>

        {/* Footer — Deep Dark Editorial */}
        <footer className="border-t border-white/5 bg-dark-void pt-20 md:pt-32 pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-24">
              <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-4 mb-6 md:mb-8 group">
                  <div className="w-12 h-12 bg-dark-elevated border border-gold-muted/30 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-gold-warm" />
                  </div>
                  <div>
                    <span className="font-bold text-lg text-text-primary block leading-none">NMRVP</span>
                    <span className="text-[9px] text-gold-warm font-mono tracking-widest uppercase">Official Registry</span>
                  </div>
                </div>
                <p className="text-text-secondary leading-relaxed text-sm font-light">
                  A unified digital ecosystem for secure, nationwide membership registration and institutional validation.
                </p>
              </div>

              <div>
                <h4 className="text-[10px] md:text-xs font-mono font-bold text-text-primary tracking-[0.2em] uppercase mb-4 md:mb-8">Platform</h4>
                <ul className="space-y-3 md:space-y-4 text-[11px] md:text-xs font-mono text-text-muted">
                  <li><Link href="/register" className="hover:text-gold-warm transition-colors uppercase tracking-widest">Register</Link></li>
                  <li><Link href="/login" className="hover:text-gold-warm transition-colors uppercase tracking-widest">Admin Access</Link></li>
                  <li><Link href="#" className="hover:text-gold-warm transition-colors uppercase tracking-widest">Directory</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] md:text-xs font-mono font-bold text-text-primary tracking-[0.2em] uppercase mb-4 md:mb-8">Governance</h4>
                <ul className="space-y-3 md:space-y-4 text-[11px] md:text-xs font-mono text-text-muted">
                  <li><Link href="#" className="hover:text-gold-warm transition-colors uppercase tracking-widest">Compliance</Link></li>
                  <li><Link href="#" className="hover:text-gold-warm transition-colors uppercase tracking-widest">Data Privacy</Link></li>
                  <li><Link href="#" className="hover:text-gold-warm transition-colors uppercase tracking-widest">Protocols</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] md:text-xs font-mono font-bold text-text-primary tracking-[0.2em] uppercase mb-4 md:mb-8">Authority</h4>
                <ul className="space-y-3 md:space-y-4 text-[11px] md:text-xs font-mono text-text-muted">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-status-validated" />
                    STATUS: <span className="text-status-validated">OPERATIONAL</span>
                  </li>
                  <li>NODE: FEDERAL_CENTRAL_01</li>
                  <li>LOC: NIGERIA_TERRITORY</li>
                </ul>
              </div>
            </div>

            <div className="pt-10 md:pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-[9px] md:text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] text-center md:text-left">
              <div>
                © {new Date().getFullYear()} NATIONAL MEMBERSHIP REGISTRATION PLATFORM · ALL RIGHTS RESERVED.
              </div>
              <div className="flex items-center gap-6">
                PRODUCED BY <span className="text-gold-warm">NANRO TECHNOLOGY</span> · v4.0.2
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
