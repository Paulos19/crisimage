"use client";

import { useEffect, useState } from "react";
import JSZip from "jszip";
import { Download, FileArchive, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DownloadViewerProps {
  zipUrl: string;
  title: string | null;
  expiresAt: Date;
}

export function DownloadViewer({ zipUrl, title, expiresAt }: DownloadViewerProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchAndUnzip() {
      try {
        // 1. Baixar o arquivo ZIP
        const response = await fetch(zipUrl);
        if (!response.ok) throw new Error("Falha ao baixar arquivo");
        const blob = await response.blob();

        // 2. Ler o ZIP com JSZip
        const zip = await JSZip.loadAsync(blob);
        const imageUrls: string[] = [];

        // 3. Iterar e criar URLs para preview
        // Limitamos a preview para não travar o browser se forem imagens 4k gigantes
        const entries = Object.values(zip.files).filter(file => 
            !file.dir && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
        );

        for (const file of entries) {
            const fileData = await file.async("blob");
            const objectUrl = URL.createObjectURL(fileData);
            imageUrls.push(objectUrl);
        }

        if (active) {
          setImages(imageUrls);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (active) {
            setError("Não foi possível carregar a pré-visualização. Mas você ainda pode baixar o arquivo.");
            setLoading(false);
        }
      }
    }

    fetchAndUnzip();

    // Cleanup para evitar memory leaks dos ObjectURLs
    return () => {
      active = false;
      images.forEach(url => URL.revokeObjectURL(url));
    };
  }, [zipUrl]); // Dependência correta

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center border-b bg-neutral-50/50 pb-8 pt-6">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <FileArchive className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">{title || "Galeria de Imagens"}</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Expira em: {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(expiresAt))}
        </p>
      </CardHeader>

      <CardContent className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Descompactando para visualização...</p>
          </div>
        ) : error ? (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro na visualização</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((src, idx) => (
              <div key={idx} className="aspect-square relative rounded-md overflow-hidden border bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={src} 
                    alt={`Preview ${idx}`} 
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" 
                    loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-4 border-t bg-neutral-50/50 p-6">
        <Button size="lg" className="w-full md:w-auto min-w-[200px]" asChild>
            <a href={zipUrl} download>
                <Download className="mr-2 h-5 w-5" />
                Baixar ZIP Completo
            </a>
        </Button>
        <p className="text-xs text-muted-foreground">
            {images.length > 0 ? `${images.length} imagens encontradas no arquivo.` : "Arquivo pronto para download."}
        </p>
      </CardFooter>
    </Card>
  );
}