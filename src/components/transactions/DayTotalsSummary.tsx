import type { DayDetailsTotals } from "@/types/transactions";

interface DayTotalsSummaryProps {
  totals: DayDetailsTotals;
}

export function DayTotalsSummary({ totals }: DayTotalsSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-2xl p-5 border bg-chart-2/10 border-chart-2/30">
        <p className="text-sm font-bold text-muted-foreground mb-1">
          إجمالي الوارد (In)
        </p>
        <p className="text-2xl font-black text-chart-2">
          {totals.total_in.toLocaleString()} ج.م
        </p>
      </div>
      <div className="rounded-2xl p-5 border bg-destructive/10 border-destructive/30">
        <p className="text-sm font-bold text-muted-foreground mb-1">
          إجمالي الصادر (Out)
        </p>
        <p className="text-2xl font-black text-destructive">
          {totals.total_out.toLocaleString()} ج.م
        </p>
      </div>
      <div
        className={`rounded-2xl p-5 border ${
          totals.net_day >= 0
            ? "bg-chart-2/10 border-chart-2/30"
            : "bg-destructive/10 border-destructive/30"
        }`}
      >
        <p className="text-sm font-bold text-muted-foreground mb-1">
          صافي الرصيد (Net)
        </p>
        <p
          className={`text-2xl font-black ${
            totals.net_day >= 0 ? "text-chart-2" : "text-destructive"
          }`}
        >
          {totals.net_day.toLocaleString()} ج.م
        </p>
      </div>
    </div>
  );
}
