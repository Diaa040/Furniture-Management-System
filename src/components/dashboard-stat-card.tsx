import type { LucideIcon } from "lucide-react";

type DashboardStatCardProps = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  positive?: boolean;
};

export function DashboardStatCard({
  title,
  value,
  change,
  icon: Icon,
  positive = true,
}: DashboardStatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[15px] font-medium text-muted-foreground">
            {title}
          </span>

          <span className="text-2xl font-bold tracking-tight">
            {value}
          </span>
        </div>

        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <span
          className={
            positive
              ? "font-semibold text-emerald-700"
              : "font-semibold text-red-700"
          }
        >
          {change}
        </span>

        <span className="text-muted-foreground">
          مقارنة بالشهر الماضي
        </span>
      </div>
    </div>
  );
}