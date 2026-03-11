import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, Shield, ShieldOff, Eye, Calendar, Link2, FileArchive, ImageIcon } from "lucide-react";
import { UploadItemActions } from "./upload-item-actions";
import { CopyButton } from "./copy-button";

export async function RecentUploads() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const uploads = await prisma.uploadSession.findMany({
    where: {
      userId: session.user.id,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      _count: {
        select: { accesses: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  if (uploads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 bg-zinc-100 dark:bg-white/[0.04] rounded-2xl flex items-center justify-center mb-4">
          <FileArchive className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
        </div>
        <p className="text-sm font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">
          Nenhum upload ativo no momento.
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-700 mt-1">
          Crie uma nova compactação para ver seus uploads aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {uploads.map((upload) => {
        const link = `${process.env.NEXTAUTH_URL}/download/${upload.slug}`;
        const isProtected = !!upload.accessKey;
        const hasPreview = !!upload.previewZipUrl;
        const accessCount = upload._count.accesses;

        // Calculate time remaining
        const now = new Date();
        const expiresAt = new Date(upload.expiresAt);
        const hoursRemaining = Math.max(0, Math.round((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)));
        const isExpiringSoon = hoursRemaining <= 24;

        return (
          <div
            key={upload.id}
            className="group relative bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] rounded-2xl overflow-hidden hover:border-emerald-500/20 dark:hover:border-emerald-500/10 transition-all duration-300 shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none"
          >
            {/* Top accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Card Header */}
            <div className="p-5 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 shrink-0 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                    <ImageIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-zinc-900 dark:text-white truncate text-sm" title={upload.title || "Sem título"}>
                      {upload.title || "Sem título"}
                    </h4>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono mt-0.5 truncate">
                      {upload.slug.substring(0, 12)}...
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <span className="flex items-center gap-1.5 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-bold border border-emerald-500/20 uppercase tracking-wider shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ativo
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="px-5 pb-4 grid grid-cols-2 gap-3">
              {/* Created */}
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-700 shrink-0" />
                <div>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-bold uppercase tracking-wider">Criado</p>
                  <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                    {format(new Date(upload.createdAt), "dd MMM, HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>

              {/* Expires */}
              <div className="flex items-center gap-2 text-xs">
                <Clock className={`h-3.5 w-3.5 shrink-0 ${isExpiringSoon ? "text-amber-500" : "text-zinc-300 dark:text-zinc-700"}`} />
                <div>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-bold uppercase tracking-wider">Expira</p>
                  <p className={`font-medium ${isExpiringSoon ? "text-amber-600 dark:text-amber-400" : "text-zinc-600 dark:text-zinc-400"}`}>
                    {formatDistanceToNow(upload.expiresAt, { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </div>

              {/* Accesses */}
              <div className="flex items-center gap-2 text-xs">
                <Eye className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-700 shrink-0" />
                <div>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-bold uppercase tracking-wider">Acessos</p>
                  <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                    {accessCount} {accessCount === 1 ? "visita" : "visitas"}
                  </p>
                </div>
              </div>

              {/* Protection */}
              <div className="flex items-center gap-2 text-xs">
                {isProtected ? (
                  <Shield className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                ) : (
                  <ShieldOff className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-700 shrink-0" />
                )}
                <div>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-bold uppercase tracking-wider">Proteção</p>
                  <p className={`font-medium ${isProtected ? "text-amber-600 dark:text-amber-400" : "text-zinc-500"}`}>
                    {isProtected ? "Com marca d'água" : "Sem proteção"}
                  </p>
                </div>
              </div>
            </div>

            {/* Access Key (if protected) */}
            {isProtected && upload.accessKey && (
              <div className="mx-5 mb-4 p-3 bg-amber-500/5 dark:bg-amber-500/[0.06] border border-amber-500/15 dark:border-amber-500/20 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Chave de Liberação</span>
                  </div>
                  <CopyButton text={upload.accessKey} />
                </div>
                <div className="mt-2">
                  <span className="inline-flex font-mono bg-white dark:bg-white/[0.03] border border-amber-500/20 px-3 py-1.5 rounded-lg text-amber-700 dark:text-amber-400 tracking-wider font-bold text-xs select-all">
                    {upload.accessKey}
                  </span>
                </div>
              </div>
            )}

            {/* Link preview */}
            {hasPreview && (
              <div className="mx-5 mb-4">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  <ImageIcon className="h-3 w-3" />
                  Preview com marca d&apos;água disponível
                </span>
              </div>
            )}

            {/* Footer Actions */}
            <div className="px-5 py-3 border-t border-zinc-100 dark:border-white/[0.04] flex items-center justify-between bg-zinc-50/50 dark:bg-white/[0.01]">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-600 min-w-0">
                <Link2 className="h-3 w-3 shrink-0" />
                <span className="truncate font-mono" title={link}>{link.replace(/^https?:\/\//, "")}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <UploadItemActions
                  uploadId={upload.id}
                  link={link}
                  title={upload.title || "Pacote de Imagens"}
                  slug={upload.slug}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}