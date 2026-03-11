"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma"; // Importação necessária

export async function sendWhatsappNotification(link: string, title: string, targetPhone: string) {
  const session = await auth();

  // Validar se temos um número
  if (!targetPhone) {
    return { error: "Número do WhatsApp não informado." };
  }

  // Tries to find the photographer's name
  let userName: string = "Fotógrafo";
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true }
    });
    userName = user?.name || "Fotógrafo";
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) return { error: "Configuração de servidor ausente." };

  try {
    // Disparo Fire-and-Forget para o N8N
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session?.user?.id || "UNKNOWN",
        name: userName,
        phone: targetPhone,
        downloadLink: link,
        projectTitle: title,
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) throw new Error("Falha no N8N");

    return { success: true };
  } catch (error) {
    console.error("N8N Error:", error);
    return { error: "Erro ao enviar mensagem." };
  }
}