"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="dark"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-dark-surface group-[.toaster]:text-text-primary group-[.toaster]:border-white/10 group-[.toaster]:shadow-elevated group-[.toaster]:rounded-2xl group-[.toaster]:backdrop-blur-xl",
                    description: "group-[.toast]:text-text-secondary font-body text-xs",
                    actionButton:
                        "group-[.toast]:bg-gold-warm group-[.toast]:text-dark-void font-bold",
                    cancelButton:
                        "group-[.toast]:bg-dark-elevated group-[.toast]:text-text-muted",
                    error: "group-[.toast]:border-status-rejected/30 group-[.toast]:bg-status-rejected/5",
                    success: "group-[.toast]:border-status-validated/30 group-[.toast]:bg-status-validated/5",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
