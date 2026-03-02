"use client"

const items = [
    "Casamentos",
    "Ensaios",
    "Estúdios",
    "Eventos",
    "Corporativo",
    "Newborn",
    "Moda",
    "Família",
    "Paisagens",
    "Documental",
]

export function MarqueeBanner() {
    // Render the list 4 times for seamless infinite loop
    const repeated = [...items, ...items, ...items, ...items]

    return (
        <div className="relative w-full overflow-hidden py-6 border-y border-white/[0.04] bg-gradient-to-r from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />

            <div className="flex animate-marquee whitespace-nowrap">
                {repeated.map((item, i) => (
                    <span
                        key={i}
                        className="mx-6 md:mx-10 text-sm md:text-base font-black uppercase tracking-[0.2em] text-zinc-700 hover:text-emerald-500/60 transition-colors duration-300 cursor-default shrink-0"
                        style={i % 3 === 1 ? { fontStyle: "italic" } : undefined}
                    >
                        {item}
                        <span className="ml-6 md:ml-10 text-emerald-500/30 text-xs">✦</span>
                    </span>
                ))}
            </div>
        </div>
    )
}
