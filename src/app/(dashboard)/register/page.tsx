"use client";

import { useUsers } from "@/apis/users.api";
import { RegisterUserDialog } from "@/components/users/RegisterUserDialog";
import { UsersList } from "@/components/users/UsersList";

export default function RegisterAndUsersPage() {
  const { data: usersResponse, isLoading: isUsersLoading, refetch } = useUsers(true);
  const usersList = usersResponse?.data || [];

  return (
    <div className="p-4 md:p-6 bg-background min-h-screen" dir="rtl">
      {/* الزرار في نص الصفحة فوق - بيفتح المودال بتاعه لوحده */}
      <div className="flex justify-center mb-6">
        <RegisterUserDialog onRegistered={refetch} />
      </div>

      <UsersList
        users={usersList}
        count={usersResponse?.count || 0}
        isLoading={isUsersLoading}
      />
    </div>
  );
}