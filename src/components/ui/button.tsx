import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent-primary)] text-white shadow-none hover:bg-[var(--accent-primary-hover)] hover:shadow-[var(--shadow-sm)] active:scale-[0.98]",
        destructive:
          "bg-[var(--danger)] text-white shadow-none hover:opacity-90 hover:shadow-[var(--shadow-sm)] active:scale-[0.98] focus-visible:ring-[var(--danger)]/20",
        outline:
          "border border-[var(--border)] bg-transparent text-[var(--foreground)] shadow-none hover:bg-[var(--secondary)] hover:border-[var(--muted-foreground)] active:bg-[var(--muted)]",
        secondary:
          "bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-none hover:bg-[var(--muted)]",
        ghost:
          "bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] active:bg-[var(--muted)]",
        link: "text-[var(--accent-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[34px] px-3.5 py-2 has-[>svg]:px-3 rounded-[var(--radius-md)]",
        sm: "h-[28px] gap-1.5 px-2 has-[>svg]:px-2 rounded-[var(--radius-sm)] text-xs",
        lg: "h-[40px] px-4.5 has-[>svg]:px-4 rounded-[var(--radius-md)]",
        icon: "h-[34px] w-[34px] rounded-[var(--radius-md)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
