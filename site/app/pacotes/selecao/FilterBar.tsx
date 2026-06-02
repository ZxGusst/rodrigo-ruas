"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"

const CONTINENTES = [
  { label: "Todos",            value: ""                },
  { label: "África",           value: "africa"          },
  { label: "América do Norte", value: "america-norte"   },
  { label: "América do Sul",   value: "america-sul"     },
  { label: "América Central",  value: "america-central" },
  { label: "Ásia",             value: "asia"            },
  { label: "Europa",           value: "europa"          },
]

export function FilterBar() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const current      = searchParams.get("continente") ?? ""

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set("continente", value)
    else params.delete("continente")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 px-[clamp(20px,5vw,80px)] pt-4 pb-8">
      {CONTINENTES.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => select(value)}
          aria-pressed={current === value}
          className={`px-5 py-2.5 rounded-full text-[20px] font-semibold uppercase tracking-[0.1em]
                      border transition-all duration-200 cursor-pointer
                      ${current === value
                        ? "bg-white text-[#060F18] border-white"
                        : "bg-transparent text-white/60 border-white/20 hover:border-white/60 hover:text-white"
                      }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

