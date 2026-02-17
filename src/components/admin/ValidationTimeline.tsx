import { CheckCircle, XCircle, Edit, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ValidationLog {
    id: string;
    action: string;
    previousStatus?: string;
    newStatus?: string;
    notes?: string;
    createdAt: string;
    adminFirstName: string;
    adminLastName: string;
}

interface ValidationTimelineProps {
    history: ValidationLog[];
}

export function ValidationTimeline({ history }: ValidationTimelineProps) {
    if (history.length === 0) {
        return (
            <div className="text-center py-8 text-neutral-500 bg-dark-800/30 rounded-lg border border-neutral-700/30 border-dashed">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No validation history available</p>
            </div>
        );
    }

    const getActionIcon = (action: string) => {
        switch (action.toLowerCase()) {
            case 'approve':
            case 'approved':
                return <CheckCircle className="w-4 h-4 text-white" />;
            case 'reject':
            case 'rejected':
                return <XCircle className="w-4 h-4 text-white" />;
            case 'edit':
            case 'edited':
                return <Edit className="w-4 h-4 text-white" />;
            default:
                return <Clock className="w-4 h-4 text-white" />;
        }
    };

    const getActionColorDetails = (action: string) => {
        switch (action.toLowerCase()) {
            case 'approve':
            case 'approved':
                return { bg: 'bg-success-500', border: 'border-success-500', text: 'text-success-400' };
            case 'reject':
            case 'rejected':
                return { bg: 'bg-error-500', border: 'border-error-500', text: 'text-error-400' };
            case 'edit':
            case 'edited':
                return { bg: 'bg-info-500', border: 'border-info-500', text: 'text-info-400' };
            default:
                return { bg: 'bg-neutral-500', border: 'border-neutral-500', text: 'text-neutral-400' };
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
            time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <div className="relative space-y-0 pl-4 py-2">
            {/* Vertical Line */}
            <div className="absolute left-[1.65rem] top-4 bottom-4 w-px bg-neutral-700/50" />

            {history.map((log, index) => {
                const styles = getActionColorDetails(log.action);
                const { date, time } = formatDate(log.createdAt);

                return (
                    <div key={log.id} className="relative flex gap-6 pb-8 last:pb-0 group">
                        {/* Timeline Icon */}
                        <div className={cn(
                            "relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg transition-transform group-hover:scale-110",
                            styles.bg,
                            styles.border
                        )}>
                            {getActionIcon(log.action)}
                        </div>

                        {/* Content Card */}
                        <div className="flex-1 bg-dark-700/30 border border-neutral-700/30 rounded-lg p-4 hover:border-gold-400/30 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className={cn("font-semibold capitalize text-base", styles.text)}>
                                        {log.action}
                                    </h4>
                                    <div className="flex items-center text-xs text-neutral-400 mt-1">
                                        <User className="w-3 h-3 mr-1" />
                                        <span>{log.adminFirstName} {log.adminLastName}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-white">{date}</p>
                                    <p className="text-xs text-neutral-500">{time}</p>
                                </div>
                            </div>

                            {log.notes && (
                                <div className="mt-3 p-3 bg-dark-800/50 rounded-md border-l-2 border-neutral-600 text-sm italic text-neutral-300">
                                    "{log.notes}"
                                </div>
                            )}

                            {(log.previousStatus || log.newStatus) && (
                                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                                    <span className="text-neutral-500">Status changed:</span>
                                    {log.previousStatus && (
                                        <Badge variant="outline" className="text-neutral-400 border-neutral-600">
                                            {log.previousStatus}
                                        </Badge>
                                    )}
                                    <span className="text-neutral-600">→</span>
                                    {log.newStatus && (
                                        <Badge className={cn(
                                            log.newStatus === 'validated' ? 'bg-success-500/20 text-success-400 hover:bg-success-500/30' :
                                                log.newStatus === 'rejected' ? 'bg-error-500/20 text-error-400 hover:bg-error-500/30' :
                                                    'bg-neutral-500/20 text-neutral-400'
                                        )}>
                                            {log.newStatus}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
