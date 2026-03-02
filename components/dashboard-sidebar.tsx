"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UploadCloud, FileArchive, ActivitySquare, Settings, LayoutDashboard, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
    icon: React.ElementType;
    label: string;
    href: string;
}

export const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Visão Geral", href: "/dashboard" },
    { icon: UploadCloud, label: "Nova Compactação", href: "/dashboard/upload" },
    { icon: FileArchive, label: "Meus Uploads", href: "/dashboard/uploads" },
    { icon: ActivitySquare, label: "Relatório de Acessos", href: "/dashboard/acessos" },
];

export function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-72 flex-shrink-0 h-full bg-[#0a0a0a] border-r border-white/[0.06] hidden md:flex flex-col relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-emerald-900/[0.08] rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-teal-900/[0.05] rounded-full blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2" />

            {/* Logo */}
            <div className="relative z-10 px-7 pt-8 pb-6">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-shadow">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black tracking-tight text-white uppercase">
                            Crisimage
                        </h2>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.25em]">
                            Painel Studio
                        </p>
                    </div>
                </Link>
            </div>

            {/* Divider */}
            <div className="mx-7 h-px bg-gradient-to-r from-emerald-500/20 via-white/[0.06] to-transparent" />

            {/* Navigation */}
            <nav className="relative z-10 flex-1 px-4 space-y-1 mt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 px-4 mb-3">
                    // Menu
                </p>
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={cn(
                                    "flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer relative overflow-hidden",
                                    isActive
                                        ? "bg-emerald-500/10 text-emerald-400 font-bold"
                                        : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300 font-medium"
                                )}
                            >
                                {/* Active indicator line */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-emerald-500 rounded-r-full" />
                                )}

                                <item.icon
                                    className={cn(
                                        "h-5 w-5 transition-all duration-300",
                                        isActive
                                            ? "text-emerald-400"
                                            : "text-zinc-600 group-hover:text-zinc-400"
                                    )}
                                />
                                <span className="text-sm tracking-wide">{item.label}</span>

                                {/* Active glow */}
                                {isActive && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-8 bg-emerald-500/10 blur-xl pointer-events-none" />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="relative z-10 p-4 border-t border-white/[0.06]">
                <Link href="/dashboard">
                    <div className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-zinc-600 hover:bg-white/[0.03] hover:text-zinc-400 cursor-pointer transition-all duration-300 font-medium">
                        <Settings className="h-5 w-5" />
                        <span className="text-sm tracking-wide">Configurações</span>
                    </div>
                </Link>

                {/* Version badge */}
                <div className="px-4 mt-3">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-zinc-700 font-medium uppercase tracking-wider">
                            v1.0 — Online
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
