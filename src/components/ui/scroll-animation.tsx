"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ScrollAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    animation: string // e.g., "animate-fadeInUp"
    duration?: number
    delay?: number
    threshold?: number
}

export function ScrollAnimation({
    children,
    animation,
    duration,
    delay,
    threshold = 0.1,
    className,
    ...props
}: ScrollAnimationProps) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    if (ref.current) {
                        observer.unobserve(ref.current)
                    }
                }
            },
            {
                threshold: threshold,
            }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [threshold])

    // Tailwind style or inline style for duration/delay
    const style = {
        ...(duration ? { animationDuration: `${duration}s` } : {}),
        ...(delay ? { animationDelay: `${delay}s` } : {}),
    }

    return (
        <div
            ref={ref}
            className={cn(
                // Base state: invisible
                !isVisible && "opacity-0",
                // Active state: styled with animation
                isVisible && `animate__animated ${animation}`,
                className
            )}
            style={style}
            {...props}
        >
            {children}
        </div>
    )
}
