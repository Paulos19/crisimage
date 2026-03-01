import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivitySquare, Globe, EyeOff, Smartphone } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const metadata = {
    title: "Acessos aos Links - Crisimage",
};

export default async function AcessosPage() {
    const session = await auth();

    if (!session?.user?.id) return null;

    // Busca os últimos 50 acessos dos links deste usuário
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
        <div className="max-w-5xl mx-auto pt-4">
            <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-primary/5 rounded-3xl flex flex-col overflow-hidden">
                <CardHeader className="pb-6 pt-8 px-8 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm">
                            <ActivitySquare className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight">Relatório de Acessos</CardTitle>
                            <CardDescription className="text-base mt-1 font-medium">Veja quem ou quando seus links públicos foram acessados e desbloqueados.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {accesses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <EyeOff className="h-12 w-12 mb-4 opacity-20" />
                            <p>Nenhum acesso registrado ainda.</p>
                            <p className="text-sm mt-1 opacity-70">Envie o link para seus clientes e os acessos aparecerão aqui!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-neutral-100/50 dark:bg-neutral-900/50 border-b border-border/40">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Galeria / Título</th>
                                        <th className="px-6 py-4 font-semibold">Data e Hora</th>
                                        <th className="px-6 py-4 font-semibold">IP / Identificador</th>
                                        <th className="px-6 py-4 font-semibold">Cliente (WhatsApp)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {accesses.map((access) => (
                                        <tr key={access.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors">
                                            <td className="px-6 py-4 font-medium text-foreground">
                                                {access.uploadSession.title || "Sem título"}
                                                <span className="text-xs text-muted-foreground ml-2 font-mono">({access.uploadSession.slug.substring(0, 6)})</span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                                {format(new Date(access.createdAt), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground flex items-center gap-2">
                                                <Globe className="h-3 w-3 opacity-50" />
                                                {access.ip || "Desconhecido"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {access.whatsapp ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 font-medium text-xs border border-green-200 dark:border-green-800">
                                                        <Smartphone className="h-3 w-3" />
                                                        {access.whatsapp}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground/50 italic text-xs">Anônimo visitante</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
