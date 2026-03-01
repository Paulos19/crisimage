"use client";

import { useEffect, useState } from "react";
import JSZip from "jszip";
import { Download, FileArchive, Loader2, Image as ImageIcon, AlertCircle, LockKeyhole, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { verifyAccessKey } from "@/actions/verify-key";

interface DownloadViewerProps {
  slug: string;
  zipUrl: string;
  previewZipUrl: string | null;
  title: string | null;
  expiresAt: Date;
  isProtected: boolean;
}

export function DownloadViewer({ slug, zipUrl, previewZipUrl, title, expiresAt, isProtected }: DownloadViewerProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [keyInput, setKeyInput] = useState("");
  const [keyState, setKeyState] = useState<"IDLE" | "VERIFYING" | "SUCCESS" | "ERROR">("IDLE");
  const [keyErrorMessage, setKeyErrorMessage] = useState("");
  const [unlockedZipUrl, setUnlockedZipUrl] = useState<string | null>(isProtected ? null : zipUrl);

  useEffect(() => {
    let active = true;

    async function fetchAndUnzip() {
      try {
        // 1. Baixar o arquivo ZIP (Prioriza o preview se for protegido, senão o original)
        const targetUrl = (isProtected && previewZipUrl) ? previewZipUrl : zipUrl;

        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error("Falha ao baixar arquivo");
        const blob = await response.blob();

        // 2. Ler o ZIP com JSZip
        const zip = await JSZip.loadAsync(blob);
        const imageUrls: string[] = [];

        // 3. Iterar e criar URLs para preview
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

    return () => {
      active = false;
      images.forEach(url => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipUrl, previewZipUrl, isProtected]);

  const handleVerifyKey = async () => {
    if (!keyInput.trim()) return;

    setKeyState("VERIFYING");
    setKeyErrorMessage("");

    const result = await verifyAccessKey(slug, keyInput.trim());

    if (result.error) {
      setKeyState("ERROR");
      setKeyErrorMessage(result.error);
    } else if (result.success && result.zipUrl) {
      setKeyState("SUCCESS");
      setUnlockedZipUrl(result.zipUrl);
    }
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center border-b bg-neutral-50/50 pb-8 pt-6">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 relative">
          <FileArchive className="h-8 w-8 text-primary" />
          {isProtected && keyState !== "SUCCESS" && (
            <div className="absolute -bottom-2 -right-2 bg-orange-100 p-1.5 rounded-full border border-orange-200">
              <LockKeyhole className="h-4 w-4 text-orange-600" />
            </div>
          )}
        </div>
        <CardTitle className="text-2xl">{title || "Galeria de Imagens"}</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Expira em: {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(expiresAt))}
        </p>
      </CardHeader>

      <CardContent className="p-6">
        {isProtected && keyState !== "SUCCESS" && (
          <div className="mb-8 p-6 bg-orange-50 border border-orange-200 rounded-xl max-w-lg mx-auto text-center space-y-4">
            <div className="flex justify-center mb-2">
              <ShieldCheck className="h-10 w-10 text-orange-500" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-orange-900">Galeria Protegida</h4>
              <p className="text-sm text-orange-800 mt-1">
                As imagens abaixo contêm marca d'água.
                Insira a <span className="font-semibold">Chave de Acesso</span> fornecida pelo fotógrafo para liberar o download em alta resolução livre de marcas.
              </p>
            </div>

            <div className="flex gap-2 max-w-sm mx-auto pt-2">
              <Input
                placeholder="Digite sua chave de acesso"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="bg-white border-orange-300 focus-visible:ring-orange-500 text-center font-mono uppercase"
                disabled={keyState === "VERIFYING"}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyKey()}
              />
              <Button
                onClick={handleVerifyKey}
                disabled={!keyInput.trim() || keyState === "VERIFYING"}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {keyState === "VERIFYING" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Desbloquear"}
              </Button>
            </div>
            {keyState === "ERROR" && (
              <p className="text-xs text-destructive font-medium">{keyErrorMessage}</p>
            )}
          </div>
        )}

        {isProtected && keyState === "SUCCESS" && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl max-w-lg mx-auto text-center flex items-center justify-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-green-900">Acesso Liberado!</h4>
              <p className="text-xs text-green-800">Você já pode baixar as fotos originais sem marca d'água.</p>
            </div>
          </div>
        )}

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
        <Button
          size="lg"
          className={`w-full md:w-auto min-w-[200px] ${isProtected && keyState !== "SUCCESS" ? "opacity-50 cursor-not-allowed" : ""}`}
          asChild={!!unlockedZipUrl}
          disabled={isProtected && keyState !== "SUCCESS"}
        >
          {unlockedZipUrl ? (
            <a href={unlockedZipUrl} download>
              <Download className="mr-2 h-5 w-5" />
              Baixar Originais
            </a>
          ) : (
            <span>
              <LockKeyhole className="mr-2 h-5 w-5" />
              Download Bloqueado
            </span>
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          {images.length > 0 ? `${images.length} imagens preparadas.` : "Arquivo pronto para download."}
          {isProtected && keyState !== "SUCCESS" && " É necessário a chave de acesso para baixar o arquivo completo sem marcas d'água."}
        </p>
      </CardFooter>
    </Card>
  );
}