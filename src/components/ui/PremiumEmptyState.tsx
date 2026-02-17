"use client";

import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    icon?: React.ElementType;
    title: string;
    description: string;
    action?: string;
    onAction?: () => void;
}

export function PremiumEmptyState({
    icon: Icon = FolderOpen,
    title,
    description,
    action,
    onAction
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center bg-neutral-50/50 rounded-3xl border border-neutral-200/50 border-dashed"
        >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center mb-6 shadow-inner">
                <Icon className="w-10 h-10 text-neutral-400" />
            </div>

            <h3 className="text-xl font-bold text-neutral-900 mb-2 font-display">
                {title}
            </h3>

            <p className="text-neutral-500 mb-8 max-w-sm leading-relaxed">
                {description}
            </p>

            {action && onAction && (
                <Button
                    onClick={onAction}
                    className="shadow-lg shadow-primary-500/20"
                >
                    {action}
                </Button>
            )}
        </motion.div>
    );
}
