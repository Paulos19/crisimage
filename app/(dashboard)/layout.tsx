import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/user-nav";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardMobileNav } from "@/components/dashboard-mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="h-screen flex bg-zinc-50 dark:bg-[#080808] text-zinc-900 dark:text-white overflow-hidden selection:bg-emerald-500/30">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-[#0a0a0a]/80 border-b border-zinc-200 dark:border-white/[0.06] flex-none">
          <div className="flex h-16 items-center px-6 lg:px-8 justify-between md:justify-end">
            {/* Mobile Nav & Logo */}
            <div className="flex items-center gap-3 md:hidden">
              <DashboardMobileNav />
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <span className="text-white font-black text-xs">C</span>
                </div>
                <h1 className="text-base font-black tracking-tight uppercase">LetImage</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Studio</span>
              </div>
              <ThemeToggle />
              <div className="h-6 w-px bg-zinc-200 dark:bg-white/[0.08]"></div>
              <UserNav user={session.user} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 custom-scrollbar bg-zinc-50 dark:bg-[#080808]">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}