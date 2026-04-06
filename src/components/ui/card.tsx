import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
    "flex flex-col gap-6 rounded-2xl border py-6 transition-all duration-300",
    {
        variants: {
            variant: {
                default: "bg-card text-card-foreground shadow-sm",
                quant: "border-border/70 bg-card/70 backdrop-blur-md text-card-foreground shadow-[0_4px_24px_rgba(0,0,0,0.02)]",
            },
            hoverable: {
                true: "hover:bg-card/80 hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:-translate-y-0.5",
                false: "",
            },
        },
        defaultVariants: {
            variant: "quant",
            hoverable: false,
        },
    }
)

interface CardProps
    extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> { }

function Card({ className, variant, hoverable, ...props }: CardProps) {
    return (
        <div
            data-slot="card"
            className={cn(cardVariants({ variant, hoverable, className }))}
            {...props}
        />
    )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-header"
            className={cn(
                "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
                className
            )}
            {...props}
        />
    )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-title"
            className={cn("leading-none font-semibold", className)}
            {...props}
        />
    )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-description"
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-action"
            className={cn(
                "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
                className
            )}
            {...props}
        />
    )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-content"
            className={cn("px-6", className)}
            {...props}
        />
    )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-footer"
            className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
            {...props}
        />
    )
}

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardAction,
    CardDescription,
    CardContent,
}
