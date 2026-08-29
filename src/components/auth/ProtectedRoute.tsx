"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // لا تقم بأي إجراء طالما أن النظام لا يزال في حالة التحميل
    if (loading) return;

    // إذا انتهى التحميل ولم يتم العثور على مستخدم، قم بالتحويل لصفحة تسجيل الدخول
    if (!user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // إظهار شاشة التحميل طالما أن الـ AuthContext لم ينتهِ من التحقق من الـ Token
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7]" dir="rtl">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-[#7C4A26]" />
          <p className="text-sm font-bold text-[#2C2420]">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // إذا انتهى التحميل ولا يوجد مستخدم، لا تقم بعرض شيء ريثما يتم التوجيه
  if (!user) {
    return null;
  }

  // إذا كان المستخدم موجوداً ومسجلاً دخوله بنجاح، اعرض محتوى الصفحة بشكل طبيعي
  return <>{children}</>;
}