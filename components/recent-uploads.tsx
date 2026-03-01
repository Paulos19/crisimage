import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, Copy, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CopyButton } from "./copy-button";

export async function RecentUploads() {
  const session = await auth();

  if (!session?.user?.id) return null;

  // Busca uploads não expirados
  const uploads = await prisma.uploadSession.findMany({
    where: {
      userId: session.user.id,
      expiresAt: {
        gt: new Date(), // Apenas futuros
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  if (uploads.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm">
        Nenhum upload ativo no momento.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {uploads.map((upload) => {
        const link = `${process.env.NEXTAUTH_URL}/download/${upload.slug}`;

        return (
          <div key={upload.id} className="group flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-card hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-md transition-all duration-300 relative overflow-hidden">
            {/* Soft left border glow on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex flex-col gap-1 min-w-0 z-10">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-foreground truncate max-w-[150px] sm:max-w-xs" title={upload.title || "Sem título"}>
                  {upload.title || "Sem título"}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-medium border border-green-500/20 shadow-sm shadow-green-500/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Ativo
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Expira {formatDistanceToNow(upload.expiresAt, { addSuffix: true, locale: ptBR })}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 z-10 shrink-0">
              <CopyButton text={link} />

              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full" asChild>
                <Link href={`/download/${upload.slug}`} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}