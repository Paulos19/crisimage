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
    <div className="space-y-4">
      {uploads.map((upload) => {
        const link = `${process.env.NEXTAUTH_URL}/download/${upload.slug}`;
        
        return (
          <div key={upload.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
            <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-semibold truncate max-w-[150px] sm:max-w-xs" title={upload.title || "Sem título"}>
                        {upload.title || "Sem título"}
                    </span>
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                        Ativo
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Expira {formatDistanceToNow(upload.expiresAt, { addSuffix: true, locale: ptBR })}</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <CopyButton text={link} />
                
                <Button variant="ghost" size="icon" asChild>
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