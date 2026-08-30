import { Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getUserInitials } from "@/lib/user-helpers";
import type { UserItem } from "@/types/users";

interface UserCardProps {
  user: UserItem;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Card className="w-full rounded-2xl border-sidebar-border/40 shadow-sm bg-card p-4 md:p-5 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        {/* الجانب الأيمن: الدائرة الرمزية + الاسم والبريد */}
        <div className="flex items-center gap-3 text-right">
          <div className="size-10 md:size-11 rounded-full bg-accent text-primary font-black flex items-center justify-center text-xs md:text-sm shadow-inner shrink-0">
            {getUserInitials(user.name)}
          </div>
          <div>
            <h3 className="text-sm md:text-base font-black text-foreground">
              {user.name}
            </h3>
            <p
              className="text-xs md:text-sm text-muted-foreground font-extrabold flex items-center gap-1 justify-start mt-0.5"
              dir="ltr"
            >
              <span className="text-right">{user.email}</span>
              <Mail className="size-3.5 text-muted-foreground shrink-0" />
            </p>
          </div>
        </div>

        {/* الجانب الأيسر: الـ Badge الخاص بالدور */}
        <div>
          <span className="bg-secondary text-primary px-3.5 py-1.5 rounded-full text-l font-black tracking-wide">
            {user.role}
          </span>
        </div>
      </div>

      {/* تفاصيل سفلية */}
      <div className="mt-3 pt-2.5 border-t border-border text-[11px] md:text-xs text-muted-foreground font-extrabold flex justify-between items-center">
        <span className="font-mono">
          تاريخ الإنشاء:{" "}
          {user.created_at
            ? new Date(user.created_at).toLocaleDateString("ar-EG")
            : "غير متوفر"}
        </span>
      </div>
    </Card>
  );
}