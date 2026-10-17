import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FinancialSummaryCardProps {
  totalPrice: number;
  paidAmount: number;
  remainingAmount: number;
  paidPercentage: number;
}

export default function FinancialSummaryCard({ totalPrice, paidAmount, remainingAmount, paidPercentage }: FinancialSummaryCardProps) {
  return (
    <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-right text-[#2C2420]">الملخص المالي</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-muted-foreground">إجمالي سعر الأوردر</span>
          <span className="font-bold text-[#2C2420]">{totalPrice.toLocaleString()} ج.م</span>
        </div>
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-muted-foreground">المدفوع (المقدم)</span>
          <span className="font-bold text-[#2C2420]">{paidAmount.toLocaleString()} ج.م</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">المتبقي</span>
          <span className="font-bold text-[#2C2420]">{remainingAmount.toLocaleString()} ج.م</span>
        </div>
        <div className="pt-2 space-y-2">
          <Progress value={paidPercentage} className="h-2.5 bg-[#F3E7DA]" />
          <p className="text-xs text-center text-muted-foreground">تم تحصيل %{paidPercentage} من قيمة الأوردر</p>
        </div>
      </CardContent>
    </Card>
  );
}
