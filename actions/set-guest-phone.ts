"use server";

import { cookies } from "next/headers";
import { z } from "zod";

const PhoneSchema = z.object({
    whatsapp: z.string().min(10, "Número inválido. Use DDD + Número"),
});

export async function setGuestPhone(whatsapp: string) {
    const parsed = PhoneSchema.safeParse({ whatsapp });
    if (!parsed.success) return { error: parsed.error.message };

    const cookieStore = await cookies();

    // Define o cookie de visitante por 30 dias
    cookieStore.set("guest_whatsapp", parsed.data.whatsapp, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return { success: true };
}
