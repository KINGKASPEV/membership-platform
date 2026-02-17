import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Phone, MapPin, Calendar, ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn utility exists

interface Member {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    phoneNumber: string;
    status: string;
    parishName: string;
    createdAt: string;
}

interface MemberCardProps {
    member: Member;
    onClick: () => void;
}

export function MemberCard({ member, onClick }: MemberCardProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'validated':
                return (
                    <Badge className="bg-success-500/20 text-success-400 hover:bg-success-500/30 border-success-500/50">
                        <CheckCircle className="w-3 h-3 mr-1" /> Validated
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge className="bg-error-500/20 text-error-400 hover:bg-error-500/30 border-error-500/50">
                        <XCircle className="w-3 h-3 mr-1" /> Rejected
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-neutral-500/20 text-neutral-400 hover:bg-neutral-500/30 border-neutral-500/50">
                        <Clock className="w-3 h-3 mr-1" /> Pending
                    </Badge>
                );
        }
    };

    return (
        <Card
            className="group relative overflow-hidden bg-dark-800/40 backdrop-blur-sm border-neutral-700/50 hover:border-gold-400/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-gold-400/5"
            onClick={onClick}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-gold-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <CardContent className="p-5 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
                            <span className="text-dark-950 font-bold text-lg">
                                {member.firstName[0]}{member.lastName[0]}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-lg leading-tight group-hover:text-gold-400 transition-colors">
                                {member.firstName} {member.lastName}
                            </h3>
                            <div className="flex items-center text-xs text-neutral-400 mt-0.5">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>Joined {new Date(member.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    {getStatusBadge(member.status)}
                </div>

                <div className="space-y-2.5">
                    <div className="flex items-center p-2 rounded-lg bg-dark-900/50 border border-neutral-800/50 group-hover:border-neutral-700 transition-colors">
                        <Phone className="w-4 h-4 text-neutral-400 mr-2.5" />
                        <span className="text-sm text-neutral-200">{member.phoneNumber}</span>
                    </div>

                    <div className="flex items-center p-2 rounded-lg bg-dark-900/50 border border-neutral-800/50 group-hover:border-neutral-700 transition-colors">
                        <MapPin className="w-4 h-4 text-neutral-400 mr-2.5" />
                        <span className="text-sm text-neutral-200 truncate">{member.parishName}</span>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-end text-xs font-medium text-gold-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    View Details <ArrowRight className="w-3 h-3 ml-1" />
                </div>
            </CardContent>
        </Card>
    );
}
