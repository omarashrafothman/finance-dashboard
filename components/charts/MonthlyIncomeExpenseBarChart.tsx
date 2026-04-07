"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface MonthlyIncomeExpensePoint {
  month: string;
  income: number;
  expense: number;
}

export default function MonthlyIncomeExpenseBarChart({
  data,
}: {
  data: MonthlyIncomeExpensePoint[];
}) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
          <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} width={42} />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#22c55e" radius={[6, 6, 0, 0]} isAnimationActive={false} />
          <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
