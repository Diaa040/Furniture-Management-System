"use client";

import {  LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

export function DashboardHeader() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">الرئيسية</span>
        <span className="text-muted-foreground">/</span>
        <span className="font-semibold text-foreground">لوحة التحكم</span>
      </div>

      <div className="flex items-center gap-3">

        <ThemeToggle />

        <button
          type="button"
          onClick={handleLogout}
          className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <LogOut className="size-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </header>
  );
}
