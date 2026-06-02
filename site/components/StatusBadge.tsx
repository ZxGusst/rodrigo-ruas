"use client"

import { Clock } from "@phosphor-icons/react"

interface StatusBadgeProps {
  badge: string | null | undefined
  className?: string
}

const CONFIG = {
  vagas:    { label: "Últimas vagas", bg: "#FFF3E0", text: "#7A3800", icon: true  },
  esgotado: { label: "Esgotado",      bg: "#F0F0F0", text: "#555555", icon: false },
}

export function StatusBadge({ badge, className = "" }: StatusBadgeProps) {
  if (!badge) return null
  const config = CONFIG[badge as keyof typeof CONFIG]
  if (!config) return null

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full select-none ${className}`}
      style={{ background: config.bg, color: config.text }}
    >
      {config.icon && <Clock size={12} weight="bold" />}
      {config.label}
    </span>
  )
}
