"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState, useCallback } from "react";
import { locationSchema } from "@/lib/schemas/registration";
import { useRegistrationStore } from "@/store/registration-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, MapPin, WifiOff } from "lucide-react";
import { toast } from "sonner";

type FormData = z.infer<typeof locationSchema>;

interface GeoItem {
    id: string;
    name: string;
}

export default function LocationStep() {
    const { location, setLocation, setStep } = useRegistrationStore();
    const [states, setStates] = useState<GeoItem[]>([]);
    const [lgas, setLgas] = useState<GeoItem[]>([]);
    const [wards, setWards] = useState<GeoItem[]>([]);
    const [parishes, setParishes] = useState<GeoItem[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(locationSchema),
        defaultValues: location || {
            stateId: "",
            lgaId: "",
            wardId: "",
            parishId: "",
        },
    });

    const selectedStateId = watch("stateId");
    const selectedLgaId = watch("lgaId");
    const selectedWardId = watch("wardId");
    const selectedParishId = watch("parishId");

    const safeFetch = useCallback(async (url: string, setter: (data: GeoItem[]) => void) => {
        setIsSyncing(true);
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Synchronization failure");
            const data = await res.json();
            setter(data);
        } catch (error) {
            console.error(`Geo sync error [${url}]:`, error);
            toast.error("Institutional Synchronization Interrupted", {
                description: "The system is experiencing latency retrieving geographic data. Retrying...",
                icon: <WifiOff className="w-4 h-4 text-status-rejected" />
            });
        } finally {
            setIsSyncing(false);
        }
    }, []);

    useEffect(() => {
        safeFetch("/api/geo/states", setStates);
    }, [safeFetch]);

    useEffect(() => {
        if (selectedStateId) {
            setLgas([]); setWards([]); setParishes([]);
            safeFetch(`/api/geo/lgas?stateId=${selectedStateId}`, setLgas);
        }
    }, [selectedStateId, safeFetch]);

    useEffect(() => {
        if (selectedLgaId) {
            setWards([]); setParishes([]);
            safeFetch(`/api/geo/wards?lgaId=${selectedLgaId}`, setWards);
        }
    }, [selectedLgaId, safeFetch]);

    useEffect(() => {
        if (selectedWardId) {
            setParishes([]);
            safeFetch(`/api/geo/parishes?wardId=${selectedWardId}`, setParishes);
        }
    }, [selectedWardId, safeFetch]);

    const onSubmit = (data: FormData) => {
        const labels = {
            state: states.find(s => s.id === selectedStateId)?.name,
            lga: lgas.find(l => l.id === selectedLgaId)?.name,
            ward: wards.find(w => w.id === selectedWardId)?.name,
            parish: parishes.find(p => p.id === selectedParishId)?.name,
        };
        setLocation(data, labels);
        setStep(2);
    };

    return (
        <Card className="border border-white/5 bg-dark-surface/40 backdrop-blur-md shadow-elevated rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
            <CardHeader className="pt-8 md:pt-10 pb-6 md:pb-8 px-6 md:px-10 border-b border-white/5 relative">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-dark-elevated border border-white/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gold-warm" />
                    </div>
                    <div>
                        <CardTitle className="text-xl md:text-2xl font-display text-text-primary">Geographic Domicile</CardTitle>
                        <CardDescription className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-text-muted">Section 02 · Jurisdictional Placement</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="p-6 md:p-10 space-y-6 md:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="state" className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-warm/80">State Authority</Label>
                            <Controller
                                control={control}
                                name="stateId"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSyncing}>
                                        <SelectTrigger id="state" className="h-12 border-border-default bg-dark-surface/50">
                                            <SelectValue placeholder={isSyncing ? "Syncing Authorities..." : "Select State"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {states.map((s) => (
                                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.stateId && <p className="text-[10px] font-mono text-status-rejected uppercase tracking-wider">{errors.stateId.message}</p>}
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="lga" className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-warm/80">Local Gov. Area</Label>
                            <Controller
                                control={control}
                                name="lgaId"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedStateId || isSyncing}>
                                        <SelectTrigger id="lga" className="h-12 border-border-default bg-dark-surface/50">
                                            <SelectValue placeholder={isSyncing ? "Syncing LGAs..." : "Select LGA"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {lgas.map((l) => (
                                                <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.lgaId && <p className="text-[10px] font-mono text-status-rejected uppercase tracking-wider">{errors.lgaId.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="ward" className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-warm/80">Administrative Ward</Label>
                            <Controller
                                control={control}
                                name="wardId"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedLgaId || isSyncing}>
                                        <SelectTrigger id="ward" className="h-12 border-border-default bg-dark-surface/50">
                                            <SelectValue placeholder={isSyncing ? "Syncing Wards..." : "Select Ward"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {wards.map((w) => (
                                                <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.wardId && <p className="text-[10px] font-mono text-status-rejected uppercase tracking-wider">{errors.wardId.message}</p>}
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="parish" className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-warm/80">Local Parish</Label>
                            <Controller
                                control={control}
                                name="parishId"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedWardId || isSyncing}>
                                        <SelectTrigger id="parish" className="h-12 border-border-default bg-dark-surface/50">
                                            <SelectValue placeholder={isSyncing ? "Syncing Parishes..." : "Select Parish"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {parishes.map((p) => (
                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.parishId && <p className="text-[10px] font-mono text-status-rejected uppercase tracking-wider">{errors.parishId.message}</p>}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-6 md:p-10 bg-dark-base/30 border-t border-white/5 flex flex-col-reverse md:flex-row gap-4 justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(0)} className="w-full md:w-auto h-12 px-8 border-border-default hover:bg-dark-elevated transition-all">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Identity
                    </Button>
                    <Button type="submit" className="w-full md:w-auto h-14 px-10 bg-gold-warm hover:bg-gold-bright text-dark-void font-bold rounded-xl shadow-gold transition-all">
                        Proceed to Religious Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
