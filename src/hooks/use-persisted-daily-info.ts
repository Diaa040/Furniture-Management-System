"use client";

import { useCallback, useEffect, useState } from "react";

export interface DailyInfo {
  workerName: string;
  dailyRate: number;
}

// حل مؤقت: بنحفظ اختيار "يومية" في localStorage عشان ميضيعش لما نعمل refresh.
// لما الباك إند يرجّع بيانات اليومية (payment_type / worker) مع المرحلة نفسها،
// المفروض نستبدل الهوك ده ونبني dailyInfo من رد السيرفر مباشرة.
function storageKey(orderId: number, itemId: number, stageName: string) {
  return `stage-daily-info:${orderId}:${itemId}:${stageName}`;
}

function readDailyInfo(
  orderId: number,
  itemId: number,
  stageName: string,
): DailyInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(
      storageKey(orderId, itemId, stageName),
    );
    return raw ? (JSON.parse(raw) as DailyInfo) : null;
  } catch {
    return null;
  }
}

export function usePersistedDailyInfo(
  orderId: number,
  itemId: number,
  stageName: string,
) {
  const [dailyInfo, setDailyInfoState] = useState<DailyInfo | null>(null);

  // كل ما المرحلة (الاسم) تتغيّر، اقرأ القيمة المحفوظة ليها من localStorage.
  // ده بيغطي حالة الـ refresh وحالة تبديل التابات بين المراحل.
  useEffect(() => {
    setDailyInfoState(readDailyInfo(orderId, itemId, stageName));
  }, [orderId, itemId, stageName]);

  const setDailyInfo = useCallback(
    (info: DailyInfo | null) => {
      setDailyInfoState(info);
      if (typeof window === "undefined") return;
      try {
        const key = storageKey(orderId, itemId, stageName);
        if (info) {
          window.localStorage.setItem(key, JSON.stringify(info));
        } else {
          window.localStorage.removeItem(key);
        }
      } catch {
        // تجاهل أخطاء الـ storage (زي الوضع الخاص / التخزين ممتلئ)
      }
    },
    [orderId, itemId, stageName],
  );

  return [dailyInfo, setDailyInfo] as const;
}