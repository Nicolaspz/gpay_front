"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type DonutData = {
  name: string;
  value: number;
};

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#353622", "#cfff"];

export default function OptimizationDonut({ data }: { data: DonutData[] }) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const percentage = total > 0 ? Math.round((data[0]?.value / total) * 100) : 0; // Exemplo: % do primeiro item

  return (
    <div className="flex flex-col items-center justify-center space-y-4 ">
      <div className="relative w-40 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-white">{percentage}%</span>
        </div>
      </div>
      <div className="space-y-2 w-full">
        {data.map((entry, idx) => (
          <div key={entry.name} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              <span className="text-gray-900 dark:text-white">{entry.name}</span>

            </div>
            <span className="bg-gray-700 text-white text-xs px-2 py-0.5 rounded-md ">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
