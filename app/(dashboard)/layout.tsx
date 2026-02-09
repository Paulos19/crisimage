import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  
  // TODO: Verificar se usuário tem WhatsApp, se não, bloquear interface
  // if (!session.user.whatsapp) redirect("/complete-profile")

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-4 container mx-auto justify-between">
          <h1 className="text-xl font-bold tracking-tight">Compact.io</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
                Olá, {session.user?.name}
            </span>
            {/* Botão de Logout simples para MVP */}
             <form action={async () => {
                "use server"
                const { signOut } = await import("@/auth")
                await signOut()
              }}>
                <button className="text-sm font-medium hover:underline">Sair</button>
              </form>
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
        {children}
      </main>
    </div>
  );
}