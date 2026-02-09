"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { upload } from "@vercel/blob/client";
import { createUploadSession } from "@/actions/create-session";
import { QRCodeSVG } from "qrcode.react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileIcon, Loader2, UploadCloud, X, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UploadZone() {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"IDLE" | "ZIPPING" | "UPLOADING" | "SAVING">("IDLE");
  const [progress, setProgress] = useState(0);
  
  // Estado para tela de sucesso
  const [successData, setSuccessData] = useState<{ slug: string; link: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Limite de 50 imagens
    if (acceptedFiles.length > 50) {
      alert("Máximo de 50 imagens permitidas!");
      return;
    }
    setFiles((prev) => [...prev, ...acceptedFiles].slice(0, 50));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }, // Aceita qualquer imagem
    maxFiles: 50,
  });

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const copyToClipboard = () => {
    if (successData) {
      navigator.clipboard.writeText(successData.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    if (!title.trim()) {
        alert("Dê um título para sua galeria!");
        return;
    }

    try {
      // 1. Zipping (Client-Side)
      setStatus("ZIPPING");
      const zip = new JSZip();
      
      files.forEach((file) => {
        zip.file(file.name, file);
      });

      // Gera o blob do ZIP
      const zipBlob = await zip.generateAsync({ 
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 } 
      }, (metadata) => {
        setProgress(metadata.percent);
      });

      // 2. Uploading (Vercel Blob)
      setStatus("UPLOADING");
      setProgress(0);

      const filename = `${title.replace(/\s+/g, '-')}-${Date.now()}.zip`;
      
      const newBlob = await upload(filename, zipBlob, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        onUploadProgress: (progressEvent) => {
            setProgress((progressEvent.percentage));
        }
      });

      // 3. Saving to DB
      setStatus("SAVING");
      const result = await createUploadSession(newBlob.url, title);

      if (result.success) {
        // Gera o link completo baseando-se na origem atual
        const link = `${window.location.origin}/download/${result.success}`;
        
        setSuccessData({ slug: result.success!, link });
        
        // Limpa o formulário
        setStatus("IDLE");
        setFiles([]);
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
                <p className="text-muted-foreground">Escaneie o QR Code ou copie o link para compartilhar.</p>
            </div>

            <div className="p-4 bg-white rounded-xl shadow-sm border border-neutral-200">
                <QRCodeSVG value={successData.link} size={180} />
            </div>

            <div className="flex w-full max-w-sm items-center space-x-2">
                <Input value={successData.link} readOnly className="text-center bg-neutral-50" />
                <Button size="icon" variant="outline" onClick={copyToClipboard}>
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
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
        {/* Título do Upload */}
        <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="title">Título da Galeria</Label>
            <Input 
                id="title" 
                placeholder="Ex: Aniversário do Pedro" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={status !== "IDLE"}
            />
        </div>

      {/* Dropzone */}
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
                : "Arraste imagens ou clique para selecionar (Max 50)"}
            </p>
        </div>
      </div>

      {/* Lista de Arquivos */}
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

      {/* Progresso e Ações */}
      {status !== "IDLE" && (
        <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                    {status === "ZIPPING" && "Compactando..."}
                    {status === "UPLOADING" && "Enviando para nuvem..."}
                    {status === "SAVING" && "Finalizando..."}
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando
            </>
        )}
      </Button>
    </div>
  );
}