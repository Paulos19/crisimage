"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PhoneSchema = z.object({
  whatsapp: z.string().min(10, "Número inválido. Use DDD + Número"),
});

export async function updateUserPhone(whatsapp: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  const parsed = PhoneSchema.safeParse({ whatsapp });
  if (!parsed.success) return { error: parsed.error.message };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { whatsapp: parsed.data.whatsapp },
    });
    
    revalidatePath("/download/[slug]", "layout"); // Revalida a sessão
    return { success: true };
  } catch (error) {
    return { error: "Erro ao atualizar telefone." };
  }
}