import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
// import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    //  <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <DashboardHeader />

          <main className="flex-1">
            {children}
          </main>
        </div>
      </SidebarProvider>
    // </ProtectedRoute>
  );
}