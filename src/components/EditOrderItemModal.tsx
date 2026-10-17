"use client";

import { useState } from "react";
import { TUpdateItemPayload } from "@/types/order";
import { OrderItem } from "@/types/order"; // أو النوع الخاص بالعنصر لديك

interface EditOrderItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TUpdateItemPayload>) => void;
  isPending: boolean;
  item: OrderItem | null; // العنصر المراد تعديله
}

export default function EditOrderItemModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  item,
}: EditOrderItemModalProps) {
  if (!isOpen || !item) return null;

  // ✅ الـ key بتخلي React يعمل remount للفورم مع كل item مختلف،
  // فالـ state بتاعته بيتصفّر ويتملى من القيم الجديدة تلقائياً من غير useEffect + setState
  return (
    <EditOrderItemForm
      key={item.id}
      item={item}
      onClose={onClose}
      onSubmit={onSubmit}
      isPending={isPending}
    />
  );
}

interface EditOrderItemFormProps {
  item: OrderItem;
  onClose: () => void;
  onSubmit: (data: Partial<TUpdateItemPayload>) => void;
  isPending: boolean;
}

// ✅ state محلي للفورم بيسمح بـ "" للسعر (عشان input فاضي)، مختلف عن TUpdateItemPayload
// اللي بيتطلب number | undefined بس - التحويل بيحصل وقت الإرسال في handleSubmit
interface EditItemFormData {
  name: string;
  price: number | "";
  status: TUpdateItemPayload["status"];
  notes: string;
}

function EditOrderItemForm({
  item,
  onClose,
  onSubmit,
  isPending,
}: EditOrderItemFormProps) {
  const [formData, setFormData] = useState<EditItemFormData>({
    name: item.name || "",
    price: item.price ?? "",
    status: (item.status as TUpdateItemPayload["status"]) || "pending",
    notes: item.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      price: formData.price === "" ? undefined : formData.price,
      status: formData.status,
      notes: formData.notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg text-right" dir="rtl">
        <h3 className="text-lg font-bold text-gray-900 mb-4">تعديل العنصر</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">اسم العنصر</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">السعر</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">الحالة</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as TUpdateItemPayload["status"],
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
              rows={3}
            />
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-semibold transition disabled:opacity-50"
            >
              {isPending ? "جاري التحديث..." : "حفظ التعديلات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}