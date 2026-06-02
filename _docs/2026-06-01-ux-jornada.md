# UX Jornada — Navbar + Filtros + Calculadora + Páginas Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reestruturar a navegação, melhorar legibilidade na seleção de pacotes, adicionar calculadora de preço e criar páginas /contato e /sobre.

**Architecture:** Navbar com modal de destinos (continentes) client-side; página /selecao recebe filtros via searchParams; novas páginas /contato e /sobre são Server Components com seções estáticas; campo `preco` adicionado ao schema Sanity para a calculadora.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS, GSAP, Phosphor Icons, Sanity CMS, TypeScript

---

## Task 1: Navbar — Destinos modal + rotas reais

**Files:**
- Modify: `components/gsap/NavBar.tsx`
- Create: `components/DestinosModal.tsx`

### Contexto
- Navbar atual tem links para âncoras (`#destinos`, `#sobre`, `#contato`) — virar rotas reais
- "Destinos" abre um modal/dropdown com continentes que linkam para `/pacotes/selecao?continente=X`
- Estrutura nova: `Pacotes` → `/pacotes/selecao` | `Destinos` → modal | `Contato` → `/contato` | `Sobre` → `/sobre`
- Sanity já tem campo `continentes` no schema de pacote

### Continentes
```
africa | america-norte | america-sul | america-central | asia | europa
```

- [ ] **1.1** Criar `components/DestinosModal.tsx` — dropdown que aparece ao clicar em "Destinos":

```tsx
"use client"
import { useState, useRef, useEffect } from "react"
import { TransitionLink } from "./gsap/TransitionLink"
import { CaretDown } from "@phosphor-icons/react"

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

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="nav-link flex items-center gap-1 text-[16px] font-medium
                   text-foreground-muted hover:text-foreground transition-colors duration-200"
      >
        Destinos
        <CaretDown
          size={13}
          weight="bold"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3
                        bg-background border border-border rounded-xl shadow-xl
                        py-2 min-w-[200px] z-50">
          {CONTINENTES.map(({ label, value }) => (
            <TransitionLink
              key={value}
              href={`/pacotes/selecao?continente=${value}`}
              onClick={() => setOpen(false)}
              className="block px-5 py-2.5 text-[15px] text-foreground-muted
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
              className="block px-5 py-2.5 text-[15px] font-semibold text-foreground
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
```

- [ ] **1.2** Atualizar `components/gsap/NavBar.tsx` — trocar links por rotas reais + integrar `DestinosModal`:

```tsx
// Trocar o array `links` por:
const links = [
  { label: "Pacotes", href: "/pacotes/selecao" },
  { label: "Contato", href: "/contato" },
  { label: "Sobre",   href: "/sobre"   },
]
```

E no JSX, inserir `<DestinosModal />` entre "Pacotes" e "Contato":

```tsx
<ul className="hidden md:flex items-center gap-10 list-none">
  <li>
    <TransitionLink href="/pacotes/selecao" className="nav-link text-[16px] font-medium text-foreground-muted hover:text-foreground transition-colors duration-200">
      Pacotes
    </TransitionLink>
  </li>
  <li><DestinosModal /></li>
  <li>
    <TransitionLink href="/contato" className="nav-link text-[16px] font-medium text-foreground-muted hover:text-foreground transition-colors duration-200">
      Contato
    </TransitionLink>
  </li>
  <li>
    <TransitionLink href="/sobre" className="nav-link text-[16px] font-medium text-foreground-muted hover:text-foreground transition-colors duration-200">
      Sobre
    </TransitionLink>
  </li>
</ul>
```

- [ ] **1.3** Verificar no browser: hover no "Destinos" abre dropdown, clicar num continente navega para `/pacotes/selecao?continente=europa`
- [ ] **1.4** Commit: `feat: navbar com destinos modal e rotas reais`

---

## Task 2: /pacotes/selecao — filtros + legibilidade

**Files:**
- Modify: `app/pacotes/selecao/PackagesList.tsx`
- Modify: `app/pacotes/selecao/page.tsx`
- Create: `app/pacotes/selecao/FilterBar.tsx`

### Contexto
- `PackagesList` tem texto da direita (período, dias, badge) com `text-white/40` e `text-[13px]` — muito opacos/pequenos
- Precisa de `FilterBar` client: filtros por continente (vem de `searchParams`) e por faixa de preço
- `continentes` já existe no schema Sanity; `preco` ainda não (adicionar no Task 3)
- O filtro de continente pode ser aplicado só com os dados existentes

### 2A — Legibilidade do PackagesList

- [ ] **2.1** Em `PackagesList.tsx`, linha 143–157, aumentar tamanho e opacidade dos itens da direita:

```tsx
// DE:
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

// PARA:
{p.periodo && (
  <span className="text-[15px] text-white/75 hidden md:block">{p.periodo}</span>
)}
{p.dias && (
  <span className="text-[15px] text-white/75 hidden md:block">{p.dias} dias</span>
)}
{p.badge && (
  <span className={`text-[13px] font-bold uppercase tracking-wide
                   px-3 py-1.5 rounded-full flex items-center gap-1.5
                   ${p.badge === "vagas"
                     ? "bg-warning/30 text-warning"
                     : "bg-white/15 text-white/70"}`}>
    <Clock size={11} weight="bold" />
    {p.badge === "vagas" ? "Últimas vagas" : "Esgotado"}
  </span>
)}
```

### 2B — FilterBar com continente e futuramente preço

- [ ] **2.2** Criar `app/pacotes/selecao/FilterBar.tsx`:

```tsx
"use client"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

const CONTINENTES = [
  { label: "Todos",            value: ""               },
  { label: "África",           value: "africa"         },
  { label: "América do Norte", value: "america-norte"  },
  { label: "América do Sul",   value: "america-sul"    },
  { label: "América Central",  value: "america-central"},
  { label: "Ásia",             value: "asia"           },
  { label: "Europa",           value: "europa"         },
]

export function FilterBar() {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()
  const current     = searchParams.get("continente") ?? ""

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set("continente", value)
    else params.delete("continente")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {CONTINENTES.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => select(value)}
          className={`px-4 py-2 rounded-full text-[13px] font-semibold uppercase tracking-wide
                      border transition-all duration-200
                      ${current === value
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-foreground-muted border-border hover:border-foreground hover:text-foreground"
                      }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **2.3** Atualizar `app/pacotes/selecao/page.tsx` para:
  - Ler `searchParams.continente`
  - Passar `continente` para `PackagesList` como prop
  - Renderizar `<FilterBar />` acima da lista

- [ ] **2.4** Atualizar `PackagesList` para receber e aplicar o filtro:
  - Adicionar prop `continente?: string`
  - Filtrar `pacotes.filter(p => !continente || p.continentes?.includes(continente))`

- [ ] **2.5** Verificar no browser: clicar num continente na FilterBar atualiza a URL e filtra a lista
- [ ] **2.6** Commit: `feat: filtro por continente + legibilidade na selecao de pacotes`

---

## Task 3: Sanity — campo `preco` + calculadora

**Files:**
- Modify: `sanity/schemaTypes/pacote.ts`
- Modify: `sanity/lib/queries.ts`
- Create: `app/pacotes/selecao/PriceCalculator.tsx`
- Modify: `app/pacotes/selecao/FilterBar.tsx`

### 3A — Adicionar campo preco ao Sanity

- [ ] **3.1** Em `sanity/schemaTypes/pacote.ts`, adicionar dentro de `/* ── Info do pacote */`:

```ts
defineField({
  name: "preco",
  title: "Preço por pessoa (R$)",
  type: "number",
  description: "Valor aproximado por pessoa. Usado para o filtro de preço.",
}),
```

- [ ] **3.2** Atualizar queries em `sanity/lib/queries.ts` para incluir `preco` nos campos buscados
- [ ] **3.3** Verificar no Sanity Studio que o campo aparece

### 3B — PriceCalculator + integração ao FilterBar

- [ ] **3.4** Criar `app/pacotes/selecao/PriceCalculator.tsx`:

```tsx
"use client"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

const FAIXAS = [
  { label: "Qualquer preço", max: 0       },
  { label: "Até R$ 5.000",   max: 5000    },
  { label: "Até R$ 8.000",   max: 8000    },
  { label: "Até R$ 12.000",  max: 12000   },
  { label: "Até R$ 18.000",  max: 18000   },
]

export function PriceCalculator() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const current      = Number(searchParams.get("precoMax") ?? 0)

  function select(max: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (max) params.set("precoMax", String(max))
    else params.delete("precoMax")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="mb-8">
      <p className="t-label mb-3">Viaje pagando até:</p>
      <div className="flex flex-wrap gap-2">
        {FAIXAS.map(({ label, max }) => (
          <button
            key={max}
            onClick={() => select(max)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-200
                        ${current === max
                          ? "bg-foreground text-background border-foreground"
                          : "bg-transparent text-foreground-muted border-border hover:border-foreground hover:text-foreground"
                        }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **3.5** Integrar `precoMax` no filtro do `PackagesList`:
  ```ts
  .filter(p => !precoMax || !p.preco || p.preco <= precoMax)
  ```
- [ ] **3.6** Adicionar `<PriceCalculator />` acima do `<FilterBar />` na página de seleção
- [ ] **3.7** Verificar no browser: selecionar faixa filtra cards; "Qualquer preço" remove filtro
- [ ] **3.8** Commit: `feat: calculadora de preco com filtro na selecao`

---

## Task 4: Página /contato

**Files:**
- Create: `app/contato/page.tsx`

### Contexto
- Email + botão WhatsApp + formulário inline (reutilizar lógica do `FormModal`)
- Server Component estático, sem modal — formulário direto na página
- Design: duas colunas desktop (info esquerda, form direita)

- [ ] **4.1** Criar `app/contato/page.tsx`:

```tsx
import { NavBar } from "@/components/gsap/NavBar"
import { ScrollReveal, LineReveal } from "@/components/gsap"
import { BtnPrimary } from "@/components/gsap/BtnPrimary"
import { WhatsappLogo, Envelope } from "@phosphor-icons/react/dist/ssr"

const WA = "https://wa.me/5511966401489"
const EMAIL = "contato@rrviagens.com.br"

export default function ContatoPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <NavBar />
      <section className="wrap pt-40 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Esquerda — info */}
          <div>
            <ScrollReveal>
              <p className="t-label mb-4">Fale com a gente</p>
            </ScrollReveal>
            <LineReveal as="h1" className="t-h1 text-foreground mb-6 leading-none">
              Entre em contato
            </LineReveal>
            <ScrollReveal delay={0.1}>
              <p className="t-body-lg mb-10">
                Atendimento direto com a equipe do Rodrigo Ruas.
                Sem chatbot, sem fila — pessoa real respondendo.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2} className="flex flex-col gap-4">
              <a href={WA} target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-3 text-[17px] font-medium
                            text-foreground hover:text-primary transition-colors">
                <WhatsappLogo weight="fill" className="w-6 h-6 text-success" />
                (11) 96640-1489
              </a>
              <a href={`mailto:${EMAIL}`}
                 className="inline-flex items-center gap-3 text-[17px] font-medium
                            text-foreground hover:text-primary transition-colors">
                <Envelope weight="fill" className="w-6 h-6 text-primary" />
                {EMAIL}
              </a>
            </ScrollReveal>
            <ScrollReveal delay={0.3} className="mt-10">
              <BtnPrimary href={WA} target="_blank" rel="noreferrer">
                Falar no WhatsApp agora
              </BtnPrimary>
            </ScrollReveal>
          </div>

          {/* Direita — formulário */}
          {/* Reutilizar FormModal inline ou criar form simples com action API */}
          <ScrollReveal delay={0.15} className="bg-background-section rounded-2xl p-8 border border-border">
            <p className="t-label mb-6">Ou nos envie uma mensagem</p>
            {/* TODO: extrair FormFields do FormModal para componente reutilizável */}
            <p className="t-body text-foreground-muted">Formulário em breve.</p>
          </ScrollReveal>

        </div>
      </section>
    </main>
  )
}
```

- [ ] **4.2** Extrair campos do formulário do `FormModal.tsx` para `components/ContactForm.tsx` (client component) e usar tanto no modal quanto na página `/contato`
- [ ] **4.3** Verificar no browser: página `/contato` carrega, links funcionam
- [ ] **4.4** Commit: `feat: pagina /contato`

---

## Task 5: Página /sobre

**Files:**
- Create: `app/sobre/page.tsx`

### Contexto
- Galeria de fotos dos destinos onde Rodrigo já foi + storytelling
- Server Component estático por enquanto (imagens Unsplash como placeholder)
- Layout: hero com foto do Rodrigo, stats, timeline de destinos, CTA

- [ ] **5.1** Criar `app/sobre/page.tsx`:

```tsx
import { NavBar } from "@/components/gsap/NavBar"
import { ScrollReveal, LineReveal, RevealImage } from "@/components/gsap"
import { BtnPrimary } from "@/components/gsap/BtnPrimary"
import { getUnsplash } from "@/lib/unsplash"

const STATS = [
  { n: "93",    l: "países visitados"    },
  { n: "19+",   l: "anos de estrada"     },
  { n: "1.500+",l: "viajantes guiados"   },
  { n: "40+",   l: "destinos ativos"     },
]

const FOTOS = [
  { slug: "japao",    label: "Japão"    },
  { slug: "turquia",  label: "Turquia"  },
  { slug: "grecia",   label: "Grécia"   },
  { slug: "marrocos", label: "Marrocos" },
  { slug: "islandia", label: "Islândia" },
  { slug: "egito",    label: "Egito"    },
]

export default function SobrePage() {
  const WA = "https://wa.me/5511966401489"
  return (
    <main className="bg-background text-foreground">
      <NavBar />

      {/* Hero */}
      <section className="wrap pt-40 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <ScrollReveal><p className="t-label mb-4">Quem é Rodrigo Ruas</p></ScrollReveal>
          <LineReveal as="h1" className="t-h1 text-foreground mb-6 leading-none">
            93 países.<br />19 anos de estrada.
          </LineReveal>
          <ScrollReveal delay={0.1}>
            <p className="t-body-lg mb-8">
              Rodrigo Ruas não é agente de viagens — é um especialista que já esteve em cada destino que vende.
              Em 19 anos conduzindo grupos, levou mais de 1.500 viajantes pelo mundo.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2} className="flex gap-10 mb-10 border-t border-border pt-8">
            {STATS.map(({ n, l }) => (
              <div key={l}>
                <p className="text-[36px] font-bold text-foreground leading-none">{n}</p>
                <p className="t-label mt-1">{l}</p>
              </div>
            ))}
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <BtnPrimary href={WA} target="_blank" rel="noreferrer">
              Viajar com o Rodrigo
            </BtnPrimary>
          </ScrollReveal>
        </div>
        <RevealImage direction="up" className="overflow-hidden">
          <div className="aspect-[3/4] relative overflow-hidden">
            <img
              src={getUnsplash("rodrigo", "lg") ?? ""}
              alt="Rodrigo Ruas"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </RevealImage>
      </section>

      {/* Galeria de destinos */}
      <section className="border-t border-border py-20">
        <div className="wrap">
          <ScrollReveal className="mb-12">
            <p className="t-label mb-2">Onde já estivemos</p>
            <h2 className="t-h2 text-foreground">Destinos com a marca Ruas</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {FOTOS.map(({ slug, label }, i) => (
              <ScrollReveal key={slug} delay={i * 0.06}
                className="relative overflow-hidden group aspect-[4/3]">
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.05]">
                  <img
                    src={getUnsplash(slug, "md") ?? ""}
                    alt={label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent pointer-events-none" />
                <p className="absolute bottom-4 left-4 text-[16px] font-bold text-white uppercase">
                  {label}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
```

- [ ] **5.2** Verificar no browser: página `/sobre` carrega com galeria e stats
- [ ] **5.3** Commit: `feat: pagina /sobre com galeria e storytelling`

---

## Ordem de execução recomendada

1. Task 1 (Navbar) — desbloqueador: rotas precisam existir antes de linkar
2. Task 2A (legibilidade PackagesList) — quick win, 10 min
3. Task 2B (FilterBar continentes) — depende de Task 1
4. Task 4 (página /contato) — necessária para o link da nav funcionar
5. Task 5 (página /sobre) — necessária para o link da nav funcionar
6. Task 3 (calculadora preço) — depende de campo Sanity ser preenchido
