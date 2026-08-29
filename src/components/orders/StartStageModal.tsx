"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StartStageFormProps {
  orderId: number;
  itemId: number;
  stageName: string;
  onSuccess?: () => void;
}

export function StartStageForm({
  orderId,
  itemId,
  stageName,
  onSuccess,
}: StartStageFormProps) {
  const queryClient = useQueryClient();

  const [executionType, setExecutionType] = useState<"internal" | "external">("internal");
  const [handlerName, setHandlerName] = useState("");
  const [agreedCost, setAgreedCost] = useState<string>("");

  const [rawMaterials, setRawMaterials] = useState<
    { raw_material_id: string; quantity: string; unit_price: string }[]
  >([]);

  const [detailsItems, setDetailsItems] = useState<{ item: string; cost: string }[]>([]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: any = {
        stage_name: stageName,
        execution_type: executionType,
        handler_name: handlerName || null,
        agreed_cost: Number(agreedCost) || 0,
      };

      if (executionType === "internal") {
        if (rawMaterials.length > 0) {
          payload.raw_materials = rawMaterials.map((m) => ({
            raw_material_id: Number(m.raw_material_id),
            quantity: Number(m.quantity),
            unit_price: Number(m.unit_price),
          }));
        }

        if (detailsItems.length > 0) {
          payload.details = {
            items: detailsItems.map((d) => ({
              item: d.item,
              cost: Number(d.cost),
            })),
          };
        }
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}/items/${itemId}/stages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "حدث خطأ أثناء حفظ المرحلة");
      }

      return res.json();
    },
    onSuccess: () => {
      // 1️⃣ تحديث كاش البيانات لإعادة جلب المرحلة بالشكل الجديد
      queryClient.invalidateQueries({ queryKey: ["item-stages", orderId, itemId] });
      // 2️⃣ إغلاق نموذج الإدخال والعودة للعرض الرئيسي
      if (onSuccess) onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="w-full bg-white rounded-[28px] border border-gray-100 p-6 md:p-8 shadow-xs dir-rtl">
      <h3 className="text-2xl font-black text-[#2C2420] text-right mb-6">
        بُدء مرحلة: {stageName}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. نوع التنفيذ */}
        <div className="space-y-3">
          <Label className="text-sm font-extrabold text-[#2C2420] block text-right">
            نوع التنفيذ *
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setExecutionType("internal")}
              className={`py-3.5 px-4 rounded-[20px] text-sm font-black transition-all flex items-center justify-center gap-2 border ${
                executionType === "internal"
                  ? "border-amber-500 bg-[#FFFDF9] text-amber-900 shadow-xs"
                  : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              🏠 داخلي (في الورشة)
            </button>
            <button
              type="button"
              onClick={() => setExecutionType("external")}
              className={`py-3.5 px-4 rounded-[20px] text-sm font-black transition-all flex items-center justify-center gap-2 border ${
                executionType === "external"
                  ? "border-amber-500 bg-[#FFFDF9] text-amber-900 shadow-xs"
                  : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              🚚 خارجي (مصنعية خارجية)
            </button>
          </div>
        </div>

        {/* 2. بيانات المصنعية / الورشة */}
        <div className="bg-[#FFFDF9] p-5 rounded-[24px] border border-amber-200/70 space-y-4">
          <h4 className="font-extrabold text-base text-[#2C2420] flex items-center gap-2 text-right">
            <span>🧘</span> بيانات المصنعية / الورشة
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5 text-right">
              <Label className="text-xs font-black text-[#2C2420]">اسم الورشة / الصنيعي</Label>
              <Input
                value={handlerName}
                onChange={(e) => setHandlerName(e.target.value)}
                placeholder="مثال: ورشة أسر"
                className="rounded-[18px] bg-white border-gray-200 h-11 text-right text-sm font-bold"
              />
            </div>
            <div className="space-y-1.5 text-right">
              <Label className="text-xs font-black text-[#2C2420]">الأجرة المتفق عليها *</Label>
              <Input
                type="number"
                required
                value={agreedCost}
                onChange={(e) => setAgreedCost(e.target.value)}
                placeholder="0.00"
                className="rounded-[18px] bg-white border-gray-200 h-11 text-center text-sm font-bold"
              />
            </div>
          </div>
        </div>

        {/* الحقول الخاصة بالداخلي فقط */}
        {executionType === "internal" && (
          <>
            {/* 3. الخامات المسحوبة من المخزن */}
            <div className="border border-gray-200 rounded-[24px] p-5 space-y-4 bg-white">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setRawMaterials([
                      ...rawMaterials,
                      { raw_material_id: "", quantity: "", unit_price: "" },
                    ])
                  }
                  className="rounded-full px-4 py-1.5 text-xs font-black text-amber-900 bg-[#FFFDF9] border border-amber-300 flex items-center gap-1 hover:bg-amber-50"
                >
                  <Plus className="size-3.5" /> إضافة خامة
                </button>
                <h4 className="font-extrabold text-base text-[#2C2420] flex items-center gap-2">
                  <span>📦</span> الخامات المسحوبة من المخزن
                </h4>
              </div>

              {rawMaterials.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setRawMaterials(rawMaterials.filter((_, i) => i !== idx))
                    }
                    className="text-red-500 p-2 hover:bg-red-50 rounded-full shrink-0"
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <Input
                    type="number"
                    placeholder="سعر الوحدة"
                    value={item.unit_price}
                    onChange={(e) => {
                      const list = [...rawMaterials];
                      list[idx].unit_price = e.target.value;
                      setRawMaterials(list);
                    }}
                    className="rounded-[18px] h-11 text-center text-xs font-bold"
                  />
                  <Input
                    type="number"
                    placeholder="الكمية"
                    value={item.quantity}
                    onChange={(e) => {
                      const list = [...rawMaterials];
                      list[idx].quantity = e.target.value;
                      setRawMaterials(list);
                    }}
                    className="rounded-[18px] h-11 text-center text-xs font-bold"
                  />
                  <Input
                    type="number"
                    placeholder="ID الخامة"
                    value={item.raw_material_id}
                    onChange={(e) => {
                      const list = [...rawMaterials];
                      list[idx].raw_material_id = e.target.value;
                      setRawMaterials(list);
                    }}
                    className="rounded-[18px] h-11 text-center text-xs font-bold"
                  />
                </div>
              ))}
            </div>

            {/* 4. التفاصيل والبنود الفرعية */}
            <div className="border border-gray-200 rounded-[24px] p-5 space-y-4 bg-white">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setDetailsItems([...detailsItems, { item: "", cost: "" }])
                  }
                  className="rounded-full px-4 py-1.5 text-xs font-black text-amber-900 bg-[#FFFDF9] border border-amber-300 flex items-center gap-1 hover:bg-amber-50"
                >
                  <Plus className="size-3.5" /> إضافة بند
                </button>
                <h4 className="font-extrabold text-base text-[#2C2420] flex items-center gap-2">
                  <span>🧾</span> التفاصيل والبنود الفرعية
                </h4>
              </div>

              {detailsItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setDetailsItems(detailsItems.filter((_, i) => i !== idx))
                    }
                    className="text-red-500 p-2 hover:bg-red-50 rounded-full shrink-0"
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <Input
                    type="number"
                    placeholder="التكلفة"
                    value={item.cost}
                    onChange={(e) => {
                      const list = [...detailsItems];
                      list[idx].cost = e.target.value;
                      setDetailsItems(list);
                    }}
                    className="rounded-[18px] h-11 text-center text-xs font-bold"
                  />
                  <Input
                    placeholder="اسم البند"
                    value={item.item}
                    onChange={(e) => {
                      const list = [...detailsItems];
                      list[idx].item = e.target.value;
                      setDetailsItems(list);
                    }}
                    className="rounded-[18px] h-11 text-right text-xs font-bold"
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* أزرار الحفظ */}
        <div className="flex items-center justify-start gap-3 pt-3 border-t border-gray-100">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-[18px] font-black bg-[#6B4226] hover:bg-[#54331c] text-white px-7 h-12 text-sm shadow-xs"
          >
            {mutation.isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "حفظ وبدء المرحلة"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}