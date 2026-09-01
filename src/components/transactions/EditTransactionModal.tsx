"use client";

import { useState, useEffect } from "react";
import type { DayTransactionItem } from "@/types/transactions";
import { useUpdateTransaction } from "@/hooks/use-day-details";

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: DayTransactionItem | null;
}

export function EditTransactionModal({ isOpen, onClose, transaction }: EditTransactionModalProps) {
  const [name, setName] = useState("");
  // جعلنا السعر يقبل النص الفارغ "" لكي لا يظهر الصفر الافتراضي المزعج
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState<"in" | "out">("out");

  const updateMutation = useUpdateTransaction();

  // تعبئة البيانات القديمة أول ما يفتح المودال للعنصر المختار
  useEffect(() => {
    if (transaction) {
      setName(transaction.name);
      setAmount(Number(transaction.amount));
      setType(transaction.type);
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التأكد من أن المبلغ تم إدخاله قبل الإرسال
    if (amount === "") return;

    updateMutation.mutate(
      {
        id: transaction.id,
        payload: { 
          name, 
          amount: Number(amount), 
          type 
        },
      },
      {
        onSuccess: () => {
          onClose(); // قفل المودال وتحديث البيانات في الخلفية عبر الـ Mutation
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" dir="rtl">
      <div className="bg-background p-6 rounded-2xl w-full max-w-md shadow-xl space-y-4">
        <h2 className="text-xl font-bold">تعديل المعاملة</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* اسم المعاملة */}
          <div>
            <label className="block text-sm font-semibold mb-1">اسم المعاملة الجديد</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-2 bg-input/10"
              required
            />
          </div>

          {/* المبلغ (بدون صفر ديفولت) */}
          <div>
            <label className="block text-sm font-semibold mb-1">المبلغ</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="أدخل المبلغ"
              className="w-full border rounded-lg p-2 bg-input/10"
              required
            />
          </div>

          {/* النوع (in / out) */}
          <div>
            <label className="block text-sm font-semibold mb-1">النوع</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "in" | "out")}
              className="w-full border rounded-lg p-2 bg-input/10"
            >
              <option value="in">وارد (In)</option>
              <option value="out">صادر (Out)</option>
            </select>
          </div>

          {/* الأزرار */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg font-semibold hover:bg-muted"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}