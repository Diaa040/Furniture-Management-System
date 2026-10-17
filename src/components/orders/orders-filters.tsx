"use client";

import { Search, RotateCcw } from "lucide-react";

interface OrdersFiltersProps {
  search: string;
  status: string;
  paymentStatus: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPaymentStatusChange: (value: string) => void;
  onReset: () => void;
}

export function OrdersFilters({
  search,
  status,
  paymentStatus,
  onSearchChange,
  onStatusChange,
  onPaymentStatusChange,
  onReset,
}: OrdersFiltersProps) {
  const hasFilters =
    search !== "" ||
    status !== "all" ||
    paymentStatus !== "all";

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-center">
      {/* Search */}
      <div className="flex h-11 flex-1 items-center gap-3 rounded-lg border border-border bg-muted/30 px-3">
        <Search className="size-5 shrink-0 text-muted-foreground" />

        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث برقم الطلب أو اسم العميل..."
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Order Status */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="h-11 rounded-lg border border-border bg-card px-3 text-[15px] outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="all">كل حالات الطلب</option>

        <option value="pending">
          قيد الانتظار
        </option>

        <option value="processing">
          قيد التنفيذ
        </option>

        <option value="completed">
          مكتمل
        </option>

        <option value="cancelled">
          ملغي
        </option>
      </select>

      {/* Payment Status */}
      <select
        value={paymentStatus}
        onChange={(e) =>
          onPaymentStatusChange(e.target.value)
        }
        className="h-11 rounded-lg border border-border bg-card px-3 text-[15px] outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="all">كل حالات الدفع</option>

        <option value="paid">
          مدفوع
        </option>

        <option value="partial">
          مدفوع جزئيًا
        </option>

        <option value="unpaid">
          غير مدفوع
        </option>
      </select>

      {/* Reset */}
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