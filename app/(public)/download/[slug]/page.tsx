import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { DownloadViewer } from "@/components/download-viewer";
import { WhatsAppModal } from "@/components/whatsapp-modal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MessageCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { DownloadActions } from "@/components/download-actions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DownloadPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();

  // 1. Gate de Segurança: Login Obrigatório
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/download/${slug}`);
  }

  // 2. Busca Dados da Sessão de Upload E o usuário dono
  const uploadSession = await prisma.uploadSession.findUnique({
    where: { slug },
    include: {
      user: {
        select: { name: true, whatsapp: true }
      }
    }
  });

  if (!uploadSession) return notFound();

  // 3. Validação de Expiração
  const isExpired = new Date() > new Date(uploadSession.expiresAt);
  if (isExpired) {
    return (
      <div className="min-h-screen bg-neutral-50/50 dark:bg-background flex items-center justify-center p-4 selection:bg-primary/20">
        <Card className="max-w-md w-full mx-auto border-destructive/20 shadow-2xl rounded-3xl overflow-hidden bg-white/70 dark:bg-card/70 backdrop-blur-xl">
          <CardHeader className="text-center pt-10 pb-6 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-destructive" />
            <div className="mx-auto bg-destructive/10 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-destructive/5 animate-pulse">
              <Clock className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-extrabold tracking-tight">Galeria Expirada</CardTitle>
            <CardDescription className="text-base mt-2 px-6">
              O prazo de 5 dias para download das fotos em alta resolução expirou de forma segura.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center px-8 pb-10 space-y-6">
            <div className="bg-neutral-100 dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-foreground">
                <AlertCircle className="w-5 h-5 text-neutral-500" />
                <span>Deseja recuperar o acesso?</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Para sua segurança e privacidade, os arquivos originais foram bloqueados.
                Entre em contato diretamente com <span className="font-semibold text-foreground">{uploadSession.user.name || "o fotógrafo"}</span> para solicitar um novo pacote.
              </p>
              {uploadSession.user.whatsapp ? (
                <Button asChild className="w-full h-12 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 rounded-xl mt-2 transition-transform active:scale-[0.98]">
                  <a
                    href={`https://wa.me/55${uploadSession.user.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! O link da minha galeria "${uploadSession.title}" expirou. Você poderia gerar um novo link de acesso, por favor?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Falar via WhatsApp
                  </a>
                </Button>
              ) : (
                <div className="p-3 bg-neutral-200/50 dark:bg-neutral-800 rounded-xl mt-2">
                  <p className="text-xs text-muted-foreground italic">
                    O fotógrafo não possui WhatsApp cadastrado.
                  </p>
                </div>
              )}
            </div>
            <Button asChild variant="outline" className="w-full h-12 rounded-xl text-muted-foreground">
              <Link href="/dashboard">Voltar para o Início</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 4. Verificação CRÍTICA do WhatsApp para o usuário logado
  const loggedInUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { whatsapp: true }
  });

  const hasWhatsapp = !!loggedInUser?.whatsapp;

  // Decide qual ZIP mandar e se precisa de chave
  const isProtected = !!uploadSession.accessKey;

  return (
    <>
      <WhatsAppModal isOpen={!hasWhatsapp} />

      <div className={`min-h-screen bg-neutral-50 dark:bg-background selection:bg-primary/20 ${!hasWhatsapp ? "blur-md pointer-events-none select-none h-screen overflow-hidden" : ""}`}>

        {/* Cinematic Header */}
        <div className="relative h-[40vh] min-h-[300px] w-full bg-neutral-900 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/40 via-neutral-900/60 to-neutral-50 dark:to-background z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-neutral-900 to-neutral-900" />

          <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 py-1 px-3 text-xs font-medium text-white/80 backdrop-blur-md mb-2">
              Galeria Protegida
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-2 drop-shadow-2xl">
              {uploadSession.title || "Sua Galeria"}
            </h1>
            <p className="text-lg md:text-xl text-white/70 font-medium">
              Por {uploadSession.user.name || "Crisimage Studio"}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-20 relative z-30 pb-20">
          <DownloadViewer
            slug={uploadSession.slug}
            zipUrl={uploadSession.zipUrl}
            previewZipUrl={uploadSession.previewZipUrl}
            title={uploadSession.title}
            expiresAt={uploadSession.expiresAt}
            isProtected={isProtected}
          />

          <div className="mt-12 max-w-2xl mx-auto flex justify-center pb-10">
            <DownloadActions
              link={`${process.env.NEXTAUTH_URL}/download/${slug}`}
              title={uploadSession.title || "Imagens"}
            />
          </div>
        </div>
      </div>
    </>
  );
}