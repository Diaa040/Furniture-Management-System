const salesData = [
  { month: "يناير", value: 55 },
  { month: "فبراير", value: 72 },
  { month: "مارس", value: 61 },
  { month: "أبريل", value: 84 },
  { month: "مايو", value: 76 },
  { month: "يونيو", value: 92 },
];

export function DashboardSalesOverview() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold">
          نظرة عامة على المبيعات
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          أداء المبيعات خلال آخر 6 أشهر
        </p>
      </div>

      <div className="flex h-64 items-end gap-4">
        {salesData.map((item) => (
          <div
            key={item.month}
            className="flex flex-1 flex-col items-center gap-3"
          >
            <div className="flex h-full w-full items-end">
              <div
                className="w-full rounded-t-lg bg-primary/80 transition-all hover:bg-primary"
                style={{ height: `${item.value}%` }}
              />
            </div>

            <span className="text-xs text-muted-foreground">
              {item.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}