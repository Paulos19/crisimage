"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";

import { RegisterSchema } from "@/lib/schemas";
import { register } from "@/actions/register";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      whatsapp: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  const inputClassName = "h-12 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600 rounded-xl focus:border-emerald-500/40 focus:ring-emerald-500/20";
  const labelClassName = "text-xs font-bold uppercase tracking-wider text-zinc-400";

  return (
    <div className="w-full space-y-8">
      {/* Logo */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white uppercase">
          Criar conta
        </h1>
        <p className="text-sm text-zinc-500 mt-1 font-medium">
          Comece a compactar suas imagens hoje
        </p>
      </div>

      {/* Card */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        <div className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClassName}>Nome</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Seu nome completo"
                          disabled={isPending}
                          className={inputClassName}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClassName}>WhatsApp</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="5511999999999"
                          type="tel"
                          disabled={isPending}
                          className={inputClassName}
                        />
                      </FormControl>
                      <p className="text-[11px] text-zinc-600 font-medium">
                        Necessário para receber o link de download.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClassName}>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="seu@email.com"
                          type="email"
                          disabled={isPending}
                          className={inputClassName}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClassName}>Senha</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="••••••"
                          type="password"
                          disabled={isPending}
                          className={inputClassName}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-x-2 text-sm text-red-400 font-medium">
                  <p>{error}</p>
                </div>
              )}
              {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-x-2 text-sm text-emerald-400 font-medium">
                  <p>{success}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 text-sm uppercase tracking-wider"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : "Registrar"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-zinc-500 hover:text-emerald-400 transition-colors font-medium"
        >
          Já tem uma conta? <span className="text-emerald-400 font-bold">Entrar</span>
        </Link>
      </div>
    </div>
  );
}