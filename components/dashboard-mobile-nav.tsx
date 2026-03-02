"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createPortal } from "react-dom"
import { Menu, X, Sparkles, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { sidebarItems } from "./dashboard-sidebar"

export function DashboardMobileNav() {
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setMounted(true)
    }, [])

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => { document.body.style.overflow = "" }
    }, [isOpen])

    return (
        <>
            {/* Mobile Hamburger Toggle */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/[0.05] transition-colors"
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5 text-white" />
            </button>

            {/* Mobile Sidebar Overlay/Drawer - rendered in portal */}
            {mounted && typeof document !== "undefined" && createPortal(
                <div
                    className={cn(
                        "fixed inset-0 z-[100] bg-[#0a0a0a]/80 backdrop-blur-sm transition-opacity duration-300 pointer-events-none",
                        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
                    )}
                >
                    {/* Click outside to close */}
                    <div
                        className="absolute inset-0"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Drawer Panel */}
                    <div
                        className={cn(
                            "absolute top-0 left-0 h-full w-72 bg-[#0a0a0a] border-r border-white/[0.06] shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                            isOpen ? "translate-x-0" : "-translate-x-full"
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.04]">
                            <Link href="/dashboard" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-base font-black tracking-tight text-white uppercase leading-none">
                                        LetImage
                                    </h2>
                                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-0.5">
                                        Painel Studio
                                    </p>
                                </div>
                            </Link>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
                            >
                                <X className="w-5 h-5 text-zinc-400 hover:text-white" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 px-4 mb-4">
                                // Menu Principal
                            </p>
                            {sidebarItems.map((item) => {
                                const isActive = pathname === item.href;

                                return (
                                    <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                                        <div
                                            className={cn(
                                                "flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-colors",
                                                isActive
                                                    ? "bg-emerald-500/10 text-emerald-400 font-bold"
                                                    : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300 active:bg-white/[0.08] active:text-white font-medium"
                                            )}
                                        >
                                            <item.icon
                                                className={cn(
                                                    "h-5 w-5",
                                                    isActive ? "text-emerald-400" : "text-zinc-600"
                                                )}
                                            />
                                            <span className="text-sm tracking-wide">{item.label}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Bottom Area */}
                        <div className="p-4 border-t border-white/[0.06]">
                            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                                <div className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300 active:bg-white/[0.08] active:text-white transition-colors font-medium">
                                    <Settings className="h-5 w-5 text-zinc-600" />
                                    <span className="text-sm tracking-wide">Configurações</span>
                                </div>
                            </Link>

                            <div className="px-4 mt-4 mb-2 flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-700">LetImage Studio</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-500/50">v1.0</span>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
