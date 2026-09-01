"use client";

import { useState } from "react";
import { useWorkerPayments } from "@/hooks/use-workers";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Receipt, Calendar, FileText, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EditWorkerPaymentModal from "./EditWorkerPaymentModal";

export interface WorkerPayment {
  id: number;
  worker_id: number;
  payment: string | number;
  amount?: string | number;
  created_at: string;
  updated_at: string;
}

interface WorkerPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: { id: number; name: string } | null;
}

export default function WorkerPaymentsModal({ isOpen, onClose, worker }: WorkerPaymentsModalProps) {
  const { payments, isLoading, isError } = useWorkerPayments(worker?.id ?? null);
  
  // حالة مودال التعديل الداخلي
  const [selectedPaymentForEdit, setSelectedPaymentForEdit] = useState<WorkerPayment | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // عكس الترتيب لكي تظهر الدفعة الجديدة في الأعلى
  const rawPayments = (payments as unknown as WorkerPayment[]) || [];
  const typedPayments = [...rawPayments].reverse();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-xl dir-rtl rounded-2xl bg-white p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[#2C2420] text-right flex items-center gap-2">
              <Receipt className="size-5 text-[#7C4A26]" />
              قائمة الدفعات المسجلة: <span className="text-[#7C4A26]">{worker?.name}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            {isLoading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="size-6 animate-spin text-[#7C4A26]" />
                <span className="mr-2 text-sm text-muted-foreground">جاري تحميل الدفعات...</span>
              </div>
            ) : isError ? (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200 text-center">
                حدث خطأ أثناء جلب سجل الدفعات.
              </div>
            ) : typedPayments.length > 0 ? (
              typedPayments.map((payment, index: number) => {
                const paymentNumber = typedPayments.length - index; // لترقيم الدفعات تصاعدياً حقيقياً
                const amount = Number(payment.payment || payment.amount || 0).toLocaleString();
                
                const rawDate = payment.created_at ? new Date(payment.created_at) : new Date();
                const formattedDate = rawDate.toISOString().split("T")[0];
                const formattedTime = rawDate.toTimeString().split(" ")[0];
                const dateTimeString = `${formattedTime} ${formattedDate}`;

                return (
                  <div
                    key={payment.id || index}
                    className="p-4 rounded-2xl border border-gray-100 bg-[#FAFAFA] flex flex-col justify-between space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-emerald-600 font-mono">
                        {amount} ج.م
                      </span>

                      <div className="flex items-center gap-2">
                        {/* زر التعديل */}
                        <button
                          onClick={() => {
                            setSelectedPaymentForEdit(payment);
                            setIsEditModalOpen(true);
                          }}
                          className="flex items-center gap-1 bg-[#FAF8F5] border border-[#7C4A26]/30 text-[#7C4A26] px-3 py-1 rounded-full text-xs font-semibold hover:bg-[#7C4A26] hover:text-white transition cursor-pointer"
                        >
                          <Edit className="size-3.5" />
                          <span>تعديل</span>
                        </button>

                        <Badge className="bg-[#FEF3C7] text-[#92400E] border-none rounded-full px-3 py-1 text-sm font-bold">
                          دفعة #{paymentNumber}
                        </Badge>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 w-full" />

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5 font-medium text-[#2C2420]">
                        <FileText className="size-4 text-[#7C4A26]" />
                        <span>دفعة نقدي</span>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-xs text-gray-500">
                        <Calendar className="size-4 text-gray-400" />
                        <span>{dateTimeString}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-muted-foreground text-sm">
                لا توجد دفعات مسجلة لهذا العامل حتى الآن.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* مودال تعديل الدفعة المنبثق */}
      <EditWorkerPaymentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        workerId={worker?.id ?? null}
        payment={selectedPaymentForEdit}
      />
    </>
  );
}