'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ExportButtonProps {
    status?: string;
    startDate?: string;
    endDate?: string;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "glass" | "gradient";
}

import { toast } from 'sonner';

export function ExportButton({ status, startDate, endDate, className, variant = "outline" }: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const params = new URLSearchParams();
            if (status) params.set('status', status);
            if (startDate) params.set('startDate', startDate);
            if (endDate) params.set('endDate', endDate);

            const response = await fetch(`/api/admin/export/members?${params}`);
            if (!response.ok) {
                throw new Error('Export service unavailable');
            }

            // Trigger download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `members_export_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Institutional Data Exported", {
                description: "The membership registry has been successfully compiled into a CSV file."
            });
        } catch (error) {
            console.error('Export error:', error);
            toast.error("Export Protocol Failure", {
                description: error instanceof Error ? error.message : "The system could not compile the requested export at this time."
            });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button onClick={handleExport} disabled={isExporting} variant={variant} className={className}>
            {isExporting ? 'Exporting...' : 'Export CSV'}
        </Button>
    );
}
