"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { getUnsplash } from "@/lib/unsplash"

/* Grupos do Ruas — Rodrigo acompanha pessoalmente */
const GRUPOS = [
  { slug: "japao",    nome: "Japão",              partida: "08 Out 2026", membros: 14, max: 20, status: "vagas"    },
  { slug: "japao",    nome: "Japão + Coreia",      partida: "12 Out 2026", membros: 9,  max: 20, status: "aberto"   },
  { slug: "ushuaia",  nome: "Ushuaia",             partida: "06 Ago 2026", membros: 17, max: 20, status: "vagas"    },
  { slug: "ushuaia",  nome: "Ushuaia",             partida: "22 Ago 2026", membros: 11, max: 20, status: "aberto"   },
  { slug: "grecia",   nome: "Grécia + Puglia",     partida: "Esgotado",    membros: 18, max: 18, status: "esgotado" },
  { slug: "turquia",  nome: "Turquia e Grécia",    partida: "10 Jun 2026", membros: 15, max: 18, status: "vagas"    },
]

/* 3 cópias — buffer folgado para nunca precisar fazer wrap durante um tween */
const ITEMS = [...GRUPOS, ...GRUPOS, ...GRUPOS]

const STATUS_STYLE: Record<string, string> = {
  vagas:    "bg-[#5C3200] text-[#FF9A3C]",
  aberto:   "bg-[#0D3322] text-[#2ECC71]",
  esgotado: "bg-white/8 text-white/30",
}
const STATUS_DOT: Record<string, string> = {
  vagas:    "bg-[#FF9A3C]",
  aberto:   "bg-[#2ECC71]",
  esgotado: "bg-white/20",
}
const STATUS_LABEL: Record<string, string> = {
  vagas:    "Últimas vagas",
  aberto:   "Aberto",
  esgotado: "Esgotado",
}

const CARD_H   = 110
const GAP      = 14
const STRIDE   = CARD_H + GAP
const N        = GRUPOS.length
const LOOP_H   = STRIDE * N
const VISIBLE  = 3
const WIN_H    = STRIDE * VISIBLE
const CENTER_Y = STRIDE + CARD_H / 2          /* centro do card do meio */
const START_Y  = CENTER_Y - LOOP_H - CARD_H / 2  /* item N centrado */

export function FerrisWheel() {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const rawY        = useRef(START_Y)
  const lastScroll  = useRef(0)      /* timestamp do último scroll aceito */
  const COOLDOWN    = 1100           /* ms — igual à duração do tween + buffer */

  /* ── estilo de cada card baseado na distância do centro ── */
  function applyStyles(y: number) {
    ITEMS.forEach((_, i) => {
      const card = cardRefs.current[i]
      if (!card) return
      const mid  = i * STRIDE + CARD_H / 2 + y
      const dist = Math.abs(mid - CENTER_Y)
      const norm = Math.min(dist / (WIN_H * 0.5), 1)
      const isCenter = norm < 0.15

      gsap.set(card, {
        scale:           1 - norm * 0.38,
        opacity:         1 - norm * 0.82,
        transformOrigin: "center center",
      })

      /* borda destacada no card central */
      const el = card.firstElementChild as HTMLElement | null
      if (el) {
        el.style.borderColor = isCenter ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.1)"
        el.style.boxShadow   = isCenter ? "0 0 0 1px rgba(255,255,255,0.15)" : "none"
      }
    })
  }

  /* ── wrap: mantém y no range válido [START_Y - LOOP_H, START_Y] ── */
  function normalizeY(y: number): number {
    let v = y
    while (v < START_Y - LOOP_H) v += LOOP_H
    while (v > START_Y)          v -= LOOP_H
    return v
  }

  /* ── anima track + aplica estilos; wrap só no onComplete ─ */
  function moveTo(target: number, duration = 0.5) {
    gsap.to(trackRef.current, {
      y:        target,
      duration,
      ease:     "power2.out",
      overwrite: "auto",
      onUpdate: () => {
        const y = gsap.getProperty(trackRef.current!, "y") as number
        applyStyles(y)
      },
      onComplete: () => {
        const safe = normalizeY(target)
        if (safe !== target) {
          rawY.current = safe
          gsap.set(trackRef.current, { y: safe })
          applyStyles(safe)
        } else {
          rawY.current = target
        }
      },
    })
  }

  useEffect(() => {
    const wrap_ = wrapRef.current
    const track = trackRef.current
    if (!wrap_ || !track) return

    gsap.set(track, { y: rawY.current })
    applyStyles(rawY.current)

    /* wheel: só com mouse em cima */
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      e.stopPropagation()
      const now = Date.now()
      if (now - lastScroll.current < COOLDOWN) return   /* throttle: um card por vez */
      lastScroll.current = now
      rawY.current -= Math.sign(e.deltaY) * STRIDE
      moveTo(rawY.current, 1.0)
    }
    wrap_.addEventListener("wheel", onWheel, { passive: false })

    return () => wrap_.removeEventListener("wheel", onWheel)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col items-center gap-5 w-full mx-auto">
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden"
        style={{ height: WIN_H }}
      >
        {/* máscara menor */}
        <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-foreground to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-foreground to-transparent z-10 pointer-events-none" />

        <div ref={trackRef} className="absolute inset-x-0 top-0">
          {ITEMS.map((g, i) => (
            <div key={`${g.slug}-${i}`} ref={el => { cardRefs.current[i] = el }}
              style={{ height: CARD_H, marginBottom: GAP }}>
              <a
                href={g.status !== "esgotado" ? "https://wa.me/5511966401489" : undefined}
                target={g.status !== "esgotado" ? "_blank" : undefined}
                rel="noreferrer"
                style={{ transition: "border-color 0.3s, box-shadow 0.3s" }}
                className={`flex items-center h-full overflow-hidden rounded-2xl border select-none
                            ${g.status !== "esgotado"
                              ? "border-white/10 bg-white/6 hover:bg-white/10 cursor-pointer"
                              : "border-white/6 bg-white/3 cursor-default"}`}
              >
                <div className="w-28 h-full shrink-0 relative overflow-hidden rounded-l-2xl">
                  <img src={getUnsplash(g.slug, "sm") ?? ""} alt={g.nome}
                    className="w-full h-full object-cover" loading="lazy" />
                  <span className={`absolute bottom-2 right-2 w-3 h-3 rounded-full
                                     border-2 border-[#0D1F30] ${STATUS_DOT[g.status]}`} />
                </div>
                <div className="flex-1 px-5">
                  <p className="text-[20px] font-bold text-white leading-tight">{g.nome}</p>
                  <p className="text-[17px] text-white/45 mt-1">{g.partida}</p>
                </div>
                <div className="flex flex-col items-end gap-2 pr-5 shrink-0">
                  <span className={`text-[15px] font-bold uppercase tracking-wide
                                    px-3 py-1.5 rounded-full ${STATUS_STYLE[g.status]}`}>
                    {STATUS_LABEL[g.status]}
                  </span>
                  <p className="text-[15px] text-white/40">
                    <span className="text-white/75 font-semibold">{g.membros}/{g.max}</span> membros
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      <p className="flex items-center gap-2 text-[17px] text-primary-foreground/40 select-none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
        Coloque o mouse em cima e role para ver mais grupos
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </p>
    </div>
  )
}
