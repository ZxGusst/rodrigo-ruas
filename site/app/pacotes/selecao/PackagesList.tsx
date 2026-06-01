"use client"

import { useRef, useState, useEffect } from "react"
import gsap from "gsap"
import { TransitionLink, ImagePlaceholder } from "@/components/gsap"
import { Clock } from "@phosphor-icons/react"
import { getUnsplash } from "@/lib/unsplash"

interface Pacote {
  _id: string
  titulo: string
  slug: string
  badge?: string | null
  heroImage?: any
  periodo?: string
  dias?: number
  partida?: string
  descricaoCurta?: string
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

  /* inicializa — o primeiro item começa visível */
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

  return (
    /* full-screen dark container */
    <div
      className="relative min-h-screen bg-[#060F18] text-white overflow-hidden"
      onMouseLeave={handleLeaveAll}
    >
      {/* ── Backgrounds empilhados, um visível por vez ──── */}
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
      {/* Gradiente: fundo mais pesado (texto legível), topo mais leve (imagem visível) */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#060F18]/80 via-[#060F18]/50 to-[#060F18]/25" />

      {/* ── Lista de itens ────────────────────────────── */}
      <div className="relative z-[2] pt-32 pb-24 px-[clamp(24px,5vw,80px)]">
        {pacotes.map((p, i) => {
          const isActive = p._id === activeId
          return (
            <TransitionLink key={p._id} href={`/pacotes/${p.slug}`}>
              <div
                ref={el => { itemRefsMap.current[p._id] = el }}
                className="group flex items-baseline gap-5 py-3 cursor-none
                           border-b border-white/8 hover:border-white/20 transition-colors"
                onMouseEnter={() => handleEnter(p._id)}
              >
                {/* Número */}
                <span className="text-[13px] text-white/30 tabular-nums w-10 shrink-0 pt-1">
                  — {String(i + 1).padStart(2, "0")}
                </span>

                {/* Nome */}
                <span
                  className="font-bold leading-none tracking-tight transition-colors duration-200"
                  style={{
                    fontSize: "clamp(36px, 5.5vw, 80px)",
                    color: isActive ? "#FAFAF8" : "rgba(255,255,255,0.7)",
                  }}
                >
                  {p.titulo}
                </span>

                {/* Descrição — aparece só no item ativo */}
                {isActive && p.descricaoCurta && (
                  <span className="hidden lg:block text-[12px] font-medium tracking-[0.12em]
                                   uppercase text-white/50 max-w-xs leading-tight self-center ml-2">
                    {p.descricaoCurta}
                  </span>
                )}

                {/* Info secundária */}
                <div className="ml-auto flex items-center gap-5 shrink-0 pb-1">
                  {p.periodo && (
                    <span className="text-[13px] text-white/40 hidden md:block">{p.periodo}</span>
                  )}
                  {p.dias && (
                    <span className="text-[13px] text-white/40 hidden md:block">{p.dias} dias</span>
                  )}
                  {p.badge && (
                    <span className={`text-[11px] font-bold uppercase tracking-wide
                                     px-2.5 py-1 rounded-full flex items-center gap-1
                                     ${p.badge === "vagas"
                                       ? "bg-warning/20 text-warning"
                                       : "bg-white/10 text-white/50"}`}>
                      <Clock size={9} weight="bold" />
                      {p.badge === "vagas" ? "Últimas vagas" : "Esgotado"}
                    </span>
                  )}
                </div>
              </div>
            </TransitionLink>
          )
        })}

        {pacotes.length === 0 && (
          <p className="text-white/40 py-20 text-center">
            Nenhum pacote disponível no momento.
          </p>
        )}
      </div>
    </div>
  )
}
