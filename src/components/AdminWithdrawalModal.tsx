"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
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
import { api } from "@/lib/api";

interface AdminWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminWithdrawalModal({
  isOpen,
  onClose,
}: AdminWithdrawalModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount < 0.01) {
      alert("الرجاء إدخال مبلغ صحيح أكبر من أو يساوي 0.01");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // إرسال البيانات للـ Endpoint المطلوبة
      await api.post("api/finance/admin-withdrawal", {
        amount: numericAmount,
      });

      // إعادة تحديث بيانات الخزينة وكاش الصفحة تلقائياً
      queryClient.invalidateQueries({ queryKey: ["treasury"] });

      // إغلاق الموب أب وتفريغ الحقل وتحديث الصفحة
      setAmount("");
      onClose();
      router.refresh();
    } catch (error: any) {
      console.error("خطأ أثناء سحب الإدارة:", error);
      alert(error?.response?.data?.message || "حدث خطأ أثناء تنفيذ عملية السحب");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dir-rtl rounded-2xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-[#2C2420] text-right">
            تسجيل مسحوبات الإدارة
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5 text-right">
            <Label className="text-sm font-bold text-[#2C2420]">
              المبلغ المراد سحبه (Amount) *
            </Label>
            <Input
              type="number"
              step="any"
              min="0.01"
              required
              placeholder="أدخل المبلغ (مثال: 1000)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-xl border-gray-200 h-11 text-center text-sm font-bold font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
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
              disabled={isSubmitting}
              className="rounded-xl font-black bg-[#7C4A26] hover:bg-[#633a1e] text-white px-6"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "حفظ السحب"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}