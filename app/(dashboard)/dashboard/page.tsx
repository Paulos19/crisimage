import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, DownloadCloud, Fingerprint, Eye, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Visão Geral - Crisimage",
};

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) return null;

    // 1. Busca os últimos uploads ativos para a tabela rápida
    const recentUploads = await prisma.uploadSession.findMany({
        where: {
            userId: session.user.id,
            expiresAt: {
                gt: new Date() // Só os não expirados
            }
        },
        orderBy: { createdAt: "desc" },
        take: 5
    });

    // 2. Conta arquivos totais (ativos)
    const totalActiveUploads = await prisma.uploadSession.count({
        where: {
            userId: session.user.id,
            expiresAt: { gt: new Date() }
        }
    });

    // 3. Conta acessos totais neste mês (simplificado para "Total de Cliques nos Links")
    const totalAccesses = await prisma.linkAccess.count({
        where: {
            uploadSession: {
                userId: session.user.id
            }
        }
    });

    return (
        <div className="space-y-6">
            {/* Título da Página */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Visão Geral</h2>
                    <p className="text-muted-foreground mt-1">Acompanhe as métricas de entrega do seu estúdio.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white shadow-lg shadow-primary/20 rounded-xl transition-all">
                        <Link href="/dashboard/upload">
                            <DownloadCloud className="w-4 h-4 mr-2" />
                            Nova Compactação
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Cards de Métricas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Card 1: Downloads Ativos */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-primary/5 rounded-2xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Fingerprint className="w-16 h-16 text-primary" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pacotes Ativos</CardTitle>
                        <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                            <FileArchive className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalActiveUploads}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> expirando em até 5 dias
                        </p>
                    </CardContent>
                </Card>

                {/* Card 2: Acessos Totais */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-primary/5 rounded-2xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Eye className="w-16 h-16 text-emerald-500" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Cliques (Acessos Púbicos)</CardTitle>
                        <div className="h-8 w-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <ActivitySquare className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalAccesses}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Visitas de clientes em seus links gerados.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabela de Disparo Rápido (Pacotes Ativos) */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
                <CardHeader className="bg-neutral-50/50 dark:bg-neutral-900/30 border-b border-border/40 px-6 py-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                Acesso Rápido a Códigos
                            </CardTitle>
                            <CardDescription className="font-medium mt-1">
                                Copie a senha dos seus 5 últimos envios ativos para enviar ao comprador.
                            </CardDescription>
                        </div>
                        <Button asChild variant="outline" size="sm" className="rounded-xl shrink-0">
                            <Link href="/dashboard/uploads">Ver Todos <ArrowRight className="w-4 h-4 ml-1" /></Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {recentUploads.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <HelpCircle className="h-10 w-10 mb-3 opacity-20" />
                            <p className="font-medium">Você ainda não tem pacotes ativos.</p>
                            <Button asChild variant="link" className="mt-2 text-primary">
                                <Link href="/dashboard/upload">Fazer o primeiro upload!</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-neutral-100/30 dark:bg-neutral-900/20">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Galeria</th>
                                        <th className="px-6 py-4 font-semibold">Criação</th>
                                        <th className="px-6 py-4 font-semibold">Expiração</th>
                                        <th className="px-6 py-4 font-semibold text-right">Chave de Liberação (Senha)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {recentUploads.map((upload) => (
                                        <tr key={upload.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors group">
                                            <td className="px-6 py-4 font-bold text-foreground">
                                                {upload.title || "Pacote de Imagens"}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {format(new Date(upload.createdAt), "dd MMM, HH:mm", { locale: ptBR })}
                                            </td>
                                            <td className="px-6 py-4 text-orange-600 dark:text-orange-400 font-medium">
                                                {format(new Date(upload.expiresAt), "dd MMM, HH:mm", { locale: ptBR })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {upload.accessKey ? (
                                                    <div className="inline-flex items-center justify-end w-full">
                                                        <span className="font-mono bg-neutral-200 dark:bg-neutral-800 px-3 py-1.5 rounded-md text-foreground tracking-wider font-semibold border border-neutral-300 dark:border-neutral-700 shadow-inner select-all">
                                                            {upload.accessKey}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground/50 italic text-xs">Sem proteção</span>
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

// Imports faltantes no inicio do arquivo que usamos nos cards:
import { FileArchive, ActivitySquare } from "lucide-react";
