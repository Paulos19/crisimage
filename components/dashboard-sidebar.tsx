"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UploadCloud, FileArchive, ActivitySquare, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarItem {
    icon: React.ElementType;
    label: string;
    href: string;
}

const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Visão Geral", href: "/dashboard" },
    { icon: UploadCloud, label: "Nova Compactação", href: "/dashboard/upload" },
    { icon: FileArchive, label: "Meus Uploads", href: "/dashboard/uploads" },
    { icon: ActivitySquare, label: "Relatório de Acessos", href: "/dashboard/acessos" },
];

export function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 flex-shrink-0 h-full bg-white/50 dark:bg-card/50 backdrop-blur-md border-r border-border/50 hidden md:flex flex-col">
            <div className="p-6">
                <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 tracking-tight">
                    Crisimage<span className="text-neutral-900 dark:text-white relative top-[-1px]">.</span>
                </h2>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">
                    Painel Studio
                </p>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
                                    isActive
                                        ? "bg-primary/10 text-primary font-semibold shadow-sm"
                                        : "text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-foreground font-medium"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "h-5 w-5 transition-colors",
                                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                    )}
                                />
                                {item.label}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border/50 mt-auto">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-destructive cursor-pointer transition-colors font-medium">
                    <Settings className="h-5 w-5" />
                    Configurações
                </div>
            </div>
        </div>
    );
}
