import { UploadZone } from "@/components/upload-zone";
import { RecentUploads } from "@/components/recent-uploads";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-12 lg:grid-cols-12">
        {/* Coluna Principal - Upload (Ocupa 8 colunas em telas grandes) */}
        <div className="md:col-span-7 lg:col-span-8">
            <Card className="h-full border-neutral-200 dark:border-neutral-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Nova Compactação</CardTitle>
                    <CardDescription>
                        Selecione até 50 imagens. Elas serão unificadas em um único arquivo ZIP.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UploadZone />
                </CardContent>
            </Card>
        </div>

        {/* Coluna Lateral - Histórico (Ocupa 4 colunas) */}
        <div className="md:col-span-5 lg:col-span-4">
            <Card className="h-full border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Seus Uploads Ativos</CardTitle>
                    <CardDescription>Links válidos por 72h</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto max-h-[600px] pr-2">
                    <Suspense fallback={
                        <div className="flex justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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