import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerInfoCardProps {
  customerName: string;
  customerPhone: string;
  notes?: string;
}

export default function CustomerInfoCard({ customerName, customerPhone, notes }: CustomerInfoCardProps) {
  return (
    <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-right text-[#2C2420]">بيانات العميل</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-muted-foreground">الاسم</span>
          <span className="font-semibold text-[#2C2420]">{customerName}</span>
        </div>
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-muted-foreground">الهاتف</span>
          <span dir="ltr" className="font-mono text-[#2C2420]">{customerPhone}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">ملاحظات</span>
          <span className="text-[#2C2420] text-left max-w-50 truncate">{notes || "لا يوجد"}</span>
        </div>
      </CardContent>
    </Card>
  );
}