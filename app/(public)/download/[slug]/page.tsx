import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { DownloadViewer } from "@/components/download-viewer";
import { WhatsAppModal } from "@/components/whatsapp-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import Link from "next/link";
import { DownloadActions } from "@/components/download-actions"; // Criaremos abaixo

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DownloadPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();

  // 1. Gate de Segurança: Login Obrigatório
  if (!session?.user) {
    redirect(`/login?callbackUrl=/download/${slug}`);
  }

  // 2. Busca Dados
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

  // 4. Verificação do WhatsApp (Lógica do Modal)
  const hasWhatsapp = !!session.user.whatsapp;

  return (
    <>
      <WhatsAppModal isOpen={!hasWhatsapp} />
      
      {/* Só renderiza o conteúdo se tiver WhatsApp, visualmente fica bloqueado pelo modal, mas protegemos aqui também se quiser */}
      <div className={!hasWhatsapp ? "blur-sm pointer-events-none" : ""}>
        <DownloadViewer 
            zipUrl={uploadSession.zipUrl} 
            title={uploadSession.title}
            expiresAt={uploadSession.expiresAt}
        />
        
        {/* Componente Client-Side para os botões de ação */}
        <div className="mt-8 max-w-4xl mx-auto flex justify-center">
            <DownloadActions 
                link={`${process.env.NEXTAUTH_URL}/download/${slug}`} 
                title={uploadSession.title || "Imagens"} 
            />
        </div>
      </div>
    </>
  );
}