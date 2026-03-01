import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Se não tiver sessão, redireciona. 
  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="h-screen flex bg-neutral-50/30 dark:bg-background overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 dark:bg-card/70 border-b border-border/50 shadow-sm flex-none">
          <div className="flex h-16 items-center px-6 justify-between md:justify-end">
            {/* Mobile Logo - Visible only when sidebar is hidden on small screens (can be refined later for mobile menu) */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h1 className="text-lg font-bold tracking-tight">Crisimage</h1>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="h-6 w-px bg-border/60"></div>
              {/* CORREÇÃO: Passamos o usuário via prop */}
              <UserNav user={session.user} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}