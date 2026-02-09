"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma"; // Importação necessária

export async function sendWhatsappNotification(link: string, title: string) {
  const session = await auth();
  
  // 1. Verificação básica de autenticação (apenas ID)
  if (!session?.user?.id) {
    return { error: "Não autorizado." };
  }

  // 2. BUSCA DIRETA NO BANCO (Fonte da Verdade)
  // Isso resolve o problema de "Sessão desatualizada" ou "Campo faltando na sessão"
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { 
      whatsapp: true, 
      name: true 
    }
  });

  // 3. Validação do dado fresco
  if (!user || !user.whatsapp) {
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
        name: user.name || "Usuário", // Usa o nome do banco
        phone: user.whatsapp,          // Usa o whats do banco
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