import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20 transition-colors duration-300">
      {/* Navbar simplificada para Landing Page */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-background/80 border-b border-border/40">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gradient-to-br from-primary to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-lg leading-none">C</span>
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Crisimage
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-medium hover:text-primary transition-colors px-2"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-24 md:pt-32 pb-20 lg:pb-32 px-4">
          {/* Efeitos de fundo (Glows radiais) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 dark:opacity-30 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-indigo-500/40 to-purple-500/40 blur-[100px] rounded-full mix-blend-screen" />
          </div>

          <div className="container mx-auto max-w-5xl text-center relative z-10">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="mr-2 h-4 w-4" /> <span>Apresentando o novo modo Premium</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
              Entregue suas fotos com a máxima <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-primary via-indigo-500 to-purple-600">
                elegância e segurança.
              </span>
            </h1>

            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              A plataforma definitiva para fotógrafos. Envie galerias, aplique marcas d'água automaticamente e libere os arquivos originais mediante pagamento com apenas um link.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
              <Link
                href="/dashboard/upload"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-14 px-8 w-full sm:w-auto"
              >
                Começar Gratuitamente <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background/50 backdrop-blur-sm shadow-sm hover:bg-accent hover:text-accent-foreground h-14 px-8 w-full sm:w-auto"
              >
                Ver Demonstração
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-20 bg-neutral-50/50 dark:bg-neutral-900/20 border-t border-border/50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="p-8 rounded-3xl bg-white dark:bg-card border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Velocidade Extrema</h3>
                <p className="text-muted-foreground">Compactação de até 50 imagens direto no navegador. Sem lentidão de servidores, enviando arquivos gigantescos em segundos.</p>
              </div>

              {/* Card 2 */}
              <div className="p-8 rounded-3xl bg-white dark:bg-card border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="h-12 w-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 text-orange-600 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Venda Protegida</h3>
                <p className="text-muted-foreground">Suba sua logo. Nós aplicamos a marca d'água automaticamente. O cliente só baixa a versão limpa digitando a chave secreta de compra.</p>
              </div>

              {/* Card 3 */}
              <div className="p-8 rounded-3xl bg-white dark:bg-card border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="h-12 w-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Experiência Premium</h3>
                <p className="text-muted-foreground">Seu cliente recebe uma galeria elegante, rápida e que valoriza a sua fotografia. Um link limpo que expira em 5 dias e converte.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Crisimage. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
