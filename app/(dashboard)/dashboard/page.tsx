import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, DownloadCloud, Fingerprint, Eye, ArrowRight, ShieldCheck, HelpCircle, FileArchive, ActivitySquare, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Visão Geral - Crisimage",
};

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const recentUploads = await prisma.uploadSession.findMany({
        where: {
            userId: session.user.id,
            expiresAt: { gt: new Date() }
        },
        orderBy: { createdAt: "desc" },
        take: 5
    });

    const totalActiveUploads = await prisma.uploadSession.count({
        where: {
            userId: session.user.id,
            expiresAt: { gt: new Date() }
        }
    });

    const totalAccesses = await prisma.linkAccess.count({
        where: {
            uploadSession: {
                userId: session.user.id
            }
        }
    });

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-px w-8 bg-gradient-to-r from-emerald-500 to-transparent" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400">
                            // Dashboard
                        </span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-white uppercase">Visão Geral</h2>
                    <p className="text-sm text-zinc-500 mt-1 font-medium uppercase tracking-wider">
                        Acompanhe as métricas de entrega do seu estúdio.
                    </p>
                </div>
                <Link
                    href="/dashboard/upload"
                    className="group inline-flex items-center gap-2 text-sm font-bold bg-emerald-500 text-black rounded-full px-6 py-3 hover:bg-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
                >
                    <DownloadCloud className="w-4 h-4" />
                    Nova Compactação
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {/* Metric Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Card 1: Active Packages */}
                <div className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-emerald-500/10 transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 right-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity">
                        <FileArchive className="w-20 h-20 text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Pacotes Ativos</span>
                        <div className="h-9 w-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                            <FileArchive className="h-4 w-4 text-emerald-400" />
                        </div>
                    </div>
                    <div className="text-4xl font-black text-white mb-1">{totalActiveUploads}</div>
                    <p className="text-xs text-zinc-600 font-medium flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> expirando em até 5 dias
                    </p>
                </div>

                {/* Card 2: Total Accesses */}
                <div className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-emerald-500/10 transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 right-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity">
                        <Eye className="w-20 h-20 text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Cliques (Acessos)</span>
                        <div className="h-9 w-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                            <ActivitySquare className="h-4 w-4 text-emerald-400" />
                        </div>
                    </div>
                    <div className="text-4xl font-black text-white mb-1">{totalAccesses}</div>
                    <p className="text-xs text-zinc-600 font-medium">
                        Visitas de clientes em seus links gerados.
                    </p>
                </div>

                {/* Card 3: Performance indicator */}
                <div className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-emerald-500/10 transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 right-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity">
                        <TrendingUp className="w-20 h-20 text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Taxa de Entrega</span>
                        <div className="h-9 w-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                        </div>
                    </div>
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-600 mb-1">100%</div>
                    <p className="text-xs text-zinc-600 font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-emerald-500" /> Entrega perfeita garantida
                    </p>
                </div>
            </div>

            {/* Recent Uploads Table */}
            <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                {/* Table header */}
                <div className="px-6 py-5 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            Acesso Rápido a Códigos
                        </h3>
                        <p className="text-xs text-zinc-600 font-medium mt-1 uppercase tracking-wider">
                            Copie a senha dos seus 5 últimos envios ativos
                        </p>
                    </div>
                    <Link
                        href="/dashboard/uploads"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider"
                    >
                        Ver Todos <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {recentUploads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
                        <HelpCircle className="h-10 w-10 mb-3 opacity-20" />
                        <p className="font-bold uppercase tracking-wide text-sm">Você ainda não tem pacotes ativos.</p>
                        <Link
                            href="/dashboard/upload"
                            className="mt-3 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                            Fazer o primeiro upload →
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-white/[0.04]">
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Galeria</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Criação</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Expiração</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 text-right">Chave de Liberação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {recentUploads.map((upload) => (
                                    <tr key={upload.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 font-bold text-white">
                                            {upload.title || "Pacote de Imagens"}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500">
                                            {format(new Date(upload.createdAt), "dd MMM, HH:mm", { locale: ptBR })}
                                        </td>
                                        <td className="px-6 py-4 text-amber-500 font-medium">
                                            {format(new Date(upload.expiresAt), "dd MMM, HH:mm", { locale: ptBR })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {upload.accessKey ? (
                                                <span className="inline-flex font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-emerald-400 tracking-wider font-bold text-xs select-all">
                                                    {upload.accessKey}
                                                </span>
                                            ) : (
                                                <span className="text-zinc-700 italic text-xs">Sem proteção</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
