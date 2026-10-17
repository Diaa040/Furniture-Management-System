'use client';

import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { useOrders, useSearchOrders } from '@/hooks/use-orders';
import { OrderListItem } from '@/types/order';

interface OrdersTableProps {
  search?: string;
  onSelectOrder?: (orderId: number) => void;
  onEditOrder?: (order: OrderListItem) => void;
}

// تأخير بسيط قبل إرسال البحث للباك إند عشان منبعتش ريكويست مع كل حرف
function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function OrdersTable({
  search = '',
  onSelectOrder,
  onEditOrder,
}: OrdersTableProps) {
  const [page, setPage] = useState(1);

  // لو خانة البحث فضيت نرجع للقائمة فوراً من غير ما نستنى الـ debounce
  const debounced = useDebouncedValue(search);
  const searchTerm = search.trim() === '' ? '' : debounced.trim();
  const isSearching = searchTerm !== '';

  // 1️⃣ القائمة العادية (بتتوقف وقت البحث) + نتايج البحث من الباك إند
  const listQuery = useOrders(page, !isSearching);
  const searchQuery = useSearchOrders(searchTerm);

  const activeQuery = isSearching ? searchQuery : listQuery;
  const { isLoading, isError, error } = activeQuery;

  // /api/search/orders بيرجّع { status, data: [...] } مباشرة من غير باجينيشن
  const ordersList: OrderListItem[] = isSearching
    ? ((searchQuery.data?.data as OrderListItem[] | undefined) ?? [])
    : (listQuery.data?.data?.data ?? []);

  const currentPage = listQuery.data?.data?.current_page || page;

  // لما البحث يتغير نرجع للصفحة الأولى
  useEffect(() => {
    setPage(1);
  }, [search]);

  // حالة التحميل أثناء طلب البيانات من API
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12 text-gray-500">
        {isSearching ? 'جاري البحث...' : 'جاري تحميل قائمة الطلبات...'}
      </div>
    );
  }

  // حالة وجود خطأ في الاتصال
  if (isError) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
        حدث خطأ أثناء {isSearching ? 'البحث' : 'تحميل الطلبات'}:{' '}
        {(error as Error)?.message || 'تأكد من اتصال السيرفر'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white transition-opacity ${
          isSearching && searchQuery.isFetching ? 'opacity-60' : ''
        }`}
      >
        <table className="w-full text-right text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">اسم العميل</th>
              <th className="p-3">رقم الهاتف</th>
              <th className="p-3">إجمالي المبلغ</th>
              <th className="p-3">العربون المدفوع</th>
              <th className="p-3">المبلغ المتبقي</th>
              <th className="p-3">الحالة</th>
              <th className="p-3">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ordersList.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-6 text-gray-400">
                  {isSearching ? 'لا توجد نتائج مطابقة للبحث' : 'لا يوجد طلبات حالياً'}
                </td>
              </tr>
            ) : (
              ordersList.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder && onSelectOrder(order.id)}
                  className="hover:bg-[#F3E7DA]/40 cursor-pointer transition-colors select-none"
                >
                  <td className="p-3 font-medium text-gray-900">#{order.id}</td>
                  <td className="p-3 font-medium">{order.customer_name}</td>
                  <td className="p-3 text-gray-600" dir="ltr">{order.customer_phone}</td>
                  <td className="p-3 font-bold">{order.total_price.toLocaleString()} ج.م</td>
                  <td className="p-3 text-emerald-600 font-semibold">{order.deposit_amount.toLocaleString()} ج.م</td>
                  <td className="p-3 text-amber-600 font-semibold">{order.remaining_amount.toLocaleString()} ج.م</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // عشان الصف نفسه بيفتح التفاصيل
                        onEditOrder?.(order);
                      }}
                      className="inline-flex size-8 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50"
                      title="تعديل"
                    >
                      <Pencil className="size-4 text-[#7C4A26]" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 2️⃣ أزرار التنقل بين الصفحات - مخفية وقت البحث لأن نتايج البحث مفيهاش باجينيشن */}
      {!isSearching && (
        <div className="flex justify-between items-center px-2 py-1">
          <span className="text-sm text-gray-500">الصفحة {currentPage}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              السابق
            </button>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={ordersList.length === 0}
              className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              التالي
            </button>
          </div>
        </div>
      )}
    </div>
  );
}