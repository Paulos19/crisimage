import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Camera } from "lucide-react";
import { SplineScene } from "@/components/spline-scene";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";
import CallToAction from "@/components/ui/call-to-action";
import { FrameSequenceCanvas } from "@/components/ui/frame-sequence-canvas";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white selection:bg-emerald-500/30">

      {/* ============================================= */}
      {/* NAVBAR — minimal, floating style               */}
      {/* ============================================= */}
      <header className="fixed top-0 z-50 w-full backdrop-blur-md bg-[#0a0a0a]/80 border-b border-white/[0.04]">
        <div className="mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <a href="#hero" className="text-lg font-extrabold tracking-tight uppercase hover:text-emerald-400 transition-colors">
              ★ Crisimage
            </a>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors tracking-wide uppercase">Recursos</a>
            <a href="#testimonials" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors tracking-wide uppercase">Testemunhos</a>
            <a href="#contact" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors tracking-wide uppercase">Contato</a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors tracking-wide uppercase hidden sm:block"
            >
              // Entrar
            </Link>
            <Link
              href="/dashboard/upload"
              className="flex items-center gap-2 text-sm font-bold bg-emerald-500 text-black rounded-full px-5 py-2.5 hover:bg-emerald-400 transition-colors"
            >
              Começar <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================= */}
      {/* HERO — Bold Oversized Typography                */}
      {/* ============================================= */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-between pt-20 overflow-hidden scroll-mt-20">

        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-emerald-900/[0.08] rounded-full blur-[200px]" />
          <div className="absolute top-[20%] right-[0%] w-[500px] h-[500px] bg-teal-900/[0.06] rounded-full blur-[180px]" />
          <div className="absolute bottom-[10%] left-[30%] w-[700px] h-[400px] bg-emerald-950/[0.05] rounded-full blur-[160px]" />
        </div>

        {/* OVERSIZED BACKGROUND TEXT */}
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none select-none z-0 overflow-hidden">
          <span className="text-[22vw] md:text-[18vw] font-black uppercase leading-[0.85] tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.06)] whitespace-nowrap">
            GALERIA
          </span>
          <span className="text-[22vw] md:text-[18vw] font-black uppercase leading-[0.85] tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.06)] whitespace-nowrap">
            PREMIUM
          </span>
        </div>

        {/* Main Content Layer */}
        <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 px-6 lg:px-16 pt-10">

          {/* LEFT — Headline + CTA */}
          <div className="flex-1 flex flex-col justify-center max-w-3xl">
            <h1 className="text-[clamp(3.5rem,10vw,9rem)] font-black uppercase leading-[0.9] tracking-tighter mb-6">
              <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-zinc-500">
                ENTREGA
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-600">
                VISUAL
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-800">
                PREMIUM
              </span>
            </h1>

            <p className="text-sm md:text-base text-zinc-500 max-w-md mb-8 leading-relaxed uppercase tracking-wider font-medium">
              // A plataforma definitiva para fotógrafos.{" "}
              <span className="text-zinc-300">
                Galerias protegidas, marca d&apos;água automática e venda segura em um link.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard/upload"
                className="group inline-flex items-center justify-center rounded-full text-base font-bold uppercase tracking-wider bg-emerald-500 text-black hover:bg-emerald-400 transition-all duration-300 h-14 px-10"
              >
                Criar Galeria
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full text-base font-bold uppercase tracking-wider border border-emerald-500/20 text-white hover:bg-emerald-500/5 transition-all h-14 px-10"
              >
                Ver Demo
              </Link>
            </div>
          </div>

          {/* RIGHT — 3D SPLINE MODEL */}
          <div className="flex-1 relative w-full max-w-2xl aspect-square flex items-center justify-center">
            <SplineScene
              scene="https://prod.spline.design/G1aGj89GDMKwaYTi/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* BOTTOM BAR — Client types */}
        <div className="relative z-10 w-full border-t border-white/[0.06] bg-white/[0.01] backdrop-blur-sm">
          <div className="w-full px-6 lg:px-16 py-6 flex flex-wrap items-center justify-between gap-6">
            <span className="text-base md:text-lg font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-emerald-400/60 transition-colors cursor-default">Casamentos</span>
            <span className="text-base md:text-lg font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-emerald-400/60 transition-colors cursor-default">Ensaios</span>
            <span className="text-base md:text-lg font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-emerald-400/60 transition-colors cursor-default" style={{ fontStyle: "italic" }}>Estúdios</span>
            <span className="text-base md:text-lg font-black uppercase tracking-[0.15em] text-zinc-600 hover:text-emerald-400/60 transition-colors cursor-default">Eventos</span>
            <span className="text-base md:text-lg font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-emerald-400/60 transition-colors cursor-default">Corporativo</span>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* CINEMATIC SCROLL — Frame Sequence Animation    */}
      {/* ============================================= */}
      <section id="cinematic" className="relative bg-[#0a0a0a]">
        <FrameSequenceCanvas />
      </section>

      {/* ============================================= */}
      {/* FEATURES — Bold section                        */}
      {/* ============================================= */}
      <section id="features" className="relative py-32 bg-[#0a0a0a] border-t border-white/[0.06] scroll-mt-20">
        {/* Section glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-emerald-900/[0.05] rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full px-6 lg:px-16 relative z-10">
          {/* Section Header */}
          <div className="mb-20">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">Projetado</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-700">para converter.</span>
            </h2>
            <p className="text-zinc-500 text-base md:text-lg max-w-xl font-medium uppercase tracking-wider leading-relaxed">
              // Tudo que você precisa para entregar fotos, valorizar seu trabalho e ser pago.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-3xl overflow-hidden">
            {/* Card 1 */}
            <div className="group bg-[#0a0a0a] p-10 hover:bg-[#0e0e0e] transition-colors duration-500 relative">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-14 w-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-8 group-hover:bg-emerald-500/10 transition-colors">
                <Zap className="h-7 w-7 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Velocidade Extrema</h3>
              <p className="text-zinc-500 leading-relaxed text-sm font-medium">
                Compactação e upload de múltiplas imagens direto no navegador. Sem lentidão, garantindo entrega em segundos.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-[#0a0a0a] p-10 hover:bg-[#0e0e0e] transition-colors duration-500 relative">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-14 w-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-8 group-hover:bg-emerald-500/10 transition-colors">
                <ShieldCheck className="h-7 w-7 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Venda Protegida</h3>
              <p className="text-zinc-500 leading-relaxed text-sm font-medium">
                Marca d&apos;água automática na sua logo. O cliente só baixa a versão limpa após digitar a chave secreta de compra.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group bg-[#0a0a0a] p-10 hover:bg-[#0e0e0e] transition-colors duration-500 relative">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-14 w-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-8 group-hover:bg-emerald-500/10 transition-colors">
                <Camera className="h-7 w-7 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Experiência Focada</h3>
              <p className="text-zinc-500 leading-relaxed text-sm font-medium">
                Uma galeria elegante e imersiva. Um link profissional que impressiona seu cliente e converte muito mais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* TESTIMONIALS — Social Proof                    */}
      {/* ============================================= */}
      <section id="testimonials" className="relative py-32 bg-[#080808] border-t border-white/[0.06] scroll-mt-20 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-900/[0.06] rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-900/[0.04] rounded-full blur-[160px] pointer-events-none" />

        {/* OVERSIZED BACKGROUND TEXT */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <span className="text-[18vw] md:text-[14vw] font-black uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.03)] whitespace-nowrap">
            FEEDBACK
          </span>
        </div>

        <div className="w-full px-6 lg:px-16 relative z-10">
          {/* Section Header */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-emerald-500 to-transparent" />
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-400">
                // Testemunhos
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">Quem usa,</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-700">recomenda.</span>
            </h2>
            <p className="text-zinc-500 text-base md:text-lg max-w-xl font-medium uppercase tracking-wider leading-relaxed">
              // Fotógrafos que transformaram sua entrega com a Crisimage.
            </p>
          </div>

          {/* Stagger Testimonials Carousel */}
          <StaggerTestimonials />

          {/* Social proof stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
            {[
              { value: "500+", label: "Fotógrafos" },
              { value: "120k+", label: "Fotos Entregues" },
              { value: "99%", label: "Satisfação" },
              { value: "< 2min", label: "Tempo de Upload" },
            ].map((stat, i) => (
              <div key={i} className="bg-[#080808] p-8 text-center hover:bg-[#0c0c0c] transition-colors duration-300">
                <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-600 mb-2">
                  {stat.value}
                </p>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* CTA — Contact Section                          */}
      {/* ============================================= */}
      <section id="contact" className="relative bg-[#0a0a0a] border-t border-white/[0.06] scroll-mt-20">
        <CallToAction />
      </section>

      {/* ============================================= */}
      {/* FOOTER                                         */}
      {/* ============================================= */}
      <footer id="footer" className="border-t border-white/[0.06] py-10 bg-[#080808]">
        <div className="w-full px-6 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-extrabold tracking-tight uppercase text-zinc-500">
            ★ Crisimage
          </span>
          <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider">
            © {new Date().getFullYear()} Crisimage. A plataforma definitiva para fotógrafos.
          </p>
        </div>
      </footer>
    </div>
  );
}
