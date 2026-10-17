"use client";

import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  PlayCircle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DailyTransactionsResponse } from "@/types/dashboard";
import { fetchDailyTransaction, startNewDay } from "@/apis/dashboard.api";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import AddTransactionModal from "@/components/AddTransactionModal";
import StartNewDayModal from "@/components/StartNewDayModal";


export default function DashboardPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewDayModalOpen, setIsNewDayModalOpen] = useState(false);

  // جلب البيانات بالـ React Query
  const { data: responseData, isLoading } = useQuery<DailyTransactionsResponse>(
    {
      queryKey: ["daily-transactions"],
      queryFn: fetchDailyTransaction,
    },
  );

  // Mutation لإضافة معاملة جديدة
  const createMutation = useMutation({
    mutationFn: async (newTransaction: { name: string; amount: number; type: "get" | "out" }) => {
      const response = await api.post(`/api/add/daily/transaction`, newTransaction);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-transactions"] });
      setIsModalOpen(false);
    },
  });

  // Mutation لبدء يوم جديد وإعادة تحميل الـ Dashboard
  const startNewDayMutation = useMutation({
    mutationFn: startNewDay,
    onSuccess: () => {
      // تحديث البيانات لجلب المعاملات الجديدة والصافي الخاص باليوم الجديد
      queryClient.invalidateQueries({ queryKey: ["daily-transactions"] });
      setIsNewDayModalOpen(false);
    },
  });

  const statsData = responseData;

  return (
    <div
      className="mx-auto w-full px-6 py-8 bg-gray-50/50 min-h-screen text-right text-"
      dir="rtl"
    >
      {/* رأس الصفحة */}
      <div className="mb-8">
        {user && (
          <p className="text-2xl font-bold py-2 text-amber-700 mb-1.5">
            أهلاً بيك، {user.name} 
          </p>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          لوحة التحكم
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          نظرة عامة على أداء المعرض والمبيعات وحركة المعاملات اليومية
        </p>
      </div>



      {/* الكروت الثلاثة الخاصة بملخص المعاملات */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#EBF9F1] border border-[#A7E8C3] rounded-2xl p-6 flex flex-col justify-between">
          <span className="text-s text-[#0D572B] font-medium">
            إجمالي الوارد (In)
          </span>
          <span className="text-xl font-extrabold text-[#0D572B] mt-2">
            {statsData?.total_in ?? 5690} ج.م
          </span>
        </div>

        <div className="bg-[#FDF2F2] border border-[#FAD2D2] rounded-2xl p-6 flex flex-col justify-between">
          <span className="text-s text-[#991B1B] font-medium">
            إجمالي الصادر (Out)
          </span>
          <span className="text-xl font-extrabold text-[#991B1B] mt-2">
            {statsData?.total_out ?? 2793757.5} ج.م
          </span>
        </div>

        <div className="bg-[#FEFCE8] border border-[#FDE68A] rounded-2xl p-6 flex flex-col justify-between">
          <span className="text-s text-[#854D0E] font-medium">
            صافي الرصيد (Net)
          </span>
          <span className="text-xl font-extrabold text-[#854D0E] mt-2">
            {statsData?.net_balance ?? -2788067.5} ج.م
          </span>
        </div>
      </div>

      {/* قسم معاملات اليوم المالية */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              معاملات اليوم المالية
            </h2>
            <p className="text-s text-gray-400 mt-0.5">
              ملخص حركة الوارد والصادر وصافي الرواجع اليومية
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-l font-semibold transition shadow-sm"
            >
              <Plus className="w-4 h-4" /> إضافة معاملة جديدة
            </button>

          </div>
        </div>

        {/* الجدول الاحترافي للمعاملات */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-s text-gray-400 font-semibold">
                <th className="py-3 px-4">#ID</th>
                <th className="py-3 px-4">اسم المعاملة / البيان</th>
                <th className="py-3 px-4">نوع المرجع</th>
                <th className="py-3 px-4">النوع</th>
                <th className="py-3 px-4 text-left">المبلغ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    جاري تحميل المعاملات...
                  </td>
                </tr>
              ) : statsData?.data && statsData.data.length > 0 ? (
                statsData.data.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-gray-50/80 transition"
                  >
                    <td className="py-3.5 px-4 text-s font-mono text-gray-400">
                      #{tx.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-800">
                      {tx.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-s font-mono">
                        {tx.reference_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {tx.type === "get" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-s font-semibold">
                          <ArrowDownRight className="w-3.5 h-3.5" /> وارد (Get)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-s font-semibold">
                          <ArrowUpRight className="w-3.5 h-3.5" /> صادر (Out)
                        </span>
                      )}
                    </td>
                    <td
                      className={`py-3.5 px-4 text-left font-bold ${tx.type === "get" ? "text-emerald-600" : "text-gray-900"}`}
                    >
                      {Number(tx.amount).toLocaleString()} ج.م
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    لا توجد معاملات مضافة اليوم
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* زر بدء يوم جديد في منتصف أسفل الصفحة */}
      <div className="flex justify-center mt-10 mb-6">
        <button
          onClick={() => setIsNewDayModalOpen(true)}
          className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-10 rounded-2xl text-lg shadow-md transition-all hover:scale-[1.02]"
        >
          <PlayCircle className="w-6 h-6" /> بدء يوم جديد
        </button>
      </div>

      {/* استدعاء الـ Modal الخاص بإضافة معاملة جديدة */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => createMutation.mutate(data)}
        isPending={createMutation.isPending}
      />

      {/* استدعاء الـ Modal الخاص بتأكيد بدء يوم جديد */}
      <StartNewDayModal
        isOpen={isNewDayModalOpen}
        onClose={() => setIsNewDayModalOpen(false)}
        onConfirm={() => startNewDayMutation.mutate()}
        isPending={startNewDayMutation.isPending}
      />
    </div>
  );
}