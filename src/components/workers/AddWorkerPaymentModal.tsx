"use client";

import { useState } from "react";
import { useAddWorkerPayment } from "@/hooks/use-workers";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";

interface AddWorkerPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: { id: number; name: string } | null;
}

export default function AddWorkerPaymentModal({ isOpen, onClose, worker }: AddWorkerPaymentModalProps) {
  const [payment, setPayment] = useState("");
  const { mutate: addPayment, isPending } = useAddWorkerPayment(worker?.id ?? null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payment || !worker) return;

    addPayment(Number(payment), {
      onSuccess: () => {
        setPayment("");
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dir-rtl rounded-2xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#2C2420] text-right flex items-center gap-2">
            <Plus className="size-5 text-[#7C4A26]" />
            إضافة دفعة للعامل: <span className="text-[#7C4A26]">{worker?.name}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="payment" className="text-sm font-semibold text-[#2C2420]">
              مبلغ الدفعة (ج.م)
            </Label>
            <Input
              id="payment"
              type="number"
              placeholder="750"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
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
              {isPending ? <Loader2 className="size-4 animate-spin" /> : "حفظ الدفعة"}
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