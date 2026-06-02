"use client"

import { useState, useRef } from "react"
import { CaretDown } from "@phosphor-icons/react"
import { TransitionLink } from "./gsap/TransitionLink"

const CONTINENTES = [
  { label: "África",           value: "africa"          },
  { label: "América do Norte", value: "america-norte"   },
  { label: "América do Sul",   value: "america-sul"     },
  { label: "América Central",  value: "america-central" },
  { label: "Ásia",             value: "asia"            },
  { label: "Europa",           value: "europa"          },
]

export function DestinosModal() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <TransitionLink
        href="/pacotes/selecao"
        className="nav-link flex items-center gap-1 text-[20px] font-medium
                   text-foreground-muted hover:text-foreground transition-colors duration-200"
      >
        Destinos
        <CaretDown
          size={13}
          weight="bold"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </TransitionLink>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0
                        bg-background border border-border rounded-xl shadow-xl
                        py-2 min-w-[220px] z-50">
          {/* ponte invisível para não perder hover ao mover o mouse */}
          <div className="absolute -top-2 left-0 right-0 h-2" />
          {CONTINENTES.map(({ label, value }) => (
            <TransitionLink
              key={value}
              href={`/pacotes/selecao?continente=${value}`}
              onClick={() => setOpen(false)}
              className="block px-5 py-3 text-[20px] text-foreground-muted
                         hover:text-foreground hover:bg-background-section
                         transition-colors duration-150"
            >
              {label}
            </TransitionLink>
          ))}
          <div className="border-t border-border mt-2 pt-2">
            <TransitionLink
              href="/pacotes/selecao"
              onClick={() => setOpen(false)}
              className="block px-5 py-3 text-[20px] font-semibold text-foreground
                         hover:bg-background-section transition-colors duration-150"
            >
              Ver todos os pacotes →
            </TransitionLink>
          </div>
        </div>
      )}
    </div>
  )
}
