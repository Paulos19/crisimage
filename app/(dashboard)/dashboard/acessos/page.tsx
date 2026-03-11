import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActivitySquare, Globe, EyeOff, Smartphone, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

export const metadata = {
    title: "Acessos aos Links - LetImage",
};

export default async function AcessosPage() {
    const session = await auth();

    if (!session?.user?.id) return null;

    const accesses = await prisma.linkAccess.findMany({
        where: {
            uploadSession: {
                userId: session.user.id
            }
        },
        include: {
            uploadSession: {
                select: { title: true, slug: true }
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 50
    });

    return (
        <div className="max-w-5xl mx-auto pt-4 space-y-6">
            {/* Back link */}
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-600 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar ao Dashboard
            </Link>

            <div className="relative bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                {/* Top accent line */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

                {/* Header */}
                <div className="px-6 md:px-8 py-7 border-b border-zinc-100 dark:border-white/[0.06]">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                            <ActivitySquare className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
                                Relatório de Acessos
                            </h2>
                            <p className="text-sm text-zinc-500 mt-0.5 font-medium">
                                Veja quem e quando seus links públicos foram acessados.
                            </p>
                        </div>
                    </div>
                </div>

                {accesses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-400 dark:text-zinc-600">
                        <EyeOff className="h-12 w-12 mb-4 opacity-20" />
                        <p className="font-bold uppercase tracking-wide text-sm">Nenhum acesso registrado ainda.</p>
                        <p className="text-xs mt-1 text-zinc-400 dark:text-zinc-700">Envie o link para seus clientes e os acessos aparecerão aqui!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-zinc-100 dark:border-white/[0.04]">
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">Galeria / Título</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">Data e Hora</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">IP / Identificador</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">Cliente (WhatsApp)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-white/[0.04]">
                                {accesses.map((access) => (
                                    <tr key={access.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                                            {access.uploadSession.title || "Sem título"}
                                            <span className="text-[10px] text-zinc-400 dark:text-zinc-600 ml-2 font-mono">
                                                ({access.uploadSession.slug.substring(0, 6)})
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">
                                            {format(new Date(access.createdAt), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500 flex items-center gap-2">
                                            <Globe className="h-3 w-3 text-zinc-400 dark:text-zinc-700" />
                                            {access.ip || "Desconhecido"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {access.whatsapp ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                                                    <Smartphone className="h-3 w-3" />
                                                    {access.whatsapp}
                                                </span>
                                            ) : (
                                                <span className="text-zinc-400 dark:text-zinc-700 italic text-xs">Anônimo</span>
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
