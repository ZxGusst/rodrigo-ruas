"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react"

gsap.registerPlugin(ScrollTrigger)

const CDN = "https://cdn.sanity.io/images/6g3tj20r/production"
const SLIDES = [
  { src: `${CDN}/1eee79b02431591f316d5468cf3248a32dbc1b15-5911x3941.jpg?w=1920&fit=crop&fm=webp&q=80`, alt: "Japão"    },
  { src: `${CDN}/99b3b7110dc715b23e156012dda893c02e1a4c1d-3813x2553.jpg?w=1920&fit=crop&fm=webp&q=80`, alt: "Turquia"  },
  { src: `${CDN}/5b92925ad592041e26edec0e8da36f52b8809587-3456x2304.jpg?w=1920&fit=crop&fm=webp&q=80`, alt: "Grécia"   },
  { src: `${CDN}/15b6179dceefc0259c68a6475b559c55141f1f18-5184x3456.jpg?w=1920&fit=crop&fm=webp&q=80`, alt: "China"    },
  { src: `${CDN}/376b384856e7fed73b3062e3a29025b2c8262362-4942x2941.jpg?w=1920&fit=crop&fm=webp&q=80`, alt: "Coreia"   },
  { src: `${CDN}/f7610cd8e64591aedfe769baa67f552c9acf4979-4912x3264.jpg?w=1920&fit=crop&fm=webp&q=80`, alt: "Alemanha" },
]

const INTERVAL = 5000
const FADE     = 0.9

interface HeroSectionProps {
  label?: string
  line1?:  string
  line2?:  string
  sub?:    string
}

export function HeroSection({
  label = "Curadoria de Expert",
  line1 = "PACOTES",
  line2 = "PELO MUNDO",
  sub   = "Curadoria de expert para viajantes exigentes.\n93 países. 19 anos de estrada.",
}: HeroSectionProps) {
  const [active, setActive] = useState(0)
  const imgRefs   = useRef<(HTMLDivElement | null)[]>([])
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* animação de texto */
  const labelRef = useRef<HTMLSpanElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const subRef   = useRef<HTMLParagraphElement>(null)
  const metaRef  = useRef<HTMLDivElement>(null)
  const lineRef  = useRef<HTMLDivElement>(null)

  /* crossfade para o índice alvo */
  const goTo = useCallback((next: number) => {
    const prev = active
    if (prev === next) return

    gsap.to(imgRefs.current[prev], { opacity: 0, duration: FADE, ease: "power2.inOut" })
    gsap.to(imgRefs.current[next], { opacity: 1, duration: FADE, ease: "power2.inOut" })
    setActive(next)
  }, [active])

  /* auto-play */
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      goTo((active + 1) % SLIDES.length)
    }, INTERVAL)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [active, goTo])

  /* inicializa opacidades */
  useEffect(() => {
    imgRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0 })
    })
  }, [])

  /* animação de texto no load — gsap.set garante estado inicial sem depender de classe CSS */
  useEffect(() => {
    /* estado inicial via GSAP — não usa opacity-100 do Tailwind para evitar conflito com re-renders */
    gsap.set([labelRef.current, metaRef.current, subRef.current], { opacity: 0 })
    gsap.set([line1Ref.current, line2Ref.current], { y: "110%", opacity: 0 })
    gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" })

    const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.3 })
    tl.to(lineRef.current,  { scaleX: 1, duration: 0.8 }, 0)
    .to(labelRef.current,   { opacity: 1, y: 0, duration: 0.6 }, 0.2)
    .to(metaRef.current,    { opacity: 1, duration: 0.5 }, 0.3)
    .to(line1Ref.current,   { y: "0%", opacity: 1, duration: 1.05 }, 0.35)
    .to(line2Ref.current,   { y: "0%", opacity: 1, duration: 1.05 }, 0.5)
    .to(subRef.current,     { opacity: 1, y: 0, duration: 0.7 }, 0.75)
    return () => { tl.kill() }
  }, [])

  const prev = () => { clearTimeout(timerRef.current!); goTo((active - 1 + SLIDES.length) % SLIDES.length) }
  const next = () => { clearTimeout(timerRef.current!); goTo((active + 1) % SLIDES.length) }

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col" data-cursor-theme="dark">

      {/* ── Imagens do carrossel ─────────────────────── */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          ref={el => { imgRefs.current[i] = el }}
          className="absolute inset-0 will-change-transform"
          style={{ opacity: 0 }}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className="w-full h-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Gradiente: mais escuro embaixo (texto), mais transparente no topo (imagem visível) */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-foreground/80 via-foreground/45 to-foreground/15" />

      {/* ── Conteúdo do hero ─────────────────────────── */}
      <div className="relative z-[2] flex-1 flex flex-col px-[clamp(20px,4vw,64px)] pt-20">

        {/* Linha decorativa */}
        <div ref={lineRef} className="border-t-2 border-white/30 mt-10 mb-10" />

        {/* Label + meta */}
        <div className="flex justify-between items-start mb-10">
          <span ref={labelRef} className="text-[20px] font-semibold tracking-[0.1em] uppercase !text-white opacity-100">{label}</span>
          <div ref={metaRef} className="text-right text-[20px] font-medium !text-white opacity-100">
            Rodrigo Ruas<br />
            <span>93 países visitados</span>
          </div>
        </div>

        {/* Título */}
        <div className="flex-1 flex flex-col justify-end pb-[clamp(48px,8vh,96px)]">
          <h1 className="t-hero text-white mb-8 leading-none">
            <span className="block overflow-hidden">
              <span ref={line1Ref} className="block" style={{ transform: "translateY(110%)" }}>
                {line1}
              </span>
            </span>
            <span className="block overflow-hidden pl-[clamp(48px,12vw,200px)]">
              <span ref={line2Ref} className="block" style={{ transform: "translateY(110%)" }}>
                {line2}
              </span>
            </span>
          </h1>

          <div className="flex justify-between items-end">
            <p ref={subRef} className="t-body-lg !text-white opacity-100"
               style={{ maxWidth: "42rem", whiteSpace: "pre-line" }}>
              {sub}
            </p>

            {/* Setas + dots */}
            <div className="hidden md:flex flex-col items-end gap-4">
              {/* Setas */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center
                             text-white/90 hover:bg-white/10 hover:text-white transition-all"
                  aria-label="Anterior"
                >
                  <ArrowLeft size={16} weight="bold" />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center
                             text-white/90 hover:bg-white/10 hover:text-white transition-all"
                  aria-label="Próxima"
                >
                  <ArrowRight size={16} weight="bold" />
                </button>
              </div>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { clearTimeout(timerRef.current!); goTo(i) }}
                    className="transition-all duration-300"
                    aria-label={`Slide ${i + 1}`}
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        i === active
                          ? "w-6 h-[3px] bg-white"
                          : "w-[3px] h-[3px] bg-white/65 hover:bg-white/90"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dots mobile — centrados no bottom */}
      <div className="relative z-[2] flex md:hidden justify-center gap-2 pb-8">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => { clearTimeout(timerRef.current!); goTo(i) }}
                  aria-label={`Slide ${i + 1}`}>
            <span className={`block rounded-full transition-all duration-300 ${
              i === active ? "w-5 h-[3px] bg-white" : "w-[3px] h-[3px] bg-white/40"
            }`} />
          </button>
        ))}
      </div>

    </section>
  )
}
