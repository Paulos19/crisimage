"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendWhatsappNotification } from "@/actions/trigger-whatsapp";
import { Loader2, MessageCircle, Sparkles, AlertCircle } from "lucide-react";

interface WhatsAppClientModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    uploadId: string;
    link: string;
    title: string;
}

export function WhatsAppClientModal({ isOpen, onOpenChange, uploadId, link, title }: WhatsAppClientModalProps) {
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (phone.length < 10) return;

        setLoading(true);
        setError(null);
        setSent(false);

        try {
            const res = await sendWhatsappNotification(link, title, phone);
            if (res.success) {
                setSent(true);
                setTimeout(() => {
                    onOpenChange(false);
                    setSent(false); // Reset for next time
                    setPhone("");
                }, 2000);
            } else {
                setError(res.error || "Ocorreu um erro ao enviar a mensagem.");
            }
        } catch (err: any) {
            setError(err.message || "Erro de rede. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/50 rounded-2xl bg-[#111111]" onInteractOutside={(e) => e.preventDefault()}>
                {/* Header with emerald gradient */}
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-900 p-8 text-center relative overflow-hidden">
                    {/* Ambient glow */}
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="mx-auto w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 relative z-10 ring-1 ring-white/20">
                        <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                    <DialogHeader className="relative z-10 space-y-2">
                        <DialogTitle className="text-2xl font-black text-white tracking-tight uppercase">Enviar p/ Cliente</DialogTitle>
                        <DialogDescription className="text-emerald-100/80 font-medium text-sm leading-relaxed px-2">
                            Informe o WhatsApp do cliente para enviar o link desta galeria diretamente para ele.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                            <p className="text-[12px] font-bold text-red-300 leading-relaxed uppercase tracking-wider">{error}</p>
                        </div>
                    )}

                    <div className="grid w-full items-center gap-2">
                        <Label htmlFor="whatsapp" className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">
                            WhatsApp do Cliente (com DDD)
                        </Label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-bold text-sm select-none">+55</span>
                            <Input
                                id="whatsapp"
                                placeholder="11 99999-9999"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={loading || sent}
                                className="pl-12 h-12 rounded-xl bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-700 focus:border-emerald-500/40 focus:ring-emerald-500/20 text-lg transition-all"
                                autoComplete="tel"
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-2 text-center w-full sm:justify-center">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || sent || phone.length < 10}
                            className={`w-full h-12 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 ${sent
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-none hover:bg-emerald-500/20"
                                    : "bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5" /> Enviando...
                                </>
                            ) : sent ? (
                                <>
                                    <Sparkles className="h-4 w-4" /> Enviado com sucesso!
                                </>
                            ) : (
                                <>
                                    <MessageCircle className="h-4 w-4" /> Enviar Galeria
                                </>
                            )}
                        </button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
