'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface TrendData {
    date: string;
    total: number;
    validated: number;
    pending: number;
    rejected: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-dark-800/95 backdrop-blur-sm p-4 border border-neutral-700 shadow-xl rounded-xl ring-1 ring-gold-400/20">
                <p className="text-sm font-semibold text-white mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-neutral-400 font-medium">{entry.name}:</span>
                        <span className="font-bold text-white">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function RegistrationTrendChart() {
    const [data, setData] = useState<TrendData[]>([]);
    const [period, setPeriod] = useState('daily');
    const [days, setDays] = useState(30);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchTrends() {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/admin/analytics/trends?period=${period}&days=${days}`);
                if (response.ok) {
                    const result = await response.json();
                    setData(result.trends);
                }
            } catch (error) {
                console.error('Failed to fetch trends:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTrends();
    }, [period, days]);

    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex justify-end gap-3 mb-4">
                <div className="w-32">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="h-9 py-1 px-3 text-xs bg-dark-700/50 border-neutral-700 text-neutral-300 hover:border-gold-500/50 focus:ring-gold-500/20">
                            <SelectValue placeholder="Daily" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-800 border-neutral-700 text-neutral-300">
                            <SelectItem value="daily" className="focus:bg-dark-700 focus:text-gold-400">Daily</SelectItem>
                            <SelectItem value="weekly" className="focus:bg-dark-700 focus:text-gold-400">Weekly</SelectItem>
                            <SelectItem value="monthly" className="focus:bg-dark-700 focus:text-gold-400">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-32">
                    <Select value={days.toString()} onValueChange={(value) => setDays(parseInt(value))}>
                        <SelectTrigger className="h-9 py-1 px-3 text-xs bg-dark-700/50 border-neutral-700 text-neutral-300 hover:border-gold-500/50 focus:ring-gold-500/20">
                            <SelectValue placeholder="Last 30 days" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-800 border-neutral-700 text-neutral-300">
                            <SelectItem value="7" className="focus:bg-dark-700 focus:text-gold-400">Last 7 days</SelectItem>
                            <SelectItem value="30" className="focus:bg-dark-700 focus:text-gold-400">Last 30 days</SelectItem>
                            <SelectItem value="90" className="focus:bg-dark-700 focus:text-gold-400">Last 90 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex-1 min-h-[300px]">
                {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                        <Loader2 className="w-8 h-8 animate-spin mb-2 text-gold-500" />
                        <p className="text-sm">Loading chart data...</p>
                    </div>
                ) : data.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-500 bg-dark-800/20 rounded-xl border border-neutral-800 border-dashed">
                        <p className="font-medium">No trend data available</p>
                        <p className="text-xs text-neutral-600 mt-1">Try selecting a different period</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" opacity={0.5} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#737373', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#737373', fontSize: 12 }}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ stroke: '#525252', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />

                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#818cf8"
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                                strokeWidth={2}
                                name="Total Registrations"
                            />
                            <Line
                                type="monotone"
                                dataKey="validated"
                                stroke="#34d399"
                                strokeWidth={2}
                                dot={false}
                                name="Validated"
                            />
                            <Line
                                type="monotone"
                                dataKey="pending"
                                stroke="#fbbf24"
                                strokeWidth={2}
                                dot={false}
                                name="Pending"
                            />
                            <Line
                                type="monotone"
                                dataKey="rejected"
                                stroke="#f43f5e"
                                strokeWidth={2}
                                dot={false}
                                name="Rejected"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
