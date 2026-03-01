import { UploadZone } from "@/components/upload-zone";
import { RecentUploads } from "@/components/recent-uploads";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { Loader2, Zap, History } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="grid gap-6 xl:gap-8 md:grid-cols-12 lg:grid-cols-12 pt-4">
            {/* Coluna Principal - Upload (Ocupa 8 colunas em telas grandes) */}
            <div className="md:col-span-12 lg:col-span-8">
                <Card className="h-full border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
                    <CardHeader className="pb-6 pt-8 px-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <Zap className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold tracking-tight">Nova Compactação</CardTitle>
                                <CardDescription className="text-base text-muted-foreground mt-1">
                                    Selecione até 50 imagens. Elas serão unificadas em um único arquivo de alta performance.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <UploadZone />
                    </CardContent>
                </Card>
            </div>

            {/* Coluna Lateral - Histórico (Ocupa 4 colunas) */}
            <div className="md:col-span-12 lg:col-span-4">
                <Card className="h-full border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-primary/5 rounded-3xl flex flex-col overflow-hidden">
                    <CardHeader className="pb-6 pt-8 px-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <History className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight">Uploads Ativos</CardTitle>
                                <CardDescription className="text-sm mt-1">Links válidos por 5 dias</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto max-h-[600px] px-8 pb-8 custom-scrollbar">
                        <Suspense fallback={
                            <div className="flex justify-center p-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                            </div>
                        }>
                            <RecentUploads />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}