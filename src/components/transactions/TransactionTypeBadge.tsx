import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface TransactionTypeBadgeProps {
  type: "in" | "out";
}

export function TransactionTypeBadge({ type }: TransactionTypeBadgeProps) {
  const isOut = type === "out";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
        isOut
          ? "bg-destructive/10 text-destructive"
          : "bg-chart-2/10 text-chart-2"
      }`}
    >
      {isOut ? "صادر (Out)" : "وارد (Get)"}
      {isOut ? (
        <ArrowUpRight className="size-3.5" />
      ) : (
        <ArrowDownLeft className="size-3.5" />
      )}
    </span>
  );
}