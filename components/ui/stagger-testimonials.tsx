"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
    {
        tempId: 0,
        testimonial: "Desde que comecei a usar a LetImage, meus clientes ficam impressionados com a experiência de entrega. A galeria é linda e a marca d'água me dá segurança total.",
        by: "Camila Ferreira, Fotógrafa de Casamentos",
        imgSrc: "https://i.pravatar.cc/150?img=45"
    },
    {
        tempId: 1,
        testimonial: "A velocidade de upload é absurda. Eu subia 500 fotos no Google Drive e demorava horas, agora levo minutos. Meu cliente vê tudo com a minha marca.",
        by: "Rafael Mendes, Estúdio de Ensaios",
        imgSrc: "https://i.pravatar.cc/150?img=12"
    },
    {
        tempId: 2,
        testimonial: "O sistema de chave secreta mudou meu fluxo de vendas. Envio a galeria com marca d'água, o cliente escolhe, paga e libera sozinho. Zero dor de cabeça.",
        by: "Juliana Costa, Fotógrafa Corporativa",
        imgSrc: "https://i.pravatar.cc/150?img=32"
    },
    {
        tempId: 3,
        testimonial: "Profissionalismo em outro nível. Meus clientes achavam que eu tinha uma equipe de TI por trás. É só a LetImage mesmo.",
        by: "Thiago Oliveira, Fotógrafo de Eventos",
        imgSrc: "https://i.pravatar.cc/150?img=11"
    },
    {
        tempId: 4,
        testimonial: "Se pudesse dar 11 estrelas, daria 12. A plataforma mais completa que já usei para entrega de fotos.",
        by: "Mariana Santos, Fotógrafa Newborn",
        imgSrc: "https://i.pravatar.cc/150?img=26"
    },
    {
        tempId: 5,
        testimonial: "Eu estava perdida antes de encontrar a LetImage. Já economizei mais de 100 horas de trabalho manual!",
        by: "Beatriz Lima, Fotógrafa de Moda",
        imgSrc: "https://i.pravatar.cc/150?img=44"
    },
    {
        tempId: 6,
        testimonial: "Demorei para adotar, mas agora que estou na LetImage, nunca mais volto. Meu fluxo de trabalho mudou completamente.",
        by: "Lucas Rocha, Fotógrafo Esportivo",
        imgSrc: "https://i.pravatar.cc/150?img=53"
    },
    {
        tempId: 7,
        testimonial: "Eu ficaria perdido sem as análises detalhadas da LetImage. O ROI é facilmente 100x para o meu estúdio.",
        by: "Daniel Souza, Estúdio Profissional",
        imgSrc: "https://i.pravatar.cc/150?img=14"
    },
    {
        tempId: 8,
        testimonial: "É simplesmente a melhor plataforma para fotógrafos. Ponto final.",
        by: "Fernando Alves, Fotógrafo de Paisagens",
        imgSrc: "https://i.pravatar.cc/150?img=7"
    },
    {
        tempId: 9,
        testimonial: "Mudei há 2 anos e nunca mais olhei para trás. A LetImage transformou meu negócio.",
        by: "André Costa, Fotógrafo Documental",
        imgSrc: "https://i.pravatar.cc/150?img=60"
    },
    {
        tempId: 10,
        testimonial: "Busquei uma solução assim por anos. Finalmente encontrei na LetImage tudo que precisava!",
        by: "Patrícia Reis, Fotógrafa de Família",
        imgSrc: "https://i.pravatar.cc/150?img=29"
    },
    {
        tempId: 11,
        testimonial: "Tão simples e intuitivo que minha equipe inteira aprendeu em 10 minutos. Impressionante.",
        by: "Marina Lopes, Gestora de Estúdio",
        imgSrc: "https://i.pravatar.cc/150?img=23"
    },
];

interface TestimonialCardProps {
    position: number;
    testimonial: typeof testimonials[0];
    handleMove: (steps: number) => void;
    cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
    position,
    testimonial,
    handleMove,
    cardSize
}) => {
    const isCenter = position === 0;

    return (
        <div
            onClick={() => handleMove(position)}
            className={cn(
                "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
                isCenter
                    ? "z-10 border-emerald-500"
                    : "z-0 border-white/[0.08] hover:border-emerald-500/30"
            )}
            style={{
                width: cardSize,
                height: cardSize,
                background: isCenter
                    ? 'linear-gradient(145deg, #064e3b, #065f46, #047857)'
                    : '#111111',
                clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
                transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
                boxShadow: isCenter
                    ? "0px 8px 0px 4px rgba(16, 185, 129, 0.3), 0 0 60px rgba(16, 185, 129, 0.1)"
                    : "0px 0px 0px 0px transparent"
            }}
        >
            <span
                className={cn(
                    "absolute block origin-top-right rotate-45",
                    isCenter ? "bg-emerald-500" : "bg-white/[0.08]"
                )}
                style={{
                    right: -2,
                    top: 48,
                    width: SQRT_5000,
                    height: 2
                }}
            />
            <img
                src={testimonial.imgSrc}
                alt={`${testimonial.by.split(',')[0]}`}
                className="mb-4 h-14 w-12 bg-zinc-800 object-cover object-top"
                style={{
                    boxShadow: isCenter
                        ? "3px 3px 0px rgba(0, 0, 0, 0.4)"
                        : "3px 3px 0px #0a0a0a"
                }}
            />
            <h3 className={cn(
                "text-base sm:text-xl font-medium leading-relaxed",
                isCenter ? "text-white" : "text-zinc-300"
            )}>
                &ldquo;{testimonial.testimonial}&rdquo;
            </h3>
            <p className={cn(
                "absolute bottom-8 left-8 right-8 mt-2 text-sm italic",
                isCenter ? "text-emerald-200/80" : "text-zinc-500"
            )}>
                - {testimonial.by}
            </p>
        </div>
    );
};

export const StaggerTestimonials: React.FC = () => {
    const [cardSize, setCardSize] = useState(365);
    const [testimonialsList, setTestimonialsList] = useState(testimonials);

    const handleMove = (steps: number) => {
        const newList = [...testimonialsList];
        if (steps > 0) {
            for (let i = steps; i > 0; i--) {
                const item = newList.shift();
                if (!item) return;
                newList.push({ ...item, tempId: Math.random() });
            }
        } else {
            for (let i = steps; i < 0; i++) {
                const item = newList.pop();
                if (!item) return;
                newList.unshift({ ...item, tempId: Math.random() });
            }
        }
        setTestimonialsList(newList);
    };

    useEffect(() => {
        const updateSize = () => {
            const { matches } = window.matchMedia("(min-width: 640px)");
            setCardSize(matches ? 365 : 290);
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return (
        <div
            className="relative w-full overflow-hidden"
            style={{ height: 600, background: 'transparent' }}
        >
            {testimonialsList.map((testimonial, index) => {
                const position = testimonialsList.length % 2
                    ? index - (testimonialsList.length + 1) / 2
                    : index - testimonialsList.length / 2;
                return (
                    <TestimonialCard
                        key={testimonial.tempId}
                        testimonial={testimonial}
                        handleMove={handleMove}
                        position={position}
                        cardSize={cardSize}
                    />
                );
            })}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                <button
                    onClick={() => handleMove(-1)}
                    className={cn(
                        "flex h-14 w-14 items-center justify-center text-2xl transition-all duration-300",
                        "bg-[#111] border-2 border-white/[0.08] text-zinc-400",
                        "hover:bg-emerald-600 hover:text-white hover:border-emerald-500",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                    )}
                    aria-label="Testemunho anterior"
                >
                    <ChevronLeft />
                </button>
                <button
                    onClick={() => handleMove(1)}
                    className={cn(
                        "flex h-14 w-14 items-center justify-center text-2xl transition-all duration-300",
                        "bg-[#111] border-2 border-white/[0.08] text-zinc-400",
                        "hover:bg-emerald-600 hover:text-white hover:border-emerald-500",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                    )}
                    aria-label="Próximo testemunho"
                >
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
};
