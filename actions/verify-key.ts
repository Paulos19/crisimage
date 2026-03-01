"use server";

import { prisma } from "@/lib/prisma";

export async function verifyAccessKey(slug: string, key: string) {
    try {
        const session = await prisma.uploadSession.findUnique({
            where: { slug },
            select: { accessKey: true, zipUrl: true }
        });

        if (!session) {
            return { error: "Sessão não encontrada." };
        }

        if (!session.accessKey) {
            return { error: "Esta galeria não possui trava de segurança." };
        }

        if (session.accessKey !== key) {
            return { error: "Chave incorreta." };
        }

        return { success: true, zipUrl: session.zipUrl };
    } catch (error) {
        console.error("Erro ao verificar chave:", error);
        return { error: "Erro interno ao verificar a chave." };
    }
}
