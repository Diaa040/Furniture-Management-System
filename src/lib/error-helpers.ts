import { isAxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/auth";

/**
 * بيرجع رسالة الإيرور الحقيقية اللي باعتها الباك إند (error.response.data.message)
 * لو الإيرور جاي من axios، أو fallback لو مفيش رسالة واضحة.
 *
 * استخدمها بدل ما تكرر نفس منطق isAxiosError في كل هوك/كومبوننت.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}