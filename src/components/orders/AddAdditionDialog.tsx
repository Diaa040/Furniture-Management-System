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
import { useCreateAddition } from "@/hooks/use-additions";

interface AddAdditionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number;
  itemId: number;
}

export function AddAdditionDialog({
  isOpen,
  onOpenChange,
  orderId,
  itemId,
}: AddAdditionDialogProps) {
  const [workerName, setWorkerName] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [totalPrice, setTotalPrice] = useState<number | "">("");
  const [payment, setPayment] = useState<number | "">("");

  const createAddition = useCreateAddition(orderId, itemId);

  const resetForm = () => {
    setWorkerName("");
    setMaterialName("");
    setTotalPrice("");
    setPayment("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim() || !materialName.trim()) return;
    if (totalPrice === "" || Number(totalPrice) < 1) return;

    createAddition.mutate(
      {
        worker_name: workerName.trim(),
        material_name: materialName.trim(),
        total_price: Number(totalPrice),
        payment: payment === "" ? 0 : Number(payment),
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? onOpenChange(true) : handleClose())}
    >
      <DialogContent className="sm:max-w-md dir-rtl rounded-2xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-[#2C2420] text-right">
            إضافة جديدة
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5 text-right">
            <Label className="text-xs font-bold text-[#2C2420]">
              اسم الصنيعي *
            </Label>
            <Input
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
              required
              className="rounded-xl border-gray-200 h-11 text-sm font-bold"
            />
          </div>

          <div className="space-y-1.5 text-right">
            <Label className="text-xs font-bold text-[#2C2420]">
              اسم الخامة / المادة *
            </Label>
            <Input
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
              required
              className="rounded-xl border-gray-200 h-11 text-sm font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 text-right">
              <Label className="text-xs font-bold text-[#2C2420]">
                الأجرة الإجمالية (ج.م) *
              </Label>
              <Input
                type="number"
                step="any"
                min="1"
                required
                value={totalPrice}
                onChange={(e) =>
                  setTotalPrice(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="rounded-xl border-gray-200 h-11 text-center text-sm font-bold font-mono"
              />
            </div>

            <div className="space-y-1.5 text-right">
              <Label className="text-xs font-bold text-[#2C2420]">
                دفعة مقدمة (ج.م)
              </Label>
              <Input
                type="number"
                step="any"
                min="0"
                value={payment}
                onChange={(e) =>
                  setPayment(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="rounded-xl border-gray-200 h-11 text-center text-sm font-bold font-mono"
              />
            </div>
          </div>

          {createAddition.isError && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-2.5 text-center">
              حدث خطأ أثناء إضافة السجل الجديد
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
              disabled={createAddition.isPending}
              className="rounded-xl font-black bg-[#7C4A26] hover:bg-[#633a1e] text-white px-6"
            >
              {createAddition.isPending ? (
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