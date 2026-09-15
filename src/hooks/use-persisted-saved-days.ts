"use client";

import { useCallback, useState } from "react";

export interface SavedDaysInfo {
  days: number;
  agreedCost: number;
  status?: string;
}

// حل مؤقت (زي usePersistedDailyInfo): بنحفظ نتيجة "حفظ عدد الأيام" في
// localStorage عشان بعد ما يتحفظ مرة، الزرار والإنبوت يختفوا خالص ويفضل
// معروض بس القيم الثابتة، حتى بعد الـ refresh. لما الباك إند يرجّع الحالة دي
// مع بيانات المرحلة نفسها، نستبدل الهوك ده ونعتمد على السيرفر مباشرة.
function storageKey(orderId: number, itemId: number, stageName: string) {
  return `stage-saved-days:${orderId}:${itemId}:${stageName}`;
}

function readSaved(
  orderId: number,
  itemId: number,
  stageName: string,
): SavedDaysInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(
      storageKey(orderId, itemId, stageName),
    );
    return raw ? (JSON.parse(raw) as SavedDaysInfo) : null;
  } catch {
    return null;
  }
}

export function usePersistedSavedDays(
  orderId: number,
  itemId: number,
  stageName: string,
) {
  const key = storageKey(orderId, itemId, stageName);

  // ✅ بدل useEffect: بنتتبع آخر key اتقرا بيه، ولو اتغير بنعمل setState
  // جوه الـ render نفسه مباشرة - نفس الباترن المستخدم في usePersistedDailyInfo
  const [trackedKey, setTrackedKey] = useState(key);
  const [saved, setSavedState] = useState<SavedDaysInfo | null>(() =>
    readSaved(orderId, itemId, stageName),
  );

  if (key !== trackedKey) {
    setTrackedKey(key);
    setSavedState(readSaved(orderId, itemId, stageName));
  }

  const setSaved = useCallback(
    (info: SavedDaysInfo | null) => {
      setSavedState(info);
      if (typeof window === "undefined") return;
      try {
        const k = storageKey(orderId, itemId, stageName);
        if (info) {
          window.localStorage.setItem(k, JSON.stringify(info));
        } else {
          window.localStorage.removeItem(k);
        }
      } catch {
        // تجاهل أخطاء الـ storage
      }
    },
    [orderId, itemId, stageName],
  );

  return [saved, setSaved] as const;
}