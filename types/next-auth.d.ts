import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { Role } from "@prisma/client"

// Estende a interface do Usuário na Sessão
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role
      whatsapp?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    role: Role
    whatsapp?: string | null
  }
}

// Estende a interface do JWT (se estiver usando estratégia JWT)
declare module "next-auth/jwt" {
  interface JWT {
    role: Role
    id: string
  }
}