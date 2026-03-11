import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/lib/schemas";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    // 1. Passa os dados do Token para a Sessão (Front-end)
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        // @ts-ignore
        session.user.role = token.role;
      }
      if (token.whatsapp && session.user) {
        // @ts-ignore
        session.user.whatsapp = token.whatsapp;
      }
      return session;
    },
    // 2. Passa os dados do Banco para o Token (JWT)
    async jwt({ token, user }) {
      // Na primeira criação do token (login), o objeto `user` está presente.
      // Salvamos os dados do user diretamente no token.
      if (user) {
        token.sub = user.id;
        // @ts-ignore
        token.role = user.role;
        // @ts-ignore
        token.whatsapp = user.whatsapp;
        return token;
      }

      // Nas chamadas subsequentes, o token já tem os dados.
      // Só buscamos no banco se precisamos (para manter atualizado), mas não invalidamos.
      if (!token.sub) return token;

      try {
        const existingUser = await prisma.user.findUnique({
          where: { id: token.sub },
        });

        if (existingUser) {
          // @ts-ignore
          token.role = existingUser.role;
          // @ts-ignore
          token.whatsapp = existingUser.whatsapp;
        }
        // Se o usuário não existe mais no banco, mantemos o token como está
        // para evitar corrupção de sessão — o middleware cuidará do redirect.
      } catch {
        // Em caso de erro no banco, mantém o token atual sem quebrar
      }

      return token;
    },
  },
  events: {
    async createUser({ user }) {
      if (user.email === process.env.ADMIN_EMAIL) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" },
        });
        console.log(`🔒 Usuário ${user.email} promovido a ADMIN automaticamente.`);
      }
    },
  },
});
