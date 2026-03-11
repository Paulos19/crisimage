import { RecentUploads } from "@/components/recent-uploads";
import { Suspense } from "react";
import { Loader2, FileArchive, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Meus Uploads - LetImage",
};

export default function UploadsPage() {
    return (
        <div className="max-w-5xl mx-auto pt-4 space-y-6">
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
                            <FileArchive className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
                                Seus Uploads Ativos
                            </h2>
                            <p className="text-sm text-zinc-500 mt-0.5 font-medium">
                                Acompanhe e gerencie os links gerados para seus clientes. Válidos por 5 dias.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-4 py-8 md:px-8">
                    <Suspense fallback={
                        <div className="flex flex-col justify-center items-center py-20 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-emerald-500/50" />
                            <p className="text-sm font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">Carregando uploads...</p>
                        </div>
                    }>
                        <RecentUploads />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
