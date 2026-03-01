import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { DownloadViewer } from "@/components/download-viewer";
import { WhatsAppModal } from "@/components/whatsapp-modal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MessageCircle } from "lucide-react";
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
      <Card className="max-w-md mx-auto mt-10 border-destructive/50 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-destructive text-2xl">Arquivo Expirado</CardTitle>
          <CardDescription className="text-base mt-2">
            O prazo de 5 dias para download das fotos expirou.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-1">Deseja solicitar um novo link?</p>
            <p className="text-xs text-muted-foreground mb-4">
              Entre em contato diretamente com {uploadSession.user.name || "o fotógrafo"}.
            </p>
            {uploadSession.user.whatsapp ? (
              <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                <a
                  href={`https://wa.me/55${uploadSession.user.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá, o link da minha galeria "${uploadSession.title}" expirou. Poderia gerar um novo?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Falar no WhatsApp
                </a>
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                Não há número de WhatsApp cadastrado.
              </p>
            )}
          </div>
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard">Voltar para o Início</Link>
          </Button>
        </CardContent>
      </Card>
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

      <div className={!hasWhatsapp ? "blur-sm pointer-events-none select-none h-screen overflow-hidden" : ""}>
        <DownloadViewer
          slug={uploadSession.slug}
          zipUrl={uploadSession.zipUrl}
          previewZipUrl={uploadSession.previewZipUrl}
          title={uploadSession.title}
          expiresAt={uploadSession.expiresAt}
          isProtected={isProtected}
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