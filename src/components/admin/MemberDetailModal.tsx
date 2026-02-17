'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ValidationTimeline } from './ValidationTimeline';
import {
    User, Mail, Phone, Calendar, MapPin, Church,
    CreditCard, X, CheckCircle, XCircle, Clock,
    Users
} from 'lucide-react';
import { toast } from 'sonner';

interface MemberDetail {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    phoneNumber: string;
    email?: string;
    dateOfBirth: string;
    gender: string;
    status: string;
    isCatholic: boolean;
    hasPvc: boolean;
    stateName: string;
    lgaName: string;
    wardName: string;
    parishName: string;
    denominationName?: string;
    validationNotes?: string;
    createdAt: string;
    validatedAt?: string;
}

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

interface MemberDetailModalProps {
    memberId: string;
    onClose: () => void;
    onUpdate: () => void;
}

export function MemberDetailModal({ memberId, onClose, onUpdate }: MemberDetailModalProps) {
    const [member, setMember] = useState<MemberDetail | null>(null);
    const [history, setHistory] = useState<ValidationLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isValidating, setIsValidating] = useState(false);
    const [validationNotes, setValidationNotes] = useState('');

    useEffect(() => {
        async function fetchMemberDetail() {
            try {
                const response = await fetch(`/api/admin/members/${memberId}`);
                if (response.ok) {
                    const data = await response.json();
                    setMember(data.member);
                    setHistory(data.history);
                }
            } catch (error) {
                console.error('Failed to fetch member details:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMemberDetail();
    }, [memberId]);

    const handleValidate = async (action: 'approve' | 'reject') => {
        setIsValidating(true);
        try {
            const response = await fetch(`/api/admin/members/${memberId}/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, notes: validationNotes }),
            });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            }

            if (response.ok) {
                toast.success("Validation Protocol Complete", {
                    description: `Member status has been updated to ${action}.`
                });
                onUpdate();
                onClose();
            } else {
                toast.error("Validation Security Refusal", {
                    description: data?.error || 'The system could not finalize the validation request.'
                });
            }
        } catch (error) {
            console.error('Validation error:', error);
            toast.error("Internal Authority Error", {
                description: 'A critical system error occurred during validation processing.'
            });
        } finally {
            setIsValidating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                <Card className="w-full max-w-4xl bg-dark-800/95 backdrop-blur-sm border-neutral-700/50">
                    <CardContent className="py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <Clock className="w-8 h-8 animate-spin text-gold-400" />
                            <p className="text-neutral-300">Loading member details...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!member) {
        return null;
    }

    const canValidate = member.status === 'pending';

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'validated':
                return <Badge className="bg-success-500 hover:bg-success-600"><CheckCircle className="w-3 h-3 mr-1" />Validated</Badge>;
            case 'rejected':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
            default:
                return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
        }
    };

    const InfoCard = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-dark-700/30 border border-neutral-700/30 hover:border-gold-400/30 transition-colors">
            <div className="mt-0.5">
                <Icon className="w-4 h-4 text-gold-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-400 mb-0.5">{label}</p>
                <p className="text-sm text-white font-medium truncate">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-dark-800/95 backdrop-blur-sm border-neutral-700/50 shadow-2xl">
                <CardHeader className="border-b border-neutral-700/50">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                                    <User className="w-6 h-6 text-dark-950" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl text-white">
                                        {member.firstName} {member.middleName} {member.lastName}
                                    </CardTitle>
                                    <CardDescription className="text-neutral-400">Member Details & Validation</CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                                {getStatusBadge(member.status)}
                                <span className="text-xs text-neutral-500">
                                    Registered {new Date(member.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <Button variant="outline" size="icon" onClick={onClose} className="border-neutral-600 hover:border-gold-400">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    {/* Personal Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-gold-400" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <InfoCard icon={Phone} label="Phone Number" value={member.phoneNumber} />
                            {member.email && <InfoCard icon={Mail} label="Email" value={member.email} />}
                            <InfoCard icon={Calendar} label="Date of Birth" value={new Date(member.dateOfBirth).toLocaleDateString()} />
                            <InfoCard icon={User} label="Gender" value={member.gender} />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gold-400" />
                            Location
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <InfoCard icon={MapPin} label="State" value={member.stateName} />
                            <InfoCard icon={MapPin} label="LGA" value={member.lgaName} />
                            <InfoCard icon={MapPin} label="Ward" value={member.wardName} />
                            <InfoCard icon={Church} label="Parish" value={member.parishName} />
                        </div>
                    </div>

                    {/* Religious & Civic */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Church className="w-5 h-5 text-gold-400" />
                            Religious & Civic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-dark-700/30 border border-neutral-700/30">
                                <Church className="w-4 h-4 text-gold-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-neutral-400 mb-0.5">Catholic</p>
                                    <Badge variant={member.isCatholic ? "default" : "secondary"} className="text-xs">
                                        {member.isCatholic ? 'Yes' : 'No'}
                                    </Badge>
                                </div>
                            </div>
                            {!member.isCatholic && member.denominationName && (
                                <InfoCard icon={Church} label="Denomination" value={member.denominationName} />
                            )}
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-dark-700/30 border border-neutral-700/30">
                                <CreditCard className="w-4 h-4 text-gold-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-neutral-400 mb-0.5">Has PVC</p>
                                    <Badge variant={member.hasPvc ? "default" : "secondary"} className="text-xs">
                                        {member.hasPvc ? 'Yes' : 'No'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Validation Section */}
                    {canValidate && (
                        <div className="border-t border-neutral-700/50 pt-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Validation Actions</h3>
                            <div className="space-y-4 p-4 rounded-lg bg-dark-700/30 border border-neutral-700/30">
                                <div>
                                    <Label htmlFor="notes" className="text-neutral-300">Validation Notes (Optional)</Label>
                                    <Input
                                        id="notes"
                                        placeholder="Add any notes or comments..."
                                        value={validationNotes}
                                        onChange={(e) => setValidationNotes(e.target.value)}
                                        disabled={isValidating}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => handleValidate('approve')}
                                        disabled={isValidating}
                                        className="flex-1 bg-success-500 hover:bg-success-600"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        {isValidating ? 'Processing...' : 'Approve'}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleValidate('reject')}
                                        disabled={isValidating}
                                        className="flex-1"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        {isValidating ? 'Processing...' : 'Reject'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Validation History */}
                    {history.length > 0 && (
                        <div className="border-t border-neutral-700/50 pt-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Validation History</h3>
                            <ValidationTimeline history={history} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
