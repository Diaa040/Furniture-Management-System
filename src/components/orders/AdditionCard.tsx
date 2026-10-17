"use client";

import { useState } from "react";
import { CreditCard, Pencil, Plus } from "lucide-react";
import type { AdditionItem } from "@/types/additions";
import { AdditionPaymentsModal } from "@/components/orders/AdditionPaymentsModal";
import { AddAdditionPaymentDialog } from "@/components/orders/AddAdditionPaymentDialog";
import { EditAdditionDialog } from "@/components/orders/EditAdditionDialog";

interface AdditionCardProps {
  addition: AdditionItem;
  itemId: number;
}

// ✅ الزراير التلاتة اتفعّلوا خالص دلوقتي: إضافة دفعة، الدفعات، تعديل البيانات
export function AdditionCard({ addition, itemId }: AdditionCardProps) {
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="bg-accent/40 p-6 rounded-2xl border border-primary/20 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-2xl">👷</span>
          <h3 className="text-xl font-black text-foreground">
            {addition.worker_name}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddPaymentOpen(true)}
            className="flex items-center gap-1.5 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-2 rounded-xl shadow-sm transition-all"
          >
            <Plus className="size-4" />
            <span>إضافة دفعة</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPaymentsOpen(true)}
            className="flex items-center gap-2 text-sm font-bold text-chart-2 hover:opacity-80 bg-chart-2/10 hover:bg-chart-2/20 px-4 py-2 rounded-xl border border-chart-2/30 shadow-sm transition-all"
          >
            <CreditCard className="size-4" />
            <span>الدفعات</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-1.5 text-sm font-bold text-[#7C4A26] bg-white hover:bg-gray-50 px-4 py-2 rounded-xl border border-gray-300 shadow-sm transition-all"
          >
            <Pencil className="size-4" />
            <span>تعديل البيانات</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pt-1">
        <div className="space-y-2">
          <label className="text-sm font-bold text-muted-foreground block">
            اسم الخامة / المادة
          </label>
          <div className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-base font-black text-foreground shadow-sm">
            {addition.material_name}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-muted-foreground block">
            الأجرة المتفق عليها
          </label>
          <div className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-base font-black text-foreground shadow-sm">
            {addition.total_price.toLocaleString()} ج.م
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-muted-foreground block">
            المدفوع
          </label>
          <div className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-base font-black text-chart-2 shadow-sm">
            {addition.total_paid.toLocaleString()} ج.م
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-muted-foreground block">
            المتبقي
          </label>
          <div className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-base font-black text-destructive shadow-sm">
            {addition.remaining.toLocaleString()} ج.م
          </div>
        </div>
      </div>

      <AdditionPaymentsModal
        isOpen={isPaymentsOpen}
        onClose={() => setIsPaymentsOpen(false)}
        itemId={itemId}
        additionId={addition.id}
        materialName={addition.material_name}
      />

      <AddAdditionPaymentDialog
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        additionId={addition.id}
      />

      <EditAdditionDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        addition={addition}
      />
    </div>
  );
}