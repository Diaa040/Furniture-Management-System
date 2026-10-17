"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, X } from "lucide-react";
import { OrdersTable } from "@/components/orders/orders-table";
import { CreateOrderDialog } from "@/components/orders/create-order-dialog";
import { EditOrderDialog } from "@/components/orders/edit-order-dialog";
import type { OrderListItem } from "@/types/order";

export default function OrdersPage() {
  const router = useRouter();

  // State التحكم في فتح نافذة إنشاء أوردر جديد
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // الأوردر اللي بيتعدل حالياً (null = النافذة مقفولة)
  const [editingOrder, setEditingOrder] = useState<OrderListItem | null>(null);

  // نص البحث (اسم العميل أو رقم تليفونه)
  const [search, setSearch] = useState("");

  // التوجيه لصفحة التفاصيل الجديدة (route ثابت + query param بدل [id])
  const handleSelectOrder = (id: number) => {
    router.push(`/orders/details?id=${id}`);
  };
  

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header الصفحة */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">إدارة الطلبات</h1>
          <p className="text-sm text-muted-foreground">
            عرض متابعة الطلبات والمدفوعات والمراحل التصنيعية
          </p>
        </div>

        {/* زر إنشاء أوردر جديد */}
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7C4A26] text-white text-sm font-semibold shadow hover:bg-[#633a1e] transition-colors"
        >
          <Plus className="size-4" />
          أوردر جديد
        </button>
      </div>

      {/* شريط البحث */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث باسم العميل أو رقم الهاتف..."
          className="w-full rounded-xl border border-border bg-white py-2.5 pr-10 pl-10 text-sm outline-none focus:ring-2 focus:ring-[#7C4A26]/40"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute left-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="مسح البحث"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* جدول الطلبات */}
      <OrdersTable
        search={search}
        onSelectOrder={handleSelectOrder}
        onEditOrder={setEditingOrder}
      />

      {/* Dialog إنشاء طلب جديد */}
      <CreateOrderDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Dialog تعديل طلب */}
      <EditOrderDialog
        order={editingOrder}
        onClose={() => setEditingOrder(null)}
      />
    </div>
  );
}