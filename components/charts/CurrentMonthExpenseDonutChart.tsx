"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface ExpenseByCategoryPoint {
  category: string;
  value: number;
  color: string;
}

export default function CurrentMonthExpenseDonutChart({
  data,
}: {
  data: ExpenseByCategoryPoint[];
}) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="category"
            innerRadius="52%"
            outerRadius="78%"
            isAnimationActive={false}
          >
            {data.map((entry) => (
              <Cell key={entry.category} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
