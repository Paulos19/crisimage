"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma"; // Importação necessária

export async function sendWhatsappNotification(link: string, title: string) {
  const session = await auth();

  let whatsapp: string | null = null;
  let userName: string = "Usuário";

  if (session?.user?.id) {
    // 2. BUSCA DIRETA NO BANCO (Fonte da Verdade)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        whatsapp: true,
        name: true
      }
    });
    whatsapp = user?.whatsapp || null;
    userName = user?.name || "Usuário";
  } else {
    // 3. Busca no cookie de visitante
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    whatsapp = cookieStore.get('guest_whatsapp')?.value || null;
    userName = "Visitante";
  }

  // 4. Validação do dado fesco
  if (!whatsapp) {
    return { error: "Número do WhatsApp não encontrado." };
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) return { error: "Configuração de servidor ausente." };

  try {
    // Disparo Fire-and-Forget para o N8N
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session?.user?.id || "GUEST",
        name: userName,
        phone: whatsapp,
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