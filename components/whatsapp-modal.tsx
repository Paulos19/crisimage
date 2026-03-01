"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateUserPhone } from "@/actions/update-phone";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, MessageCircle } from "lucide-react";
// REMOVIDO: import { useSession } from "next-auth/react"; 

export function WhatsAppModal({ isOpen }: { isOpen: boolean }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // REMOVIDO: const { update } = useSession();

  const handleSubmit = async () => {
    if (phone.length < 10) return;

    setLoading(true);

    // 1. Atualiza no Banco via Server Action
    const res = await updateUserPhone(phone);

    if (res.success) {
      // 2. Apenas recarrega a rota. 
      // Como a Page (Server Component) busca direto do Prisma, ela vai pegar o dado novo.
      router.refresh();

      // O loading continua true visualmente até a página recarregar e o modal sumir.
    } else {
      alert(res.error);
      setLoading(false);
    }
  };

  // Se não estiver aberto, nem renderiza
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => { }}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl [&>button]:hidden bg-white dark:bg-card" onInteractOutside={(e) => e.preventDefault()}>

        <div className="bg-gradient-to-br from-green-500 to-emerald-700 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 relative z-10 shadow-inner ring-1 ring-white/30">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <DialogHeader className="relative z-10 space-y-2">
            <DialogTitle className="text-2xl font-bold text-white tracking-tight">Quase lá!</DialogTitle>
            <DialogDescription className="text-green-50 font-medium text-sm leading-relaxed px-2">
              Precisamos do seu WhatsApp para garantir a segurança da galeria e facilitar o acesso futuro aos links protegidos.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Seu número será usado apenas para vinculação segura aos downloads e para que fotógrafos possam lhe reenviar links inspirados.
            </p>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="whatsapp" className="text-sm font-semibold ml-1">WhatsApp (com DDD)</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium select-none">+55</span>
              <Input
                id="whatsapp"
                placeholder="11 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className="pl-12 h-12 rounded-xl border-neutral-200 dark:border-neutral-800 focus-visible:ring-green-500 text-lg transition-all"
                autoComplete="tel"
              />
            </div>
          </div>

          <DialogFooter className="mt-2 text-center w-full sm:justify-center">
            <Button
              onClick={handleSubmit}
              disabled={loading || phone.length < 10}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg shadow-green-500/20 text-base"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
              {loading ? "Validando acesso..." : "Acessar Galeria Protegida"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}