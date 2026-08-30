export const DEFAULT_STAGES = [
  { id: 1, name: "النجارة" },
  { id: 2, name: "الدهان" },
  { id: 3, name: "التنجيد" },
  { id: 4, name: "إضافات" },
  { id: 5, name: "التسليم" },
];

export const statusDotMap: Record<string, { color: string; label: string }> = {
  completed: { color: "bg-emerald-500", label: "مكتملة" },
  in_progress: { color: "bg-amber-500", label: "قيد التنفيذ" },
  not_started: { color: "bg-gray-300", label: "لم تبدأ" },
  pending: { color: "bg-gray-300", label: "لم تبدأ" },
};