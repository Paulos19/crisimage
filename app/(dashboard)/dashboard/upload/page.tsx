import { UploadZone } from "@/components/upload-zone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

export const metadata = {
    title: "Nova Compactação - Crisimage",
};

export default function UploadPage() {
    return (
        <div className="max-w-4xl mx-auto pt-4">
            <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
                <CardHeader className="pb-6 pt-8 px-8 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm">
                            <Zap className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight">Nova Compactação</CardTitle>
                            <CardDescription className="text-base text-muted-foreground mt-1 font-medium">
                                Selecione até 50 imagens. Elas serão unificadas em um único arquivo protegido e de alta performance.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-4 py-8 md:px-10">
                    <UploadZone />
                </CardContent>
            </Card>
        </div>
    );
}
