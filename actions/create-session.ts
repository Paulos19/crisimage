"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { addDays } from "date-fns";
import { nanoid } from "nanoid"; // Instale: npm i nanoid

export async function createUploadSession(
  zipUrl: string,
  title: string,
  previewZipUrl?: string,
  accessKey?: string
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  // Gera um slug curto para o link (ex: u9fd-k3d9)
  const slug = nanoid(10);
  const expiresAt = addDays(new Date(), 5);

  try {
    const uploadSession = await prisma.uploadSession.create({
      data: {
        slug,
        userId: session.user.id,
        zipUrl,
        previewZipUrl,
        accessKey,
        title: title || "Sem título",
        status: "READY",
        expiresAt,
      },
    });

    // TODO: Disparar N8N aqui na próxima fase

    return { success: uploadSession.slug };
  } catch (error) {
    console.error("Erro ao salvar sessão:", error);
    return { error: "Erro ao registrar o upload." };
  }
}