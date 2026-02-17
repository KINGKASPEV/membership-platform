"use client";

import { motion } from "framer-motion";

export function PremiumLoadingSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-dark-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-6 h-32"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 bg-neutral-700/50 rounded-2xl" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 bg-neutral-700/50 rounded w-24" />
                            <div className="h-8 bg-neutral-700/50 rounded w-16" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-dark-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-6 h-96"
                    >
                        <div className="space-y-2 mb-4">
                            <div className="h-6 bg-neutral-700/50 rounded w-32" />
                            <div className="h-4 bg-neutral-700/50 rounded w-48" />
                        </div>
                        <div className="h-64 bg-neutral-700/50 rounded" />
                    </div>
                ))}
            </div>

            {/* Full-width Chart Skeleton */}
            <div className="bg-dark-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-6 h-96">
                <div className="space-y-2 mb-4">
                    <div className="h-6 bg-dark-elevated/50 rounded w-40" />
                    <div className="h-4 bg-dark-elevated/50 rounded w-56" />
                </div>
                <div className="h-64 bg-dark-elevated/50 rounded" />
            </div>
        </div>
    );
}
