import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Camera, Calendar, ArrowRight, Sparkles, ExternalLink, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

interface PortfolioPageProps {
    params: Promise<{ userId: string }>;
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
    const { userId } = await params;

    const photographer = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, image: true, role: true }
    });

    if (!photographer) return notFound();

    const activeGalleries = await prisma.uploadSession.findMany({
        where: {
            userId: userId,
            expiresAt: { gt: new Date() }
        },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="min-h-screen bg-[#080808] text-white selection:bg-emerald-500/30 pb-20">
            {/* Hero Header */}
            <div className="relative h-[40vh] min-h-[300px] w-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-[#0a0a0a]/60 to-[#080808] z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#0a0a0a] to-[#0a0a0a]" />

                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-4">
                    <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 py-1.5 px-4 text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] backdrop-blur-md mb-2">
                        <Camera className="w-3 h-3 mr-2" />
                        Portfólio Profissional
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase drop-shadow-2xl">
                        {photographer.name || "Fotógrafo"}
                    </h1>
                    <p className="text-base md:text-lg text-zinc-500 font-medium uppercase tracking-wider">
                        Explorar Galerias Ativas
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-30">
                <div className="max-w-5xl mx-auto">
                    {activeGalleries.length === 0 ? (
                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-20 text-center backdrop-blur-md">
                            <ImageIcon className="w-16 h-16 text-zinc-700 mx-auto mb-6 opacity-20" />
                            <h3 className="text-xl font-bold uppercase tracking-tight text-white">Nenhuma galeria ativa</h3>
                            <p className="text-sm text-zinc-500 mt-2 font-medium uppercase tracking-wider">
                                Este profissional não possui entregas públicas no momento.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeGalleries.map((gallery) => (
                                <Link
                                    key={gallery.id}
                                    href={`/download/${gallery.slug}`}
                                    className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.04] hover:border-emerald-500/20 transition-all duration-500 overflow-hidden flex flex-col justify-between"
                                >
                                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                                                <Calendar className="h-5 w-5 text-emerald-400" />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                                                Expira em: {format(new Date(gallery.expiresAt), "dd MMM", { locale: ptBR })}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-emerald-400 transition-colors">
                                            {gallery.title || "Galeria de Imagens"}
                                        </h3>
                                        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-8">
                                            {format(new Date(gallery.createdAt), "MMMM 'de' yyyy", { locale: ptBR })}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mt-auto">
                                        Acessar Galeria <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Branding */}
            <footer className="mt-20 text-center">
                <div className="flex items-center justify-center gap-2 text-zinc-600">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Entregue via LetImage</span>
                </div>
            </footer>
        </div>
    );
}
