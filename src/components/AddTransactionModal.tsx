"use client";

import { useState } from "react";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; amount: number; type: "get" | "out" }) => void;
  isPending: boolean;
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
}: AddTransactionModalProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"get" | "out">("get");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      amount: Number(amount),
      type,
    });
    // تفريغ الحقول بعد الإرسال (اختياري حسب الرغبة)
    setName("");
    setAmount("");
    setType("get");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg text-right" dir="rtl">
        <h3 className="text-lg font-bold text-gray-900 mb-4">إضافة معاملة مالية جديدة</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">اسم المعاملة / البيان</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="أدخل اسم المعاملة..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">المبلغ</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="any"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">نوع المعاملة</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "get" | "out")}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="get">وارد (Get)</option>
              <option value="out">صادر (Out)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition disabled:opacity-50"
            >
              {isPending ? "جاري الحفظ..." : "حفظ المعاملة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}