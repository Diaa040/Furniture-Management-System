import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CostProfitCardProps {
  totalStagesCost: number;
  totalProfit: number;
}

export default function CostProfitCard({ totalStagesCost, totalProfit }: CostProfitCardProps) {
  return (
    <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-[#2C2420]">التكلفة والربح</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-muted-foreground">إجمالي تكلفة التصنيع</span>
          <span className="font-semibold text-[#2C2420]">{totalStagesCost.toLocaleString()} ج.م</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">إجمالي الربح</span>
          <span className="font-semibold text-[#7C4A26]">{totalProfit.toLocaleString()} ج.م</span>
        </div>
      </CardContent>
    </Card>
  );
}