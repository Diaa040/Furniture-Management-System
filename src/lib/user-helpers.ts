export function getUserInitials(name: string) {
  if (!name) return "م";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}