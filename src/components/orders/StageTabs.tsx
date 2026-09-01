"use client";

import { statusDotMap } from "@/lib/stage-constants";
import type { StageViewModel } from "@/lib/stage-helpers";

interface StageTabsProps {
  stages: StageViewModel[];
  activeIndex: number;
  onChange: (stageName: string) => void;
}

export function StageTabs({ stages, activeIndex, onChange }: StageTabsProps) {
  return (
    <div className="border-b border-gray-200 bg-white px-6 rounded-2xl shadow-sm">
      <div className="flex items-center justify-start gap-10 overflow-x-auto no-scrollbar">
        {stages.map((stg, index) => {
          const isActive = activeIndex === index;
          const dot = statusDotMap[stg.status] || statusDotMap["not_started"];

          return (
            <button
              // بنستخدم stg.order كـ key مش stg.id، لأن order دايمًا فريد ومن 1 لـ 5
              // (ترتيب المرحلة الثابت)، على عكس id اللي ممكن يكون رقم حقيقي من
              // قاعدة البيانات لو المرحلة اتبدأت، وممكن يتصادم بالصدفة مع رقم
              // افتراضي (1-5) لمرحلة تانية لسه ما بدأتش.
              key={stg.order}
              onClick={() => onChange(stg.name)}
              className={`relative flex items-center gap-2.5 py-5 text-base font-extrabold transition-colors whitespace-nowrap ${
                isActive
                  ? "text-[#2C2420]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className={`size-3 rounded-full ${dot.color}`} />
              <span>
                .{stg.order} {stg.name}
              </span>

              {isActive && (
                <span className="absolute bottom-0 right-0 left-0 h-1.5 bg-amber-500 rounded-t-md" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}