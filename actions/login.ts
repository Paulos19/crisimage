"use server";

import * as z from "zod";
import { signIn } from "@/auth"; // Importamos do nosso arquivo de configuração
import { LoginSchema } from "@/lib/schemas";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // 1. Validação Zod no Backend
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos!" };
  }

  const { email, password } = validatedFields.data;

  try {
    // 2. Tentativa de Login (Credentials)
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard", // Redirecionamento padrão após sucesso
    });
  } catch (error) {
    // 3. Tratamento de Erros Específicos do Auth.js
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciais inválidas!" };
        default:
          return { error: "Algo deu errado. Tente novamente." };
      }
    }

    // O Next.js usa erros para redirecionar. Se não for AuthError, relançamos.
    throw error; 
  }
};