import { UploadZone } from "@/components/upload-zone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Coluna Principal - Upload */}
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Nova Compactação</CardTitle>
                    <CardDescription>
                        Selecione até 50 imagens. Elas serão unificadas em um único arquivo ZIP.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UploadZone />
                </CardContent>
            </Card>
        </div>

        {/* Coluna Lateral - Histórico (Placeholder) */}
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Seus Uploads</CardTitle>
                    <CardDescription>Últimas 72 horas</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        A lista de uploads aparecerá aqui.
                    </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}