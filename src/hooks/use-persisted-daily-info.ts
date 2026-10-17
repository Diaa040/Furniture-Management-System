"use client";

import { useCallback, useState } from "react";

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
  const key = storageKey(orderId, itemId, stageName);

  // ✅ بدل useEffect: بنتتبع آخر key اتقرا بيه، ولو اتغير (تبديل مرحلة/عنصر)
  // بنعمل setState جوه الـ render نفسه مباشرة - ده الباترن الرسمي من React
  // لتحديث state بناءً على تغيّر قيمة مشتقة، وميعتبرش "calling setState in an effect"
  // لأنه أصلاً مش جوه effect: https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [trackedKey, setTrackedKey] = useState(key);
  const [dailyInfo, setDailyInfoState] = useState<DailyInfo | null>(() =>
    readDailyInfo(orderId, itemId, stageName),
  );

  if (key !== trackedKey) {
    setTrackedKey(key);
    setDailyInfoState(readDailyInfo(orderId, itemId, stageName));
  }

  const setDailyInfo = useCallback(
    (info: DailyInfo | null) => {
      setDailyInfoState(info);
      if (typeof window === "undefined") return;
      try {
        const k = storageKey(orderId, itemId, stageName);
        if (info) {
          window.localStorage.setItem(k, JSON.stringify(info));
        } else {
          window.localStorage.removeItem(k);
        }
      } catch {
        // تجاهل أخطاء الـ storage (زي الوضع الخاص / التخزين ممتلئ)
      }
    },
    [orderId, itemId, stageName],
  );

  return [dailyInfo, setDailyInfo] as const;
}