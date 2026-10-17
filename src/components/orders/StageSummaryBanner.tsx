import { Briefcase } from "lucide-react";
import type { StageViewModel } from "@/lib/stage-helpers";

interface StageSummaryBannerProps {
  stage: StageViewModel;
}

export function StageSummaryBanner({ stage }: StageSummaryBannerProps) {
  if (!stage.hasStarted) return null;

  return (
    <div className="bg-[#E6F8F0] border border-[#BCECD7] rounded-2xl p-6 flex items-center justify-between shadow-sm">
      <div className="text-left space-y-1">
        <div className="flex items-center justify-end gap-2 text-[#0D5C3A] font-black text-xl md:text-2xl">
          <span>إجمالي تكلفة مرحلة {stage.name}</span>
          <Briefcase className="size-6 text-[#0D5C3A]" />
        </div>
        <p className="text-sm md:text-base font-bold text-[#1E7E53]">
          {stage.rawExecutionType === "internal"
            ? "تشمل الصنيعي + الخامات + البنود الأخرى"
            : "تكلفة المصنعية / الشغل الخارجي"}
        </p>
      </div>
      <span className="text-3xl font-black text-[#0D5C3A]">
        {stage.stageCost.toLocaleString()} ج.م
      </span>
    </div>
  );
}