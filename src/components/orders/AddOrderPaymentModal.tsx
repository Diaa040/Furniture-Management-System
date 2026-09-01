"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface AddOrderPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  isPending: boolean;
}

export default function AddOrderPaymentModal({ isOpen, onClose, onSubmit, isPending }: AddOrderPaymentModalProps) {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount < 1) {
      alert("الرجاء إدخال مبلغ صحيح (أكبر من أو يساوي 1)");
      return;
    }
    onSubmit(numericAmount);
    setAmount("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md dir-rtl rounded-2xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-[#2C2420] text-center">تسجيل دفعة للأوردر</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5 text-right">
            <Label className="text-sm font-bold text-[#2C2420]">المبلغ (Amount) *</Label>
            <Input
              type="number"
              step="any"
              min="1"
              required
              placeholder="أدخل المبلغ (مثال: 500)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-xl border-gray-200 h-11 text-center text-sm font-bold"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl font-bold border-gray-200">إلغاء</Button>
            <Button type="submit" disabled={isPending} className="rounded-xl font-black bg-[#7C4A26] hover:bg-[#633a1e] text-white px-6">
              {isPending ? <Loader2 className="size-4 animate-spin" /> : "حفظ الدفعة"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}