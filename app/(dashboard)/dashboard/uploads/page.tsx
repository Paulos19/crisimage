import { RecentUploads } from "@/components/recent-uploads";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { Loader2, FileArchive } from "lucide-react";

export const metadata = {
    title: "Meus Uploads - Crisimage",
};

export default function UploadsPage() {
    return (
        <div className="max-w-5xl mx-auto pt-4">
            <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-primary/5 rounded-3xl flex flex-col overflow-hidden">
                <CardHeader className="pb-6 pt-8 px-8 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm">
                            <FileArchive className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight">Seus Uploads Ativos</CardTitle>
                            <CardDescription className="text-base mt-1 font-medium">Acompanhe e gerencie os links gerados para seus clientes. Válidos por 5 dias.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 px-4 py-8 md:px-8">
                    <Suspense fallback={
                        <div className="flex flex-col justify-center items-center py-20 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
                            <p className="text-sm font-medium text-muted-foreground">Carregando uploads...</p>
                        </div>
                    }>
                        <RecentUploads />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
