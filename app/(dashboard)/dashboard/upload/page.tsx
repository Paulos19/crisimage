import { UploadZone } from "@/components/upload-zone";
import { Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Nova Compactação - LetImage",
};

export default function UploadPage() {
    return (
        <div className="max-w-4xl mx-auto pt-4 space-y-6">
            {/* Back link */}
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-600 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar ao Dashboard
            </Link>

            <div className="relative bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                {/* Top accent line */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

                {/* Header */}
                <div className="px-6 md:px-8 py-7 border-b border-zinc-100 dark:border-white/[0.06]">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                            <Zap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
                                Nova Compactação
                            </h2>
                            <p className="text-sm text-zinc-500 mt-0.5 font-medium">
                                Selecione até 50 imagens. Elas serão unificadas em um único arquivo protegido.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Upload Zone */}
                <div className="px-4 py-8 md:px-10">
                    <UploadZone />
                </div>
            </div>
        </div>
    );
}
