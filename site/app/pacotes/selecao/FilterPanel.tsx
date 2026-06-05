"use client"

import { useState, Suspense } from "react"
import { FilterBar } from "./FilterBar"
import { PriceCalculator } from "./PriceCalculator"
import { SlidersHorizontal, X } from "@phosphor-icons/react"
import gsap from "gsap"
import { useRef, useEffect } from "react"

export function FilterPanel() {
  const [open, setOpen]     = useState(false)
  const panelRef            = useRef<HTMLDivElement>(null)
  const hasActiveFilter     = false  /* pode expandir pra checar searchParams */

  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    if (open) {
      gsap.set(el, { display: "block" })
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" })
    } else {
      gsap.to(el, {
        height: 0, opacity: 0, duration: 0.2, ease: "power2.in",
        onComplete: () => gsap.set(el, { display: "none" }),
      })
    }
  }, [open])

  return (
    <div className="border-b border-white/10">
      {/* Trigger */}
      <div className="flex items-center justify-between px-[clamp(20px,5vw,80px)] py-4">
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-3 text-[18px] font-semibold text-white/80
                     hover:text-white transition-colors cursor-pointer"
        >
          <SlidersHorizontal size={20} weight="bold" />
          Filtrar
          {open && <X size={16} weight="bold" className="text-white/50" />}
        </button>
        {!open && (
          <p className="text-[15px] text-white/40">
            Continente · Tipo · Preço
          </p>
        )}
      </div>

      {/* Painel expansível */}
      <div ref={panelRef} className="overflow-hidden" style={{ display: "none", height: 0 }}>
        <div className="pb-6 flex flex-col gap-6" onClick={() => setOpen(false)}>
          <Suspense>
            <FilterBar />
          </Suspense>
          <Suspense>
            <PriceCalculator />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
