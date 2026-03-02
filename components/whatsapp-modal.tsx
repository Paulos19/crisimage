"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserPhone } from "@/actions/update-phone";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, MessageCircle, Sparkles } from "lucide-react";

export function WhatsAppModal({ isOpen }: { isOpen: boolean }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (phone.length < 10) return;

    setLoading(true);

    const res = await updateUserPhone(phone);

    if (res.success) {
      router.refresh();
    } else {
      alert(res.error);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => { }}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/50 rounded-2xl [&>button]:hidden bg-[#111111]" onInteractOutside={(e) => e.preventDefault()}>

        {/* Header with emerald gradient */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-900 p-8 text-center relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="mx-auto w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 relative z-10 ring-1 ring-white/20">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <DialogHeader className="relative z-10 space-y-2">
            <DialogTitle className="text-2xl font-black text-white tracking-tight uppercase">Quase lá!</DialogTitle>
            <DialogDescription className="text-emerald-100/80 font-medium text-sm leading-relaxed px-2">
              Precisamos do seu WhatsApp para garantir a segurança da galeria e facilitar o acesso futuro aos links protegidos.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-white/[0.03] border border-white/[0.06] p-4 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Seu número será usado apenas para vinculação segura aos downloads e para que fotógrafos possam lhe reenviar links.
            </p>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="whatsapp" className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">
              WhatsApp (com DDD)
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-bold text-sm select-none">+55</span>
              <Input
                id="whatsapp"
                placeholder="11 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className="pl-12 h-12 rounded-xl bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-700 focus:border-emerald-500/40 focus:ring-emerald-500/20 text-lg transition-all"
                autoComplete="tel"
              />
            </div>
          </div>

          <DialogFooter className="mt-2 text-center w-full sm:justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading || phone.length < 10}
              className="w-full h-12 rounded-xl bg-emerald-500 text-black font-bold text-sm uppercase tracking-wider hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Validando acesso..." : "Acessar Galeria Protegida"}
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}