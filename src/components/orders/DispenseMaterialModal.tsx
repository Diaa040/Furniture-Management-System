"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRawMaterialsByCategory, useDispenseMaterial } from "@/hooks/use-raw-materials";

// تعريف واجهة الخامة بدقة لتجنب استخدام أي نوع مبهم
interface RawMaterial {
  id: number;
  name: string;
  unit_price?: number;
}

interface DispenseMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  itemId: number;
  stageName: string;
  categoryId: number;
}

export function DispenseMaterialModal({
  isOpen,
  onClose,
  orderId,
  itemId,
  stageName,
  categoryId,
}: DispenseMaterialModalProps) {
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");

  const { data: categoryData, isLoading: isLoadingMaterials } = useRawMaterialsByCategory(categoryId);
  const dispenseMutation = useDispenseMaterial(orderId, itemId);

  const materialsList: RawMaterial[] = categoryData?.raw_materials || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterialId || !quantity) return;

    dispenseMutation.mutate(
      {
        raw_material_id: Number(selectedMaterialId),
        category_id: categoryId,
        quantity: Number(quantity),
        order_item_id: itemId,
        stage_name: stageName,
      },
      {
        onSuccess: () => {
          setSelectedMaterialId("");
          setQuantity("");
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md dir-rtl rounded-2xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-[#2C2420] text-right">
            صرف خامة ({stageName})
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2 text-right">
            <Label className="text-sm font-bold text-[#2C2420]">اختر الخامة *</Label>
            
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-1 border rounded-xl border-gray-100 bg-gray-50/50">
              {isLoadingMaterials ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="size-5 animate-spin text-[#7C4A26]" />
                </div>
              ) : materialsList.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">لا توجد خامات متاحة لهذه المرحلة</p>
              ) : (
                materialsList.map((mat: RawMaterial) => {
                  const isSelected = selectedMaterialId === String(mat.id);
                  return (
                    <div
                      key={mat.id}
                      onClick={() => setSelectedMaterialId(String(mat.id))}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#7C4A26] bg-[#7C4A26]/5 text-[#7C4A26] font-black shadow-sm"
                          : "border-gray-200 bg-white text-[#2C2420] hover:border-gray-300 font-bold"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`size-4 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-[#7C4A26] bg-[#7C4A26]" : "border-gray-300 bg-white"
                        }`}>
                          {isSelected && <div className="size-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-sm">{mat.name}</span>
                      </div>
                      
                      {mat.unit_price && (
                        <span className="text-xs text-gray-500 font-normal">
                          {mat.unit_price} ج.م
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="space-y-1.5 text-right">
            <Label className="text-sm font-bold text-[#2C2420]">الكمية *</Label>
            <Input
              type="number"
              step="any"
              min="0.01"
              required
              placeholder="أدخل الكمية المطلوبة"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="rounded-xl border-gray-200 h-11 text-center text-sm font-bold"
            />
          </div>

          {dispenseMutation.isError && (
            <p className="text-xs font-bold text-red-500 text-right">
              {(dispenseMutation.error as Error)?.message || "حدث خطأ أثناء الصرف"}
            </p>
          )}

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
              disabled={dispenseMutation.isPending || !selectedMaterialId}
              className="rounded-xl font-black bg-[#7C4A26] hover:bg-[#633a1e] text-white px-6"
            >
              {dispenseMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "تأكيد الصرف"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}