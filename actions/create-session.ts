"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { addHours } from "date-fns";
import { nanoid } from "nanoid"; // Instale: npm i nanoid

export async function createUploadSession(zipUrl: string, title: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  // Gera um slug curto para o link (ex: u9fd-k3d9)
  const slug = nanoid(10); 
  const expiresAt = addHours(new Date(), 72);

  try {
    const uploadSession = await prisma.uploadSession.create({
      data: {
        slug,
        userId: session.user.id,
        zipUrl,
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