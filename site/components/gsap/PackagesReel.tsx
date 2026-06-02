"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ImagePlaceholder } from "./ImagePlaceholder"
import { FlipText } from "./FlipText"
import { BtnPrimary } from "./BtnPrimary"
import { Airplane } from "@phosphor-icons/react"
import { StatusBadge } from "@/components/StatusBadge"
import { getUnsplash } from "@/lib/unsplash"

gsap.registerPlugin(ScrollTrigger)

const SCROLL_THRESHOLD = 4

export interface PacoteCard {
  _id?: string
  titulo?: string
  slug?: string
  periodo?: string
  dias?: number
  partida?: string
  badge?: string | null
  heroImage?: any
  descricaoCurta?: string
  nome?: string
  data?: string
}

function getImageSrc(p: PacoteCard): string | null {
  if (p.heroImage?.asset?._ref) {
    const ref = p.heroImage.asset._ref.replace("image-","").replace(/-(\w+)$/, ".$1")
    return `https://cdn.sanity.io/images/6g3tj20r/production/${ref}?fm=webp&q=82&auto=format&w=600`
  }
  return getUnsplash((p.slug ?? p.titulo ?? ""), "md")
}

/* ── Card compartilhado ─────────────────────────────── */
function Card({ p, compact = false }: { p: PacoteCard; compact?: boolean }) {
  const titulo    = p.titulo ?? p.nome ?? ""
  const periodo   = p.periodo ?? ""
  const dias      = p.dias ?? 0
  const partida   = p.partida ?? p.data ?? ""
  const badge     = p.badge ?? null
  const slug      = p.slug
  const descricao = p.descricaoCurta ?? (periodo && dias ? `${periodo} · ${dias} dias` : "")
  const href      = slug ? `/pacotes/${slug}` : "https://wa.me/5511966401489"
  const src       = getImageSrc(p)

  return (
    <div className="group border border-border hover:border-foreground/25 transition-colors overflow-hidden"
         data-cursor="expand" data-cursor-label="VER">
      <div className="relative overflow-hidden">
        <div className={`${compact ? "aspect-[3/2]" : "aspect-[3/4]"} transition-transform duration-700 group-hover:scale-[1.04]`}>
          {src
            ? <img src={src} alt={titulo} className="w-full h-full object-cover" loading="lazy" />
            : <ImagePlaceholder className="w-full h-full" iconSize={40} />}
        </div>
        {badge && <span className="absolute top-4 left-4"><StatusBadge badge={badge} /></span>}
      </div>
      <div className="p-7 border-t border-border">
        <FlipText as="h3" className="text-[21px] font-bold text-foreground mb-2" stagger={0.014}>
          {titulo.toUpperCase()}
        </FlipText>
        {descricao && <p className="t-body mb-3 line-clamp-2">{descricao}</p>}
        {partida && (
          <p className="t-small flex items-center gap-1.5 mb-4">
            <Airplane weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> {partida}
          </p>
        )}
        <BtnPrimary href={href} variant="outline" stagger={0.014}>
          {slug ? "Ver pacote" : "Reservar"}
        </BtnPrimary>
      </div>
    </div>
  )
}

/* ── Grid estático — zero GSAP ──────────────────────── */
function ComingSoonCard() {
  return (
    <div className="border border-dashed border-border overflow-hidden flex flex-col">
      <div className="aspect-[3/2] bg-background-section flex items-center justify-center">
        <div className="w-24 h-24 rounded-full border-2 border-border flex items-center justify-center">
          <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-foreground-subtle">
            Em breve
          </span>
        </div>
      </div>
      <div className="p-7 border-t border-border flex-1 flex flex-col justify-center">
        <p className="text-[20px] font-bold text-foreground-subtle mb-2">Mais grupos em breve</p>
        <p className="t-body text-foreground-subtle">
          Novos grupos sendo preparados. Cadastre seu interesse e avisamos quando abrir.
        </p>
      </div>
    </div>
  )
}

function StaticGrid({ pacotes }: { pacotes: PacoteCard[] }) {
  /* preenche até 3 cards para manter a grid uniforme */
  const showComingSoon = pacotes.length < 3

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-[clamp(20px,4vw,64px)] py-8">
      {pacotes.map(p => <Card key={p._id ?? p.titulo} p={p} compact />)}
      {showComingSoon && <ComingSoonCard />}
    </div>
  )
}

/* ── Carrossel com GSAP — só para 5+ cards ──────────── */
function ScrollReel({ pacotes }: { pacotes: PacoteCard[] }) {
  const sectionRef      = useRef<HTMLElement>(null)
  const trackRef        = useRef<HTMLDivElement>(null)
  const progressRef     = useRef<HTMLDivElement>(null)
  const progressWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section      = sectionRef.current
    const track        = trackRef.current
    const progress     = progressRef.current
    const progressWrap = progressWrapRef.current
    if (!section || !track || !progress || !progressWrap) return

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
          onLeave:     slideOut,
          onLeaveBack: slideOut,
          onUpdate: (self) => { progress.style.width = `${self.progress * 100}%` },
        },
      })
      return () => tween.kill()
    })
    return () => mm.revert()
  }, [])

  return (
    <div>
      <section ref={sectionRef} className="overflow-hidden bg-background relative" data-cursor-theme="dark">
        <div ref={progressWrapRef}
             className="absolute left-1/2 -translate-x-1/2 z-10
                        w-[clamp(120px,20vw,280px)] h-[2px] bg-border rounded-full overflow-hidden"
             style={{ top: "calc(80px + 1rem)" }}>
          <div ref={progressRef}
               className="absolute left-0 top-0 h-full bg-foreground rounded-full"
               style={{ width: "0%" }} />
        </div>

        <div ref={trackRef}
             className="flex items-stretch gap-6 will-change-transform px-[clamp(20px,4vw,64px)] pb-12"
             style={{ width: "max-content", paddingTop: "calc(80px + 2rem)" }}>
          {pacotes.map(p => (
            <div key={p._id ?? p.titulo} className="shrink-0" style={{ width: "clamp(300px, 28vw, 420px)" }}>
              <Card p={p} />
            </div>
          ))}
          <div className="shrink-0 w-[clamp(20px,4vw,64px)]" aria-hidden />
        </div>
      </section>
    </div>
  )
}

/* ── Exportação principal ────────────────────────────── */
export function PackagesReel({ pacotes }: { pacotes: PacoteCard[] }) {
  if (pacotes.length === 0) return null
  if (pacotes.length <= SCROLL_THRESHOLD) return <StaticGrid pacotes={pacotes} />
  return <ScrollReel pacotes={pacotes} />
}
