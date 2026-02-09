"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateUserPhone } from "@/actions/update-phone";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function WhatsAppModal({ isOpen }: { isOpen: boolean }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    const res = await updateUserPhone(phone);
    if (res.success) {
      router.refresh(); // Recarrega para atualizar a sessão do lado do servidor/cliente
      // O modal fechará automaticamente pois o componente pai vai re-renderizar com o dado atualizado
    } else {
      alert(res.error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
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
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading || phone.length < 10}>
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Salvar e Continuar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}