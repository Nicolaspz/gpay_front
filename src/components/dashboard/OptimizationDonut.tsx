"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type DonutData = {
  name: string;
  value: number;
};

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export default function OptimizationDonut({ data }: { data: DonutData[] }) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const percentage = total > 0 ? Math.round((data[0]?.value / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center space-y-5">
      <div className="relative w-[192px] h-[192px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={65}
              outerRadius={90}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="var(--background)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-[28px] font-bold text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-clash-display)" }}
          >
            {percentage}%
          </span>
          <span className="text-[11px] text-[var(--muted-foreground)] font-medium">Sucesso</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
        {data.map((entry, idx) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span className="text-xs text-[var(--muted-foreground)]">{entry.name}</span>
            <span className="text-xs font-semibold text-[var(--foreground)]" style={{ fontFeatureSettings: '"tnum"' }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
