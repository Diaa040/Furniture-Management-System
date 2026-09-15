"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useUpdateStagePayment } from "@/hooks/use-orders";
import type { PaymentItem } from "@/types/order";

interface EditStagePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  itemId: number;
  stageName: string;
  payment: PaymentItem | null;
}

export default function EditStagePaymentModal({
  isOpen,
  onClose,
  orderId,
  itemId,
  stageName,
  payment,
}: EditStagePaymentModalProps) {
  if (!isOpen || !payment) return null;

  // ✅ الـ key بتخلي React يعمل remount للفورم مع كل دفعة مختلفة،
  // فالـ state بتاعته بيتصفّر ويتملى من القيم الجديدة تلقائياً من غير useEffect
  return (
    <EditStagePaymentForm
      key={payment.id}
      orderId={orderId}
      itemId={itemId}
      stageName={stageName}
      payment={payment}
      onClose={onClose}
    />
  );
}

interface EditStagePaymentFormProps {
  orderId: number;
  itemId: number;
  stageName: string;
  payment: PaymentItem;
  onClose: () => void;
}

function EditStagePaymentForm({
  orderId,
  itemId,
  stageName,
  payment,
  onClose,
}: EditStagePaymentFormProps) {
  const [amount, setAmount] = useState<number | "">(payment.amount);

  const updateMutation = useUpdateStagePayment(orderId, itemId, stageName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount === "" || Number(amount) < 1) return;

    updateMutation.mutate(
      { paymentId: payment.id, amount: Number(amount) },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm dir-rtl rounded-2xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-[#2C2420] text-right">
            تعديل الدفعة
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5 text-right">
            <Label className="text-xs font-bold text-[#2C2420]">
              المبلغ (ج.م) *
            </Label>
            <Input
              type="number"
              step="any"
              min="1"
              required
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="rounded-xl border-gray-200 h-11 text-center text-sm font-bold font-mono"
            />
          </div>

          {updateMutation.isError && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-2.5 text-center">
              حدث خطأ أثناء تعديل الدفعة
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl font-bold border-gray-200"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="rounded-xl font-black bg-[#7C4A26] hover:bg-[#633a1e] text-white px-6"
            >
              {updateMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "حفظ التعديل"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}