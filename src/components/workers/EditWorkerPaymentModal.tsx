"use client";

import { useState } from "react";
import { useUpdateWorkerPayment } from "@/hooks/use-workers";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Edit3 } from "lucide-react";
import { WorkerPayment } from "./WorkerPaymentsModal";

interface EditWorkerPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerId: number | null;
  payment: WorkerPayment | null;
}

export default function EditWorkerPaymentModal({ isOpen, onClose, workerId, payment }: EditWorkerPaymentModalProps) {
  // تهيئة الـ state مباشرة بالقيم القادمة من الـ props
  const [amount, setAmount] = useState(() => String(payment?.payment || payment?.amount || ""));
  const { mutate: updatePayment, isPending } = useUpdateWorkerPayment(workerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !payment) return;

    updatePayment(
      { paymentId: payment.id, payment: Number(amount) },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dir-rtl rounded-2xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#2C2420] text-right flex items-center gap-2">
            <Edit3 className="size-5 text-[#7C4A26]" />
            تعديل قيمة الدفعة
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="edit-payment" className="text-sm font-semibold text-[#2C2420]">
              المبلغ الجديد (ج.م)
            </Label>
            <Input
              id="edit-payment"
              type="number"
              defaultValue={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-xl font-mono text-right text-sm"
              required
            />
          </div>

          <div className="pt-2 flex gap-3">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[#7C4A26] hover:bg-[#633a1d] text-white rounded-xl text-sm font-semibold cursor-pointer"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : "حفظ التعديلات"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-sm font-semibold border-gray-200 cursor-pointer"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}