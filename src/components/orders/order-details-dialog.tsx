'use client';

import { useState } from 'react';
import { useOrderDetails, useAddCustomerPayment } from '@/hooks/use-orders';
import { ItemStagesDialog } from './item-stages-dialog';
import { OrderDetails, Payment, OrderItem } from '@/types/order';

interface OrderDetailsDialogProps {
  orderId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsDialog({ orderId, isOpen, onClose }: OrderDetailsDialogProps) {
  const { data: response, isLoading, isError } = useOrderDetails(orderId);
  const addPaymentMutation = useAddCustomerPayment(orderId || 0);

  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isStagesOpen, setIsStagesOpen] = useState(false);

  if (!isOpen || !orderId) return null;

  // 🟢 الحل الجذري والآمن لاستخراج البيانات وتجنب أخطاء TypeScript (never & data property)
  type ResponseType = OrderDetails | { data: OrderDetails };
  const typedResponse = response as ResponseType | undefined;
  
  const order: OrderDetails | undefined = 
    typedResponse && typeof typedResponse === 'object' && 'data' in typedResponse 
      ? (typedResponse as { data: OrderDetails }).data 
      : (typedResponse as OrderDetails | undefined);

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentAmount || Number(paymentAmount) <= 0) return;

    try {
      await addPaymentMutation.mutateAsync({
        amount: Number(paymentAmount),
        payment_method: 'cash',
        notes: paymentNotes,
      });

      setPaymentAmount('');
      setPaymentNotes('');
      setShowPaymentForm(false);
    } catch (err) {
      console.error('فشل تحصيل الدفعة:', err);
    }
  };

  const handleOpenStages = (itemId: number) => {
    setSelectedItemId(itemId);
    setIsStagesOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
          
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-bold">تفاصيل الطلب #{orderId}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-bold">✕</button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">جاري تحميل البيانات...</div>
            ) : isError || !order ? (
              <div className="text-center py-8 text-red-500">حدث خطأ أثناء تحميل بيانات الطلب</div>
            ) : (
              <>
                {/* بيانات العميل */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <span className="text-xs text-gray-500 block">العميل</span>
                    <span className="font-semibold text-sm">{order.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">الهاتف</span>
                    <span className="font-semibold text-sm" dir="ltr">{order.customer_phone}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">العربون/المدفوع</span>
                    <span className="font-semibold text-sm text-green-600">
                      {Number(order.deposit_amount || 0).toLocaleString()} ج.م
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">المتبقي</span>
                    <span className="font-semibold text-sm text-amber-600">
                      {Number(order.remaining_amount || 0).toLocaleString()} ج.م
                    </span>
                  </div>
                </div>

                {/* دفعات العميل */}
                <div className="border border-gray-200 dark:border-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-sm">سجل دفعات العميل</h3>
                    <button
                      onClick={() => setShowPaymentForm(!showPaymentForm)}
                      className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition"
                    >
                      {showPaymentForm ? 'إلغاء' : '+ تحصيل دفعة جديدة'}
                    </button>
                  </div>

                  {showPaymentForm && (
                    <form onSubmit={handleAddPayment} className="mb-4 p-3 bg-green-50 dark:bg-gray-800/50 rounded-md gap-3 flex flex-col sm:flex-row items-end">
                      <div className="flex-1 w-full">
                        <label className="text-xs font-medium block mb-1">المبلغ (ج.م)</label>
                        <input
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          required
                          className="w-full text-sm p-2 border rounded-md"
                          placeholder="مثال: 5000"
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <label className="text-xs font-medium block mb-1">ملاحظات</label>
                        <input
                          type="text"
                          value={paymentNotes}
                          onChange={(e) => setPaymentNotes(e.target.value)}
                          className="w-full text-sm p-2 border rounded-md"
                          placeholder="مثال: دفعة بعد مرحلة النجارة"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={addPaymentMutation.isPending}
                        className="w-full sm:w-auto px-4 py-2 bg-green-700 text-white text-xs rounded-md hover:bg-green-800 disabled:opacity-50"
                      >
                        {addPaymentMutation.isPending ? 'جاري الحفظ...' : 'تأكيد التحصيل'}
                      </button>
                    </form>
                  )}

                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {order.payments && order.payments.length > 0 ? (
                      order.payments.map((p: Payment) => (
                        <div key={p.id} className="flex justify-between items-center text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                          <span>مبلغ: <strong>{Number(p.amount).toLocaleString()} ج.م</strong> ({p.payment_method})</span>
                          <span className="text-gray-500">{p.notes || 'بدون ملاحظات'}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">لا يوجد دفعات إضافية مسجلة بعد.</p>
                    )}
                  </div>
                </div>

                {/* عناصر الأوردر ومراحل كل قطعة */}
                <div>
                  <h3 className="font-bold text-sm mb-3">قطع الأثاث المطلوبة</h3>
                  <div className="space-y-2">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item: OrderItem) => (
                        <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                          <div>
                            <h4 className="font-semibold text-sm">{item.name}</h4>
                            <p className="text-xs text-gray-500">{item.notes || 'لا توجد ملاحظات'}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-sm">{Number(item.price).toLocaleString()} ج.م</span>
                            
                            <button
                              onClick={() => handleOpenStages(item.id)}
                              className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition"
                            >
                              مراحل التصنيع ⚙️
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">لا يوجد قطع مضافة لهذا الطلب.</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-xs rounded-md hover:bg-gray-300">
              إغلاق
            </button>
          </div>
        </div>
      </div>

      <ItemStagesDialog
        orderId={orderId}
        itemId={selectedItemId}
        isOpen={isStagesOpen}
        onClose={() => {
          setIsStagesOpen(false);
          setSelectedItemId(null);
        }}
      />
    </>
  );
}