"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { upload } from "@vercel/blob/client";
import { createUploadSession } from "@/actions/create-session";
import { QRCodeSVG } from "qrcode.react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileIcon, Loader2, UploadCloud, X, Copy, Check, Shield, ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UploadZone() {
  const [files, setFiles] = useState<File[]>([]);
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"IDLE" | "PROCESSING_WATERMARKS" | "ZIPPING" | "UPLOADING" | "SAVING">("IDLE");
  const [progress, setProgress] = useState(0);

  // Estado para tela de sucesso
  const [successData, setSuccessData] = useState<{ slug: string; link: string; accessKey?: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Input ref para marca dágua
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

  // Função para aplicar marca d'água numa imagem usando Canvas
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

          // Desenha a original
          ctx.drawImage(img, 0, 0);

          // Desenha a marca d'água (ex: no centro, 30% translúcida, com 50% da largura da original)
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
          }, "image/jpeg", 0.7); // Compressão para preview
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

      // 1. Processar Marcas D'água (se houver)
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

        previewZipBlob = await previewZip.generateAsync({ type: "blob", compression: "STORE" }); // Mais rápido
      }

      // 2. Zipping Originais
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

      // 3. Uploading (Vercel Blob)
      setStatus("UPLOADING");
      setProgress(0);

      const baseFilename = title.replace(/\s+/g, '-').toLowerCase() + `-${Date.now()}`;

      // Upload Originais
      const originalBlob = await upload(`${baseFilename}-original.zip`, originalZipBlob, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        onUploadProgress: (progressEvent) => {
          // Se tiver preview, esse upload representa 50%
          const target = watermarkFile ? 50 : 100;
          setProgress(progressEvent.percentage * (target / 100));
        }
      });

      // Upload Previews (se houver)
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

      // 4. Saving to DB
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

  // --- Renderização da Tela de Sucesso ---
  if (successData) {
    return (
      <div className="flex flex-col items-center space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 py-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-green-600">Arquivo Pronto!</h3>
          <p className="text-muted-foreground">Envie o link para seu cliente baixar as fotos.</p>
        </div>

        <div className="p-4 bg-white rounded-xl shadow-sm border border-neutral-200">
          <QRCodeSVG value={successData.link} size={180} />
        </div>

        <div className="flex w-full max-w-sm flex-col space-y-4">
          <div className="space-y-1 text-left">
            <Label className="text-xs text-muted-foreground">Link do Cliente</Label>
            <div className="flex w-full items-center space-x-2">
              <Input value={successData.link} readOnly className="text-center bg-neutral-50" />
              <Button size="icon" variant="outline" onClick={() => copyToClipboard(successData.link)}>
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {successData.accessKey && (
            <div className="space-y-1 text-left p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-orange-600" />
                <Label className="text-sm font-semibold text-orange-800">Chave de Liberação</Label>
              </div>
              <p className="text-xs text-orange-700 mb-3">
                Entregue esta chave ao cliente <b>apenas após o pagamento</b> para liberar o download sem marca d'água.
              </p>
              <div className="flex w-full items-center space-x-2">
                <Input value={successData.accessKey} readOnly className="text-center font-mono font-bold bg-white border-orange-300 text-orange-900" />
                <Button size="icon" variant="outline" className="border-orange-300 hover:bg-orange-100" onClick={() => copyToClipboard(successData.accessKey!, true)}>
                  {copiedKey ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-orange-800" />}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4">
          <Button variant="default" onClick={() => setSuccessData(null)}>
            Criar novo upload
          </Button>
        </div>
      </div>
    );
  }

  // --- Renderização do Formulário de Upload ---
  return (
    <div className="space-y-6">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="title">Título da Galeria</Label>
        <Input
          id="title"
          placeholder="Ex: Casamento João e Maria"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={status !== "IDLE"}
        />
      </div>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/10" : "border-neutral-300 hover:border-primary"}
          ${status !== "IDLE" ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <UploadCloud className="h-10 w-10 text-neutral-400" />
          <p className="text-sm text-neutral-600">
            {isDragActive
              ? "Solte as imagens aqui..."
              : "Arraste imagens ou clique para selecionar as fotos (Max 50)"}
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
          {files.map((file, i) => (
            <div key={i} className="relative group bg-neutral-100 p-2 rounded flex items-center gap-2 text-xs truncate">
              <FileIcon className="h-4 w-4 shrink-0" />
              <span className="truncate flex-1">{file.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="text-red-500 hover:bg-red-100 p-1 rounded disabled:hidden"
                disabled={status !== "IDLE"}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 bg-muted/50 rounded-lg border border-dashed flex items-center justify-between">
        <div className="space-y-1">
          <Label className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-orange-500" />
            Proteção com Marca D'água (Opcional)
          </Label>
          <p className="text-xs text-muted-foreground w-4/5">
            Selecione uma imagem (.png) para inserir como marca d'água nas prévias. O download original exigirá uma chave de acesso.
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
          <div className="flex items-center gap-2 bg-background p-2 rounded-md border text-sm">
            <span className="truncate max-w-[100px] text-xs font-medium">{watermarkFile.name}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => setWatermarkFile(null)} disabled={status !== "IDLE"}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => watermarkInputRef.current?.click()} disabled={status !== "IDLE"}>
            <ImagePlus className="mr-2 h-4 w-4" /> Selecionar
          </Button>
        )}
      </div>

      {status !== "IDLE" && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {status === "PROCESSING_WATERMARKS" && "Aplicando marcas d'água..."}
              {status === "ZIPPING" && "Compactando fotos orignais..."}
              {status === "UPLOADING" && "Enviando para nuvem..."}
              {status === "SAVING" && "Finalizando link..."}
            </span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <Button
        onClick={handleProcess}
        disabled={files.length === 0 || !title || status !== "IDLE"}
        className="w-full"
      >
        {status === "IDLE" ? (
          "Compactar e Gerar Link"
        ) : (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando Arquivos
          </>
        )}
      </Button>
    </div>
  );
}