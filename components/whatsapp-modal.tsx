"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateUserPhone } from "@/actions/update-phone";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px] [&>button]:hidden" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Complete seu cadastro</DialogTitle>
          <DialogDescription>
            Para baixar os arquivos e receber o link, precisamos do seu WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="whatsapp">WhatsApp (com DDD)</Label>
            <Input
              id="whatsapp"
              placeholder="11999999999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading || phone.length < 10}>
            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
            {loading ? "Salvando..." : "Salvar e Continuar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}