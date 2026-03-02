import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { DownloadViewer } from "@/components/download-viewer";
import { WhatsAppModal } from "@/components/whatsapp-modal";
import { Clock, MessageCircle, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { DownloadActions } from "@/components/download-actions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DownloadPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/download/${slug}`);
  }

  const uploadSession = await prisma.uploadSession.findUnique({
    where: { slug },
    include: {
      user: {
        select: { name: true, whatsapp: true }
      }
    }
  });

  if (!uploadSession) return notFound();

  const isExpired = new Date() > new Date(uploadSession.expiresAt);
  if (isExpired) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4 selection:bg-emerald-500/30">
        <div className="max-w-md w-full mx-auto relative bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
          {/* Top danger accent */}
          <div className="h-1 w-full bg-gradient-to-r from-red-500 via-red-400 to-red-500" />

          <div className="text-center pt-10 pb-6 px-8">
            <div className="mx-auto bg-red-500/10 w-20 h-20 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-500/5">
              <Clock className="h-10 w-10 text-red-400 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white uppercase">Galeria Expirada</h2>
            <p className="text-sm text-zinc-500 mt-2 font-medium">
              O prazo de 5 dias para download das fotos em alta resolução expirou de forma segura.
            </p>
          </div>

          <div className="px-8 pb-10 space-y-5">
            <div className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-white">
                <AlertCircle className="w-5 h-5 text-zinc-400" />
                <span>Deseja recuperar o acesso?</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed text-center">
                Para sua segurança, os arquivos originais foram bloqueados.
                Entre em contato com <span className="font-bold text-white">{uploadSession.user.name || "o fotógrafo"}</span> para solicitar um novo pacote.
              </p>
              {uploadSession.user.whatsapp ? (
                <a
                  href={`https://wa.me/55${uploadSession.user.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! O link da minha galeria "${uploadSession.title}" expirou. Você poderia gerar um novo link de acesso, por favor?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-12 bg-emerald-500 text-black font-bold rounded-xl text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <MessageCircle className="h-5 w-5" />
                  Falar via WhatsApp
                </a>
              ) : (
                <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-center">
                  <p className="text-xs text-zinc-600 italic">
                    O fotógrafo não possui WhatsApp cadastrado.
                  </p>
                </div>
              )}
            </div>
            <Link
              href="/dashboard"
              className="flex items-center justify-center w-full h-12 rounded-xl text-sm font-bold text-zinc-500 border border-white/[0.06] hover:bg-white/[0.03] hover:text-white transition-all"
            >
              Voltar para o Início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const loggedInUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { whatsapp: true }
  });

  const hasWhatsapp = !!loggedInUser?.whatsapp;

  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || "Desconhecido";
    const userAgent = headersList.get('user-agent') || "Desconhecido";

    await prisma.linkAccess.create({
      data: {
        uploadSessionId: uploadSession.id,
        ip: ip.split(',')[0].trim(),
        userAgent: userAgent.substring(0, 190),
        whatsapp: loggedInUser?.whatsapp || null,
      }
    });
  } catch (error) {
    console.error("Falha ao registrar acesso:", error);
  }

  const isProtected = !!uploadSession.accessKey;

  return (
    <>
      <WhatsAppModal isOpen={!hasWhatsapp} />

      <div className={`min-h-screen bg-[#080808] selection:bg-emerald-500/30 ${!hasWhatsapp ? "blur-md pointer-events-none select-none h-screen overflow-hidden" : ""}`}>

        {/* Cinematic Header */}
        <div className="relative h-[40vh] min-h-[300px] w-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-[#0a0a0a]/60 to-[#080808] z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-[#0a0a0a] to-[#0a0a0a]" />

          {/* Ambient glows */}
          <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-emerald-900/[0.06] rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-teal-900/[0.04] rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 py-1.5 px-4 text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] backdrop-blur-md mb-2">
              <Sparkles className="w-3 h-3 mr-2" />
              Galeria Protegida
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase drop-shadow-2xl">
              {uploadSession.title || "Sua Galeria"}
            </h1>
            <p className="text-base md:text-lg text-zinc-500 font-medium uppercase tracking-wider">
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