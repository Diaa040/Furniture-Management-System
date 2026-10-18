"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { canAccessPath } from "@/lib/permissions";

export default function RoleGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!canAccessPath(user?.role, pathname)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6" dir="rtl">
        <p className="text-center text-base font-bold text-muted-foreground">
          غير مسموح لك بالدخول إلى هذه الصفحة.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}