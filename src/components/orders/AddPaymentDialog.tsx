import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddPaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  stageName: string;
  amount: string;
  onAmountChange: (value: string) => void;
  note: string;
  onNoteChange: (value: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function AddPaymentDialog({
  isOpen,
  onOpenChange,
  stageName,
  amount,
  onAmountChange,
  note,
  onNoteChange,
  isSubmitting,
  onSubmit,
  onCancel,
}: AddPaymentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md dir-rtl rounded-2xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-[#2C2420] text-right">
            إضافة دفعة جديدة لصنيعي ({stageName})
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5 text-right">
            <Label className="text-sm font-bold text-[#2C2420]">
              المبلغ المراد دفعه (ج.م) *
            </Label>
            <Input
              type="number"
              step="any"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              className="rounded-xl border-gray-200 h-11 text-center text-sm font-bold"
            />
          </div>

          <div className="space-y-1.5 text-right">
            <Label className="text-sm font-bold text-[#2C2420]">
              ملاحظات أو بيان الدفعة (اختياري)
            </Label>
            <Input
              placeholder="مثال: دفعة مقدمة، تسليم جزء من الحساب..."
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              className="rounded-xl border-gray-200 h-11 text-right text-sm font-bold"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="rounded-xl font-bold border-gray-200"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl font-black bg-[#7C4A26] hover:bg-[#633a1e] text-white px-6"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "حفظ الدفعة"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}