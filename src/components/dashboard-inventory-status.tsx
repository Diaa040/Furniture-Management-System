const inventoryStats = [
  {
    label: "إجمالي المنتجات",
    value: "320",
  },
  {
    label: "متوفر",
    value: "280",
  },
  {
    label: "مخزون منخفض",
    value: "28",
  },
  {
    label: "نافد",
    value: "12",
  },
];

export function DashboardInventoryStatus() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold">
          حالة المخزون
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          ملخص حالة المنتجات الحالية
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {inventoryStats.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border bg-muted/30 p-4"
          >
            <p className="text-sm text-muted-foreground">
              {item.label}
            </p>

            <p className="mt-2 text-2xl font-bold">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}