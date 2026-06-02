"use client"

import { useRef, useState, useEffect } from "react"
import gsap from "gsap"
import { TransitionLink, ImagePlaceholder } from "@/components/gsap"
import { getUnsplash } from "@/lib/unsplash"
import { StatusBadge } from "@/components/StatusBadge"
import { TipoBadge } from "./TipoBadge"

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

function getImageUrl(p: Pacote): string | null {
  if (!p.heroImage?.asset?._ref) return getUnsplash(p.slug, "lg")
  const ref = p.heroImage.asset._ref.replace("image-", "").replace(/-(\w+)$/, ".$1")
  return `https://cdn.sanity.io/images/6g3tj20r/production/${ref}?w=1600&fit=crop`
}

function getMobileImageUrl(p: Pacote): string {
  if (p.heroImage?.asset?._ref) {
    const ref = p.heroImage.asset._ref.replace("image-", "").replace(/-(\w+)$/, ".$1")
    return `https://cdn.sanity.io/images/6g3tj20r/production/${ref}?w=828&fit=crop&fm=webp&q=80`
  }
  return getUnsplash(p.slug, "md") ?? ""
}

export function PackagesList({ pacotes }: { pacotes: Pacote[] }) {
  const [activeId, setActiveId] = useState<string>(pacotes[0]?._id ?? "")

  /* ── Desktop: GSAP crossfade ─────────────────────────── */
  const bgRefsMap   = useRef<Record<string, HTMLDivElement | null>>({})
  const itemRefsMap = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    if (!pacotes.length) return
    Object.entries(bgRefsMap.current).forEach(([id, el]) => {
      if (!el) return
      gsap.set(el, { opacity: id === pacotes[0]._id ? 1 : 0 })
    })
  }, [pacotes])

  const handleEnter = (id: string) => {
    setActiveId(id)
    Object.entries(bgRefsMap.current).forEach(([key, el]) => {
      if (!el) return
      gsap.to(el, { opacity: key === id ? 1 : 0, duration: 0.55, ease: "power2.inOut" })
    })
    Object.entries(itemRefsMap.current).forEach(([key, el]) => {
      if (!el) return
      gsap.to(el, { opacity: key === id ? 1 : 0.28, duration: 0.25, ease: "power2.out" })
    })
  }

  const handleLeaveAll = () => {
    Object.values(itemRefsMap.current).forEach(el => {
      if (!el) return
      gsap.to(el, { opacity: 1, duration: 0.3 })
    })
  }

  /* ── Mobile: IntersectionObserver ───────────────────── */
  const mobileItemRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const mobileBgRefs   = useRef<Record<string, HTMLDivElement | null>>({})

  /* Init first mobile background */
  useEffect(() => {
    if (!pacotes.length) return
    Object.entries(mobileBgRefs.current).forEach(([id, el]) => {
      if (!el) return
      gsap.set(el, { opacity: id === pacotes[0]._id ? 1 : 0 })
    })
  }, [pacotes])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const id = (entry.target as HTMLElement).dataset.itemId
          if (id) {
            setActiveId(id)
            /* crossfade mobile backgrounds */
            Object.entries(mobileBgRefs.current).forEach(([key, el]) => {
              if (!el) return
              gsap.to(el, { opacity: key === id ? 1 : 0, duration: 0.6, ease: "power2.inOut" })
            })
          }
        }
      }),
      { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" }
    )
    pacotes.forEach(p => {
      const el = mobileItemRefs.current[p._id]
      if (el) { el.dataset.itemId = p._id; observer.observe(el) }
    })
    return () => observer.disconnect()
  }, [pacotes])

  return (
    <>
      {/* ══════════════════════════════════════════════
          DESKTOP — layout original com crossfade GSAP
          ══════════════════════════════════════════════ */}
      <div
        className="hidden lg:block relative min-h-screen bg-[#060F18] text-white overflow-hidden"
        data-cursor-theme="dark"
        onMouseLeave={handleLeaveAll}
      >
        {/* Backgrounds empilhados, um visível por vez */}
        {pacotes.map(p => {
          const src = getImageUrl(p)
          return (
            <div key={p._id}
                 ref={el => { bgRefsMap.current[p._id] = el }}
                 className="absolute inset-0"
                 style={{ opacity: 0 }}>
              {src
                ? <img src={src} alt={p.titulo} className="w-full h-full object-cover" />
                : <ImagePlaceholder className="w-full h-full" iconSize={64} />
              }
            </div>
          )
        })}

        {/* Overlay escuro sobre as imagens */}
        <div className="absolute inset-0 z-[1] bg-black/70" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#060F18]/90 via-transparent to-transparent pointer-events-none" />

        {/* Lista */}
        <div className="relative z-[2] pt-32 pb-24 px-[clamp(24px,5vw,80px)]">
          {pacotes.map((p, i) => {
            const isActive   = p._id === activeId
            const isEsgotado = p.badge === "esgotado"
            const Wrapper    = isEsgotado ? "div" : TransitionLink
            const wProps     = isEsgotado ? {} : { href: `/pacotes/${p.slug}` }

            return (
              <Wrapper key={p._id} {...(wProps as any)}>
                <div
                  ref={el => { itemRefsMap.current[p._id] = el }}
                  className={`group flex items-baseline gap-5 py-3
                              border-b border-white/8 transition-colors
                              ${isEsgotado
                                ? "opacity-45 cursor-default"
                                : "cursor-none hover:border-white/20"}`}
                  onMouseEnter={() => !isEsgotado && handleEnter(p._id)}
                >
                  {/* Número */}
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

                  {/* Descrição — só no item ativo */}
                  {isActive && !isEsgotado && p.descricaoCurta && (
                    <span className="text-[20px] font-medium tracking-[0.1em]
                                     uppercase text-white/75 max-w-xs leading-tight self-center ml-2">
                      {p.descricaoCurta}
                    </span>
                  )}

                  {/* Info secundária */}
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
              Nenhum pacote disponível no momento.
            </p>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE — Open Residency scrolling list
          ══════════════════════════════════════════════ */}
      <div className="lg:hidden relative bg-[#060F18] text-white overflow-hidden"
           style={{ minHeight: "100svh" }}>

        {/* Backgrounds absolutos — crossfade via GSAP (sem blur nem fixed) */}
        {pacotes.map(p => {
          const src = getMobileImageUrl(p)
          return (
            <div key={p._id}
                 ref={el => { mobileBgRefs.current[p._id] = el }}
                 className="absolute inset-0 pointer-events-none"
                 style={{ opacity: 0 }}>
              {src && <img src={src} alt="" className="w-full h-full object-cover"
                           style={{ objectPosition: "50% 30%" }} />}
            </div>
          )
        })}
        {/* Overlay escuro para manter texto legível */}
        <div className="absolute inset-0 bg-black/65 pointer-events-none" />

        <div className="relative z-10 px-[clamp(16px,5vw,32px)] pb-16"
             style={{ paddingTop: "clamp(48px,20svh,120px)" }}>
          {pacotes.map((p, i) => {
            const isActive   = p._id === activeId
            const isEsgotado = p.badge === "esgotado"
            const imgSrc     = getMobileImageUrl(p)

            return (
              <div key={p._id} ref={el => { mobileItemRefs.current[p._id] = el }}
                   className="border-t border-white/40 pt-2">
                <TransitionLink
                  href={isEsgotado ? "/pacotes/selecao" : `/pacotes/${p.slug}`}
                  className="block py-5"
                  onClick={() => setActiveId(p._id)}
                >
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="font-mono text-[10px] tracking-[0.08em] uppercase shrink-0"
                          style={{ color: isActive ? "#FF9A3C" : "rgba(255,255,255,0.3)",
                                   transition: "color 0.4s" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-medium leading-[0.95] tracking-tight"
                          style={{ fontSize: "clamp(2rem,9vw,4rem)",
                                   color: isActive ? "#FF9A3C" : "rgba(255,255,255,0.9)",
                                   transition: `color 0.4s ${i * 0.05}s` }}>
                      {p.titulo}
                    </span>
                  </div>

                  {/* Expansível ao ativar */}
                  <div className="overflow-hidden"
                       style={{ maxHeight: isActive ? "520px" : "0px",
                                opacity: isActive ? 1 : 0,
                                transition: "max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s" }}>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {p.tipo && !isEsgotado && <TipoBadge tipo={p.tipo} />}
                      {p.badge === "vagas"   && <StatusBadge badge="vagas" />}
                    </div>
                    {p.descricaoCurta && (
                      <p className="font-mono text-[16px] tracking-[0.07em] uppercase mt-3 leading-relaxed"
                         style={{ color: "rgba(255,255,255,0.75)" }}>
                        {p.descricaoCurta}
                      </p>
                    )}
                    {imgSrc && (
                      <div className="relative w-full mt-3 rounded-sm overflow-hidden"
                           style={{ aspectRatio: "16/9" }}>
                        <img src={imgSrc} alt={p.titulo} loading="lazy"
                             className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 h-12 pointer-events-none"
                             style={{ background: "linear-gradient(transparent,rgba(0,0,0,0.4))" }} />
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-3 font-mono text-[16px] text-white/75
                                    uppercase tracking-wide">
                      {p.periodo && <span>{p.periodo}</span>}
                      {p.dias    && <span>· {p.dias} dias</span>}
                      {p.partida && <span>· Partida {p.partida}</span>}
                    </div>
                  </div>
                </TransitionLink>
              </div>
            )
          })}

          {pacotes.length === 0 && (
            <p className="text-white/40 py-20 text-center text-[20px]">
              Nenhum pacote disponível.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
