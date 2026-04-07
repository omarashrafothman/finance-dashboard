import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SummaryCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: number;
  trend: number;
}) {
  const isPositive = trend >= 0;

  return (
    <Card className="border-primary/20">
      <CardContent>
        <p className="text-muted-foreground">{label}</p>
        <h2 className="text-2xl font-bold text-primary">{value.toFixed(2)}</h2>
        <p className={`mt-1 inline-flex items-center gap-1 text-xs ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
          {isPositive ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
          {isPositive ? "+" : ""}
          {trend.toFixed(2)} vs previous month
        </p>
      </CardContent>
    </Card>
  );
}
