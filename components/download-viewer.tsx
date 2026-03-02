"use client";

import { useEffect, useState } from "react";
import JSZip from "jszip";
import { Download, FileArchive, Loader2, AlertCircle, LockKeyhole, ShieldCheck, Check, Sparkles } from "lucide-react";
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
        const targetUrl = (isProtected && previewZipUrl) ? previewZipUrl : zipUrl;

        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error("Falha ao baixar arquivo");
        const blob = await response.blob();

        const zip = await JSZip.loadAsync(blob);
        const imageUrls: string[] = [];

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
    <div className="w-full bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-2xl overflow-hidden mt-8">
      {/* Top accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      {/* Header */}
      <div className="text-center border-b border-white/[0.06] pb-8 pt-6 px-6">
        <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-4 relative shadow-lg shadow-emerald-500/10">
          <FileArchive className="h-8 w-8 text-emerald-400" />
          {isProtected && keyState !== "SUCCESS" && (
            <div className="absolute -bottom-2 -right-2 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 backdrop-blur-sm">
              <LockKeyhole className="h-4 w-4 text-amber-500" />
            </div>
          )}
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white uppercase">{title || "Galeria de Imagens"}</h2>
        <p className="text-xs text-zinc-600 mt-2 font-medium uppercase tracking-wider">
          Expira em: <span className="text-zinc-400">{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(expiresAt))}</span>
        </p>
      </div>

      {/* Content */}
      <div className="p-6 md:p-10">
        {/* Protection Key Input */}
        {isProtected && keyState !== "SUCCESS" && (
          <div className="mb-10 p-8 bg-white/[0.02] border border-amber-500/20 rounded-2xl max-w-xl mx-auto text-center space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/[0.03] via-transparent to-transparent pointer-events-none" />
            <div className="flex justify-center mb-4 relative z-10">
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                <ShieldCheck className="h-8 w-8 text-amber-500" />
              </div>
            </div>
            <div className="relative z-10">
              <h4 className="text-xl font-black text-amber-400 uppercase tracking-tight">Galeria Protegida</h4>
              <p className="text-xs text-zinc-500 mt-2 max-w-md mx-auto leading-relaxed">
                As imagens abaixo contêm marca d&apos;água de proteção.
                Insira a <span className="font-bold text-amber-400">Chave de Liberação</span> para baixar o arquivo original completo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto pt-4 relative z-10">
              <Input
                placeholder="Cole sua chave aqui"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="bg-white/[0.03] border-amber-500/20 text-amber-400 placeholder:text-zinc-700 focus:border-amber-500/40 focus:ring-amber-500/20 text-center font-mono uppercase h-12 text-lg rounded-xl"
                disabled={keyState === "VERIFYING"}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyKey()}
              />
              <button
                onClick={handleVerifyKey}
                disabled={!keyInput.trim() || keyState === "VERIFYING"}
                className="h-12 px-8 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 transition-all sm:w-auto w-full disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center"
              >
                {keyState === "VERIFYING" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Desbloquear"}
              </button>
            </div>
            {keyState === "ERROR" && (
              <p className="text-sm text-red-400 font-bold relative z-10">{keyErrorMessage}</p>
            )}
          </div>
        )}

        {/* Success unlocked */}
        {isProtected && keyState === "SUCCESS" && (
          <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl max-w-lg mx-auto text-center flex items-center justify-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-full">
              <Check className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-left">
              <h4 className="font-black text-emerald-400 uppercase tracking-tight text-sm">Acesso Liberado!</h4>
              <p className="text-[11px] text-zinc-500">Você já pode baixar as fotos originais sem marca d&apos;água.</p>
            </div>
          </div>
        )}

        {/* Gallery */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-500/50" />
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider animate-pulse">Preparando galeria interativa...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
            <AlertCircle className="h-5 w-5 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-red-400 font-medium">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
            {images.map((src, idx) => (
              <div
                key={idx}
                className="aspect-square relative rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06]"
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
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center gap-4 border-t border-white/[0.06] p-8">
        {unlockedZipUrl ? (
          <a
            href={unlockedZipUrl}
            download
            className="inline-flex items-center justify-center gap-2 min-w-[280px] h-14 rounded-xl text-sm font-bold uppercase tracking-wider bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
          >
            <Download className="h-5 w-5" />
            Baixar Galeria Completa
          </a>
        ) : (
          <div className="inline-flex items-center justify-center gap-2 min-w-[280px] h-14 rounded-xl text-sm font-bold uppercase tracking-wider bg-white/[0.04] text-zinc-600 border border-white/[0.06] cursor-not-allowed">
            <LockKeyhole className="h-5 w-5" />
            Download Bloqueado
          </div>
        )}
        <p className="text-xs text-zinc-600 text-center font-medium">
          {images.length > 0 ? `${images.length} imagens processadas com sucesso.` : "Arquivo em alta resolução pronto para download."}
        </p>
      </div>
    </div>
  );
}