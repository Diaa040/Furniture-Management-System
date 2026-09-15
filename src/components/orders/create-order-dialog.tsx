"use client";

import { useState } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { useCreateOrder } from "@/hooks/use-orders";
import type { CreateOrderPayload } from "@/types/order";

interface CreateOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ItemInput {
  name: string;
  price: string;
  notes: string;
}

export function CreateOrderDialog({
  open,
  onClose,
  onSuccess,
}: CreateOrderDialogProps) {
  // 🟢 استخدام الـ Hook لضمان تحديث القائمة تلقائياً
  const createOrderMutation = useCreateOrder();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<ItemInput[]>([
    { name: "", price: "", notes: "" },
  ]);

  if (!open) return null;

  const handleAddItem = () => {
    setItems((prev) => [...prev, { name: "", price: "", notes: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof ItemInput,
    value: string
  ) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setDeliveryDate("");
    setDepositAmount("");
    setNotes("");
    setItems([{ name: "", price: "", notes: "" }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || items.some((i) => !i.name || !i.price)) {
      alert("برجاء استكمال كافة البيانات الأساسية واسم وسعر كل عنصر");
      return;
    }

    // ✅ total_price مطلوب في CreateOrderPayload لكن مفيش حقل إدخال ليه في الفورم،
    // فبنحسبه تلقائياً كمجموع أسعار كل العناصر المضافة
    const totalPrice = items.reduce(
      (sum, item) => sum + (Number(item.price) || 0),
      0
    );

    const payload: CreateOrderPayload = {
      customer_name: customerName,
      customer_phone: customerPhone,
      total_price: totalPrice,
      delivery_date: deliveryDate,
      deposit_amount: Number(depositAmount) || 0,
      notes,
      items: items.map((item) => ({
        name: item.name,
        price: Number(item.price) || 0,
        notes: item.notes,
      })),
    };

    try {
      await createOrderMutation.mutateAsync(payload);
      resetForm();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("خطأ في إنشاء الأوردر:", error);
      alert("حدث خطأ أثناء حفظ الأوردر، برجاء المحاولة لاحقاً");
    }
  };

  // مجموع أسعار العناصر الحالية، بيتحدث لحظياً مع كتابة المستخدم (نفس القيمة اللي هتتبعت كـ total_price)
  const totalPricePreview = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <h2 className="text-lg font-bold">إنشاء أوردر جديد</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-lg hover:bg-accent"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* بيانات العميل والطلب */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground">بيانات العميل والطلب</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">اسم العميل *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder="محمد أحمد"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">رقم الهاتف *</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder="01012345678"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">تاريخ التسليم المتوقع</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">مبلغ العربون المبدئي (ج.م)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder="10000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">ملاحظات العامة للطلب</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="ملاحظات التسليم أو الاتفاق..."
              />
            </div>
          </div>

          {/* العناصر المطلوب تصنيعها */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-muted-foreground">عناصر الأثاث المطلوب تصنيعها</h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Plus className="size-4" /> إضافة عنصر جديد
              </button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="flex gap-3 items-start rounded-xl border border-border p-3 bg-muted/20">
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="اسم القطعة (مثلاً: انتريه مودرن)"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, "name", e.target.value)}
                      className="col-span-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                      type="number"
                      placeholder="السعر (ج.م)"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, "price", e.target.value)}
                      className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="ملاحظات وتفاصيل القطعة (الخشب، القماش، الدهان)"
                    value={item.notes}
                    onChange={(e) => handleItemChange(index, "notes", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg mt-1"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            ))}

            {/* إجمالي أسعار العناصر - بيتحسب تلقائياً وهو نفس القيمة اللي بتتبعت كـ total_price */}
            <div className="flex items-center justify-end gap-2 text-sm font-bold text-[#2C2420] pt-1">
              <span className="text-xs font-semibold text-muted-foreground">
                إجمالي سعر الأوردر:
              </span>
              <span>{totalPricePreview.toLocaleString()} ج.م</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-accent"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={createOrderMutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50"
            >
              {createOrderMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              حفظ الأوردر
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}