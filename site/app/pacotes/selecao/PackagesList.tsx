"use client"

import { useRef, useState, useEffect } from "react"
import gsap from "gsap"
import { TransitionLink, ImagePlaceholder } from "@/components/gsap"
import { Info } from "@phosphor-icons/react"
import { getUnsplash } from "@/lib/unsplash"
import { StatusBadge } from "@/components/StatusBadge"

interface Pacote {
  _id: string
  titulo: string
  slug: string
  tipo?: string | null
  badge?: string | null
  heroImage?: any
  periodo?: string
  dias?: number
  partida?: string
  descricaoCurta?: string
}

const TIPO_CONFIG: Record<string, { label: string; bg: string; text: string; desc: string }> = {
  gruposDoRuas: {
    label: "Grupo Ruas",
    bg:    "#FFF9E6",
    text:  "#7A5100",
    desc:  "Rodrigo vai junto. Roteiro exclusivo com curadoria e presença pessoal dele do início ao fim.",
  },
  assinadoByRuas: {
    label: "Assinado By Ruas",
    bg:    "#E8F4FF",
    text:  "#0A3D5C",
    desc:  "Curadoria feita por Rodrigo — hotéis, roteiro e experiências —mas ele não vai junto. Privativo, sai quando você quiser.",
  },
  gruposBrasileiros: {
    label: "Grupo Brasileiro",
    bg:    "#E8FFF2",
    text:  "#0A4A2A",
    desc:  "Grupo organizado com guia bilíngue (PT/ES). Rodrigo não vai junto. Datas fixas, preços acessíveis.",
  },
}

function TipoBadge({ tipo }: { tipo: string }) {
  const config  = TIPO_CONFIG[tipo]
  const tipRef  = useRef<HTMLSpanElement>(null)

  if (!config) return null

  const show = () => {
    if (!tipRef.current) return
    gsap.killTweensOf(tipRef.current)
    gsap.fromTo(tipRef.current,
      { opacity: 0, y: 6, pointerEvents: "none" },
      { opacity: 1, y: 0, duration: 0.2, ease: "power2.out",
        onStart() { if (tipRef.current) tipRef.current.style.pointerEvents = "none" } }
    )
  }

  const hide = () => {
    if (!tipRef.current) return
    gsap.killTweensOf(tipRef.current)
    gsap.to(tipRef.current, { opacity: 0, y: 6, duration: 0.15, ease: "power2.in" })
  }

  return (
    <span
      className="relative inline-flex items-center gap-1.5 shrink-0 self-center"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <span
        className="inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full cursor-default select-none"
        style={{ background: config.bg, color: config.text }}
      >
        {config.label}
        <Info size={14} weight="fill" style={{ opacity: 0.6 }} />
      </span>

      <span
        ref={tipRef}
        className="absolute left-0 bottom-full mb-2 z-50 w-72 rounded-xl shadow-2xl px-5 py-4 text-[17px] leading-snug font-medium"
        style={{ background: config.bg, color: config.text, opacity: 0, pointerEvents: "none" }}
      >
        {config.desc}
        <span className="absolute left-4 top-full w-0 h-0"
              style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
                       borderTop: `6px solid ${config.bg}` }} />
      </span>
    </span>
  )
}

function getImageUrl(heroImage: any): string | null {
  if (!heroImage?.asset?._ref) return null
  const ref = heroImage.asset._ref
    .replace("image-", "")
    .replace(/-(\w+)$/, ".$1")
  return `https://cdn.sanity.io/images/6g3tj20r/production/${ref}?w=1600&fit=crop`
}

export function PackagesList({ pacotes }: { pacotes: Pacote[] }) {
  const [activeId, setActiveId] = useState<string | null>(pacotes[0]?._id ?? null)
  const bgRefsMap = useRef<Record<string, HTMLDivElement | null>>({})
  const itemRefsMap = useRef<Record<string, HTMLDivElement | null>>({})

  /* inicializa — o primeiro item come�a vis�vel */
  useEffect(() => {
    if (!pacotes.length) return
    Object.entries(bgRefsMap.current).forEach(([id, el]) => {
      if (!el) return
      gsap.set(el, { opacity: id === pacotes[0]._id ? 1 : 0 })
    })
  }, [pacotes])

  const handleEnter = (id: string) => {
    setActiveId(id)

    /* crossfade backgrounds */
    Object.entries(bgRefsMap.current).forEach(([key, el]) => {
      if (!el) return
      gsap.to(el, {
        opacity: key === id ? 1 : 0,
        duration: 0.55,
        ease: "power2.inOut",
      })
    })

    /* dimmer nos outros itens */
    Object.entries(itemRefsMap.current).forEach(([key, el]) => {
      if (!el) return
      gsap.to(el, {
        opacity: key === id ? 1 : 0.28,
        duration: 0.25,
        ease: "power2.out",
      })
    })
  }

  const handleLeaveAll = () => {
    Object.values(itemRefsMap.current).forEach(el => {
      if (!el) return
      gsap.to(el, { opacity: 1, duration: 0.3 })
    })
  }

  /* ── IntersectionObserver: ativa item central no scroll (mobile/touch) ── */
  useEffect(() => {
    if (typeof window === "undefined") return
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches
    if (!isTouchDevice) return   /* só em touch */

    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry: IntersectionObserverEntry | null = null
        entries.forEach(entry => {
          if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio)
            bestEntry = entry
        })
        if (bestEntry && (bestEntry as IntersectionObserverEntry).isIntersecting) {
          const el    = (bestEntry as IntersectionObserverEntry).target as HTMLElement
          const id    = el.dataset.itemId
          const isEsg = el.dataset.esgotado === "true"
          if (id && !isEsg) handleEnter(id)
        }
      },
      { threshold: [0.4, 0.6, 0.8], rootMargin: "-15% 0px -15% 0px" }
    )

    pacotes.forEach(p => {
      const el = itemRefsMap.current[p._id]
      if (el) {
        el.dataset.itemId    = p._id
        el.dataset.esgotado  = String(p.badge === "esgotado")
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacotes])

  return (
    /* full-screen dark container */
    <div
      className="relative min-h-screen bg-[#060F18] text-white overflow-hidden"
      data-cursor-theme="dark"
      onMouseLeave={handleLeaveAll}
    >
      {/* ── Backgrounds empilhados, um vis�vel por vez ──── */}
      {pacotes.map(p => {
        const imgUrl = getImageUrl(p.heroImage)
        return (
          <div
            key={p._id}
            ref={el => { bgRefsMap.current[p._id] = el }}
            className="absolute inset-0"
            style={{ opacity: 0 }}
          >
            {(() => {
              const src = imgUrl ?? getUnsplash(p.slug, "lg")
              return src
                ? <img src={src} alt={p.titulo} className="w-full h-full object-cover" />
                : <ImagePlaceholder className="w-full h-full" iconSize={64} />
            })()}
          </div>
        )
      })}

      {/* Overlay escuro por cima das imagens */}
      {/* Gradiente: fundo mais pesado (texto leg�vel), topo mais leve (imagem vis�vel) */}
      {/* overlay base — imagem bem escura */}
      <div className="absolute inset-0 z-[1] bg-black/70" />
      {/* gradiente extra no rodapé para o texto da lista */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#060F18]/90 via-transparent to-transparent pointer-events-none" />

      {/* ── Lista de itens ────────────────────────────── */}
      <div className="relative z-[2] pt-32 pb-24 px-[clamp(24px,5vw,80px)]">
        {pacotes.map((p, i) => {
          const isActive    = p._id === activeId
          const isEsgotado  = p.badge === "esgotado"
          const Wrapper     = isEsgotado ? "div" : TransitionLink
          const wrapperProps = isEsgotado ? {} : { href: `/pacotes/${p.slug}` }

          return (
            <Wrapper key={p._id} {...(wrapperProps as any)}>
              <div
                ref={el => { itemRefsMap.current[p._id] = el }}
                className={`group flex items-baseline gap-5 py-3
                            border-b border-white/8 transition-colors
                            ${isEsgotado
                              ? "opacity-45 cursor-default"
                              : "cursor-none hover:border-white/20"}`}
                onMouseEnter={() => !isEsgotado && handleEnter(p._id)}
              >
                {/* N�mero */}
                <span className="text-[20px] text-white/20 tabular-nums w-10 shrink-0 pt-1">
                  — {String(i + 1).padStart(2, "0")}
                </span>

                {/* Nome + badge de tipo */}
                <div className="flex items-baseline gap-4 flex-1 min-w-0">
                  <span
                    className="font-bold leading-none tracking-tight transition-colors duration-200 shrink-0"
                    style={{
                      fontSize: "clamp(36px, 5.5vw, 80px)",
                      color: isActive && !isEsgotado ? "#FFFFFF" : "rgba(255,255,255,0.33)",
                    }}
                  >
                    {p.titulo}
                  </span>
                  {p.tipo && <TipoBadge tipo={p.tipo} />}
                </div>

                {/* Descri��o — aparece s� no item ativo */}
                {isActive && !isEsgotado && p.descricaoCurta && (
                  <span className="hidden lg:block text-[20px] font-medium tracking-[0.1em]
                                   uppercase text-white/75 max-w-xs leading-tight self-center ml-2">
                    {p.descricaoCurta}
                  </span>
                )}

                {/* Info secund�ria */}
                <div className="ml-auto flex items-center gap-5 shrink-0 pb-1">
                  {p.periodo && (
                    <span className="text-[20px] text-white/80 hidden md:block">{p.periodo}</span>
                  )}
                  {p.dias && (
                    <span className="text-[20px] text-white/80 hidden md:block">{p.dias} dias</span>
                  )}
                  {p.badge && <StatusBadge badge={p.badge} />}
                </div>
              </div>
            </Wrapper>
          )
        })}

        {pacotes.length === 0 && (
          <p className="text-white/70 py-20 text-center text-[20px]">
            Nenhum pacote dispon�vel no momento.
          </p>
        )}
      </div>
    </div>
  )
}

