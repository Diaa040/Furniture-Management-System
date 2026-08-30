import { Plus, Receipt, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StageViewModel } from "@/lib/stage-helpers";
import type { StageDetailItem } from "@/types/order";

interface StageDetailsListProps {
  stage: StageViewModel;
  isDeleting: boolean;
  onAdd: () => void;
  onDelete: (itemName: string, itemCost: number) => void;
}

export function StageDetailsList({
  stage,
  isDeleting,
  onAdd,
  onDelete,
}: StageDetailsListProps) {
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm space-y-0">
      <div className="bg-[#FAF8F5] p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-extrabold text-[#2C2420]">
            التفاصيل والبنود الفرعية
          </h3>
          <Receipt className="size-5 text-amber-700" />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="bg-white hover:bg-gray-50 text-[#7C4A26] border-gray-300 font-bold rounded-xl gap-1 text-sm shadow-none"
        >
          <Plus className="size-4" /> إضافة بند تكلفة
        </Button>
      </div>

      <div className="p-4 space-y-3 bg-[#FAF8F5]/40">
        {stage.detailsItems.length > 0 ? (
          stage.detailsItems.map((detail: StageDetailItem, dIdx: number) => {
            const itemName = detail.item || detail.name || "بند بدون اسم";
            const itemCost = Number(detail.cost || 0);

            return (
              <div
                key={dIdx}
                className="flex justify-between items-center text-base py-3 px-4 bg-white rounded-xl border border-gray-100 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#2C2420] font-bold">
                    {itemName}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="font-black text-[#2C2420]">
                    {itemCost.toLocaleString()} ج.م
                  </span>
                  <button
                    type="button"
                    title="حذف البند"
                    disabled={isDeleting}
                    onClick={() => onDelete(itemName, itemCost)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-6 text-center text-sm font-semibold text-muted-foreground">
            لا توجد بنود فرعية مسجلة لهذه المرحلة
          </div>
        )}
      </div>

      {stage.detailsItems.length > 0 && (
        <div className="bg-[#FAF8F5] p-4 flex items-center justify-between border-t border-gray-200">
          <span className="text-sm font-black text-[#2C2420]">
            إجمالي البنود الفرعية
          </span>
          <span className="text-base font-black text-[#2C2420]">
            {stage.detailsCost.toLocaleString()} ج.م
          </span>
        </div>
      )}
    </div>
  );
}