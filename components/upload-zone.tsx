"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { upload } from "@vercel/blob/client";
import { createUploadSession } from "@/actions/create-session";
import { QRCodeSVG } from "qrcode.react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileIcon, Loader2, UploadCloud, X, Copy, Check, Shield, ImagePlus, ArrowRight, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UploadZone() {
  const [files, setFiles] = useState<File[]>([]);
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"IDLE" | "PROCESSING_WATERMARKS" | "ZIPPING" | "UPLOADING" | "SAVING">("IDLE");
  const [progress, setProgress] = useState(0);

  const [successData, setSuccessData] = useState<{ slug: string; link: string; accessKey?: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const watermarkInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 50) {
      alert("Máximo de 50 imagens permitidas!");
      return;
    }
    setFiles((prev) => [...prev, ...acceptedFiles].slice(0, 50));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 50,
  });

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleWatermarkSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setWatermarkFile(e.target.files[0]);
    }
  };

  const copyToClipboard = (text: string, isKey: boolean = false) => {
    navigator.clipboard.writeText(text);
    if (isKey) {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const applyWatermark = async (originalFile: File, wmFile: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const wmImg = new Image();

      const imgUrl = URL.createObjectURL(originalFile);
      const wmUrl = URL.createObjectURL(wmFile);

      img.onload = () => {
        wmImg.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("Canvas não suportado");

          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0);

          ctx.globalAlpha = 0.4;
          const wmWidth = img.width * 0.5;
          const wmHeight = (wmImg.height / wmImg.width) * wmWidth;
          const x = (img.width - wmWidth) / 2;
          const y = (img.height - wmHeight) / 2;

          ctx.drawImage(wmImg, x, y, wmWidth, wmHeight);

          canvas.toBlob((blob) => {
            URL.revokeObjectURL(imgUrl);
            URL.revokeObjectURL(wmUrl);
            if (blob) resolve(blob);
            else reject("Erro ao gerar blob");
          }, "image/jpeg", 0.7);
        };
        wmImg.src = wmUrl;
      };
      img.src = imgUrl;
    });
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    if (!title.trim()) {
      alert("Dê um título para sua galeria!");
      return;
    }

    try {
      let previewZipBlob: Blob | null = null;
      let generateAccessKey = false;
      const accessKey = watermarkFile ? Math.random().toString(36).slice(-8).toUpperCase() : undefined;

      if (watermarkFile) {
        setStatus("PROCESSING_WATERMARKS");
        generateAccessKey = true;
        const previewZip = new JSZip();

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const watermarkedBlob = await applyWatermark(file, watermarkFile);
          previewZip.file(file.name, watermarkedBlob);
          setProgress(((i + 1) / files.length) * 100);
        }

        previewZipBlob = await previewZip.generateAsync({ type: "blob", compression: "STORE" });
      }

      setStatus("ZIPPING");
      setProgress(0);
      const originalZip = new JSZip();

      files.forEach((file) => {
        originalZip.file(file.name, file);
      });

      const originalZipBlob = await originalZip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 }
      }, (metadata) => {
        setProgress(metadata.percent);
      });

      setStatus("UPLOADING");
      setProgress(0);

      const baseFilename = title.replace(/\s+/g, '-').toLowerCase() + `-${Date.now()}`;

      const originalBlob = await upload(`${baseFilename}-original.zip`, originalZipBlob, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        onUploadProgress: (progressEvent) => {
          const target = watermarkFile ? 50 : 100;
          setProgress(progressEvent.percentage * (target / 100));
        }
      });

      let previewUploadUrl: string | undefined = undefined;
      if (previewZipBlob) {
        const previewBlobResult = await upload(`${baseFilename}-preview.zip`, previewZipBlob, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          onUploadProgress: (progressEvent) => {
            setProgress(50 + (progressEvent.percentage * 0.5));
          }
        });
        previewUploadUrl = previewBlobResult.url;
      }

      setStatus("SAVING");
      const result = await createUploadSession(
        originalBlob.url,
        title,
        previewUploadUrl,
        accessKey
      );

      if (result.success) {
        const link = `${window.location.origin}/download/${result.success}`;

        setSuccessData({
          slug: result.success!,
          link,
          accessKey
        });

        setStatus("IDLE");
        setFiles([]);
        setWatermarkFile(null);
        setTitle("");
      } else {
        alert("Erro ao salvar sessão: " + result.error);
        setStatus("IDLE");
      }

    } catch (error) {
      console.error(error);
      alert("Erro no processo. Tente novamente.");
      setStatus("IDLE");
    }
  };

  // --- Success Screen ---
  if (successData) {
    return (
      <div className="flex flex-col items-center space-y-6 text-center py-4">
        <div className="space-y-2">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/20">
            <Sparkles className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
          </div>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">Arquivo Pronto!</h3>
          <p className="text-sm text-zinc-500 font-medium">Envie o link para seu cliente baixar as fotos.</p>
        </div>

        <div className="p-5 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] rounded-2xl">
          <QRCodeSVG value={successData.link} size={180} bgColor="transparent" fgColor="#059669" />
        </div>

        <div className="flex w-full max-w-sm flex-col space-y-4">
          <div className="space-y-1.5 text-left">
            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">Link do Cliente</Label>
            <div className="flex w-full items-center space-x-2">
              <Input
                value={successData.link}
                readOnly
                className="text-center bg-zinc-50 dark:bg-white/[0.03] border-zinc-200 dark:border-white/[0.08] text-emerald-600 dark:text-emerald-400 font-mono text-xs rounded-xl h-11"
              />
              <button
                onClick={() => copyToClipboard(successData.link)}
                className="h-11 w-11 shrink-0 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-white/[0.03] hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-zinc-500" />}
              </button>
            </div>
          </div>

          {successData.accessKey && (
            <div className="space-y-2 text-left p-4 bg-amber-500/[0.06] border border-amber-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-amber-500" />
                <Label className="text-xs font-bold text-amber-400 uppercase tracking-wider">Chave de Liberação</Label>
              </div>
              <p className="text-[11px] text-amber-500/70 leading-relaxed">
                Entregue esta chave ao cliente <b className="text-amber-400">apenas após o pagamento</b> para liberar o download sem marca d&apos;água.
              </p>
              <div className="flex w-full items-center space-x-2">
                <Input
                  value={successData.accessKey}
                  readOnly
                  className="text-center font-mono font-bold bg-white/[0.03] border-amber-500/20 text-amber-400 rounded-xl h-11 uppercase tracking-wider"
                />
                <button
                  onClick={() => copyToClipboard(successData.accessKey!, true)}
                  className="h-11 w-11 shrink-0 flex items-center justify-center rounded-xl border border-amber-500/20 bg-white/[0.03] hover:bg-amber-500/10 transition-all"
                >
                  {copiedKey ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-amber-500" />}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            onClick={() => setSuccessData(null)}
            className="inline-flex items-center gap-2 text-sm font-bold bg-emerald-500 text-black rounded-full px-6 py-3 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            Criar novo upload
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // --- Upload Form ---
  return (
    <div className="space-y-6">
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Título da Galeria
        </Label>
        <Input
          id="title"
          placeholder="Ex: Casamento João e Maria"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={status !== "IDLE"}
          className="h-12 bg-zinc-50 dark:bg-white/[0.03] border-zinc-200 dark:border-white/[0.08] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 rounded-xl focus:border-emerald-500/40 focus:ring-emerald-500/20 text-base transition-all"
        />
      </div>

      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 group
          ${isDragActive ? "border-emerald-500 bg-emerald-500/5 scale-[1.02]" : "border-zinc-300 dark:border-white/[0.08] hover:border-emerald-500/30 hover:bg-zinc-50 dark:hover:bg-white/[0.02]"}
          ${status !== "IDLE" ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className={`p-4 rounded-full transition-colors duration-300 ${isDragActive ? "bg-emerald-500/20 text-emerald-500" : "bg-zinc-100 dark:bg-white/[0.04] text-zinc-400 dark:text-zinc-600 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 dark:group-hover:text-emerald-400"}`}>
            <UploadCloud className="h-8 w-8" />
          </div>
          <p className="text-sm font-bold text-zinc-700 dark:text-white uppercase tracking-wide">
            {isDragActive
              ? "Solte as imagens aqui!"
              : "Arraste imagens ou clique para selecionar"}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-600 font-medium">
            Máximo de 50 fotos. Formatos suportados: JPG, PNG, WEBP.
          </p>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/0 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 border border-zinc-200 dark:border-white/[0.06] rounded-xl bg-zinc-50 dark:bg-white/[0.02]">
          {files.map((file, i) => (
            <div key={i} className="relative group bg-white dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06] p-2 rounded-lg flex items-center gap-2 text-xs truncate text-zinc-500 dark:text-zinc-400">
              <FileIcon className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-600" />
              <span className="truncate flex-1">{file.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="text-red-400 hover:bg-red-500/10 p-1 rounded disabled:hidden transition-colors"
                disabled={status !== "IDLE"}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="p-5 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] rounded-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-all hover:border-amber-500/20">
        <div className="space-y-1.5 flex-1">
          <Label className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-white">
            <div className="bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20">
              <Shield className="h-4 w-4 text-amber-500" />
            </div>
            Proteção com Marca D&apos;água <span className="text-xs font-normal text-zinc-400 dark:text-zinc-600 ml-1">(Opcional)</span>
          </Label>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-600 md:w-[90%] leading-relaxed">
            Selecione uma imagem (.png) transparente para proteger suas fotos. O cliente precisará de uma chave de acesso para o pacote original.
          </p>
          <input
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            ref={watermarkInputRef}
            onChange={handleWatermarkSelect}
            disabled={status !== "IDLE"}
          />
        </div>

        {watermarkFile ? (
          <div className="flex items-center gap-3 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] p-3 rounded-xl shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
            <div className="h-8 w-8 bg-zinc-100 dark:bg-white/[0.04] rounded-md flex items-center justify-center">
              <ImagePlus className="h-4 w-4 text-zinc-500" />
            </div>
            <span className="truncate max-w-[120px] text-sm font-medium text-zinc-800 dark:text-white" title={watermarkFile.name}>{watermarkFile.name}</span>
            <button
              onClick={() => setWatermarkFile(null)}
              disabled={status !== "IDLE"}
              className="h-8 w-8 flex items-center justify-center text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => watermarkInputRef.current?.click()}
            disabled={status !== "IDLE"}
            className="shrink-0 w-full sm:w-auto h-10 px-4 rounded-xl text-sm font-bold border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-white/[0.03] text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] hover:text-zinc-700 dark:hover:text-white hover:border-emerald-500/20 transition-all inline-flex items-center justify-center gap-2"
          >
            <ImagePlus className="h-4 w-4" /> Selecionar Logo
          </button>
        )}
      </div>

      {status !== "IDLE" && (
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-zinc-500">
              {status === "PROCESSING_WATERMARKS" && "Aplicando marcas d'água..."}
              {status === "ZIPPING" && "Compactando fotos originais..."}
              {status === "UPLOADING" && "Enviando para nuvem..."}
              {status === "SAVING" && "Finalizando link..."}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 bg-zinc-200 dark:bg-white/[0.04] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <button
        onClick={handleProcess}
        disabled={files.length === 0 || !title || status !== "IDLE"}
        className="w-full h-14 text-sm font-bold uppercase tracking-wider rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none inline-flex items-center justify-center gap-2"
      >
        {status === "IDLE" ? (
          <>
            <UploadCloud className="h-5 w-5" /> Compactar e Gerar Link
          </>
        ) : (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {status === "PROCESSING_WATERMARKS" && "Processando Marcas D'água..."}
            {status === "ZIPPING" && "Compactando..."}
            {status === "UPLOADING" && "Enviando..."}
            {status === "SAVING" && "Finalizando..."}
          </>
        )}
      </button>
    </div>
  );
}