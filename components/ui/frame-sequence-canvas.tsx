"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const TOTAL_FRAMES = 224
const SCROLL_HEIGHT_VH = 500 // how tall the scroll spacer is (in vh units)

function getFrameSrc(index: number): string {
  const num = String(index).padStart(3, "0")
  return `/frames/ezgif-frame-${num}.jpg`
}

export function FrameSequenceCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)
  const rafRef = useRef<number>(0)
  const progressRef = useRef(0)

  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Determine if mobile for reduced frame loading
  const isMobileRef = useRef(false)

  // Preload images
  useEffect(() => {
    if (typeof window === "undefined") return

    isMobileRef.current = window.innerWidth < 768
    const step = isMobileRef.current ? 2 : 1
    const frameIndices: number[] = []
    for (let i = 1; i <= TOTAL_FRAMES; i += step) {
      frameIndices.push(i)
    }
    // Always include the last frame
    if (frameIndices[frameIndices.length - 1] !== TOTAL_FRAMES) {
      frameIndices.push(TOTAL_FRAMES)
    }

    const totalToLoad = frameIndices.length
    let loaded = 0
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES + 1) // 1-indexed

    const onLoad = () => {
      loaded++
      setLoadingProgress(Math.round((loaded / totalToLoad) * 100))
      if (loaded === totalToLoad) {
        // Fill in skipped frames with nearest loaded frame
        if (step > 1) {
          for (let i = 1; i <= TOTAL_FRAMES; i++) {
            if (!images[i]) {
              // Find nearest loaded frame
              let nearest = i
              for (let d = 1; d < step; d++) {
                if (images[i - d]) { nearest = i - d; break }
                if (images[i + d]) { nearest = i + d; break }
              }
              images[i] = images[nearest]
            }
          }
        }
        imagesRef.current = images
        setIsLoaded(true)
      }
    }

    frameIndices.forEach((idx) => {
      const img = new Image()
      img.src = getFrameSrc(idx)
      img.onload = onLoad
      img.onerror = onLoad // Continue even if a frame fails
      images[idx] = img
    })

    return () => {
      // Cleanup
      imagesRef.current = []
    }
  }, [])

  // Draw frame on canvas
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = imagesRef.current[frameIndex]
    if (!img) return

    // Cover-fit the image into the canvas
    const cW = canvas.width
    const cH = canvas.height
    const iW = img.naturalWidth || img.width
    const iH = img.naturalHeight || img.height

    const scale = Math.max(cW / iW, cH / iH)
    const sW = iW * scale
    const sH = iH * scale
    const x = (cW - sW) / 2
    const y = (cH - sH) / 2

    ctx.clearRect(0, 0, cW, cH)
    ctx.drawImage(img, x, y, sW, sH)
  }, [])

  // Resize canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`

      if (isLoaded) {
        drawFrame(currentFrameRef.current || 1)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isLoaded, drawFrame])

  // Scroll handler — map scroll position to frame index
  useEffect(() => {
    if (!isLoaded) return

    const handleScroll = () => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const scrollable = container.scrollHeight - window.innerHeight
      const scrolled = -rect.top

      const progress = Math.max(0, Math.min(1, scrolled / scrollable))
      progressRef.current = progress
      setScrollProgress(progress)

      const frameIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(progress * (TOTAL_FRAMES - 1)) + 1))

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex
        cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => {
          drawFrame(frameIndex)
        })
      }
    }

    // Draw first frame immediately
    currentFrameRef.current = 1
    drawFrame(1)

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isLoaded, drawFrame])

  // Text overlay visibility based on scroll progress
  const getOverlayStyle = (showFrom: number, showTo: number): React.CSSProperties => {
    const p = scrollProgress
    let opacity = 0
    const fadeRange = 0.06

    if (p >= showFrom && p <= showTo) {
      // Fade in
      if (p < showFrom + fadeRange) {
        opacity = (p - showFrom) / fadeRange
      }
      // Fade out
      else if (p > showTo - fadeRange) {
        opacity = (showTo - p) / fadeRange
      }
      // Full visible
      else {
        opacity = 1
      }
    }

    return {
      opacity: Math.max(0, Math.min(1, opacity)),
      transform: `translateY(${opacity < 1 ? 20 * (1 - opacity) : 0}px)`,
      transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
    >
      {/* Sticky canvas viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {/* Loading state */}
        {!isLoaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0a0a0a]">
            {/* Loading bar */}
            <div className="w-48 h-1 bg-white/[0.08] rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-xs text-zinc-600 font-bold uppercase tracking-[0.3em]">
              {loadingProgress}%
            </p>
          </div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.5s ease-in" }}
        />

        {/* Dark overlay for text readability — stronger on early green frames */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: scrollProgress < 0.6
              ? `radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)`
              : `radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)`,
            transition: "background 0.5s ease",
          }}
        />

        {/* TEXT OVERLAYS — layered on top */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="text-center px-6 max-w-4xl">

            {/* Phase 1: Intro subtitle (stage setup) */}
            <div style={getOverlayStyle(0.02, 0.22)}>
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-400">
                // Suas memórias, amplificadas
              </span>
            </div>

            {/* Phase 2: Main headline (explosion moment) */}
            <div style={getOverlayStyle(0.28, 0.55)}>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
                <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-zinc-400">
                  ABRA.
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-700">
                  ENTREGUE.
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-300 to-zinc-600">
                  IMPRESSIONE.
                </span>
              </h2>
            </div>

            {/* Phase 3: CTA text (photos floating) */}
            <div style={getOverlayStyle(0.62, 0.88)} className="pointer-events-auto">
              <p className="text-zinc-300 text-lg md:text-xl font-medium uppercase tracking-wider mb-8 leading-relaxed">
                Suas fotos ganham vida
                <br />
                <span className="text-emerald-400">na Crisimage.</span>
              </p>
              <Link
                href="/dashboard/upload"
                className="group inline-flex items-center justify-center rounded-full text-sm font-bold uppercase tracking-wider bg-emerald-500 text-black hover:bg-emerald-400 transition-all duration-300 h-14 px-10 shadow-lg shadow-emerald-500/20"
              >
                Começar agora
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator at the bottom */}
        {isLoaded && scrollProgress < 0.05 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
              Scroll
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-emerald-500/60 to-transparent" />
          </div>
        )}
      </div>
    </div>
  )
}
