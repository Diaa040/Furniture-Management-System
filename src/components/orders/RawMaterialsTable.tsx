import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StageViewModel } from "@/lib/stage-helpers";
import type { RawMaterialItem } from "@/types/order";

interface RawMaterialsTableProps {
  stage: StageViewModel;
  onDispense: () => void;
}

export function RawMaterialsTable({
  stage,
  onDispense,
}: RawMaterialsTableProps) {
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      <div className="bg-[#FAF8F5] p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-extrabold text-[#2C2420]">
            المواد المسحوبه من المخزن
          </h3>
          <Package className="size-5 text-amber-700" />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onDispense}
          className="bg-white hover:bg-gray-50 text-[#7C4A26] border-gray-300 font-bold rounded-xl gap-1 text-sm shadow-none"
        >
          <Plus className="size-4" /> صرف خامة
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-[#FEF9E7] text-gray-700 text-sm font-black border-b border-amber-100">
              <th className="p-3.5">الخامة</th>
              <th className="p-3.5 text-center">الكمية</th>
              <th className="p-3.5 text-center">سعر الوحدة</th>
              <th className="p-3.5 text-left pl-6">الإجمالي</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm font-bold text-[#2C2420]">
            {stage.rawMaterials.length > 0 ? (
              stage.rawMaterials.map((mat: RawMaterialItem, idx: number) => {
                const materialName = mat.raw_material?.name || "خامة بدون اسم";
                const unit = mat.raw_material?.unit || "";
                const quantity = parseFloat(String(mat.quantity || 0));
                const rawUnitPrice =
                  mat.raw_material?.unit_price ?? mat.unit_price ?? 0;
                const unitPrice = parseFloat(String(rawUnitPrice));
                const totalCost = parseFloat(String(mat.total_cost || 0));

                return (
                  <tr
                    key={mat.id || idx}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-3.5 font-extrabold">{materialName}</td>
                    <td className="p-3.5 text-center font-semibold text-gray-600">
                      {quantity} {unit}
                    </td>
                    <td className="p-3.5 text-center font-semibold text-gray-600">
                      {unitPrice.toLocaleString()} ج.م
                    </td>
                    <td className="p-3.5 text-left pl-6 font-black">
                      {totalCost.toLocaleString()} ج.م
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-gray-400 font-semibold"
                >
                  لا توجد مواد مسحوبة مسجلة لهذه المرحلة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-[#FEF9E7] p-4 flex items-center justify-between border-t border-amber-100">
        <span className="text-sm font-black text-[#2C2420]">
          إجمالي المسحوب من المخزن
        </span>
        <span className="text-base font-black text-amber-900">
          {stage.rawMaterialsCost.toLocaleString()} ج.م
        </span>
      </div>
    </div>
  );
}