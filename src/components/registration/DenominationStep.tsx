"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { denominationSchema } from "@/lib/schemas/registration";
import { useRegistrationStore } from "@/store/registration-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Church, ShieldCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type FormData = z.infer<typeof denominationSchema>;

interface Denomination {
    id: string;
    name: string;
}

export default function DenominationStep() {
    const { denomination, setDenomination, setStep } = useRegistrationStore();
    const [denominationsList, setDenominationsList] = useState<Denomination[]>([]);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(denominationSchema),
        defaultValues: denomination || {
            isCatholic: true,
            hasPvc: false,
            denominationId: "",
        },
    });

    const isCatholic = watch("isCatholic");
    const hasPvc = watch("hasPvc");
    const selectedDenominationId = watch("denominationId");

    useEffect(() => {
        const fetchDenominations = async () => {
            try {
                const res = await fetch("/api/geo/denominations");
                if (!res.ok) throw new Error("Institutional synchronization failure");
                const data = await res.json();
                setDenominationsList(data);
            } catch (error) {
                console.error("Denomination sync error:", error);
                // Fail silently in UI but log for protocol integrity
            }
        };
        fetchDenominations();
    }, []);

    const onSubmit = (data: FormData) => {
        const labels = {
            denomination: isCatholic ? "Catholic" : denominationsList.find(d => d.id === selectedDenominationId)?.name
        };
        setDenomination(data, labels);
        setStep(3);
    };

    const CustomToggle = ({ label, checked, onChange, id }: { label: string, checked: boolean, onChange: (val: boolean) => void, id: string }) => (
        <label
            htmlFor={id}
            className={cn(
                "w-full flex items-center justify-between p-4 md:p-6 rounded-xl md:rounded-2xl border transition-all cursor-pointer group",
                checked ? "bg-gold-warm/10 border-gold-warm shadow-gold" : "bg-dark-elevated/30 border-white/5 hover:border-white/10"
            )}
        >
            <div className="flex items-center gap-3 md:gap-4">
                <div className={cn(
                    "w-5 h-5 md:w-6 md:h-6 rounded-md md:rounded-lg border flex items-center justify-center transition-all",
                    checked ? "bg-gold-warm border-gold-warm" : "border-white/20 group-hover:border-white/40"
                )}>
                    {checked && <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-dark-void stroke-[4]" />}
                </div>
                <span className={cn(
                    "text-xs md:text-sm font-medium transition-colors",
                    checked ? "text-gold-warm" : "text-text-primary"
                )}>
                    {label}
                </span>
            </div>
            <input
                type="checkbox"
                id={id}
                className="hidden"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
        </label>
    );

    return (
        <Card className="border border-white/5 bg-dark-surface/40 backdrop-blur-md shadow-elevated rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
            <CardHeader className="pt-8 md:pt-10 pb-6 md:pb-8 px-6 md:px-10 border-b border-white/5 relative">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-dark-elevated border border-white/10 flex items-center justify-center">
                        <Church className="w-4 h-4 md:w-5 md:h-5 text-gold-warm" />
                    </div>
                    <div>
                        <CardTitle className="text-xl md:text-2xl font-display text-text-primary">Religious & Civic Status</CardTitle>
                        <CardDescription className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-text-muted">Section 03 · Community Planning</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="p-6 md:p-10 space-y-8 md:space-y-10">
                    <div className="space-y-4">
                        <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-warm/80">Denomination Status</Label>
                        <CustomToggle
                            id="catholic-toggle"
                            label="I am a Catholic Member"
                            checked={isCatholic}
                            onChange={(val) => setValue("isCatholic", val)}
                        />

                        {!isCatholic && (
                            <div className="pt-4 space-y-4 animate-slide-down">
                                <Label htmlFor="denomination" className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-warm/40 pl-2">Select Denomination</Label>
                                <Controller
                                    control={control}
                                    name="denominationId"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger id="denomination" className="h-12 border-border-default bg-dark-surface/50">
                                                <SelectValue placeholder="Select Institutional Body" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {denominationsList.map((d) => (
                                                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.denominationId && <p className="text-[10px] font-mono text-status-rejected uppercase tracking-wider pl-2">{errors.denominationId.message}</p>}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-warm/80">Civic Duty</Label>
                        <CustomToggle
                            id="pvc-toggle"
                            label="I have a Permanent Voter's Card (PVC)"
                            checked={hasPvc}
                            onChange={(val) => setValue("hasPvc", val)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="p-6 md:p-10 bg-dark-base/30 border-t border-white/5 flex flex-col-reverse md:flex-row gap-4 justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-full md:w-auto h-12 px-8 border-border-default hover:bg-dark-elevated">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Location
                    </Button>
                    <Button type="submit" className="w-full md:w-auto h-14 px-10 bg-gold-warm hover:bg-gold-bright text-dark-void font-bold rounded-xl shadow-gold transition-all">
                        Proceed to Review
                        <ShieldCheck className="w-5 h-5 ml-2" />
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
