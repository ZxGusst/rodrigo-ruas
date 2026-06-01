"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ImagePlaceholder } from "./ImagePlaceholder"
import { FlipText } from "./FlipText"
import { BtnPrimary } from "./BtnPrimary"
import { Clock, Airplane } from "@phosphor-icons/react"
import { getUnsplash } from "@/lib/unsplash"

gsap.registerPlugin(ScrollTrigger)

export interface PacoteCard {
  _id?: string
  /* campos do Sanity */
  titulo?: string
  slug?: string
  periodo?: string
  dias?: number
  partida?: string
  badge?: string | null
  heroImage?: any
  descricaoCurta?: string
  /* campos legados (mockup) */
  nome?: string
  data?: string
}

export function PackagesReel({ pacotes }: { pacotes: PacoteCard[] }) {
  const sectionRef      = useRef<HTMLElement>(null)
  const trackRef        = useRef<HTMLDivElement>(null)
  const progressRef     = useRef<HTMLDivElement>(null)   /* fill da barra */
  const progressWrapRef = useRef<HTMLDivElement>(null)   /* container da barra (animado) */

  useEffect(() => {
    const section      = sectionRef.current
    const track        = trackRef.current
    const progress     = progressRef.current
    const progressWrap = progressWrapRef.current
    if (!section || !track || !progress || !progressWrap) return

    /* estado inicial: invisível */
    gsap.set(progressWrap, { opacity: 0 })

    const slideIn  = () => gsap.to(progressWrap, { opacity: 1, duration: 0.4, ease: "power2.out" })
    const slideOut = () => gsap.to(progressWrap, { opacity: 0, duration: 0.3, ease: "power2.in" })

    const mm = gsap.matchMedia()

    mm.add("(min-width: 768px)", () => {
      const getDistance = () => -(track.scrollWidth - section.clientWidth)
      const SPEED = 1.8

      const tween = gsap.to(track, {
        x: getDistance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.abs(getDistance()) * SPEED}`,
          scrub: 1.4,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter:     slideIn,
          onEnterBack: slideIn,
          onLeave:     slideOut,   /* interação termina → slide out */
          onLeaveBack: slideOut,
          onUpdate: (self) => {
            progress.style.width = `${self.progress * 100}%`
          },
        },
      })

      return () => tween.kill()
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={sectionRef} className="overflow-hidden bg-background relative">

      {/* ── Barra de progresso — topo, dentro do espaço acima dos cards ─ */}
      <div
        ref={progressWrapRef}
        className="absolute left-1/2 -translate-x-1/2 z-10
                   w-[clamp(120px,20vw,280px)] h-[2px] bg-border rounded-full overflow-hidden"
        style={{ top: "calc(80px + 1rem)" }}   /* alinhado ao padding-top da nav */
      >
        <div
          ref={progressRef}
          className="absolute left-0 top-0 h-full bg-foreground rounded-full"
          style={{ width: "0%" }}
        />
      </div>

      {/* ── Track horizontal ───────────────────────────────── */}
      <div
        ref={trackRef}
        className="flex items-stretch gap-6 will-change-transform px-[clamp(20px,4vw,64px)] pb-12"
        style={{ width: "max-content", paddingTop: "calc(80px + 2rem)" /* nav height + breathing room */ }}
      >
        {pacotes.map((p) => {
          const titulo   = p.titulo ?? p.nome ?? ""
          const periodo  = p.periodo ?? ""
          const dias     = p.dias ?? 0
          const partida  = p.partida ?? p.data ?? ""
          const badge    = p.badge ?? null
          const slug     = p.slug
          const descricao = p.descricaoCurta ?? (periodo && dias ? `${periodo} · ${dias} dias` : "")
          const href     = slug ? `/pacotes/${slug}` : "https://wa.me/5511966401489"
          const key      = p._id ?? titulo

          return (
            <div
              key={key}
              className="shrink-0 group border border-border
                         hover:border-foreground/25 transition-colors overflow-hidden"
              style={{ width: "clamp(300px, 28vw, 420px)" }}
              data-cursor="expand"
              data-cursor-label="VER"
            >
              <div className="relative overflow-hidden">
                <div className="aspect-[3/4] transition-transform duration-700 group-hover:scale-[1.04]">
                  {(() => {
                    const fallback = getUnsplash(slug ?? titulo, "md")
                    const src = p.heroImage
                      ? `https://cdn.sanity.io/images/6g3tj20r/production/${p.heroImage?.asset?._ref?.replace("image-","")?.replace(/-(\w+)$/, ".$1")}?fm=webp&q=82&auto=format&w=600`
                      : fallback
                    return src
                      ? <img src={src} alt={titulo} className="w-full h-full object-cover" loading="lazy" />
                      : <ImagePlaceholder className="w-full h-full" iconSize={40} />
                  })()}
                </div>
                {badge && (
                  <span className={`absolute top-4 left-4 flex items-center gap-1.5
                                   text-[12px] font-bold uppercase tracking-wide
                                   px-3 py-1.5 rounded-full
                                   ${badge === "vagas"
                                     ? "bg-warning/90 text-white"
                                     : "bg-foreground/80 text-background"}`}>
                    <Clock size={11} weight="bold" />
                    {badge === "vagas" ? "Últimas vagas" : "Esgotado"}
                  </span>
                )}
              </div>

              <div className="p-7 border-t border-border">
                <FlipText as="h3" className="text-[21px] font-bold text-foreground mb-2" stagger={0.014}>
                  {titulo.toUpperCase()}
                </FlipText>
                {descricao && <p className="t-body mb-3 line-clamp-2">{descricao}</p>}
                {partida && (
                  <p className="t-small flex items-center gap-1.5 mb-4">
                    <Airplane size={13} /> {partida}
                  </p>
                )}
                <BtnPrimary href={href} variant="outline" stagger={0.014}>
                  {slug ? "Ver pacote" : "Reservar"}
                </BtnPrimary>
              </div>
            </div>
          )
        })}

        <div className="shrink-0 w-[clamp(20px,4vw,64px)]" aria-hidden />
      </div>
    </section>
  )
}
