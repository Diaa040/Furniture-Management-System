// 'use client';

// import { useState } from 'react';
// import { useItemStages, useAddStagePayment } from '@/hooks/use-orders';
// import { StageItem } from '@/types/order';

// interface ItemStagesDialogProps {
//   orderId: number | null;
//   itemId: number | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function ItemStagesDialog({ orderId, itemId, isOpen, onClose }: ItemStagesDialogProps) {
//   const { data: response, isLoading } = useItemStages(orderId, itemId);
  
//   const [selectedStageId, setSelectedStageId] = useState<number | null>(null);
//   const [amount, setAmount] = useState('');
//   const [notes, setNotes] = useState('');

//   const addStagePaymentMutation = useAddStagePayment(
//     orderId || 0,
//     itemId || 0,
//     selectedStageId || 0
//   );

//   if (!isOpen || !orderId || !itemId) return null;

//   // 🟢 استخراج القائمة بشكل مباشر ونظيف تماماً بحسب ItemStagesResponse
//   const stagesList: StageItem[] = response?.stages || [];

//   const handleAddPayment = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!amount || !selectedStageId) return;

//     try {
//       await addStagePaymentMutation.mutateAsync({
//         amount: Number(amount),
//         notes,
//       });
//       setAmount('');
//       setNotes('');
//       setSelectedStageId(null);
//     } catch (error) {
//       console.error('حدث خطأ أثناء إضافة الدفعة للمرحلة', error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
//       <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
//         {/* Header */}
//         <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
//           <div>
//             <h3 className="font-bold text-base">مراحل تصنيع: {response?.item_name || `#${itemId}`}</h3>
//             {response?.total_item_cost && (
//               <p className="text-xs text-gray-500">إجمالي تكلفة القطعة: {response.total_item_cost.toLocaleString()} ج.م</p>
//             )}
//           </div>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-bold">✕</button>
//         </div>

//         {/* Content */}
//         <div className="p-5 overflow-y-auto space-y-4 flex-1">
//           {isLoading ? (
//             <div className="text-center py-8 text-gray-500">جاري تحميل بيانات التصنيع...</div>
//           ) : (
//             <div className="space-y-4">
//               {stagesList.length === 0 ? (
//                 <div className="text-center py-6 text-gray-400">لا توجد مراحل تصنيع مسجلة بعد.</div>
//               ) : (
//                 stagesList.map((stage) => {
//                   const cost = stage.stage_cost || stage.details_cost || 0;
//                   const paid = stage.total_paid || 0;
//                   const remaining = stage.remaining_amount ?? (cost - paid);

//                   return (
//                     <div key={stage.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400 block">
//                             مرحلة: {stage.stage_name}
//                           </span>
//                           {stage.handler_name && (
//                             <span className="text-xs text-gray-500">القائم بالفيذ: {stage.handler_name}</span>
//                           )}
//                         </div>
//                         <span className={`text-xs px-2.5 py-0.5 rounded-full ${
//                           stage.execution_type === 'internal' 
//                             ? 'bg-blue-100 text-blue-800' 
//                             : 'bg-purple-100 text-purple-800'
//                         }`}>
//                           {stage.execution_type === 'internal' ? 'تنفيذ داخلي' : 'ورشة خارجية'}
//                         </span>
//                       </div>

//                       <div className="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded text-xs">
//                         <div>
//                           <span className="text-gray-500 block">التكلفة:</span>
//                           <strong className="text-gray-800 dark:text-gray-200">{cost.toLocaleString()} ج.م</strong>
//                         </div>
//                         <div>
//                           <span className="text-gray-500 block">المدفوع:</span>
//                           <strong className="text-green-600">{paid.toLocaleString()} ج.م</strong>
//                         </div>
//                         <div>
//                           <span className="text-gray-500 block">المتبقي:</span>
//                           <strong className="text-amber-600">{remaining.toLocaleString()} ج.م</strong>
//                         </div>
//                       </div>

//                       <div className="flex justify-end pt-1">
//                         <button
//                           onClick={() => setSelectedStageId(selectedStageId === stage.id ? null : stage.id)}
//                           className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-100"
//                         >
//                           {selectedStageId === stage.id ? 'إلغاء' : '+ إضافة دفعة مرحلة'}
//                         </button>
//                       </div>

//                       {selectedStageId === stage.id && (
//                         <form onSubmit={handleAddPayment} className="mt-3 p-3 border border-indigo-100 bg-indigo-50/40 rounded-lg space-y-2">
//                           <div className="grid grid-cols-2 gap-2">
//                             <div>
//                               <label className="text-[11px] font-semibold block mb-1">المبلغ (ج.م)</label>
//                               <input
//                                 type="number"
//                                 value={amount}
//                                 onChange={(e) => setAmount(e.target.value)}
//                                 required
//                                 className="w-full text-xs p-2 border rounded bg-white dark:bg-gray-800"
//                                 placeholder="مثال: 1500"
//                               />
//                             </div>
//                             <div>
//                               <label className="text-[11px] font-semibold block mb-1">ملاحظات/البيان</label>
//                               <input
//                                 type="text"
//                                 value={notes}
//                                 onChange={(e) => setNotes(e.target.value)}
//                                 className="w-full text-xs p-2 border rounded bg-white dark:bg-gray-800"
//                                 placeholder="مثال: عربون نجارة"
//                               />
//                             </div>
//                           </div>
//                           <button
//                             type="submit"
//                             disabled={addStagePaymentMutation.isPending}
//                             className="w-full py-1.5 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 disabled:opacity-50"
//                           >
//                             {addStagePaymentMutation.isPending ? 'جاري الحفظ...' : 'حفظ الدفعة'}
//                           </button>
//                         </form>
//                       )}
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           )}
//         </div>

//         <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex justify-end">
//           <button onClick={onClose} className="px-4 py-1.5 bg-gray-200 dark:bg-gray-800 text-xs rounded hover:bg-gray-300">
//             إغلاق
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }