const recentSales = [
  {
    customer: "أحمد محمد",
    product: "طاولة خشبية",
    amount: "2,500 ج.م",
    status: "مكتملة",
  },
  {
    customer: "محمد علي",
    product: "غرفة نوم",
    amount: "4,200 ج.م",
    status: "مكتملة",
  },
  {
    customer: "محمود حسن",
    product: "كنبة مودرن",
    amount: "1,850 ج.م",
    status: "قيد التنفيذ",
  },
  {
    customer: "عمر خالد",
    product: "مكتب خشبي",
    amount: "3,100 ج.م",
    status: "مكتملة",
  },
];

export function DashboardRecentSales() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">
            آخر المبيعات
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            أحدث عمليات البيع
          </p>
        </div>

        <button
          type="button"
          className="text-sm font-semibold text-primary hover:underline"
        >
          عرض الكل
        </button>
      </div>

      <div className="space-y-4">
        {recentSales.map((sale) => (
          <div
            key={`${sale.customer}-${sale.product}`}
            className="flex items-center justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold">
                {sale.customer}
              </p>

              <p className="mt-1 truncate text-sm text-muted-foreground">
                {sale.product}
              </p>
            </div>

            <div className="shrink-0 text-left">
              <p className="text-[15px] font-bold">
                {sale.amount}
              </p>

              <span
                className={
                  sale.status === "مكتملة"
                    ? "text-xs font-medium text-emerald-700"
                    : "text-xs font-medium text-amber-700"
                }
              >
                {sale.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}