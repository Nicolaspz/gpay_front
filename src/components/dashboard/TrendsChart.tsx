"use client";

import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

type ChartData = {
  date: string;
  pending: number;
  success: number;
  failed: number;
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 shadow-[var(--shadow-lg)]">
      <p className="text-xs font-medium text-[var(--muted-foreground)] mb-1">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[var(--muted-foreground)]">{entry.name}:</span>
          <span className="font-semibold text-[var(--foreground)]" style={{ fontFeatureSettings: '"tnum"' }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function TrendsChart({ data }: { data: ChartData[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradSuccess" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.1} />
              <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradFailed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-5)" stopOpacity={0.1} />
              <stop offset="100%" stopColor="var(--chart-5)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="0" vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="success"
            stroke="var(--chart-1)"
            strokeWidth={2.5}
            fill="url(#gradSuccess)"
            dot={false}
            activeDot={{ r: 5, stroke: "var(--background)", strokeWidth: 3 }}
            name="Concluídas"
            isAnimationActive={true}
            animationDuration={1000}
          />
          <Area
            type="monotone"
            dataKey="pending"
            stroke="var(--chart-3)"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="url(#gradPending)"
            dot={false}
            activeDot={{ r: 4, stroke: "var(--background)", strokeWidth: 3 }}
            name="Pendentes"
            isAnimationActive={true}
            animationDuration={1200}
          />
          <Area
            type="monotone"
            dataKey="failed"
            stroke="var(--chart-5)"
            strokeWidth={2}
            fill="url(#gradFailed)"
            dot={false}
            activeDot={{ r: 4, stroke: "var(--background)", strokeWidth: 3 }}
            name="Falhas"
            isAnimationActive={true}
            animationDuration={1400}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
