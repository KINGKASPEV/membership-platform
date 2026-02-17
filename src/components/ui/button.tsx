import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 duration-300",
    {
        variants: {
            variant: {
                default: "bg-gold-warm text-dark-void font-bold shadow-lg shadow-gold-warm/20 hover:shadow-xl hover:shadow-gold-warm/30 hover:-translate-y-0.5 relative overflow-hidden group",
                destructive:
                    "bg-gradient-to-r from-status-rejected to-red-600 text-white shadow-lg shadow-status-rejected/25 hover:shadow-status-rejected/40 hover:-translate-y-0.5",
                outline:
                    "border border-border-default bg-transparent text-text-primary hover:bg-dark-elevated hover:border-gold-muted hover:text-gold-warm",
                secondary:
                    "bg-transparent border border-border-default text-text-primary shadow-sm hover:border-gold-muted hover:bg-dark-elevated hover:-translate-y-0.5",
                ghost: "text-text-secondary hover:bg-dark-elevated hover:text-text-primary",
                link: "text-gold-warm underline-offset-4 hover:underline",
                glass: "bg-dark-surface/40 backdrop-blur-md border border-border-subtle text-text-primary hover:bg-dark-surface/60 shadow-lg",
                gradient: "bg-gradient-to-r from-royal-500 to-royal-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1",
            },
            size: {
                default: "h-11 px-6 py-2.5",
                sm: "h-9 rounded-lg px-3 text-xs",
                lg: "h-12 rounded-xl px-8 text-base",
                icon: "h-10 w-10",
                xl: "h-14 rounded-2xl px-10 text-lg",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, isLoading, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {variant === 'default' && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />}
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </Comp>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
