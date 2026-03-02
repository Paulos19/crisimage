"use client"

import Link from "next/link"
import { Instagram, Mail, ArrowUpRight } from "lucide-react"

const footerLinks = {
    produto: [
        { label: "Recursos", href: "#features" },
        { label: "Criar Galeria", href: "/dashboard/upload" },
        { label: "Login", href: "/login" },
    ],
    suporte: [
        { label: "Contato", href: "#contact" },
        { label: "Termos de Uso", href: "#" },
        { label: "Privacidade", href: "#" },
    ],
}

export function LpFooter() {
    return (
        <footer className="relative border-t border-white/[0.04] bg-[#060606] overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-emerald-900/[0.04] rounded-full blur-[200px] pointer-events-none" />

            {/* Main footer content */}
            <div className="relative z-10 w-full px-6 lg:px-16 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
                    {/* Brand column */}
                    <div className="md:col-span-5 space-y-5">
                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-emerald-500/20">
                                ★
                            </div>
                            <span className="text-sm font-black tracking-tight uppercase text-white">
                                LetImage
                            </span>
                        </div>
                        <p className="text-sm text-zinc-600 leading-relaxed max-w-xs font-medium">
                            A plataforma definitiva para fotógrafos. Galerias protegidas, marca d&apos;água automática e entrega premium em um link.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-10 w-10 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-zinc-600 hover:text-emerald-400 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all"
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a
                                href="mailto:contato@letimage.com"
                                className="h-10 w-10 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-zinc-600 hover:text-emerald-400 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all"
                            >
                                <Mail className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Produto */}
                    <div className="md:col-span-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-5">
                            Produto
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.produto.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="group inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-emerald-400 transition-colors font-medium"
                                    >
                                        {link.label}
                                        <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Suporte */}
                    <div className="md:col-span-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-5">
                            Suporte
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.suporte.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="group inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-emerald-400 transition-colors font-medium"
                                    >
                                        {link.label}
                                        <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter / Mini CTA */}
                    <div className="md:col-span-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-5">
                            Status
                        </h4>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Online</span>
                        </div>
                        <p className="text-[11px] text-zinc-700 font-medium leading-relaxed">
                            Todos os serviços operando normalmente.
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent mb-8" />

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-zinc-700 font-medium uppercase tracking-wider">
                        © {new Date().getFullYear()} LetImage. Todos os direitos reservados.
                    </p>
                    <p className="text-[11px] text-zinc-700 font-medium">
                        Feito com <span className="text-emerald-500">♥</span> para fotógrafos
                    </p>
                </div>
            </div>
        </footer>
    )
}
