"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import SummaryCard from "@/components/dashboard/SummaryCard";
import { useTransactions } from "@/lib/hooks/useTransactions";

const MonthlyIncomeExpenseBarChart = dynamic(
  () => import("@/components/charts/MonthlyIncomeExpenseBarChart"),
  { ssr: false },
);
const CurrentMonthExpenseDonutChart = dynamic(
  () => import("@/components/charts/CurrentMonthExpenseDonutChart"),
  { ssr: false },
);

const CHART_COLORS = ["#3b82f6", "#06b6d4", "#22c55e", "#a855f7", "#f97316", "#eab308", "#ef4444"];

export default function Dashboard() {
  const { transactions, loading } = useTransactions();

  const metrics = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const previousMonth = previousMonthDate.getMonth();
    const previousYear = previousMonthDate.getFullYear();

    const currentMonthTransactions = transactions.filter((tx) => {
      const d = new Date(tx.date || tx.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const previousMonthTransactions = transactions.filter((tx) => {
      const d = new Date(tx.date || tx.createdAt);
      return d.getMonth() === previousMonth && d.getFullYear() === previousYear;
    });

    const currentIncome = currentMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const currentExpense = currentMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
    const previousIncome = previousMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const previousExpense = previousMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      balance: totalIncome - totalExpenses,
      income: totalIncome,
      expenses: totalExpenses,
      balanceTrend: currentIncome - currentExpense - (previousIncome - previousExpense),
      incomeTrend: currentIncome - previousIncome,
      expensesTrend: currentExpense - previousExpense,
    };
  }, [transactions]);

  const last6MonthsData = useMemo(() => {
    const now = new Date();
    const rows = Array.from({ length: 6 }, (_, index) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        month: d.toLocaleString("en-US", { month: "short" }),
        income: 0,
        expense: 0,
      };
    });
    const map = new Map(rows.map((r) => [r.key, r]));
    transactions.forEach((tx) => {
      const d = new Date(tx.date || tx.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const row = map.get(key);
      if (!row) return;
      if (tx.type === "income") row.income += tx.amount;
      if (tx.type === "expense") row.expense += tx.amount;
    });
    return rows;
  }, [transactions]);

  const currentMonthExpenseByCategory = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const categoryMap = new Map<string, number>();

    transactions.forEach((tx) => {
      if (tx.type !== "expense") return;
      const d = new Date(tx.date || tx.createdAt);
      if (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear) return;
      categoryMap.set(tx.category, (categoryMap.get(tx.category) ?? 0) + tx.amount);
    });

    return Array.from(categoryMap.entries()).map(([category, value], index) => ({
      category,
      value,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-5">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your financial overview at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard label="Total Balance" value={metrics.balance} trend={metrics.balanceTrend} />
        <SummaryCard label="Income" value={metrics.income} trend={metrics.incomeTrend} />
        <SummaryCard label="Expenses" value={metrics.expenses} trend={metrics.expensesTrend} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="border-primary/20">
          <CardContent className="space-y-3">
            <div>
              <p className="text-muted-foreground">Income vs Expenses</p>
              <h3 className="text-xl font-semibold text-primary">Last 6 Months</h3>
            </div>
            {loading ? (
              <div className="h-[320px] animate-pulse rounded-xl bg-muted/60" />
            ) : (
              <MonthlyIncomeExpenseBarChart data={last6MonthsData} />
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="space-y-3">
            <div>
              <p className="text-muted-foreground">Current Month</p>
              <h3 className="text-xl font-semibold text-primary">Expenses by Category</h3>
            </div>
            {loading ? (
              <div className="h-[320px] animate-pulse rounded-xl bg-muted/60" />
            ) : (
              <CurrentMonthExpenseDonutChart data={currentMonthExpenseByCategory} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
