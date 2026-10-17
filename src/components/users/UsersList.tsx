import { Loader2, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UserCard } from "@/components/users/UserCard";
import type { UserItem } from "@/types/users";

interface UsersListProps {
  users: UserItem[];
  count: number;
  isLoading: boolean;
}

export function UsersList({ users, count, isLoading }: UsersListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg md:text-xl font-black text-foreground flex items-center gap-2">
          <Users className="size-5 text-primary" /> المستخدمون المسجلون (
          {count})
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="size-7 animate-spin text-primary" />
        </div>
      ) : users.length > 0 ? (
        <div className="space-y-3">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl border-sidebar-border/40 bg-card p-6 text-center text-muted-foreground font-black text-sm">
          لا يوجد مستخدمون مضافون حتى الآن.
        </Card>
      )}
    </div>
  );
}