"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, CreditCard, Loader2, Pencil, Receipt } from "lucide-react";
import { useAdditionPayments } from "@/hooks/use-additions";
import { EditAdditionPaymentModal } from "@/components/orders/EditAdditionPaymentModal";
import type { AdditionPaymentItem } from "@/types/additions";

interface AdditionPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number;
  additionId: number | null;
  materialName?: string;
}

export function AdditionPaymentsModal({
  isOpen,
  onClose,
  itemId,
  additionId,
  materialName,
}: AdditionPaymentsModalProps) {
  const { data, isLoading, isError } = useAdditionPayments(
    additionId,
    isOpen
  );

  // الدفعة المختارة حالياً للتعديل (null يعني مفيش مودال تعديل مفتوح)
  const [editingPayment, setEditingPayment] =
    useState<AdditionPaymentItem | null>(null);

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg dir-rtl rounded-2xl bg-white p-6 space-y-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-[#2C2420] text-right flex items-center gap-2">
            <CreditCard className="size-5 text-emerald-600" />
            <span>سجل دفعات: {materialName || "الإضافة"}</span>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-7 animate-spin text-[#7C4A26]" />
            <span className="mr-3 font-bold text-sm text-gray-600">
              جاري تحميل الدفعات...
            </span>
          </div>
        ) : isError || !data ? (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 text-center font-bold text-sm">
            حدث خطأ أثناء تحميل بيانات الدفعات.
          </div>
        ) : (
          <div className="space-y-5">
            {/* بطاقات الملخص المالي */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-gray-100 text-center space-y-1">
                <span className="text-xs font-bold text-gray-500 block">
                  الأجرة الإجمالية
                </span>
                <span className="text-base font-black text-[#2C2420]">
                  {Number(data.total_price).toLocaleString()} ج.م
                </span>
              </div>
              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-center space-y-1">
                <span className="text-xs font-bold text-emerald-700 block">
                  المدفوع
                </span>
                <span className="text-base font-black text-emerald-700">
                  {Number(data.total_paid).toLocaleString()} ج.م
                </span>
              </div>
              <div className="bg-red-50/50 p-3 rounded-xl border border-red-100 text-center space-y-1">
                <span className="text-xs font-bold text-red-600 block">
                  المتبقي
                </span>
                <span className="text-base font-black text-red-600">
                  {Number(data.remaining).toLocaleString()} ج.م
                </span>
              </div>
            </div>

            {/* قائمة الدفعات */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <h4 className="text-sm font-black text-[#2C2420] flex items-center gap-1.5">
                <Receipt className="size-4 text-amber-700" />
                <span>قائمة الدفعات المسجلة</span>
              </h4>

              {data.payments_list && data.payments_list.length > 0 ? (
                data.payments_list.map(
                  (payment: AdditionPaymentItem, index: number) => (
                    <div
                      key={payment.id}
                      className="p-4 rounded-xl border border-gray-100 bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900">
                          دفعة #{index + 1}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-emerald-700">
                            {Number(payment.amount).toLocaleString()} ج.م
                          </span>

                          <button
                            type="button"
                            onClick={() => setEditingPayment(payment)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200/70 hover:text-[#2C2420] transition-colors"
                            title="تعديل الدفعة"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold pt-1 border-t border-gray-200/60">
                        <Calendar className="size-3.5 text-gray-400" />
                        <span>
                          {new Date(payment.paid_at).toLocaleDateString(
                            "ar-EG"
                          )}
                        </span>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="text-center py-8 text-gray-400 font-semibold text-sm border border-dashed border-gray-200 rounded-xl">
                  لا توجد دفعات مسجلة لهذه الإضافة حتى الآن.
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* مودال تعديل دفعة - مودال منفصل بيتفتح فوق مودال قائمة الدفعات */}
    <EditAdditionPaymentModal
      isOpen={editingPayment !== null}
      onClose={() => setEditingPayment(null)}
      itemId={itemId}
      additionId={additionId as number}
      payment={editingPayment}
    />
    </>
  );
}