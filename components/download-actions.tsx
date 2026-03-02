"use client";

import { useState } from "react";
import { MessageCircle, Loader2, CheckCircle } from "lucide-react";
import { sendWhatsappNotification } from "@/actions/trigger-whatsapp";

export function DownloadActions({ link, title }: { link: string, title: string }) {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSendWhatsapp = async () => {
        setLoading(true);
        const res = await sendWhatsappNotification(link, title);

        if (res.success) {
            setSent(true);
        } else {
            alert("Erro ao enviar: " + res.error);
        }
        setLoading(false);
    };

    return (
        <div className="flex gap-4">
            <button
                onClick={handleSendWhatsapp}
                disabled={loading || sent}
                className={`
                    w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all
                    ${sent
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default"
                        : "bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                `}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : sent ? (
                    <CheckCircle className="h-4 w-4" />
                ) : (
                    <MessageCircle className="h-4 w-4" />
                )}
                {sent ? "Enviado!" : "Receber no WhatsApp"}
            </button>
        </div>
    );
}