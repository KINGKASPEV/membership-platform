'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Users,
    TrendingUp,
    CheckCircle,
    Clock,
    XCircle,
    MapPin,
    Loader2
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { AdminNavbar } from '@/components/layout/AdminNavbar';

interface DashboardStats {
    totalMembers: number;
    pendingValidations: number;
    validatedToday: number;
    rejectedToday: number;
}

interface TrendData {
    date: string;
    total: number;
    validated: number;
    pending: number;
    rejected: number;
}

interface GeographicData {
    name: string;
    count: number;
    percentage?: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [trendData, setTrendData] = useState<TrendData[]>([]);
    const [geoData, setGeoData] = useState<GeographicData[]>([]);
    const [user, setUser] = useState<{ firstName: string; lastName: string; role: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchAllData() {
            try {
                // 1. User Info
                const userRes = await fetch('/api/auth/me');
                if (!userRes.ok) throw new Error('Unauthorized');
                const userData = await userRes.json();
                setUser(userData);

                // 2. Stats
                const statsRes = await fetch('/api/admin/stats');
                const statsData = statsRes.ok ? await statsRes.json() : null;

                // 3. Trends (default 30 days)
                const trendsRes = await fetch('/api/admin/analytics/trends?period=daily&days=30');
                const trendsData = trendsRes.ok ? await trendsRes.json() : { trends: [] };

                // 4. Geographic
                const geoRes = await fetch('/api/admin/analytics/geographic');
                const geoResult = geoRes.ok ? await geoRes.json() : { distribution: [] };

                setStats(statsData);
                setTrendData(trendsData.trends || []);

                // Calculate percentages for geo data
                const totalGeo = geoResult.distribution.reduce((acc: number, curr: GeographicData) => acc + curr.count, 0);
                const processedGeo = geoResult.distribution.map((item: GeographicData) => ({
                    ...item,
                    percentage: totalGeo > 0 ? (item.count / totalGeo) * 100 : 0
                })).sort((a: GeographicData, b: GeographicData) => b.count - a.count).slice(0, 5); // Start with top 5

                setGeoData(processedGeo);

            } catch (error) {
                console.error('Dashboard data fetch specific error:', error);
                // router.push('/login'); // Optional: redirect on error
            } finally {
                setIsLoading(false);
            }
        }

        fetchAllData();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-dark-base flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-gold-warm animate-spin" />
            </div>
        );
    }

    // fallback if fetch failed
    const totalMembers = stats?.totalMembers || 0;
    const validatedToday = stats?.validatedToday || 0;
    const pending = stats?.pendingValidations || 0;
    const rejected = stats?.rejectedToday || 0;

    // Chart data mapping
    const chartData = trendData.map(t => ({
        month: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        members: t.total
    }));

    return (
        <div className="min-h-screen font-sans bg-dark-base text-white selection:bg-gold-warm/30 selection:text-white">
            <AdminNavbar user={user} />

            <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-8">

                {/* 1. STATS GRID — Asymmetric, signature layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-8">

                    {/* HERO STAT — Total Members (spans 5 cols) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="col-span-1 md:col-span-12 lg:col-span-5 relative bg-dark-surface rounded-2xl border border-border-subtle p-6 md:p-8 overflow-hidden group cursor-default shadow-card"
                    >
                        {/* Ambient gold light */}
                        <div className="absolute -top-16 -left-16 w-32 md:w-48 h-32 md:h-48 bg-gold-warm/15 rounded-full blur-3xl group-hover:opacity-150 transition-opacity duration-700" />

                        {/* Decorative watermark */}
                        <div
                            className="absolute right-4 md:right-6 top-2 md:top-4 text-[80px] md:text-[120px] leading-none text-white/[0.03] select-none pointer-events-none"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            01
                        </div>

                        <div className="relative z-10">
                            {/* Label */}
                            <div className="flex items-center gap-2 mb-4 md:mb-6">
                                <div className="w-8 h-8 rounded-lg bg-dark-elevated border border-border-gold flex items-center justify-center">
                                    <Users className="w-4 h-4 text-gold-warm" />
                                </div>
                                <span className="text-[10px] md:text-xs text-text-muted tracking-[0.15em] uppercase font-semibold font-body">
                                    Total Members
                                </span>
                            </div>

                            {/* Value */}
                            <div className="mb-4">
                                <span className="text-5xl md:text-7xl text-text-primary leading-none font-extralight tracking-tight">
                                    {totalMembers.toLocaleString()}
                                </span>
                            </div>

                            {/* Indicator */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-status-validated/10 border border-status-validated/20 rounded-full">
                                    <TrendingUp className="w-3.5 h-3.5 text-status-validated" />
                                    <span className="text-[10px] md:text-xs font-medium text-status-validated">+2.4% this month</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* VALIDATED (spans 3 cols) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="col-span-1 md:col-span-6 lg:col-span-3 relative bg-dark-surface rounded-2xl border border-border-subtle p-5 md:p-6 overflow-hidden group shadow-card"
                    >
                        <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-status-validated/5 rounded-full blur-2xl" />

                        <div className="relative z-10">
                            <div className="w-9 h-9 rounded-xl bg-status-validated/10 border border-status-validated/20 flex items-center justify-center mb-4">
                                <CheckCircle className="w-5 h-5 text-status-validated" />
                            </div>
                            <span className="text-[10px] text-text-muted tracking-widest uppercase font-semibold block mb-2">
                                Validated Today
                            </span>
                            <span className="text-4xl md:text-5xl text-text-primary leading-none block mb-3 font-extralight">
                                {validatedToday.toLocaleString()}
                            </span>
                            {/* Sparkline visualization */}
                            <div className="flex items-end gap-0.5 h-6 opacity-60">
                                {[3, 5, 4, 7, 6, 8, 9, 7, 10, 8, 12, 11].map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 rounded-sm bg-status-validated/40"
                                        style={{ height: `${(h / 12) * 100}%` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* PENDING (spans 6 cols on small, 2 on desktop) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="col-span-1 md:col-span-3 lg:col-span-2 relative bg-dark-surface rounded-2xl border border-border-subtle p-5 md:p-6 overflow-hidden group shadow-card"
                    >
                        <div className="relative z-10">
                            <div className="w-9 h-9 rounded-xl bg-status-pending/10 border border-status-pending/20 flex items-center justify-center mb-4">
                                <Clock className="w-5 h-5 text-status-pending" />
                            </div>
                            <span className="text-[10px] text-text-muted tracking-widest uppercase font-semibold block mb-2">
                                Pending
                            </span>
                            <span className="text-4xl md:text-5xl text-text-primary leading-none font-extralight">
                                {pending.toLocaleString()}
                            </span>
                        </div>
                    </motion.div>

                    {/* REJECTED (spans 6 cols on small, 2 on desktop) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="col-span-1 md:col-span-3 lg:col-span-2 relative bg-dark-surface rounded-2xl border border-border-subtle p-5 md:p-6 overflow-hidden group shadow-card"
                    >
                        <div className="relative z-10">
                            <div className="w-9 h-9 rounded-xl bg-status-rejected/10 border border-status-rejected/20 flex items-center justify-center mb-4">
                                <XCircle className="w-5 h-5 text-status-rejected" />
                            </div>
                            <span className="text-[10px] text-text-muted tracking-widest uppercase font-semibold block mb-2">
                                Rejected
                            </span>
                            <span className="text-4xl md:text-5xl text-text-primary leading-none font-extralight">
                                {rejected.toLocaleString()}
                            </span>
                        </div>
                    </motion.div>
                </div>


                {/* 2. ANALYTICS SECTION — 3-column signature layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Validation Rate — Full redesign, left col spans 4 */}
                    <div className="col-span-1 lg:col-span-4 bg-dark-surface rounded-2xl border border-border-subtle p-6 md:p-7 shadow-card">
                        <div className="flex items-start justify-between mb-6 md:mb-8">
                            <div>
                                <h3
                                    className="text-lg md:text-xl text-text-primary mb-1"
                                    style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
                                >
                                    Validation Rate
                                </h3>
                                <p className="text-[11px] md:text-xs text-text-muted tracking-wide">
                                    Daily validation performance
                                </p>
                            </div>
                        </div>

                        {/* BIG number center */}
                        <div className="text-center py-4 md:py-6">
                            <div
                                className="text-[64px] md:text-[88px] leading-none text-gold-warm mb-2"
                                style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400 }}
                            >
                                {stats?.totalMembers ? Math.round(((stats.totalMembers - stats.pendingValidations) / stats.totalMembers) * 100) : 0}%
                            </div>
                            <p className="text-[10px] md:text-xs text-text-muted tracking-[0.2em] uppercase">
                                Validated
                            </p>
                        </div>

                        {/* Rate rows */}
                        <div className="space-y-3 mt-6 pt-6 border-t border-border-subtle">
                            {[
                                { label: 'Validated Count', value: totalMembers - pending, color: 'var(--status-validated)' },
                                { label: 'Pending Count', value: pending, color: 'var(--status-pending)' },
                                { label: 'Rejected Count', value: rejected, color: 'var(--status-rejected)' },
                            ].map((row) => (
                                <div key={row.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: row.color }} />
                                        <span className="text-xs md:text-sm text-text-secondary">{row.label}</span>
                                    </div>
                                    <span className="text-xs md:text-sm font-mono font-medium text-text-primary">
                                        {row.value.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Member Growth Chart — spans 5 */}
                    <div className="col-span-1 lg:col-span-5 bg-dark-surface rounded-2xl border border-border-subtle p-6 md:p-7 shadow-card">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h3
                                    className="text-lg md:text-xl text-text-primary mb-1"
                                    style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
                                >
                                    Member Growth
                                </h3>
                                <p className="text-[11px] md:text-xs text-text-muted tracking-wide">
                                    Registrations over time
                                </p>
                            </div>
                            {/* Period selector */}
                            <div className="flex items-center gap-1 bg-dark-elevated rounded-lg p-1 w-full sm:w-auto overflow-x-auto">
                                {['7D', '30D', '90D', '1Y'].map((p) => (
                                    <button key={p} className={`flex-1 sm:flex-none px-3 py-1.5 text-[10px] md:text-xs font-medium rounded-md transition-all whitespace-nowrap ${p === '30D'
                                        ? 'bg-gold-warm text-dark-void'
                                        : 'text-text-muted hover:text-text-secondary'
                                        }`}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recharts Area Chart */}
                        <div className="h-[200px] md:h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#c9a84c" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#c9a84c" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fill: '#4a5568', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={10}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        tick={{ fill: '#4a5568', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#1c2433',
                                            border: '1px solid rgba(201, 168, 76, 0.20)',
                                            borderRadius: '10px',
                                            color: '#e8ecf0',
                                            fontSize: '11px',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                                        }}
                                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="members"
                                        stroke="#c9a84c"
                                        strokeWidth={2}
                                        fill="url(#goldGradient)"
                                        dot={false}
                                        activeDot={{ r: 4, fill: '#c9a84c', stroke: '#0d1117', strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Geographic Distribution — spans 3 */}
                    <div className="col-span-1 lg:col-span-3 bg-dark-surface rounded-2xl border border-border-subtle p-6 md:p-7 shadow-card">
                        <div className="mb-6">
                            <h3
                                className="text-lg md:text-xl text-text-primary mb-1"
                                style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
                            >
                                Top States
                            </h3>
                            <p className="text-[11px] md:text-xs text-text-muted tracking-wide">
                                By member count
                            </p>
                        </div>

                        {/* State list */}
                        <div className="space-y-4 md:space-y-5">
                            {geoData.length > 0 ? geoData.map((state, i) => (
                                <div key={state.name} className="group">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] md:text-xs font-mono text-text-muted">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <span className="text-xs md:text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                                                {state.name}
                                            </span>
                                        </div>
                                        <span className="text-[10px] md:text-xs font-mono text-gold-warm">
                                            {state.count.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-1 bg-dark-overlay rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${state.percentage || 0}%` }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className="h-full bg-gold-warm rounded-full"
                                        />
                                    </div>
                                </div>
                            )) : (
                                /* Empty state */
                                <div className="py-8 text-center flex flex-col items-center justify-center h-40 md:h-48">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-dark-elevated border border-border-default flex items-center justify-center mb-4">
                                        <MapPin className="w-5 h-5 md:w-6 md:h-6 text-text-muted" />
                                    </div>
                                    <p className="text-xs md:text-sm text-text-muted">No regional data yet</p>
                                    <p className="text-[10px] md:text-xs text-text-muted/60 mt-1 max-w-[150px]">
                                        Distribution map appears after 50+ validations
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
