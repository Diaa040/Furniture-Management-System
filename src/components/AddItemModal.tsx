"use client";

import { useState } from "react";

export interface TAddItem {
  name: string;
  price: number | "";
  status: "pending" | "completed" | "cancelled";
  notes: string;
}

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TAddItem) => void;
  isPending: boolean;
}

export default function AddItemModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
}: AddItemModalProps) {
  const [formData, setFormData] = useState<TAddItem>({
    name: "",
    price: "",
    status: "pending",
    notes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // 🟢 تفريغ الحقول بعد الإرسال
    setFormData({
      name: "",
      price: "",
      status: "pending",
      notes: "",
    });
  };

  const handleClose = () => {
    // تفريغ الحقول أيضاً عند الضغط على إلغاء اختيارياً
    setFormData({
      name: "",
      price: "",
      status: "pending",
      notes: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg text-right" dir="rtl">
        <h3 className="text-lg font-bold text-gray-900 mb-4">إضافة عنصر جديد</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">اسم العنصر</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="مثال: طاولة طعام خشب زان"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">السعر</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="2500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">الحالة</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as TAddItem["status"],
                })
              }
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="pending">معلق (Pending)</option>
              <option value="completed">مكتمل (Completed)</option>
              <option value="cancelled">ملغي (Cancelled)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">الملاحظات</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="اكتب ملاحظاتك هنا..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-semibold transition disabled:opacity-50"
            >
              {isPending ? "جاري الحفظ..." : "حفظ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}