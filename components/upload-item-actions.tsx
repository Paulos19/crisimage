"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, MessageCircle } from "lucide-react";
import { CopyButton } from "./copy-button";
import { WhatsAppClientModal } from "./whatsapp-client-modal";

interface UploadItemActionsProps {
    uploadId: string;
    link: string;
    title: string;
    slug: string;
}

export function UploadItemActions({ uploadId, link, title, slug }: UploadItemActionsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <WhatsAppClientModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                uploadId={uploadId}
                link={link}
                title={title}
            />

            <CopyButton text={link} />

            <button
                onClick={() => setIsModalOpen(true)}
                title="Enviar p/ WhatsApp"
                className="h-8 w-8 flex items-center justify-center text-zinc-400 dark:text-zinc-600 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-all"
            >
                <MessageCircle className="h-4 w-4" />
            </button>

            <Link
                href={`/download/${slug}`}
                target="_blank"
                title="Ver Galeria"
                className="h-8 w-8 flex items-center justify-center text-zinc-400 dark:text-zinc-600 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-all"
            >
                <ExternalLink className="h-4 w-4" />
            </Link>
        </>
    );
}
