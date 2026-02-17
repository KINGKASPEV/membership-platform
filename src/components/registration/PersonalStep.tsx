"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { personalInfoSchema } from "@/lib/schemas/registration";
import { useRegistrationStore } from "@/store/registration-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, User } from "lucide-react";

type FormData = z.infer<typeof personalInfoSchema>;

export default function PersonalStep() {
    const { personalInfo, setPersonalInfo, setStep } = useRegistrationStore();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: personalInfo || {
            firstName: "",
            lastName: "",
            middleName: "",
            email: "",
            phoneNumber: "",
            dateOfBirth: "",
            gender: "Male",
        },
    });

    const onSubmit = (data: FormData) => {
        setPersonalInfo(data);
        setStep(1);
    };

    return (
        <Card className="border border-white/5 bg-dark-surface/40 backdrop-blur-md shadow-elevated rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
            <CardHeader className="pt-8 md:pt-10 pb-6 md:pb-8 px-6 md:px-10 border-b border-white/5 relative">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-dark-elevated border border-white/10 flex items-center justify-center">
                        <User className="w-4 h-4 md:w-5 md:h-5 text-gold-warm" />
                    </div>
                    <div>
                        <CardTitle className="text-xl md:text-2xl font-display text-text-primary">Personal Credentials</CardTitle>
                        <CardDescription className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-text-muted">Section 01 · Identity Verification</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="p-6 md:p-10 space-y-6 md:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="firstName" className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-warm/80">First Name</Label>
                            <Input
                                id="firstName"
                                placeholder="e.g. Chinua"
                                error={errors.firstName?.message}
                                {...register("firstName")}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="lastName" className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-warm/80">Last Name</Label>
                            <Input
                                id="lastName"
                                placeholder="e.g. Achebe"
                                error={errors.lastName?.message}
                                {...register("lastName")}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="middleName" className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-warm/80">Middle Name (Optional)</Label>
                        <Input
                            id="middleName"
                            placeholder="Optional"
                            error={errors.middleName?.message}
                            {...register("middleName")}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="phoneNumber" className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-warm/80">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                placeholder="080 0000 0000"
                                error={errors.phoneNumber?.message}
                                {...register("phoneNumber")}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="email" className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-warm/80">Email Address (Optional)</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@domain.gov"
                                error={errors.email?.message}
                                {...register("email")}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="dateOfBirth" className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-warm/80">Date of Birth</Label>
                            <Input
                                id="dateOfBirth"
                                type="date"
                                error={errors.dateOfBirth?.message}
                                {...register("dateOfBirth")}
                                className="appearance-none"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="gender" className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-warm/80">Gender</Label>
                            <Controller
                                control={control}
                                name="gender"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger id="gender" className="h-12 border-border-default bg-dark-surface/50">
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-6 md:p-10 bg-dark-base/30 border-t border-white/5 flex justify-end">
                    <Button type="submit" className="w-full md:w-auto h-14 px-10 bg-gold-warm hover:bg-gold-bright text-dark-void font-bold rounded-xl shadow-gold transition-all">
                        Proceed to Location
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
