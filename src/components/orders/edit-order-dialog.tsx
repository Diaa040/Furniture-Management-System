"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useUpdateOrder } from "@/hooks/use-orders";
import { getApiErrorMessage } from "@/lib/error-helpers";
import type { OrderListItem } from "@/types/order";

const STATUS_OPTIONS = [
  { value: "pending", label: "قيد الانتظار" },
  { value: "processing", label: "قيد التنفيذ" },
  { value: "delivered", label: "تم التسليم" },
  { value: "cancelled", label: "ملغي" },
];

interface EditOrderDialogProps {
  order: OrderListItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditOrderDialog({
  order,
  onClose,
  onSuccess,
}: EditOrderDialogProps) {
  const updateOrder = useUpdateOrder();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [status, setStatus] = useState("pending");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");

  // ملء الفورم بقيم الطلب المختار
  useEffect(() => {
    if (order) {
      setCustomerName(order.customer_name ?? "");
      setCustomerPhone(order.customer_phone ?? "");
      setStatus(order.status ?? "pending");
      setDeliveryDate(order.delivery_date?.slice(0, 10) ?? "");
      setNotes(order.notes ?? "");
      updateOrder.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  if (!order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateOrder.mutate(
      {
        id: order.id,
        payload: {
          customer_name: customerName,
          customer_phone: customerPhone,
          status,
          delivery_date: deliveryDate || undefined,
          notes,
        },
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
      },
    );
  };

  const errorMessage = updateOrder.isError
    ? getApiErrorMessage(updateOrder.error, "حدث خطأ أثناء تعديل الطلب")
    : "";

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <h2 className="text-lg font-bold">تعديل الأوردر #{order.id}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-lg hover:bg-accent"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {errorMessage && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm font-bold rounded-xl border border-destructive/30">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">اسم العميل *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">رقم الهاتف *</label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">الحالة</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputClass}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">تاريخ التسليم</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">ملاحظات</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-accent"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={updateOrder.isPending}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50"
            >
              {updateOrder.isPending && <Loader2 className="size-4 animate-spin" />}
              حفظ التعديلات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}