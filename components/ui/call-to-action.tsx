"use client"

import { Mail, SendHorizonal, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CallToAction() {
    return (
        <section className="relative py-24 md:py-40 overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-900/[0.08] rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-teal-900/[0.05] rounded-full blur-[160px] pointer-events-none" />

            {/* OVERSIZED BACKGROUND TEXT */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                <span className="text-[20vw] md:text-[14vw] font-black uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.03)] whitespace-nowrap">
                    CONTATO
                </span>
            </div>

            <div className="relative z-10 w-full px-6 lg:px-16">
                <div className="text-center max-w-3xl mx-auto">
                    {/* Tag */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-500" />
                        <span className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-400">
              // Comece Agora
                        </span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-500" />
                    </div>

                    <h2 className="text-balance text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                            Pronto pra
                        </span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-700">
                            transformar?
                        </span>
                    </h2>

                    <p className="text-zinc-500 text-base md:text-lg max-w-xl mx-auto font-medium uppercase tracking-wider leading-relaxed mb-12">
            // Crie sua primeira galeria gratuita e veja a diferença na entrega para seu cliente.
                    </p>

                    {/* Email form */}
                    <form
                        action=""
                        className="mx-auto max-w-md mb-10"
                    >
                        <div className="relative grid grid-cols-[1fr_auto] items-center rounded-full border-2 border-white/[0.08] bg-white/[0.02] pr-2 shadow-lg shadow-emerald-900/5 transition-all duration-300 has-[input:focus]:border-emerald-500/40 has-[input:focus]:bg-white/[0.04] has-[input:focus]:shadow-emerald-500/10">
                            <Mail className="pointer-events-none absolute inset-y-0 left-5 my-auto size-5 text-zinc-600" />

                            <input
                                placeholder="Seu melhor e-mail"
                                className="h-14 w-full bg-transparent pl-14 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none font-medium tracking-wide"
                                type="email"
                            />

                            <button
                                type="submit"
                                className="flex h-10 items-center gap-2 rounded-full bg-emerald-500 px-6 text-sm font-bold uppercase tracking-wider text-black transition-all duration-300 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
                            >
                                <span className="hidden md:block">Começar</span>
                                <SendHorizonal
                                    className="relative size-4 md:hidden"
                                    strokeWidth={2.5}
                                />
                            </button>
                        </div>
                    </form>

                    {/* Or CTA buttons */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/dashboard/upload"
                            className="group inline-flex items-center justify-center rounded-full text-sm font-bold uppercase tracking-wider bg-white/[0.04] border border-white/[0.08] text-white hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300 h-12 px-8"
                        >
                            Criar Galeria Grátis
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center rounded-full text-sm font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-all h-12 px-8"
                        >
                            Já tenho conta
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
