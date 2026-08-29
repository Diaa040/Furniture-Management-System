'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { OrdersTable } from '@/components/orders/orders-table';
import { CreateOrderDialog } from '@/components/orders/create-order-dialog';

export default function OrdersPage() {
  const router = useRouter();
  
  // State التحكم في فتح نافذة إنشاء أوردر جديد
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // التوجيه لصفحة التفاصيل الجديدة مباشرة
  const handleSelectOrder = (id: number) => {
    router.push(`/orders/${id}`);
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

      {/* جدول الطلبات */}
      <OrdersTable onSelectOrder={handleSelectOrder} />

      {/* Dialog إنشاء طلب جديد */}
      <CreateOrderDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}