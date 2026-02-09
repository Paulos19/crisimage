import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/user-nav"; 

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
    <div className="min-h-screen flex flex-col bg-neutral-50/50 dark:bg-neutral-950">
      <header className="border-b bg-white dark:bg-neutral-900 sticky top-0 z-10">
        <div className="flex h-16 items-center px-4 container mx-auto justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Compact.io</h1>
          </div>
          
          <div className="flex items-center gap-4">
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