// Object.freeze هنا مقصود: DEFAULT_STAGES نسخة واحدة مشتركة في الذاكرة طول عمر التطبيق
// (مش بتتعمل من جديد كل render لأنها const على مستوى الملف).
// الـ freeze بيمنع أي كود في أي مكان تاني من المشروع من عمل push/unshift/splice
// عليها بالغلط، وبيخليها ترمي Error فورًا بدل ما تتلخبط بصمت.
export const DEFAULT_STAGES = Object.freeze([
  { id: 1, name: "النجارة" },
  { id: 2, name: "الدهان" },
  { id: 3, name: "التنجيد" },
  { id: 4, name: "إضافات" },
  { id: 5, name: "التسليم" },
]);

export const statusDotMap: Record<string, { color: string; label: string }> = {
  completed: { color: "bg-emerald-500", label: "مكتملة" },
  in_progress: { color: "bg-amber-500", label: "قيد التنفيذ" },
  not_started: { color: "bg-gray-300", label: "لم تبدأ" },
  pending: { color: "bg-gray-300", label: "لم تبدأ" },
};