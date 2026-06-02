"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"

const FAIXAS = [
  { label: "Qualquer preço", max: 0     },
  { label: "Até US$ 4.000",  max: 4000  },
  { label: "Até US$ 6.000",  max: 6000  },
  { label: "Até US$ 9.000",  max: 9000  },
  { label: "Até US$ 13.000", max: 13000 },
]

export function PriceCalculator({
  navigateTo,
  theme = "dark",
  value,
  onChange,
}: {
  navigateTo?: string
  theme?: "dark" | "light"
  value?: number          /* modo controlado — sem redirect */
  onChange?: (max: number) => void
} = {}) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  /* modo controlado (homepage inline) vs modo URL (seleção) */
  const current  = onChange !== undefined ? (value ?? 0) : Number(searchParams.get("precoMax") ?? 0)
  const basePath = navigateTo ?? pathname

  function select(max: number) {
    if (onChange) { onChange(max); return }
    const params = new URLSearchParams(navigateTo ? "" : searchParams.toString())
    if (max) params.set("precoMax", String(max))
    else params.delete("precoMax")
    router.push(`${basePath}?${params.toString()}`)
  }

  const activeClass  = theme === "dark"
    ? "bg-white text-[#060F18] border-white"
    : "bg-foreground text-background border-foreground"
  const inactiveClass = theme === "dark"
    ? "bg-transparent text-white/60 border-white/20 hover:border-white/60 hover:text-white"
    : "bg-transparent text-foreground-muted border-border hover:border-foreground hover:text-foreground"
  const labelClass = theme === "dark" ? "text-white/40" : "text-foreground-subtle"

  return (
    <div className={theme === "dark" ? "px-[clamp(20px,5vw,80px)] pb-6" : ""}>
      <p className={`text-[20px] font-semibold uppercase tracking-[0.1em] mb-4 ${labelClass}`}>
        Viaje pagando até:
      </p>
      <div className="flex flex-wrap gap-3">
        {FAIXAS.map(({ label, max }) => (
          <button
            key={max}
            onClick={() => select(max)}
            aria-pressed={current === max}
            className={`px-5 py-2.5 rounded-full text-[20px] font-semibold uppercase tracking-[0.1em] border transition-all duration-200 cursor-pointer
                        ${current === max ? activeClass : inactiveClass}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
