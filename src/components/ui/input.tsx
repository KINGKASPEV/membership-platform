import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, ...props }, ref) => {
        return (
            <div className="w-full">
                <input
                    type={type}
                    className={cn(
                        "flex h-12 w-full rounded-xl border border-border-default px-4 py-3 text-sm ring-offset-dark-base file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted transition-all duration-200 shadow-sm",
                        "bg-dark-surface text-text-primary file:text-text-primary",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-warm/20 focus-visible:border-gold-warm",
                        "focus:bg-dark-surface active:bg-dark-surface", // Ensure background stays dark
                        error && "border-status-rejected focus-visible:border-status-rejected focus-visible:ring-status-rejected/10",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <p className="mt-1.5 text-sm font-medium text-error-600 animate-slide-up">{error}</p>}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
