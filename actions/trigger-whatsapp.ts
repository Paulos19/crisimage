"use server";

import { auth } from "@/auth";

export async function sendWhatsappNotification(link: string, title: string) {
  const session = await auth();
  
  if (!session?.user?.id || !session.user.whatsapp) {
    return { error: "Usuário sem WhatsApp cadastrado." };
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) return { error: "Configuração de servidor ausente." };

  try {
    // Disparo Fire-and-Forget para o N8N
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.user.id,
        name: session.user.name,
        phone: session.user.whatsapp,
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