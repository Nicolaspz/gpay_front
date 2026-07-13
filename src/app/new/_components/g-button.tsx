"use client";

import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type GButtonProps = {
  children: ReactNode;
  href?: string;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
};

export default function GButton({
  children,
  href = "#",
  icon,
  variant = "primary",
  size = "default",
  className = "",
}: GButtonProps) {
  const baseStyles =
    "flex items-center gap-2 rounded-full font-semibold transition-transform hover:scale-[1.01]";

  const variants = {
    primary: "bg-[#5E53FF] text-white shadow-[0_10px_24px_rgba(94,83,255,0.22)]",
    secondary: "bg-[#D6D4D8] text-white shadow-[0_10px_18px_rgba(0,0,0,0.06)]",
    outline: "border border-white/90 bg-transparent text-white hover:bg-white/8",
  };

  const sizes = {
    default: "h-[48px] px-6 text-[15px]",
    sm: "h-[42px] px-5 text-[14px]",
    lg: "h-[44px] px-5 text-[13px]",
  };

  const iconSizes = {
    default: { container: "h-9 w-9", icon: "h-[17px] w-[17px]" },
    sm: { container: "h-8 w-8", icon: "h-[16px] w-[16px]" },
    lg: { container: "h-8 w-8", icon: "h-[15px] w-[15px]" },
  };

  return (
    <a
      href={href}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <span>{children}</span>
      {icon && (
        <span
          className={`grid ${iconSizes[size].container} place-items-center rounded-full bg-white text-[#5E53FF] shadow-[0_6px_12px_rgba(0,0,0,0.08)]`}
        >
          {icon}
        </span>
      )}
    </a>
  );
}

export function GButtonIcon({
  size = "default",
}: {
  size?: "default" | "sm" | "lg";
}) {
  const iconSizes = {
    default: "h-[17px] w-[17px]",
    sm: "h-[16px] w-[16px]",
    lg: "h-[15px] w-[15px]",
  };

  return <ArrowUpRight className={iconSizes[size]} strokeWidth={2.2} />;
}
