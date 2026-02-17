'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Loader2 } from 'lucide-react';

interface ValidationStats {
    validated: number;
    pending: number;
    rejected: number;
    validationRate: number;
    rejectionRate: number;
    weekOverWeekChange: number;
}

const COLORS = {
    validated: '#10b981', // Emerald
    pending: '#f59e0b',   // Amber
    rejected: '#f43f5e',   // Rose
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm p-3 border border-neutral-100 shadow-xl rounded-xl ring-1 ring-black/5">
                <span className="text-neutral-600 font-medium">{payload[0].name}: </span>
                <span className="font-bold text-neutral-900">{payload[0].value}</span>
            </div>
        );
    }
    return null;
};

export function ValidationRateChart() {
    const [stats, setStats] = useState<ValidationStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/admin/analytics/validation-rate');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch validation stats:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-neutral-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary-500" />
                <p>Loading stats...</p>
            </div>
        );
    }

    if (!stats) {
        return <div className="h-64 flex items-center justify-center text-neutral-400">No data available</div>;
    }

    const chartData = [
        { name: 'Validated', value: stats.validated },
        { name: 'Pending', value: stats.pending },
        { name: 'Rejected', value: stats.rejected },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-center">
            <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-white">{stats.validationRate}%</p>
                        <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Validated</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center space-y-6">
                <div className="p-4 bg-dark-700/30 rounded-xl border border-success-500/20 backdrop-blur-sm">
                    <p className="text-sm font-medium text-success-400 mb-1">Validation Rate</p>
                    <p className="text-3xl font-bold text-white">{stats.validationRate}%</p>
                </div>

                <div className="p-4 bg-dark-700/30 rounded-xl border border-error-500/20 backdrop-blur-sm">
                    <p className="text-sm font-medium text-error-400 mb-1">Rejection Rate</p>
                    <p className="text-3xl font-bold text-white">{stats.rejectionRate}%</p>
                </div>

                <div>
                    <p className="text-sm text-neutral-400 mb-1">Week-over-Week</p>
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 text-lg font-bold ${stats.weekOverWeekChange >= 0 ? 'text-success-400' : 'text-error-400'}`}>
                            {stats.weekOverWeekChange >= 0 ? '+' : ''}{stats.weekOverWeekChange}%
                        </div>
                        <span className="text-xs text-neutral-500">vs last week</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
