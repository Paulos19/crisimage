"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { RegisterSchema } from "@/lib/schemas";
import { AuthError } from "next-auth";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // 1. Validação dos campos no servidor (Segurança)
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos!" };
  }

  const { email, password, name, whatsapp } = validatedFields.data;

  // 2. Verifica duplicidade
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Este e-mail já está em uso!" };
  }

  // 3. Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Regra de Negócio: Admin Automático
  // Se o email for igual ao do ENV, promove para ADMIN.
  const role = email === process.env.ADMIN_EMAIL ? "ADMIN" : "USER";

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        whatsapp, // Obrigatório para nosso fluxo n8n
        role,
      },
    });

    // TODO: Enviar email de verificação (se necessário no futuro)

    return { success: "Usuário criado! Faça login para continuar." };
  } catch (error) {
    console.error("Erro ao registrar:", error);
    return { error: "Algo deu errado ao criar a conta." };
  }
};