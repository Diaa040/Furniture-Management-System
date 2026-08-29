const lowStockProducts = [
  {
    name: "كرسي خشب",
    quantity: 5,
  },
  {
    name: "مكتب مودرن",
    quantity: 3,
  },
  {
    name: "طاولة طعام",
    quantity: 2,
  },
  {
    name: "وحدة تخزين",
    quantity: 1,
  },
];

export function DashboardLowStock() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold">
          تنبيهات المخزون
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          المنتجات التي تحتاج إلى إعادة تخزين
        </p>
      </div>

      <div className="space-y-4">
        {lowStockProducts.map((product) => (
          <div
            key={product.name}
            className="flex items-center justify-between rounded-xl border border-border p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                ⚠
              </div>

              <span className="text-[15px] font-semibold">
                {product.name}
              </span>
            </div>

            <span className="text-sm font-bold text-red-600">
              {product.quantity} قطع
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}