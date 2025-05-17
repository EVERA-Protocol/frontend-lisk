"use client"

import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TransactionSuccessProps {
    message: string
    subMessage?: string
    onComplete?: () => void
    className?: string
}

export function TransactionSuccess({ message, subMessage, onComplete, className }: TransactionSuccessProps) {
    const [animationState, setAnimationState] = useState<"initial" | "animate" | "complete">("initial")

    useEffect(() => {
        // Start animation after component mounts
        const animateTimeout = setTimeout(() => {
            setAnimationState("animate")
        }, 100)

        // Set to complete after animation finishes
        const completeTimeout = setTimeout(() => {
            setAnimationState("complete")
            if (onComplete) onComplete()
        }, 2000)

        return () => {
            clearTimeout(animateTimeout)
            clearTimeout(completeTimeout)
        }
    }, [onComplete])

    return (
        <div className={cn("flex flex-col items-center justify-center text-center p-6", className)}>
            <div
                className={cn(
                    "relative mb-6 transition-all duration-500",
                    animationState === "initial" && "scale-0 opacity-0",
                    animationState === "animate" && "scale-100 opacity-100",
                )}
            >
                <div className="absolute -inset-4 rounded-full bg-green-500/20 animate-pulse"></div>
                <CheckCircle2 className="h-16 w-16 text-green-500" strokeWidth={1.5} />
            </div>

            <h3
                className={cn(
                    "text-xl font-bold text-white mb-2 transition-all duration-500 delay-300",
                    animationState === "initial" && "translate-y-4 opacity-0",
                    animationState === "animate" && "translate-y-0 opacity-100",
                )}
            >
                {message}
            </h3>

            {subMessage && (
                <p
                    className={cn(
                        "text-gray-400 transition-all duration-500 delay-500",
                        animationState === "initial" && "translate-y-4 opacity-0",
                        animationState === "animate" && "translate-y-0 opacity-100",
                    )}
                >
                    {subMessage}
                </p>
            )}
        </div>
    )
}
