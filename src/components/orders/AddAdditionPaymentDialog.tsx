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
import { useAddAdditionPayment } from "@/hooks/use-additions";
import { getApiErrorMessage } from "@/lib/error-helpers";

interface AddAdditionPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  additionId: number;
}

export function AddAdditionPaymentDialog({
  isOpen,
  onClose,
  additionId,
}: AddAdditionPaymentDialogProps) {
  const [amount, setAmount] = useState<number | "">("");

  const addPayment = useAddAdditionPayment(additionId);

  // ✅ بيعرض رسالة الخطأ الحقيقية الراجعة من الباك اند (زي أخطاء الـ validation
  // بتاعة Laravel) بدل رسالة عامة ثابتة - نفس الهيلبر المستخدم في WorkshopInfoCard
  const addPaymentError = addPayment.isError
    ? getApiErrorMessage(addPayment.error, "حدث خطأ أثناء إضافة الدفعة")
    : "";

  const handleClose = () => {
    setAmount("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount === "" || Number(amount) < 1) return;

    addPayment.mutate(
      { amount: Number(amount) },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? undefined : handleClose())}>
      <DialogContent className="sm:max-w-sm dir-rtl rounded-2xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-[#2C2420] text-right">
            إضافة دفعة
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

          {addPaymentError && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-2.5 text-center">
              {addPaymentError}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded-xl font-bold border-gray-200"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={addPayment.isPending}
              className="rounded-xl font-black bg-[#7C4A26] hover:bg-[#633a1e] text-white px-6"
            >
              {addPayment.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "حفظ"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}