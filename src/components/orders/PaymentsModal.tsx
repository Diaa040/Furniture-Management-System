"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, CreditCard, Receipt, Calendar, FileText, Pencil } from "lucide-react";
import { useStagePayments } from "@/hooks/use-orders"; // أو الهوك حسب مكانه عندك
import type { PaymentItem } from "@/types/order";
import EditStagePaymentModal from "@/components/orders/EditStagePaymentModal"; // عدّل المسار لو حاطه في مكان مختلف

interface PaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  itemId: number;
  stageName: string;
}

export default function PaymentsModal({
  isOpen,
  onClose,
  orderId,
  itemId,
  stageName,
}: PaymentsModalProps) {
  // جلب البيانات فقط عندما يكون المودال مفتوحاً
  const { data, isLoading, isError } = useStagePayments(orderId, itemId, stageName, isOpen);

  const paymentData = data;

  // الدفعة المختارة حالياً للتعديل (null يعني مفيش مودال تعديل مفتوح)
  const [editingPayment, setEditingPayment] = useState<PaymentItem | null>(null);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg dir-rtl rounded-2xl bg-white p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[#2C2420] text-right flex items-center gap-2">
              <CreditCard className="size-5 text-emerald-600" />
              <span>سجل دفعات مرحلة: {stageName}</span>
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-7 animate-spin text-[#7C4A26]" />
              <span className="mr-3 font-bold text-sm text-gray-600">جاري تحميل الدفعات...</span>
            </div>
          ) : isError ? (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-center font-bold text-sm">
              حدث خطأ أثناء تحميل بيانات الدفعات.
            </div>
          ) : (
            <div className="space-y-5">
              {/* بطاقات الملخص المالي للمرحلة */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-gray-100 text-center space-y-1">
                  <span className="text-xs font-bold text-gray-500 block">المتفق عليه</span>
                  <span className="text-base font-black text-[#2C2420]">
                    {paymentData?.agreed_cost?.toLocaleString() || 0} ج.م
                  </span>
                </div>
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-center space-y-1">
                  <span className="text-xs font-bold text-emerald-700 block">المدفوع</span>
                  <span className="text-base font-black text-emerald-700">
                    {paymentData?.total_paid?.toLocaleString() || 0} ج.م
                  </span>
                </div>
                <div className="bg-red-50/50 p-3 rounded-xl border border-red-100 text-center space-y-1">
                  <span className="text-xs font-bold text-red-600 block">المتبقي</span>
                  <span className="text-base font-black text-red-600">
                    {paymentData?.remaining?.toLocaleString() || 0} ج.م
                  </span>
                </div>
              </div>

              {/* قائمة الدفعات */}
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                <h4 className="text-sm font-black text-[#2C2420] flex items-center gap-1.5">
                  <Receipt className="size-4 text-amber-700" />
                  <span>قائمة الدفعات المسجلة</span>
                </h4>

                {paymentData?.payments && paymentData.payments.length > 0 ? (
                  paymentData.payments.map((payment: PaymentItem, index: number) => (
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
                            {payment.amount.toLocaleString()} ج.م
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

                      <div className="flex items-center justify-between text-xs text-gray-500 font-semibold pt-1 border-t border-gray-200/60">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3.5 text-gray-400" />
                          <span>{payment.date}</span>
                        </div>
                        {payment.notes && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <FileText className="size-3.5 text-amber-600" />
                            <span>{payment.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400 font-semibold text-sm border border-dashed border-gray-200 rounded-xl">
                    لا توجد دفعات مسجلة لهذه المرحلة حتى الآن.
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* مودال تعديل دفعة - مودال منفصل بيتفتح فوق مودال قائمة الدفعات */}
      <EditStagePaymentModal
        isOpen={editingPayment !== null}
        onClose={() => setEditingPayment(null)}
        orderId={orderId}
        itemId={itemId}
        stageName={stageName}
        payment={editingPayment}
      />
    </>
  );
}