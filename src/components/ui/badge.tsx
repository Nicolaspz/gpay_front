import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--accent-primary)] text-white [a&]:hover:bg-[var(--accent-primary-hover)]",
        secondary: "border-transparent bg-[var(--secondary)] text-[var(--secondary-foreground)] [a&]:hover:bg-[var(--muted)]",
        destructive: "border-transparent bg-[var(--danger)] text-white [a&]:hover:bg-[var(--danger)]/90",
        outline: "text-[var(--foreground)] [a&]:hover:bg-[var(--secondary)] [a&]:hover:text-[var(--accent-foreground)]",
        success: "border-transparent bg-[var(--success-subtle)] text-[var(--success)] [a&]:hover:bg-[var(--success-subtle)]/80",
        pending: "border-transparent bg-[var(--warning-subtle)] text-[var(--warning)] [a&]:hover:bg-[var(--warning-subtle)]/80",
        info: "border-transparent bg-[var(--info-subtle)] text-[var(--info)] [a&]:hover:bg-[var(--info-subtle)]/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
