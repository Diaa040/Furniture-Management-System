"use client";

import { useWorkerOrderItems } from "@/hooks/use-workers";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Package, Plus, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WorkerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: { id: number; name: string } | null;
  onOpenAddPayment: () => void;
  onOpenHistory: () => void;
}

const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "قيد الانتظار", className: "bg-amber-100 text-amber-800" },
  processing: { label: "قيد التصنيع", className: "bg-blue-100 text-blue-800" },
  completed: { label: "مكتمل", className: "bg-emerald-100 text-emerald-800" },
  delivered: { label: "تم التسليم", className: "bg-[#E6F4EA] text-[#1E7E34]" },
};

export default function WorkerDetailsModal({
  isOpen,
  onClose,
  worker,
  onOpenAddPayment,
  onOpenHistory,
}: WorkerDetailsModalProps) {
  const { items, isLoading, isError } = useWorkerOrderItems(worker?.id ?? null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl dir-rtl rounded-2xl bg-white p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-[#2C2420] text-right flex items-center gap-2">
            <Package className="size-5 text-[#7C4A26]" />
            عناصر أوردرات العامل: <span className="text-[#7C4A26]">{worker?.name}</span>
          </DialogTitle>
        </DialogHeader>

        {/* زرين "الدفعات" و "إضافة دفعة" في المنتصف تحت العنوان */}
        <div className="flex items-center justify-center gap-3 my-4">
          <button
            onClick={onOpenHistory}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#E6F4EA] text-[#1E7E34] hover:opacity-90 font-semibold text-sm transition shadow-sm border border-[#1E7E34]/20"
          >
            <span>الدفعات</span>
            <CreditCard className="size-4" />
          </button>

          <button
            onClick={onOpenAddPayment}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#7C4A26] text-white hover:bg-[#633a1d] font-semibold text-sm transition shadow-sm"
          >
            <span>إضافة دفعة</span>
            <Plus className="size-4" />
          </button>
        </div>

        {/* عرض عناصر الأوردرات الأساسية */}
        <div className="mt-2 space-y-3">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-[#7C4A26]" />
              <span className="mr-2 text-sm text-muted-foreground">جاري تحميل العناصر...</span>
            </div>
          ) : isError ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200 text-center">
              حدث خطأ أثناء جلب عناصر العامل.
            </div>
          ) : items.length > 0 ? (
            items.map((item) => {
              const statusInfo = statusMap[item.status] || {
                label: item.status,
                className: "bg-gray-100 text-gray-700",
              };

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-[#FAFAFA]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#2C2420] text-sm">{item.name}</h4>
                      <span className="text-xs text-muted-foreground font-mono">
                        (أوردر #{item.order_id})
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.notes || "لا توجد ملاحظات"}
                    </p>
                    <span className="text-sm font-bold text-emerald-600 block font-mono">
                      {Number(item.price).toLocaleString()} ج.م
                    </span>
                  </div>

                  <Badge className={`${statusInfo.className} border-none rounded-full px-3 text-sm`}>
                    {statusInfo.label}
                  </Badge>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              لا توجد عناصر مسجلة لهذا العامل حالياً.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}