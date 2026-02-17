'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';

interface DistributionData {
    id: string;
    name: string;
    count: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-dark-800/95 backdrop-blur-sm p-3 border border-neutral-700 shadow-xl rounded-xl ring-1 ring-gold-400/20">
                <p className="text-sm font-semibold text-white mb-1">{label}</p>
                <span className="text-neutral-400 font-medium">Members: </span>
                <span className="font-bold text-gold-400">{payload[0].value}</span>
            </div>
        );
    }
    return null;
};

export function GeographicDistributionChart() {
    const [data, setData] = useState<DistributionData[]>([]);
    const [level, setLevel] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchDistribution() {
            try {
                const response = await fetch('/api/admin/analytics/geographic');
                if (response.ok) {
                    const result = await response.json();
                    setData(result.distribution);
                    setLevel(result.level);
                }
            } catch (error) {
                console.error('Failed to fetch geographic distribution:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchDistribution();
    }, []);

    if (isLoading) {
        return (
            <div className="h-80 flex flex-col items-center justify-center text-neutral-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-gold-400" />
                <p>Loading map data...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="h-80 flex flex-col items-center justify-center text-neutral-500 bg-dark-800/20 rounded-xl border border-neutral-800 border-dashed">
                <div className="p-4 bg-dark-700/50 rounded-full mb-3">
                    <Loader2 className="w-6 h-6 text-neutral-600" />
                </div>
                <p className="font-medium">No geographic data available</p>
                <p className="text-xs text-neutral-600 mt-1">Member distribution will appear here</p>
            </div>
        );
    }

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" opacity={0.5} />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#737373', fontSize: 11 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#737373', fontSize: 12 }}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: '#fbbf24', opacity: 0.1 }}
                    />
                    <Bar
                        dataKey="count"
                        fill="url(#goldGradient)"
                        radius={[4, 4, 0, 0]}
                        name="Members"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`url(#goldGradient-${index})`} />
                        ))}
                    </Bar>
                    <defs>
                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fbbf24" stopOpacity={1} />
                            <stop offset="100%" stopColor="#d97706" stopOpacity={0.8} />
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
