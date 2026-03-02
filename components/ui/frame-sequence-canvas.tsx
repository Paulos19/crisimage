"use client"

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

// ─── Configuration ────────────────────────────────────────────
const TOTAL_FRAMES = 240
const SCROLL_HEIGHT_VH = 500 // comfortable pacing for ~8s cinematic moment
const PRELOAD_BATCH_SIZE = 10 // parallel image loads
const LERP_FACTOR = 0.18 // smoothness (lower = smoother but laggier)

function getFrameSrc(index: number): string {
  const num = String(index).padStart(3, "0")
  return `/frames/ezgif-frame-${num}.jpg`
}

// ─── Easing helper for smoother interpolation ─────────────────
function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

// ─── Text Phase Configuration ─────────────────────────────────
interface TextPhase {
  id: string
  showFrom: number
  showTo: number
  fadeRange: number
}

const TEXT_PHASES: TextPhase[] = [
  { id: "intro", showFrom: 0.01, showTo: 0.18, fadeRange: 0.05 },
  { id: "headline", showFrom: 0.25, showTo: 0.50, fadeRange: 0.06 },
  { id: "cta", showFrom: 0.58, showTo: 0.92, fadeRange: 0.07 },
]

// ─── Component ────────────────────────────────────────────────
export function FrameSequenceCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const currentFrameRef = useRef(1)
  const targetFrameRef = useRef(1)
  const rafRef = useRef<number>(0)
  const progressRef = useRef(0)
  const isVisibleRef = useRef(false)
  const hasDrawnFirstFrameRef = useRef(false)

  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hasEntered, setHasEntered] = useState(false)

  // Determine device capability
  const isMobileRef = useRef(false)
  const dprRef = useRef(1)

  // ─── Draw frame on canvas (cover-fit) ───────────────────────
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    const clampedIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameIndex)))
    const img = imagesRef.current[clampedIndex]
    if (!img) return

    const cW = canvas.width
    const cH = canvas.height
    const iW = img.naturalWidth || img.width
    const iH = img.naturalHeight || img.height

    if (iW === 0 || iH === 0) return

    // Cover-fit calculation
    const scale = Math.max(cW / iW, cH / iH)
    const sW = iW * scale
    const sH = iH * scale
    const x = (cW - sW) / 2
    const y = (cH - sH) / 2

    ctx.drawImage(img, x, y, sW, sH)
  }, [])

  // ─── Size canvas to viewport ────────────────────────────────
  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = dprRef.current
    const w = window.innerWidth
    const h = window.innerHeight

    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
  }, [])

  // ─── Preload images in batches (memory efficient) ───────────
  useEffect(() => {
    if (typeof window === "undefined") return

    isMobileRef.current = window.innerWidth < 768
    dprRef.current = Math.min(window.devicePixelRatio || 1, isMobileRef.current ? 1.5 : 2)

    // Size canvas immediately so first frame can draw
    sizeCanvas()

    // On mobile, load every 2nd frame for memory savings
    const step = isMobileRef.current ? 2 : 1
    const frameIndices: number[] = []
    for (let i = 1; i <= TOTAL_FRAMES; i += step) {
      frameIndices.push(i)
    }
    // Always include first and last frames
    if (!frameIndices.includes(1)) frameIndices.unshift(1)
    if (!frameIndices.includes(TOTAL_FRAMES)) frameIndices.push(TOTAL_FRAMES)

    const totalToLoad = frameIndices.length
    const images: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES + 1).fill(null)
    let loaded = 0
    let firstFrameLoaded = false

    // Batch preloader for controlled parallelism
    const loadBatch = async (batch: number[]) => {
      await Promise.all(
        batch.map(
          (idx) =>
            new Promise<void>((resolve) => {
              const img = new Image()
              img.decoding = "async"
              img.src = getFrameSrc(idx)
              img.onload = () => {
                images[idx] = img
                loaded++
                setLoadingProgress(Math.round((loaded / totalToLoad) * 100))

                // Draw frame 1 eagerly as soon as it loads (eliminates blank gap)
                if (idx === 1 && !firstFrameLoaded) {
                  firstFrameLoaded = true
                  imagesRef.current = images
                  // Draw on the canvas immediately
                  const canvas = canvasRef.current
                  if (canvas && canvas.width > 0) {
                    const ctx = canvas.getContext("2d", { alpha: false })
                    if (ctx) {
                      const iW = img.naturalWidth || img.width
                      const iH = img.naturalHeight || img.height
                      if (iW > 0 && iH > 0) {
                        const scale = Math.max(canvas.width / iW, canvas.height / iH)
                        const sW = iW * scale
                        const sH = iH * scale
                        const x = (canvas.width - sW) / 2
                        const y = (canvas.height - sH) / 2
                        ctx.drawImage(img, x, y, sW, sH)
                        hasDrawnFirstFrameRef.current = true
                      }
                    }
                  }
                }

                resolve()
              }
              img.onerror = () => {
                loaded++
                setLoadingProgress(Math.round((loaded / totalToLoad) * 100))
                resolve()
              }
            })
        )
      )
    }

    const preloadAll = async () => {
      for (let i = 0; i < frameIndices.length; i += PRELOAD_BATCH_SIZE) {
        const batch = frameIndices.slice(i, i + PRELOAD_BATCH_SIZE)
        await loadBatch(batch)
      }

      // Fill skipped frames with nearest loaded frame (mobile)
      if (step > 1) {
        for (let i = 1; i <= TOTAL_FRAMES; i++) {
          if (!images[i]) {
            // Find nearest loaded frame
            for (let d = 1; d <= step; d++) {
              if (images[i - d]) { images[i] = images[i - d]; break }
              if (images[i + d]) { images[i] = images[i + d]; break }
            }
          }
        }
      }

      imagesRef.current = images
      setIsLoaded(true)
    }

    preloadAll()

    return () => {
      imagesRef.current = []
    }
  }, [sizeCanvas])

  // ─── Resize canvas to match viewport ───────────────────────
  useEffect(() => {
    const handleResize = () => {
      sizeCanvas()
      if (isLoaded) {
        drawFrame(currentFrameRef.current)
      } else if (hasDrawnFirstFrameRef.current) {
        drawFrame(1)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isLoaded, drawFrame, sizeCanvas])

  // ─── Intersection Observer for lazy activation ──────────────
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
        if (entry.isIntersecting && !hasEntered) {
          setHasEntered(true)
        }
      },
      { rootMargin: "200px 0px" }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [hasEntered])

  // ─── Scroll handler + smooth frame interpolation ────────────
  useEffect(() => {
    if (!isLoaded) return

    // Draw first frame immediately when all loaded
    currentFrameRef.current = 1
    targetFrameRef.current = 1
    drawFrame(1)

    const handleScroll = () => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      // scrollable = total height of container minus one viewport (the stuck part)
      const scrollable = container.offsetHeight - window.innerHeight
      // scrolled = how far past the top of the container the viewport has scrolled
      const scrolled = -rect.top

      // Progress goes 0→1 as user scrolls through the pinned section
      const progress = Math.max(0, Math.min(1, scrolled / Math.max(scrollable, 1)))
      progressRef.current = progress
      setScrollProgress(progress)

      // Map scroll progress to target frame index (1-based)
      targetFrameRef.current = Math.max(
        1,
        Math.min(TOTAL_FRAMES, Math.round(progress * (TOTAL_FRAMES - 1)) + 1)
      )
    }

    // Smooth interpolation loop at 60fps
    let lastTime = 0

    const animate = (timestamp: number) => {
      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      const delta = timestamp - lastTime
      if (delta < 8) {
        // Cap at ~120fps to save resources
        rafRef.current = requestAnimationFrame(animate)
        return
      }
      lastTime = timestamp

      const current = currentFrameRef.current
      const target = targetFrameRef.current

      // Smooth interpolation toward target frame
      if (Math.abs(current - target) > 0.5) {
        const next = lerp(current, target, LERP_FACTOR)
        currentFrameRef.current = next
        drawFrame(Math.round(next))
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    // Trigger initial scroll calc in case section is already in view
    handleScroll()

    rafRef.current = requestAnimationFrame(animate)
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isLoaded, drawFrame])

  // ─── Text overlay opacity calculator ────────────────────────
  const getPhaseStyle = useCallback(
    (phase: TextPhase): React.CSSProperties => {
      const p = scrollProgress
      let opacity = 0
      const { showFrom, showTo, fadeRange } = phase

      if (p >= showFrom && p <= showTo) {
        if (p < showFrom + fadeRange) {
          opacity = (p - showFrom) / fadeRange
        } else if (p > showTo - fadeRange) {
          opacity = (showTo - p) / fadeRange
        } else {
          opacity = 1
        }
      }

      opacity = Math.max(0, Math.min(1, opacity))

      return {
        opacity,
        transform: `translateY(${(1 - opacity) * 24}px) scale(${0.97 + opacity * 0.03})`,
        transition: "opacity 0.12s ease-out, transform 0.12s ease-out",
        willChange: "opacity, transform",
      }
    },
    [scrollProgress]
  )

  // ─── Loading screen ────────────────────────────────────────
  const loadingScreen = useMemo(
    () => (
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0a0a0a]">
        {/* Subtle ambient glow behind loader */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-900/[0.06] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Circular progress ring */}
          <div className="relative w-20 h-20 mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="2"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="url(#emerald-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - loadingProgress / 100)}`}
                style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
              />
              <defs>
                <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-emerald-400 tracking-wider">
              {loadingProgress}%
            </span>
          </div>

          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">
            Preparando experiência
          </p>
        </div>
      </div>
    ),
    [loadingProgress]
  )

  // ─── Render ─────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
    >
      {/* 
        Fixed viewport — pinned behind all other sections (z-0 relative to #cinematic).
        This eliminates the 100vh "blank scroll" gap completely.
      */}
      <div className="fixed inset-0 w-full h-screen overflow-hidden bg-[#0a0a0a] -z-10 pointer-events-none">
        {/* Loading state — sits above canvas but below when loaded */}
        {!isLoaded && loadingScreen}

        {/* Main canvas — full viewport, always behind overlays */}
        {/* Canvas is always rendered and eagerly shows frame 1 */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: isLoaded || hasDrawnFirstFrameRef.current ? 1 : 0,
            transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* ─── Cinematic overlays ──────────────────────────── */}

        {/* Top gradient fade — seamless transition from hero */}
        <div
          className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
          style={{
            height: "30vh",
            background:
              "linear-gradient(to bottom, #0a0a0a 0%, rgba(10,10,10,0.6) 40%, transparent 100%)",
          }}
        />

        {/* Bottom gradient fade — seamless transition to features */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
          style={{
            height: "30vh",
            background:
              "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.6) 40%, transparent 100%)",
          }}
        />

        {/* Side vignette for cinematic depth */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(10,10,10,0.5) 100%)",
          }}
        />

        {/* Dynamic darkness layer — adapts to animation phase */}
        <div
          className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-700"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)",
            opacity: scrollProgress < 0.25 ? 1 : scrollProgress > 0.55 ? 0.6 : 0.35,
          }}
        />

        {/* ─── Text overlays ───────────────────────────────── */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="text-center px-6 max-w-4xl w-full">
            {/* Phase 1: Before box opens — emotional intro */}
            <div style={getPhaseStyle(TEXT_PHASES[0])} className="mb-4">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-emerald-500/60" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] text-emerald-400/90">
                  // Uma experiência cinematográfica
                </span>
                <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-emerald-500/60" />
              </div>
              <p className="text-base sm:text-xl md:text-2xl text-zinc-300 font-medium leading-relaxed max-w-lg mx-auto">
                Cada foto carrega uma{" "}
                <span className="text-white font-bold">história.</span>
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                Entregue como ela merece.
              </p>
            </div>

            {/* Phase 2: Explosion moment — bold headline */}
            <div style={getPhaseStyle(TEXT_PHASES[1])}>
              <h2 className="text-[2.8rem] sm:text-6xl md:text-7xl lg:text-[6.5rem] font-black uppercase tracking-tighter leading-[0.82]">
                <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-zinc-400">
                  ABRA.
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-700 py-1">
                  ENTREGUE.
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-300 to-zinc-600">
                  IMPRESSIONE.
                </span>
              </h2>
            </div>

            {/* Phase 3: Photos floating — CTA */}
            <div
              style={getPhaseStyle(TEXT_PHASES[2])}
              className="pointer-events-auto"
            >
              <p className="text-zinc-400 text-sm sm:text-base md:text-lg font-medium uppercase tracking-wider mb-3 leading-relaxed">
                Memórias que explodem em emoção.
              </p>
              <p className="text-zinc-500/80 text-xs sm:text-sm md:text-base mb-8 sm:mb-10 max-w-md mx-auto leading-relaxed normal-case">
                Com a LetImage, cada entrega se torna um momento inesquecível para seu cliente.
              </p>
              <Link
                href="/dashboard/upload"
                className="group inline-flex items-center justify-center rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-emerald-500 text-black hover:bg-emerald-400 transition-all duration-300 h-12 sm:h-14 px-8 sm:px-10 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Começar agora
                <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Scroll indicator ────────────────────────────── */}
        {isLoaded && scrollProgress < 0.04 && (
          <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 animate-pulse">
              Scroll para explorar
            </span>
            <div className="relative w-5 h-8 rounded-full border border-white/[0.08] flex justify-center">
              <div className="w-0.5 h-2 bg-emerald-500/60 rounded-full mt-1.5 animate-bounce" />
            </div>
          </div>
        )}

        {/* ─── Progress indicator (subtle) ─────────────────── */}
        {isLoaded && scrollProgress > 0.02 && scrollProgress < 0.98 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-24 sm:w-32">
            <div className="h-[2px] w-full bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500/60 to-emerald-400/60 rounded-full"
                style={{
                  width: `${scrollProgress * 100}%`,
                  transition: "width 0.1s linear",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
