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
import { useUpdateAdditionPayment } from "@/hooks/use-additions";
import { getApiErrorMessage } from "@/lib/error-helpers";
import type { AdditionPaymentItem } from "@/types/additions";

interface EditAdditionPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number;
  additionId: number;
  payment: AdditionPaymentItem | null;
}

export function EditAdditionPaymentModal({
  isOpen,
  onClose,
  itemId,
  additionId,
  payment,
}: EditAdditionPaymentModalProps) {
  if (!isOpen || !payment) return null;

  // ✅ الـ key بيخلي الفورم يتعمله remount مع كل دفعة مختلفة، فالـ state
  // بتاعته بيتصفّر ويتملى من القيم الجديدة تلقائيًا من غير useEffect
  return (
    <EditAdditionPaymentForm
      key={payment.id}
      itemId={itemId}
      additionId={additionId}
      payment={payment}
      onClose={onClose}
    />
  );
}

interface EditAdditionPaymentFormProps {
  itemId: number;
  additionId: number;
  payment: AdditionPaymentItem;
  onClose: () => void;
}

function EditAdditionPaymentForm({
  itemId,
  additionId,
  payment,
  onClose,
}: EditAdditionPaymentFormProps) {
  // ⚠️ payment.amount راجع كـ string من الباك اند (زي "500.00")
  const [amount, setAmount] = useState<number | "">(Number(payment.amount));

  const updateMutation = useUpdateAdditionPayment(itemId, additionId);

  const updateError = updateMutation.isError
    ? getApiErrorMessage(updateMutation.error, "حدث خطأ أثناء تعديل الدفعة")
    : "";

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

          {updateError && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-2.5 text-center">
              {updateError}
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