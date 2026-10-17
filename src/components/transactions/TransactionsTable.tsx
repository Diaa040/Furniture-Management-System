import { Pencil } from "lucide-react";
import { TransactionTypeBadge } from "@/components/transactions/TransactionTypeBadge";
import type { DayTransactionItem } from "@/types/transactions";

interface TransactionsTableProps {
  transactions: DayTransactionItem[];
  onEdit: (transaction: DayTransactionItem) => void;
}

export function TransactionsTable({
  transactions,
  onEdit,
}: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground font-bold text-sm bg-card rounded-2xl border border-border">
        لا توجد معاملات مسجلة في هذا اليوم.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-card rounded-2xl border border-border">
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="text-muted-foreground text-sm font-bold border-b border-border">
            <th className="p-4">ID#</th>
            <th className="p-4">اسم المعاملة / البيان</th>
            <th className="p-4">نوع المرجع</th>
            <th className="p-4">النوع</th>
            <th className="p-4">المبلغ</th>
            <th className="p-4 text-center">تعديل</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-sm font-semibold text-foreground">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-accent/40 transition-colors">
              <td className="p-4 text-muted-foreground">#{tx.id}</td>
              <td className="p-4">{tx.name}</td>
              <td className="p-4">
                <span className="bg-secondary text-secondary-foreground px-2.5 py-1 rounded-lg text-xs font-bold">
                  {tx.reference_type}
                </span>
              </td>
              <td className="p-4">
                <TransactionTypeBadge type={tx.type} />
              </td>
              <td
                className={`p-4 font-bold ${
                  tx.type === "out" ? "text-destructive" : "text-chart-2"
                }`}
              >
                {Number(tx.amount).toLocaleString()} ج.م
              </td>
              <td className="p-4 text-center">
                <button
                  type="button"
                  onClick={() => onEdit(tx)}
                  title="تعديل المعاملة"
                  className="text-primary hover:bg-accent p-1.5 rounded-lg transition-colors"
                >
                  <Pencil className="size-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}