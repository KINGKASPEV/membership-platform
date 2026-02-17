"use client";

import { useRegistrationStore } from "@/store/registration-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, MapPin, Church, ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function ReviewStep() {
    const { personalInfo, denomination, labels, setStep, reset } = useRegistrationStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Re-fetch all data from store for payload
            const { personalInfo, location, denomination } = useRegistrationStore.getState();
            const payload = { personalInfo, location, denomination };

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            }

            if (!response.ok) {
                const message = data?.error || 'The system could not finalize your protocol submission.';
                // Distinguish between validation (e.g. exists) and system errors
                if (response.status === 400 || response.status === 409) {
                    toast.error("Registration Conflict", {
                        description: message
                    });
                } else {
                    toast.error("Institutional Protocol Failure", {
                        description: "A critical error occurred while processing your enrolment. Please contact administration."
                    });
                }
                return;
            }

            toast.success("Enrolment Successful", {
                description: "Your credentials have been submitted for institutional validation."
            });

            reset();
            router.push('/');
        } catch (error) {
            // Only log truly unexpected errors to console to keep it clean for users
            if (!(error instanceof Error && (error.message.includes('exists') || error.message.includes('failed')))) {
                console.error('Institutional System Error:', error);
            }

            toast.error("Connectivity Interruption", {
                description: "The system is unable to reach the authorization gateway. Please check your network."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const SummarySection = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
        <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                <div className="w-8 h-8 rounded-lg bg-dark-elevated flex items-center justify-center border border-white/5">
                    <Icon className="w-4 h-4 text-gold-warm" />
                </div>
                <h4 className="text-[10px] font-mono font-bold text-gold-warm tracking-[0.2em] uppercase">
                    {title}
                </h4>
            </div>
            <div className="grid grid-cols-1 gap-4 pl-0 md:pl-11">
                {children}
            </div>
        </div>
    );

    const DataPoint = ({ label, value }: { label: string, value: string | undefined }) => (
        <div className="bg-white/[0.02] p-3 md:p-0 md:bg-transparent rounded-lg border border-white/[0.05] md:border-none">
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">{label}</p>
            <p className="text-text-primary text-sm font-medium break-words">{value || "—"}</p>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-0">
            <Card className="border border-white/5 bg-dark-surface/40 backdrop-blur-md shadow-elevated overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-warm/40 to-transparent" />

                <CardHeader className="pt-8 md:pt-10 pb-6 md:pb-8 px-6 md:px-10 text-center border-b border-white/5">
                    <CardTitle className="text-2xl md:text-3xl font-display font-light text-text-primary mb-2">Review Protocol</CardTitle>
                    <CardDescription className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                        Verification of provided institutional data
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-6 md:p-10 space-y-10 md:space-y-12">
                    <SummarySection icon={User} title="Individual Credentials">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            <DataPoint label="Legal Name" value={`${personalInfo?.firstName} ${personalInfo?.lastName}`} />
                            <DataPoint label="Contact" value={personalInfo?.phoneNumber} />
                            <DataPoint label="Birth Date" value={personalInfo?.dateOfBirth} />
                            <DataPoint label="Gender" value={personalInfo?.gender} />
                        </div>
                    </SummarySection>

                    <SummarySection icon={MapPin} title="Geographic Domicile">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            <DataPoint label="State" value={labels.state} />
                            <DataPoint label="L.G.A" value={labels.lga} />
                            <DataPoint label="Ward" value={labels.ward} />
                            <DataPoint label="Parish" value={labels.parish} />
                        </div>
                    </SummarySection>

                    <SummarySection icon={Church} title="Religious & Civic Status">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            <DataPoint label="Denomination" value={labels.denomination} />
                            <DataPoint label="PVC Registration" value={denomination?.hasPvc ? "Validated" : "Not Registered"} />
                        </div>
                    </SummarySection>
                </CardContent>

                <CardFooter className="p-6 md:p-10 bg-dark-base/50 flex flex-col-reverse md:flex-row gap-4 justify-between items-center border-t border-white/5">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(2)}
                        disabled={isSubmitting}
                        className="w-full md:w-auto px-8 h-12 border-border-default hover:bg-dark-elevated transition-all"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Modify Data
                    </Button>

                    <Button
                        onClick={onSubmit}
                        isLoading={isSubmitting}
                        className="w-full md:w-auto px-10 h-14 bg-gold-warm hover:bg-gold-bright text-dark-void font-bold shadow-gold rounded-xl transition-all"
                    >
                        <ShieldCheck className="w-5 h-5 mr-2" />
                        Confirm and Submit
                        <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
                    </Button>
                </CardFooter>
            </Card>

            <p className="mt-8 text-center text-[10px] text-text-muted font-mono uppercase tracking-[0.2em] max-w-lg mx-auto leading-loose px-4">
                By submitting, you affirm that all information provided is accurate and belongs to you.
                Data integrity is enforced by institutional security protocols.
            </p>
        </div>
    );
}
