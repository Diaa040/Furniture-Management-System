"use client";

import { Search, RotateCcw } from "lucide-react";

interface OrdersFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

export function OrdersFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onReset,
}: OrdersFiltersProps) {
  const hasFilters = search !== "" || status !== "all";

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-center">
      <div className="flex h-11 flex-1 items-center gap-3 rounded-lg border border-border bg-muted/30 px-3">
        <Search className="size-5 shrink-0 text-muted-foreground" />

        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث برقم الأوردر أو اسم العميل..."
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
        />
      </div>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="h-11 rounded-lg border border-border bg-card px-3 text-[15px] outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="all">الكل</option>
        <option value="manufacturing">قيد التصنيع</option>
        <option value="ready">جاهز للتسليم</option>
        <option value="delivered">تم التسليم</option>
      </select>

      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold transition-colors hover:bg-accent"
        >
          <RotateCcw className="size-4" />
          إعادة ضبط
        </button>
      )}
    </div>
  );
}