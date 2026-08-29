"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, Loader2, Wallet, TrendingUp, TrendingDown, ArrowUpRight, ShieldAlert, FileText, Plus } from "lucide-react";
import { useTreasury } from "@/apis/treasury.api";
import { useAdminWithdrawals } from "@/apis/treasury.api";
import { useReceivables , useStagesFinancials} from "@/apis/treasury.api";
import AdminWithdrawalModal from "@/components/AdminWithdrawalModal";
import { AdminWithdrawalItem , ReceivableItem , StageFinancialItem} from "@/types/treasury";
type ActiveTableType = null | "withdrawals" | "receivables" | "stages";

export default function TreasuryPage() {
  const router = useRouter();
  const { data: response, isLoading, isError, error } = useTreasury();
  
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [activeTable, setActiveTable] = useState<ActiveTableType>(null);
  const [currentPage] = useState(1);

  // جلب البيانات لكل جدول (لا يتم جلب البيانات إلا إذا تم النقر على الكارت الخاص به لتوفير الركويستات)
  const { data: withdrawalsResponse, isLoading: isWithdrawalsLoading } = useAdminWithdrawals(
    currentPage, 
    activeTable === "withdrawals"
  );

  const { data: receivablesResponse, isLoading: isReceivablesLoading } = useReceivables(
    activeTable === "receivables"
  );

  const { data: stagesResponse, isLoading: isStagesLoading } = useStagesFinancials(
    activeTable === "stages"
  );

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center dir-rtl">
        <Loader2 className="size-8 animate-spin text-[#7C4A26]" />
        <span className="mr-3 text-sm text-muted-foreground">
          جاري تحميل بيانات الخزينة...
        </span>
      </div>
    );
  }

  if (isError || !response) {
    return (
      <div className="p-6 dir-rtl space-y-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="rounded-xl gap-2"
        >
          <ArrowRight className="size-4" /> رجوع
        </Button>
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
          حدث خطأ أثناء جلب بيانات الخزينة:{" "}
          {(error as Error)?.message || "البيانات غير متاحة"}
        </div>
      </div>
    );
  }

  const treasury = response.data;
  const withdrawalsList = withdrawalsResponse?.data?.data || [];
  const receivablesList = receivablesResponse?.data || [];
  const stagesList = stagesResponse?.data || [];

  const toggleTable = (type: ActiveTableType) => {
    setActiveTable((prev) => (prev === type ? null : type));
  };

  const statsCards = [
    {
      id: "sales",
      title: "إجمالي المبيعات",
      value: `${Number(treasury.total_sales).toLocaleString()} ج.م`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      isClickable: false,
    },
    {
      id: "expenses",
      title: "إجمالي المصروفات",
      value: `${Number(treasury.total_expenses).toLocaleString()} ج.م`,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
      isClickable: false,
    },
    {
      id: "balance",
      title: "الرصيد الحالي للخزنة",
      value: `${Number(treasury.current_balance).toLocaleString()} ج.م`,
      icon: Wallet,
      color: "text-[#7C4A26]",
      bgColor: "bg-[#F3E7DA]",
      isClickable: false,
    },
    {
      id: "withdrawals",
      title: "مسحوبات الإدارة",
      value: `${Number(treasury.admin_withdrawals).toLocaleString()} ج.م`,
      icon: ShieldAlert,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      isClickable: true,
      onClick: () => toggleTable("withdrawals"),
    },
    {
      id: "receivables",
      title: "إجمالي المبالغ الخارجية",
      value: `${Number(receivablesResponse?.total_remaining || 0).toLocaleString()} ج.م`,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      isClickable: true,
      onClick: () => toggleTable("receivables"),
    },
    {
      id: "stages",
      title: "إجمالي المديونات",
      value: `${Number(stagesResponse?.total_remaining || 0).toLocaleString()} ج.م`,
      icon: ArrowUpRight,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      isClickable: true,
      onClick: () => toggleTable("stages"),
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#FDFBF7] min-h-screen" dir="rtl">
      {/* الهيدر مع زر سحب الإدارة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="rounded-xl border-gray-200 bg-white hover:bg-gray-100 shrink-0"
            title="رجوع"
          >
            <ArrowRight className="size-5 text-[#2C2420]" />
          </Button>

          <div>
            <h1 className="text-2xl font-extrabold text-[#2C2420]">
              إدارة الخزينة والماليات
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              متابعة حركة الأموال والمبيعات والمصروفات بالخزينة
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsWithdrawalModalOpen(true)}
          className="bg-[#7C4A26] hover:bg-[#633a1e] text-white rounded-xl text-xs font-semibold px-4 py-2.5 gap-1.5 shadow-sm"
        >
          <Plus className="size-4" /> مسحوبات الإدارة
        </Button>
      </div>

      {/* الـ 6 كروت */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((card) => {
          const Icon = card.icon;
          const isSelected = activeTable === card.id;
          return (
            <Card
              key={card.id}
              onClick={card.isClickable ? card.onClick : undefined}
              className={`border-sidebar-border/40 shadow-sm rounded-2xl bg-white transition-all ${
                card.isClickable
                  ? "cursor-pointer hover:shadow-md hover:border-[#7C4A26]/50 group"
                  : ""
              } ${isSelected ? "ring-2 ring-[#7C4A26]" : ""}`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.color}`}>
                  <Icon className="size-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-[#2C2420] font-mono">
                  {card.value}
                </div>
                {card.isClickable && (
                  <p className="text-[11px] text-[#7C4A26] mt-2 font-semibold flex items-center gap-1 group-hover:underline">
                    {isSelected ? "إخفاء التفاصيل" : "اضغط لعرض التفاصيل"}{" "}
                    <ArrowRight
                      className={`size-3 rotate-180 transition-transform ${
                        isSelected ? "rotate-0" : ""
                      }`}
                    />
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 1. جدول مسحوبات الإدارة */}
      {activeTable === "withdrawals" && (
        <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white animate-in fade-in-50 duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg font-bold text-[#2C2420]">
              سجل مسحوبات الإدارة
            </CardTitle>
            {withdrawalsResponse?.total_amount && (
              <span className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg font-mono">
                الإجمالي: {Number(withdrawalsResponse.total_amount).toLocaleString()} ج.م
              </span>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#FAF8F5]">
                <TableRow>
                  <TableHead className="text-right font-bold text-[#2C2420]">المبلغ (Amount)</TableHead>
                  <TableHead className="text-center font-bold text-[#2C2420]">تاريخ السحب (Withdrawal Date)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isWithdrawalsLoading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8">
                      <Loader2 className="size-6 animate-spin mx-auto text-[#7C4A26]" />
                    </TableCell>
                  </TableRow>
                ) : withdrawalsList.length > 0 ? (
                  withdrawalsList.map((item: AdminWithdrawalItem) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono font-bold text-amber-600">
                        {Number(item.amount).toLocaleString()} ج.م
                      </TableCell>
                      <TableCell className="text-center font-mono text-muted-foreground">
                        {item.withdrawal_date}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
                      لا توجد مسحوبات إدارية مسجلة حتى الآن
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* 2. جدول إجمالي المبالغ الخارجية */}
      {activeTable === "receivables" && (
        <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white animate-in fade-in-50 duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg font-bold text-[#2C2420]">
              سجل المبالغ الخارجية (Receivables)
            </CardTitle>
            {receivablesResponse?.total_remaining !== undefined && (
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg font-mono">
                الإجمالي: {Number(receivablesResponse.total_remaining).toLocaleString()} ج.م
              </span>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#FAF8F5]">
                <TableRow>
                  <TableHead className="text-right font-bold text-[#2C2420]">اسم العميل (Customer Name)</TableHead>
                  <TableHead className="text-center font-bold text-[#2C2420]">المبلغ المتبقي (Remaining Amount)</TableHead>
                  <TableHead className="text-left font-bold text-[#2C2420] pl-6">تاريخ التسليم (Delivery Date)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isReceivablesLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <Loader2 className="size-6 animate-spin mx-auto text-blue-600" />
                    </TableCell>
                  </TableRow>
                ) : receivablesList.length > 0 ? (
                  receivablesList.map((item: ReceivableItem) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-bold text-[#2C2420]">
                        {item.customer_name}
                      </TableCell>
                      <TableCell className="text-center font-mono font-bold text-blue-600">
                        {Number(item.remaining_amount).toLocaleString()} ج.م
                      </TableCell>
                      <TableCell className="text-left pl-6 font-mono text-muted-foreground">
                        {item.delivery_date}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                      لا توجد مبالغ خارجية مسجلة حتى الآن
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* 3. جدول إجمالي المديونات */}
      {activeTable === "stages" && (
        <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white animate-in fade-in-50 duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg font-bold text-[#2C2420]">
              سجل المديونات (Stages Financials)
            </CardTitle>
            {stagesResponse?.total_remaining !== undefined && (
              <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-lg font-mono">
                الإجمالي: {Number(stagesResponse.total_remaining).toLocaleString()} ج.م
              </span>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#FAF8F5]">
                <TableRow>
                  <TableHead className="text-right font-bold text-[#2C2420]">اسم العامل (Worker Name)</TableHead>
                  <TableHead className="text-left font-bold text-[#2C2420] pl-6">المبلغ المتبقي (Remaining Amount)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isStagesLoading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8">
                      <Loader2 className="size-6 animate-spin mx-auto text-purple-600" />
                    </TableCell>
                  </TableRow>
                ) : stagesList.length > 0 ? (
                  stagesList.map((item: StageFinancialItem, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-bold text-[#2C2420]">
                        {item.worker_name}
                      </TableCell>
                      <TableCell className="text-left pl-6 font-mono font-bold text-purple-600">
                        {Number(item.remaining_amount).toLocaleString()} ج.م
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
                      لا توجد مديونات مسجلة حتى الآن
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* بوب أب الإضافة */}
      <AdminWithdrawalModal
        isOpen={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
      />
    </div>
  );
}