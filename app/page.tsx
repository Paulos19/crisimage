import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Camera, Sparkles, Lock, Eye } from "lucide-react";
import { SplineScene } from "@/components/spline-scene";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";
import CallToAction from "@/components/ui/call-to-action";
import { FrameSequenceCanvas } from "@/components/ui/frame-sequence-canvas";
import { LpNavbar } from "@/components/lp-navbar";
import { LpFooter } from "@/components/lp-footer";
import { MarqueeBanner } from "@/components/marquee-banner";

export default function Home() {
  return (
    <div className="relative min-h-screen text-white selection:bg-emerald-500/30 overflow-x-hidden bg-[#0a0a0a] md:bg-transparent">

      {/* ============================================= */}
      {/* NAVBAR — Deconstructed, responsive             */}
      {/* ============================================= */}
      <LpNavbar />

      {/* ============================================= */}
      {/* HERO — Bold Oversized Typography + Spline      */}
      {/* ============================================= */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-between pt-16 lg:pt-20 overflow-hidden scroll-mt-20 bg-[#0a0a0a] z-10">

        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-emerald-900/[0.08] rounded-full blur-[200px]" />
          <div className="absolute top-[20%] right-[0%] w-[400px] h-[400px] bg-teal-900/[0.06] rounded-full blur-[180px]" />
          <div className="absolute bottom-[10%] left-[30%] w-[500px] h-[400px] bg-emerald-950/[0.05] rounded-full blur-[160px]" />
        </div>

        {/* Linear gradient overlay — top to bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] pointer-events-none z-0" />

        {/* OVERSIZED BACKGROUND TEXT */}
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none select-none z-0 overflow-hidden">
          <span className="text-[22vw] md:text-[18vw] font-black uppercase leading-[0.85] tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.04)] whitespace-nowrap">
            GALERIA
          </span>
          <span className="text-[22vw] md:text-[18vw] font-black uppercase leading-[0.85] tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.04)] whitespace-nowrap">
            PREMIUM
          </span>
        </div>

        {/* Main Content Layer */}
        <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 px-5 lg:px-16 pt-8 lg:pt-10">

          {/* LEFT — Headline + CTA */}
          <div className="flex-1 flex flex-col justify-center max-w-3xl text-center lg:text-left">
            <h1 className="text-[clamp(3rem,9vw,9rem)] font-black uppercase leading-[0.85] tracking-tighter mb-6">
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

            <p className="text-xs md:text-sm text-zinc-500 max-w-md mb-8 leading-relaxed uppercase tracking-wider font-medium mx-auto lg:mx-0">
              // A plataforma definitiva para fotógrafos.{" "}
              <span className="text-zinc-300">
                Galerias protegidas, marca d&apos;água automática e venda segura em um link.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/dashboard/upload"
                className="group inline-flex items-center justify-center rounded-full text-sm font-bold uppercase tracking-wider bg-emerald-500 text-black hover:bg-emerald-400 transition-all duration-300 h-12 lg:h-14 px-8 lg:px-10 shadow-lg shadow-emerald-500/20"
              >
                Criar Galeria
                <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full text-sm font-bold uppercase tracking-wider border border-emerald-500/20 text-white hover:bg-emerald-500/5 transition-all h-12 lg:h-14 px-8 lg:px-10"
              >
                Ver Demo
              </Link>
            </div>
          </div>

          {/* RIGHT — 3D SPLINE MODEL */}
          <div className="flex-1 relative w-full max-w-xl lg:max-w-2xl aspect-square flex items-center justify-center">
            <SplineScene
              scene="https://prod.spline.design/G1aGj89GDMKwaYTi/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* MARQUEE CAROUSEL — separating hero from cinematic */}
        <MarqueeBanner />
      </section>

      {/* ============================================= */}
      {/* CINEMATIC SCROLL — Frame Sequence Animation    */}
      {/* ============================================= */}
      <section id="cinematic" className="relative z-0">
        <FrameSequenceCanvas />
      </section>

      {/* ============================================= */}
      {/* FEATURES — Bold section with parallax feel     */}
      {/* ============================================= */}
      <section id="features" className="relative py-24 md:py-32 bg-[#0a0a0a] z-10 scroll-mt-20 overflow-hidden shadow-2xl">
        {/* Linear gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#080808] to-[#0a0a0a] pointer-events-none" />

        {/* Section glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-emerald-900/[0.05] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-0 w-[400px] h-[400px] bg-emerald-900/[0.03] rounded-full blur-[200px] pointer-events-none" />

        {/* Oversized bg text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <span className="text-[20vw] md:text-[16vw] font-black uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.02)] whitespace-nowrap">
            FEATURES
          </span>
        </div>

        <div className="w-full px-5 lg:px-16 relative z-10">
          {/* Section Header */}
          <div className="mb-16 md:mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-emerald-500 to-transparent" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-emerald-400">
                // Recursos
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-4 md:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">Projetado</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-700">para converter.</span>
            </h2>
            <p className="text-zinc-500 text-sm md:text-base max-w-xl font-medium uppercase tracking-wider leading-relaxed">
              // Tudo que você precisa para entregar fotos, valorizar seu trabalho e ser pago.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl md:rounded-3xl overflow-hidden">
            {/* Card 1 */}
            <div className="group bg-[#0a0a0a] p-8 md:p-10 hover:bg-[#0e0e0e] transition-colors duration-500 relative">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-6 md:mb-8 group-hover:bg-emerald-500/10 transition-colors">
                <Zap className="h-6 w-6 md:h-7 md:w-7 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-3 md:mb-4">Velocidade Extrema</h3>
              <p className="text-zinc-500 leading-relaxed text-xs md:text-sm font-medium">
                Compactação e upload de múltiplas imagens direto no navegador. Sem lentidão, garantindo entrega em segundos.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-[#0a0a0a] p-8 md:p-10 hover:bg-[#0e0e0e] transition-colors duration-500 relative">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-6 md:mb-8 group-hover:bg-emerald-500/10 transition-colors">
                <ShieldCheck className="h-6 w-6 md:h-7 md:w-7 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-3 md:mb-4">Venda Protegida</h3>
              <p className="text-zinc-500 leading-relaxed text-xs md:text-sm font-medium">
                Marca d&apos;água automática na sua logo. O cliente só baixa a versão limpa após digitar a chave secreta de compra.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group bg-[#0a0a0a] p-8 md:p-10 hover:bg-[#0e0e0e] transition-colors duration-500 relative">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-6 md:mb-8 group-hover:bg-emerald-500/10 transition-colors">
                <Camera className="h-6 w-6 md:h-7 md:w-7 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-3 md:mb-4">Experiência Focada</h3>
              <p className="text-zinc-500 leading-relaxed text-xs md:text-sm font-medium">
                Uma galeria elegante e imersiva. Um link profissional que impressiona seu cliente e converte muito mais.
              </p>
            </div>
          </div>

          {/* Extra feature highlights — responsive grid */}
          <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
            {[
              { icon: Lock, label: "Chave Secreta", desc: "Controle total de acesso" },
              { icon: Eye, label: "Pré-visualização", desc: "Galeria interativa com zoom" },
              { icon: Sparkles, label: "QR Code", desc: "Compartilhamento instantâneo" },
            ].map((item, i) => (
              <div key={i} className="bg-[#0a0a0a] p-6 md:p-8 flex items-center gap-4 hover:bg-[#0e0e0e] transition-colors group">
                <div className="h-10 w-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10 transition-colors">
                  <item.icon className="h-5 w-5 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-wider">{item.label}</p>
                  <p className="text-[11px] text-zinc-600 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* TESTIMONIALS — Social Proof                    */}
      {/* ============================================= */}
      <section id="testimonials" className="relative py-24 md:py-32 bg-[#080808] z-10 scroll-mt-20 overflow-hidden shadow-2xl">
        {/* Gradient border top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />

        {/* Ambient glows */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-900/[0.06] rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-900/[0.04] rounded-full blur-[160px] pointer-events-none" />

        {/* OVERSIZED BACKGROUND TEXT */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <span className="text-[18vw] md:text-[14vw] font-black uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.02)] whitespace-nowrap">
            FEEDBACK
          </span>
        </div>

        <div className="w-full px-5 lg:px-16 relative z-10">
          {/* Section Header */}
          <div className="mb-16 md:mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-emerald-500 to-transparent" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-emerald-400">
                // Testemunhos
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-4 md:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">Quem usa,</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-700">recomenda.</span>
            </h2>
            <p className="text-zinc-500 text-sm md:text-base max-w-xl font-medium uppercase tracking-wider leading-relaxed">
              // Fotógrafos que transformaram sua entrega com a LetImage.
            </p>
          </div>

          {/* Stagger Testimonials Carousel */}
          <StaggerTestimonials />

          {/* Social proof stats */}
          <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
            {[
              { value: "500+", label: "Fotógrafos" },
              { value: "120k+", label: "Fotos Entregues" },
              { value: "99%", label: "Satisfação" },
              { value: "< 2min", label: "Tempo de Upload" },
            ].map((stat, i) => (
              <div key={i} className="bg-[#080808] p-6 md:p-8 text-center hover:bg-[#0c0c0c] transition-colors duration-300">
                <p className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-600 mb-2">
                  {stat.value}
                </p>
                <p className="text-[10px] md:text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">
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
      <section id="contact" className="relative bg-[#0a0a0a] z-10 scroll-mt-20 shadow-2xl">
        {/* Gradient border top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
        <CallToAction />
      </section>

      {/* ============================================= */}
      {/* FOOTER — Complete                              */}
      {/* ============================================= */}
      <div className="relative z-10 bg-[#0a0a0a]">
        <LpFooter />
      </div>
    </div>
  );
}
