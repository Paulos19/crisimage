import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Se não tiver sessão, redireciona. 
  // Isso garante que session.user existe abaixo.
  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/30 dark:bg-background transition-colors duration-300">
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 dark:bg-background/70 border-b border-border shadow-sm">
        <div className="flex h-16 items-center px-4 container mx-auto justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gradient-to-br from-primary to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-lg leading-none">C</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Crisimage
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="h-6 w-px bg-border hidden sm:block"></div>
            {/* CORREÇÃO: Passamos o usuário via prop */}
            <UserNav user={session.user} />
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6 container mx-auto">
        {children}
      </main>
    </div>
  );
}