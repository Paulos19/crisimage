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
    <Card className="w-full shadow-2xl border-none bg-white/90 dark:bg-card/90 backdrop-blur-md rounded-3xl overflow-hidden mt-8">
      <CardHeader className="text-center border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30 pb-8 pt-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-indigo-500/20 rounded-2xl flex items-center justify-center mb-4 relative shadow-sm">
          <FileArchive className="h-8 w-8 text-primary" />
          {isProtected && keyState !== "SUCCESS" && (
            <div className="absolute -bottom-2 -right-2 bg-orange-100 dark:bg-orange-500/20 p-2 rounded-xl border border-orange-200 dark:border-orange-500/30 shadow-sm backdrop-blur-sm">
              <LockKeyhole className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          )}
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">{title || "Galeria de Imagens"}</CardTitle>
        <p className="text-sm text-muted-foreground mt-2 font-medium">
          Expira em: <span className="text-foreground">{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(expiresAt))}</span>
        </p>
      </CardHeader>

      <CardContent className="p-6 md:p-10">
        {isProtected && keyState !== "SUCCESS" && (
          <div className="mb-10 p-8 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-background border border-orange-200/60 dark:border-orange-900/50 rounded-3xl max-w-xl mx-auto text-center space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-orange-300/10 via-transparent to-transparent pointer-events-none" />
            <div className="flex justify-center mb-4 relative z-10">
              <div className="p-3 bg-white dark:bg-orange-900/30 rounded-2xl shadow-sm border border-orange-100 dark:border-orange-800">
                <ShieldCheck className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <div className="relative z-10">
              <h4 className="text-xl font-bold text-orange-900 dark:text-orange-400">Galeria Protegida</h4>
              <p className="text-sm text-orange-800/80 dark:text-orange-300/80 mt-2 max-w-md mx-auto leading-relaxed">
                As imagens abaixo contêm marca d'água de proteção.
                Insira a <span className="font-bold text-orange-900 dark:text-orange-300">Chave de Liberação</span> para baixar o arquivo original completo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto pt-4 relative z-10">
              <Input
                placeholder="Cole sua chave aqui"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="bg-white/80 dark:bg-black/50 backdrop-blur border-orange-200 dark:border-orange-800 focus-visible:ring-orange-500 text-center font-mono uppercase h-12 text-lg rounded-xl shadow-inner"
                disabled={keyState === "VERIFYING"}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyKey()}
              />
              <Button
                onClick={handleVerifyKey}
                disabled={!keyInput.trim() || keyState === "VERIFYING"}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white h-12 px-8 rounded-xl shadow-lg shadow-orange-500/20 transition-all sm:w-auto w-full font-bold"
              >
                {keyState === "VERIFYING" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Desbloquear"}
              </Button>
            </div>
            {keyState === "ERROR" && (
              <p className="text-sm text-destructive font-medium animate-in fade-in slide-in-from-top-2 relative z-10">{keyErrorMessage}</p>
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
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary/50" />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Preparando galeria interativa...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="max-w-md mx-auto rounded-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro na visualização</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
            {images.map((src, idx) => (
              <div
                key={idx}
                className="aspect-square relative rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-sm border border-black/5 dark:border-white/5 animate-in fade-in zoom-in-95 duration-1000 fill-mode-both"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Preview ${idx}`}
                  className="object-cover w-full h-full hover:scale-110 transition-transform duration-700 cursor-pointer"
                  loading="lazy"
                />
                {isProtected && keyState !== "SUCCESS" && (
                  <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-4 border-t border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30 p-8">
        <Button
          size="lg"
          className={`w-full md:w-auto min-w-[280px] h-14 rounded-2xl text-base font-bold shadow-lg transition-all ${isProtected && keyState !== "SUCCESS" ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 cursor-not-allowed shadow-none" : "bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-600/95 shadow-primary/20 hover:-translate-y-1"}`}
          asChild={!!unlockedZipUrl}
          disabled={isProtected && keyState !== "SUCCESS"}
        >
          {unlockedZipUrl ? (
            <a href={unlockedZipUrl} download>
              <Download className="mr-2 h-6 w-6" />
              Baixar Galeria Completa
            </a>
          ) : (
            <span>
              <LockKeyhole className="mr-2 h-5 w-5" />
              Download Bloqueado
            </span>
          )}
        </Button>
        <p className="text-sm text-muted-foreground text-center font-medium">
          {images.length > 0 ? `${images.length} imagens processadas com sucesso.` : "Arquivo em alta resolução pronto para download."}
        </p>
      </CardFooter>
    </Card>
  );
}