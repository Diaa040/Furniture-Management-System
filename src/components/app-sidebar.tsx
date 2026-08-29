"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Armchair } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigationGroups = [
  {
    title: "عام",
    items: [
      { title: "الرئيسية", url: "/dashboard" },
      { title: "الأوردات", url: "/orders" },
    ],
  },
  {
    title: "المخزن",
    items: [
      { title: "المخزن", url: "/inventory" },
      { title: "عهدة الخامات عند المنفذين", url: "/materials" },
    ],
  },
  {
    title: "الحسابات",
    items: [
      { title: "الأرباح الشهرية", url: "/profits" },
      { title: "الحركة المالية", url: "/treasury" },
      
    ],
  },
  {
    title: "النظام",
    items: [
      { title: "المستخدمون والصلاحيات", url: "/register" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return "مص";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return name.slice(0, 2);
  };

  return (
    <Sidebar side="right" className="border-l border-sidebar-border/60 bg-sidebar" dir="rtl">
      {/* 1️⃣ الهيدر (Brand Header) */}
      <SidebarHeader className="p-4 pt-6 pb-4">
        <div className="flex items-center justify-start gap-3">
          {/* المربع البني بالأيقونة */}
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#7C4A26] text-white shadow-sm">
            <Armchair className="size-6" />
          </div>

          {/* نصوص الهيدر */}
          <div className="flex flex-col text-right">
            <span className="text-base font-bold text-sidebar-foreground leading-tight">
              Mohamed Salah
            </span>
            <span className="text-base font-bold text-sidebar-foreground leading-tight">
              Furniture
            </span>
            <span className="text-[11px] font-normal text-muted-foreground/70 mt-0.5">
              Custom Furniture Manufacturing
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* 2️⃣ قائمة التنقل (Content) */}
      <SidebarContent className="px-3 py-2 space-y-1">
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.title} className="p-0 py-1">
            <SidebarGroupLabel className="px-3 text-[13px] font-normal text-muted-foreground/60 h-auto mb-1">
              {group.title}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={isActive}
                        className={`h-11 w-full justify-start rounded-xl px-4 text-base font-normal transition-all ${
                          isActive
                            ? "bg-[#F3E7DA] text-[#7C4A26] font-semibold hover:bg-[#F3E7DA] hover:text-[#7C4A26]"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary"
                        }`}
                      >
                        <Link href={item.url} className="w-full text-right">
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* 3️⃣ الفوتر السفلي (User Profile) */}
      <SidebarFooter className="border-t border-sidebar-border/60 p-3">
        <div className="flex items-center justify-start gap-3 px-1">
          {/* الأفاتار الدائري */}
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#F3E7DA] text-sm font-bold text-[#7C4A26]">
            {getInitials(user?.name)}
          </div>

          {/* الاسم والرتبة */}
          <div className="flex min-w-0 flex-col text-right">
            <span className="truncate text-base font-bold text-sidebar-foreground">
              {user?.name || "محمد صلاح"}
            </span>
            <span className="truncate text-xs font-normal text-muted-foreground/70">
              {user?.role || "Admin"}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}