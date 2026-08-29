"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle } from "lucide-react";
// استبدل هذا بالهوك الخاص بك أو دالة الـ API التي ترسل البيانات للرابط المطلوب
// مثال: /api/orders/{orderId}/items/{itemId}/payments
import { useAddPayment } from "@/hooks/use-orders"; 
import { toast } from "sonner"; // أو مكتبة الـ Toast المستخدمة عندك

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  itemId: number;
  stageName: string;
}

export default function AddPaymentModal({
  isOpen,
  onClose,
  orderId,
  itemId,
  stageName,
}: AddPaymentModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // الهوك المسؤول عن إرسال البيانات للـ Endpoint المطلوب
  const { mutate: addPayment, isPending } = useAddPayment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      toast.error("يرجى إدخال مبلغ صحيح");
      return;
    }

    // إرسال البيانات للـ Endpoint: api/orders/{orderId}/items/{itemId}/payments
    addPayment(
      {
        orderId,
        itemId,
        data: {
          amount: Number(amount),
          notes,
          stageName, // إذا كان الـ API يحتاج اسم المرحلة أيضاً
        },
      },
      {
        onSuccess: () => {
          toast.success("تم إضافة الدفعة بنجاح");
          setAmount("");
          setNotes("");
          onClose();
        },
        onError: () => {
          toast.error("حدث خطأ أثناء إضافة الدفعة، حاول مرة أخرى.");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dir-rtl rounded-2xl bg-white p-6 space-y-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-[#2C2420] text-right flex items-center gap-2">
            <PlusCircle className="size-5 text-emerald-600" />
            <span>إضافة دفعة جديدة - {stageName}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* حقل المبلغ */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-bold text-gray-700">
              المبلغ (ج.م) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="أدخل المبلغ..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-xl border-gray-200 focus:border-emerald-600 focus:ring-emerald-600"
              required
            />
          </div>

          {/* حقل الملاحظات */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-bold text-gray-700">
              ملاحظات (اختياري)
            </Label>
            <Input
              id="notes"
              type="text"
              placeholder="مثال: دفعة مقدمة، الدفعة الثانية..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl border-gray-200 focus:border-emerald-600 focus:ring-emerald-600"
            />
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl font-bold px-4"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-5"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin ml-2" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <span>حفظ الدفعة</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}