// "use client";

// import { use } from "react";
// import { useRouter } from "next/navigation";
// import { useItemStages } from "@/hooks/use-orders";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowRight, Loader2 } from "lucide-react";

// export default function StageDetailsPage({
//   params,
// }: {
//   params: Promise<{ id: string; itemId: string; stageName: string }>;
// }) {
//   const resolvedParams = use(params);
//   const orderId = Number(resolvedParams.id);
//   const itemId = Number(resolvedParams.itemId);
//   // فك ترميز الاسم العربي (مثلاً تحويل %D8%A7... إلى "الدهان")
//   const stageName = decodeURIComponent(resolvedParams.stageName);

//   const router = useRouter();

//   // جلب بيانات المرحلة بناءً على الأوردر والعنصر واسم المرحلة
//   const { data: responseData, isLoading, isError } = useItemStages(
//     orderId,
//     itemId,
//     stageName
//   );

//   if (isLoading) {
//     return (
//       <div className="flex h-96 items-center justify-center dir-rtl">
//         <Loader2 className="size-8 animate-spin text-[#7C4A26]" />
//         <span className="mr-3 text-sm text-muted-foreground">
//           جاري تحميل بيانات مرحلة ({stageName})...
//         </span>
//       </div>
//     );
//   }

//   if (isError || !responseData) {
//     return (
//       <div className="p-6 dir-rtl space-y-4">
//         <Button
//           variant="outline"
//           onClick={() => router.back()}
//           className="rounded-xl gap-2"
//         >
//           <ArrowRight className="size-4" /> رجوع
//         </Button>
//         <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
//           حدث خطأ أثناء جلب تفاصيل المرحلة أو أن المرحلة غير موجودة.
//         </div>
//       </div>
//     );
//   }

//   // دعم الاستجابة سواء جاءت كـ stage أو داخل قائمة stages
//   const stage = responseData.stage || (responseData.stages && responseData.stages[0]);

//   return (
//     <div className="p-6 space-y-6 bg-[#FDFBF7] min-h-screen" dir="rtl">
//       {/* الهيدر وزر الرجوع */}
//       <div className="flex items-center gap-3">
//         <Button
//           variant="outline"
//           size="icon"
//           onClick={() => router.back()}
//           className="rounded-xl border-gray-200 bg-white hover:bg-gray-100 shrink-0"
//         >
//           <ArrowRight className="size-5 text-[#2C2420]" />
//         </Button>

//         <div>
//           <h1 className="text-2xl font-extrabold text-[#2C2420]">
//             مرحلة: {stageName}
//           </h1>
//           <p className="text-xs text-muted-foreground mt-0.5">
//             طلب #{orderId} - عنصر #{itemId}
//           </p>
//         </div>
//       </div>

//       {/* تفاصيل المرحلة */}
//       <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white">
//         <CardHeader>
//           <CardTitle className="text-lg font-bold text-[#2C2420]">
//             تفاصيل العمل والورشة
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4 text-sm">
//           <div className="flex justify-between border-b pb-2">
//             <span className="text-muted-foreground">حالة المرحلة:</span>
//             <span className="font-semibold text-[#2C2420]">
//               {stage?.status || "غير محدد"}
//             </span>
//           </div>
//           <div className="flex justify-between border-b pb-2">
//             <span className="text-muted-foreground">القائم بالعمل / الورشة:</span>
//             <span className="font-semibold text-[#2C2420]">
//               {stage?.workshop_name || stage?.handler_name || "غير محدد"}
//             </span>
//           </div>
//           <div className="flex justify-between border-b pb-2">
//             <span className="text-muted-foreground">التكلفة المتفق عليها:</span>
//             <span className="font-bold text-[#7C4A26]">
//               {Number(stage?.agreed_cost || 0).toLocaleString()} ج.م
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-muted-foreground">المبلغ المدفوع:</span>
//             <span className="font-bold text-green-700">
//               {Number(stage?.total_paid || 0).toLocaleString()} ج.م
//             </span>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }