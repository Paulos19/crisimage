import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/user-nav";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

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
    <div className="h-screen flex bg-[#080808] text-white overflow-hidden selection:bg-emerald-500/30">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0a0a0a]/80 border-b border-white/[0.06] flex-none">
          <div className="flex h-16 items-center px-6 lg:px-8 justify-between md:justify-end">
            {/* Mobile Logo */}
            <div className="flex items-center gap-2.5 md:hidden">
              <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-md shadow-emerald-500/20">
                <span className="text-white font-black text-sm">C</span>
              </div>
              <h1 className="text-lg font-black tracking-tight uppercase">Crisimage</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Studio</span>
              </div>
              <div className="h-6 w-px bg-white/[0.08]"></div>
              <UserNav user={session.user} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 custom-scrollbar bg-[#080808]">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}