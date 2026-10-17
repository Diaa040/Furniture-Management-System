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
import { useUpdateAddition } from "@/hooks/use-additions";
import { getApiErrorMessage } from "@/lib/error-helpers";
import type { AdditionItem } from "@/types/additions";

interface EditAdditionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  addition: AdditionItem | null;
}

export function EditAdditionDialog({
  isOpen,
  onClose,
  addition,
}: EditAdditionDialogProps) {
  if (!isOpen || !addition) return null;

  // ✅ الـ key بيخلي الفورم يتعمله remount مع كل إضافة مختلفة، فالحقول بتتملى
  // بالقيم الجديدة تلقائيًا من غير useEffect (نفس باترن EditStagePaymentModal)
  return (
    <EditAdditionForm key={addition.id} addition={addition} onClose={onClose} />
  );
}

interface EditAdditionFormProps {
  addition: AdditionItem;
  onClose: () => void;
}

function EditAdditionForm({ addition, onClose }: EditAdditionFormProps) {
  const [workerName, setWorkerName] = useState(addition.worker_name);
  const [materialName, setMaterialName] = useState(addition.material_name);
  const [totalPrice, setTotalPrice] = useState<number | "">(
    addition.total_price
  );

  const updateAddition = useUpdateAddition(addition.id);

  const updateError = updateAddition.isError
    ? getApiErrorMessage(updateAddition.error, "حدث خطأ أثناء تعديل البيانات")
    : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim() || !materialName.trim()) return;
    if (totalPrice === "" || Number(totalPrice) < 0) return;

    updateAddition.mutate(
      {
        worker_name: workerName.trim(),
        material_name: materialName.trim(),
        total_price: Number(totalPrice),
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dir-rtl rounded-2xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-[#2C2420] text-right">
            تعديل بيانات الإضافة
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

          <div className="space-y-1.5 text-right">
            <Label className="text-xs font-bold text-[#2C2420]">
              الأجرة الإجمالية (ج.م) *
            </Label>
            <Input
              type="number"
              step="any"
              min="0"
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
              disabled={updateAddition.isPending}
              className="rounded-xl font-black bg-[#7C4A26] hover:bg-[#633a1e] text-white px-6"
            >
              {updateAddition.isPending ? (
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