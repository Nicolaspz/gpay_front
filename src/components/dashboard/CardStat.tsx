"use client"

import { Card } from "@/components/ui/card";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface CardStatProps {
  title: string;
  amount: string;
  change?: string;
  icon?: React.ReactNode;
  hero?: boolean;
  sparklineData?: { value: number }[];
}

export function CardStat({
  title,
  amount,
  change,
  icon,
  hero = false,
  sparklineData,
}: CardStatProps) {
  const isPositive = change?.startsWith('+');
  const isNegative = change?.startsWith('-');

  return (
    <Card
      className={`relative overflow-hidden ${
        hero
          ? "rounded-[var(--radius-xl)] border-[var(--border)] bg-gradient-to-br from-[var(--accent-primary-subtle)] to-transparent p-5"
          : "rounded-[var(--radius-lg)] border-[var(--border-subtle, var(--border))] bg-[var(--secondary)] p-4"
      } card-hover`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--muted-foreground)] mb-2">
            {title}
          </p>
          <p
            className={`font-bold text-[var(--foreground)] leading-none ${
              hero
                ? "text-[28px] md:text-[32px]"
                : "text-[18px]"
            }`}
            style={{ fontFamily: hero ? "var(--font-clash-display)" : undefined, fontFeatureSettings: '"tnum"' }}
          >
            {amount}
          </p>
          {change && (
            <p
              className={`text-xs font-semibold mt-1.5 ${
                isPositive
                  ? "text-[var(--success)]"
                  : isNegative
                  ? "text-[var(--danger)]"
                  : "text-[var(--muted-foreground)]"
              }`}
            >
              {isPositive && "▲ "}
              {isNegative && "▼ "}
              {change} vs mês anterior
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-[var(--radius-md)] bg-[var(--muted)] text-[var(--muted-foreground)]">
            {icon}
          </div>
        )}
      </div>

      {/* Sparkline for hero card */}
      {hero && sparklineData && sparklineData.length > 0 && (
        <div className="mt-4 h-[48px] -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--accent-primary)"
                strokeWidth={1.5}
                fill="url(#sparkGradient)"
                dot={false}
                isAnimationActive={true}
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
