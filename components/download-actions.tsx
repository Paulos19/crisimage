"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2, CheckCircle } from "lucide-react";
import { sendWhatsappNotification } from "@/actions/trigger-whatsapp";
import { toast } from "sonner"; // Ou use o hook de toast do shadcn se tiver instalado

export function DownloadActions({ link, title }: { link: string, title: string }) {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSendWhatsapp = async () => {
        setLoading(true);
        const res = await sendWhatsappNotification(link, title);
        
        if (res.success) {
            setSent(true);
            // toast.success("Enviado para seu WhatsApp!");
        } else {
            alert("Erro ao enviar: " + res.error);
        }
        setLoading(false);
    };

    return (
        <div className="flex gap-4">
            {/* O botão de Download já está dentro do DownloadViewer, 
                mas se quiser um botão extra aqui, pode colocar.
                O foco aqui é o botão do N8N. */}
            
            <Button 
                onClick={handleSendWhatsapp} 
                disabled={loading || sent}
                variant="secondary"
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
            >
                {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : sent ? (
                    <CheckCircle className="mr-2 h-4 w-4" />
                ) : (
                    <MessageCircle className="mr-2 h-4 w-4" />
                )}
                {sent ? "Enviado!" : "Receber no WhatsApp"}
            </Button>
        </div>
    );
}