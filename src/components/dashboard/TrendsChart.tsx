"use client";

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type ChartData = {
  date: string;
  pending: number;
  success: number;
  failed: number;
};

export default function TrendsChart({ data }: { data: ChartData[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "none",
              borderRadius: "0.5rem",
              color: "#F9FAFB",
            }}
          />
          <Line type="monotone" dataKey="pending" stroke="#FACC15" dot={false} name="Pendentes" />
          <Line type="monotone" dataKey="success" stroke="#10B981" dot={false} name="Concluídas" />
          <Line type="monotone" dataKey="failed" stroke="#EF4444" dot={false} name="Falhas" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
