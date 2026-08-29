"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMonthlyReport, fetchSpecificMonthlyReport } from "@/apis/profits.api";
import { DateFilterModal, monthsList } from "@/components/DateFilterModal";
import { ProfitReportType } from "@/types/profits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Loader2 } from "lucide-react";

export default function MonthlyProfitsPage() {
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [activeType, setActiveType] = useState<ProfitReportType | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // جلب البيانات بناءً على الفلاتر والـ Type الحالي
  const { data: reportData, isLoading } = useQuery({
    queryKey: ["monthly-report", selectedMonth, selectedYear, activeType],
    queryFn: () => {
      if (selectedMonth !== undefined || selectedYear !== undefined || activeType !== undefined) {
        return fetchSpecificMonthlyReport(selectedMonth, selectedYear, activeType);
      }
      return fetchMonthlyReport();
    },
  });

  const totals = reportData?.totals || {
    total_sales: 0,
    manufacturing_cost: 0,
    fixed_expenses: 0,
    net_profit: 0,
  };

  const transactions = reportData?.data || [];

  const handleApplyDateFilter = (month?: number, year?: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  return (
    <div className="p-6 space-y-6 bg-[#FDFBF7] min-h-screen" dir="rtl">
      {/* الهيدر وزر اختيار التاريخ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2C2420]">
            الأرباح الشهرية
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            صافي الربح الحقيقي بعد احتساب تكلفة التصنيع والمرتبات والإيجار والمصاريف الإضافية
          </p>
        </div>

        <Button
          variant="outline"
          className="rounded-2xl border-[#EFEBE4] bg-white hover:bg-[#FAF8F5] text-[#2C2420] gap-2 px-4 shadow-sm h-11"
          onClick={() => setIsModalOpen(true)}
        >
          <Calendar className="size-4 text-[#7C4A26]" />
          <span className="font-bold text-sm">
            {selectedMonth && selectedYear
              ? `${monthsList.find((m) => m.value === selectedMonth)?.label} ${selectedYear}`
              : "اختيار التاريخ"}
          </span>
        </Button>
      </div>

      {/* الـ 4 مربعات العلوية (أول 3 قابلة للضغط لتحديد الـ Type) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* مربع إجمالي المبيعات */}
        <Card
          onClick={() => setActiveType("sales")}
          className={`border-sidebar-border/40 shadow-sm rounded-2xl bg-white cursor-pointer transition-all ${
            activeType === "sales" ? "border-2 border-[#7C4A26] bg-[#FAF8F5]" : "hover:border-[#7C4A26]"
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              إجمالي المبيعات (sales)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#2C2420] font-mono">
              {totals.total_sales.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* مربع تكلفة التصنيع */}
        <Card
          onClick={() => setActiveType("manufacturing")}
          className={`border-sidebar-border/40 shadow-sm rounded-2xl bg-white cursor-pointer transition-all ${
            activeType === "manufacturing" ? "border-2 border-[#7C4A26] bg-[#FAF8F5]" : "hover:border-[#7C4A26]"
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              تكلفة التصنيع (manufacturing)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#2C2420] font-mono">
              {totals.manufacturing_cost.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* مربع المصاريف الثابتة */}
        <Card
          onClick={() => setActiveType("fixed_expenses")}
          className={`border-sidebar-border/40 shadow-sm rounded-2xl bg-white cursor-pointer transition-all ${
            activeType === "fixed_expenses" ? "border-2 border-[#7C4A26] bg-[#FAF8F5]" : "hover:border-[#7C4A26]"
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              المصاريف الثابتة (fixed_expenses)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#2C2420] font-mono">
              {totals.fixed_expenses.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* مربع صافي الربح الحقيقي (غير قابل للضغط كمرشح نوع) */}
        <Card className=" shadow-sm rounded-2xl bg-[#E6F4EA]/50 border-emerald-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-emerald-800">
              صافي الربح الحقيقي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-700 font-mono">
              {totals.net_profit.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جدول البيانات */}
      <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-bold text-[#2C2420]">
            {activeType ? `تفاصيل معاملات الـ (${activeType})` : "تفاصيل جميع المعاملات المالية"}
          </CardTitle>
          {activeType && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveType(undefined)}
              className="text-xs text-[#7C4A26] font-bold"
            >
              إلغاء فلتر النوع
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-[#7C4A26]" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-[#FAF8F5]">
                <TableRow>
                  <TableHead className="text-right font-bold text-[#2C2420]">
                    الاسم
                  </TableHead>
                  <TableHead className="text-center font-bold text-[#2C2420]">
                    المبلغ (الكمية)
                  </TableHead>
                  <TableHead className="text-left font-bold text-[#2C2420] pl-6">
                    النوع
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions && transactions.length > 0 ? (
                  transactions.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-semibold text-[#2C2420]">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-center font-mono font-bold text-[#7C4A26]">
                        {Number(item.amount).toLocaleString()} ج.م
                      </TableCell>
                      <TableCell className="text-left pl-6">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {item.type}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>  
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground py-8"
                    >
                      لا توجد بيانات متاحة لهذا الاختيار
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* الـ Modal الخارجي */}
      <DateFilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApplyDateFilter}
        currentMonth={selectedMonth}
        currentYear={selectedYear}
      />
    </div>
  );
}