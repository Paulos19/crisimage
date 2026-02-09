"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { upload } from "@vercel/blob/client";
import { createUploadSession } from "@/actions/create-session";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { FileIcon, Loader2, UploadCloud, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UploadZone() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"IDLE" | "ZIPPING" | "UPLOADING" | "SAVING">("IDLE");
  const [progress, setProgress] = useState(0);

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
      setProgress(0); // Reinicia progresso para o upload

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
        router.push(`/download/${result.success}`); // Redireciona para a página pública
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