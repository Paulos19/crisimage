import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { CopyButton } from "./copy-button";
import { UploadItemActions } from "./upload-item-actions";

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
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  if (uploads.length === 0) {
    return (
      <div className="text-center py-10 text-zinc-600 text-sm font-bold uppercase tracking-wider">
        Nenhum upload ativo no momento.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {uploads.map((upload) => {
        const link = `${process.env.NEXTAUTH_URL}/download/${upload.slug}`;

        return (
          <div key={upload.id} className="group flex items-center justify-between p-4 border border-white/[0.06] rounded-xl bg-white/[0.02] hover:bg-white/[0.04] hover:border-emerald-500/10 transition-all duration-300 relative overflow-hidden">
            {/* Active indicator on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-emerald-500 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity rounded-r-full" />

            <div className="flex flex-col gap-1 min-w-0 z-10 pl-2">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white truncate max-w-[150px] sm:max-w-xs" title={upload.title || "Sem título"}>
                  {upload.title || "Sem título"}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ativo
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-600 mt-0.5 font-medium">
                <Clock className="h-3.5 w-3.5" />
                <span>Expira {formatDistanceToNow(upload.expiresAt, { addSuffix: true, locale: ptBR })}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 z-10 shrink-0">
              <UploadItemActions
                uploadId={upload.id}
                link={link}
                title={upload.title || "Pacote de Imagens"}
                slug={upload.slug}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}