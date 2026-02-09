import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "Senha é obrigatória" }),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  whatsapp: z.string().min(10, { message: "WhatsApp inválido (inclua DDD)" }), // Crucial para o n8n
});