// القيم اللي بتتعامل كـ "أسيستنت" (فورم التسجيل بيستخدم "assistance")
const ASSISTANT_ROLES = ["assistance", "assistant"];

// ⚠️ الصفحات الممنوعة على الأسيستنت - عدّل الليست دي براحتك
// أي مسار هنا بيمنع كمان كل الصفحات اللي تحته (مثلاً /treasury/anything)
export const ASSISTANT_BLOCKED_PATHS = ["/register", "/profits", "/treasury"];

export function isAssistantRole(role?: string | null): boolean {
  return !!role && ASSISTANT_ROLES.includes(role.trim().toLowerCase());
}

// نشيل الـ "/" اللي في الآخر (static export ممكن يضيفها)
function normalizePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

// true = المستخدم يقدر يدخل المسار ده
export function canAccessPath(role: string | null | undefined, pathname: string): boolean {
  if (!isAssistantRole(role)) return true;

  const path = normalizePath(pathname);
  return !ASSISTANT_BLOCKED_PATHS.some(
    (blocked) => path === blocked || path.startsWith(`${blocked}/`),
  );
}