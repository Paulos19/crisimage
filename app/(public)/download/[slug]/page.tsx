import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { DownloadViewer } from "@/components/download-viewer";
import { WhatsAppModal } from "@/components/whatsapp-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
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

  // 2. Busca Dados da Sessão de Upload
  const uploadSession = await prisma.uploadSession.findUnique({
    where: { slug },
  });

  if (!uploadSession) return notFound();

  // 3. Validação de Expiração
  const isExpired = new Date() > new Date(uploadSession.expiresAt);
  if (isExpired) {
    return (
      <Card className="max-w-md mx-auto mt-10 border-destructive/50">
        <CardHeader className="text-center">
             <div className="mx-auto bg-destructive/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-destructive">Link Expirado</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
            <p className="mb-4">Este arquivo não está mais disponível.</p>
            <Button asChild variant="outline"><Link href="/dashboard">Ir para Dashboard</Link></Button>
        </CardContent>
      </Card>
    );
  }

  // 4. Verificação CRÍTICA do WhatsApp
  // Não confiamos apenas na sessão aqui, buscamos o user atualizado no banco
  // para garantir que o Modal suma imediatamente após o update.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { whatsapp: true } // Otimizado, pega só o campo necessário
  });

  const hasWhatsapp = !!user?.whatsapp;

  return (
    <>
      {/* Renderiza o Modal se NÃO tiver whatsapp */}
      <WhatsAppModal isOpen={!hasWhatsapp} />
      
      {/* Aplica blur e desabilita cliques se o modal estiver ativo */}
      <div className={!hasWhatsapp ? "blur-sm pointer-events-none select-none h-screen overflow-hidden" : ""}>
        <DownloadViewer 
            zipUrl={uploadSession.zipUrl} 
            title={uploadSession.title}
            expiresAt={uploadSession.expiresAt}
        />
        
        <div className="mt-8 max-w-4xl mx-auto flex justify-center pb-10">
            <DownloadActions 
                link={`${process.env.NEXTAUTH_URL}/download/${slug}`} 
                title={uploadSession.title || "Imagens"} 
            />
        </div>
      </div>
    </>
  );
}