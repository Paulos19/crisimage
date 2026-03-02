"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, X, Menu } from "lucide-react"

const navLinks = [
    { label: "Recursos", href: "#features" },
    { label: "Testemunhos", href: "#testimonials" },
    { label: "Contato", href: "#contact" },
]

export function LpNavbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60)
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    // Lock body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [isOpen])

    return (
        <>
            {/* Desktop + Mobile top bar */}
            <header
                className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled
                        ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.04] shadow-lg shadow-black/20"
                        : "bg-transparent"
                    }`}
            >
                <div className="mx-auto px-5 lg:px-10 h-16 lg:h-20 flex items-center justify-between">
                    {/* Logo */}
                    <a
                        href="#hero"
                        className="relative z-50 flex items-center gap-2.5 group"
                    >
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                            ★
                        </div>
                        <span className="text-sm font-black tracking-tight uppercase text-white">
                            Crisimage
                        </span>
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="relative px-4 py-2 text-[11px] font-bold text-zinc-400 hover:text-white transition-colors tracking-[0.2em] uppercase group"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-emerald-500 group-hover:w-3/4 transition-all duration-300" />
                            </a>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="hidden md:inline-flex text-[11px] font-bold text-zinc-500 hover:text-white transition-all tracking-[0.15em] uppercase px-3 py-2"
                        >
                            Entrar
                        </Link>
                        <Link
                            href="/dashboard/upload"
                            className="hidden sm:inline-flex items-center gap-2 text-xs font-bold bg-emerald-500 text-black rounded-full px-5 py-2.5 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
                        >
                            Começar <ArrowRight className="h-3.5 w-3.5" />
                        </Link>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="relative z-50 lg:hidden h-10 w-10 flex items-center justify-center rounded-lg hover:bg-white/[0.05] transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <X className="h-5 w-5 text-white" />
                            ) : (
                                <Menu className="h-5 w-5 text-white" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* ============================================= */}
            {/* MOBILE MENU — Full-screen deconstructed style  */}
            {/* ============================================= */}
            <div
                className={`fixed inset-0 z-40 bg-[#080808] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${isOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}
            >
                {/* Background decorative elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-emerald-900/[0.08] rounded-full blur-[150px]" />
                    <div className="absolute bottom-[20%] left-[10%] w-[250px] h-[250px] bg-teal-900/[0.05] rounded-full blur-[120px]" />

                    {/* Oversized bg text */}
                    <div className="absolute bottom-10 left-0 right-0 flex items-end justify-center">
                        <span className="text-[30vw] font-black uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.02)]">
                            MENU
                        </span>
                    </div>
                </div>

                {/* Menu content */}
                <div className="relative h-full flex flex-col justify-center px-8">
                    <nav className="space-y-2 mb-12">
                        {navLinks.map((link, i) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block group"
                                style={{
                                    transform: isOpen ? "translateY(0)" : "translateY(40px)",
                                    opacity: isOpen ? 1 : 0,
                                    transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) ${150 + i * 80}ms`,
                                }}
                            >
                                <div className="flex items-center justify-between py-4 border-b border-white/[0.04] group-hover:border-emerald-500/20 transition-colors">
                                    <span className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                                        {link.label}
                                    </span>
                                    <ArrowRight className="h-6 w-6 text-zinc-700 group-hover:text-emerald-400 group-hover:translate-x-2 transition-all" />
                                </div>
                            </a>
                        ))}
                    </nav>

                    {/* Mobile CTAs */}
                    <div
                        className="space-y-3"
                        style={{
                            transform: isOpen ? "translateY(0)" : "translateY(40px)",
                            opacity: isOpen ? 1 : 0,
                            transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) 500ms`,
                        }}
                    >
                        <Link
                            href="/dashboard/upload"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center gap-2 w-full h-14 rounded-xl bg-emerald-500 text-black font-bold text-sm uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                        >
                            Criar Galeria <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center w-full h-14 rounded-xl border border-white/[0.08] text-zinc-400 font-bold text-sm uppercase tracking-wider hover:bg-white/[0.03] hover:text-white transition-all"
                        >
                            Já tenho conta
                        </Link>
                    </div>

                    {/* Bottom info */}
                    <div
                        className="absolute bottom-8 left-8 right-8 flex items-center justify-between"
                        style={{
                            opacity: isOpen ? 1 : 0,
                            transition: `opacity 0.5s 600ms`,
                        }}
                    >
                        <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.2em]">
                            © {new Date().getFullYear()} Crisimage
                        </span>
                        <span className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.2em]">
                            v1.0
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}
