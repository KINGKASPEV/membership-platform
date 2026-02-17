import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PersonalInfoData, LocationData, DenominationData } from '@/lib/schemas/registration';

interface RegistrationLabels {
    state?: string;
    lga?: string;
    ward?: string;
    parish?: string;
    denomination?: string;
}

interface RegistrationState {
    currentStep: number;
    personalInfo: PersonalInfoData | null;
    location: LocationData | null;
    denomination: DenominationData | null;
    labels: RegistrationLabels;

    setStep: (step: number) => void;
    setPersonalInfo: (data: PersonalInfoData) => void;
    setLocation: (data: LocationData, labels: Partial<RegistrationLabels>) => void;
    setDenomination: (data: DenominationData, labels: Partial<RegistrationLabels>) => void;
    reset: () => void;
}

export const useRegistrationStore = create<RegistrationState>()(
    persist(
        (set) => ({
            currentStep: 0,
            personalInfo: null,
            location: null,
            denomination: null,
            labels: {},

            setStep: (step) => set({ currentStep: step }),
            setPersonalInfo: (data) => set({ personalInfo: data }),
            setLocation: (data, labels) => set((state) => ({
                location: data,
                labels: { ...state.labels, ...labels }
            })),
            setDenomination: (data, labels) => set((state) => ({
                denomination: data,
                labels: { ...state.labels, ...labels }
            })),
            reset: () =>
                set({
                    currentStep: 0,
                    personalInfo: null,
                    location: null,
                    denomination: null,
                    labels: {},
                }),
        }),
        {
            name: 'registration-storage',
        }
    )
);
