export default function StyleGuidePage() {
  return (
    <main className="min-h-screen bg-background">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-border bg-background px-[clamp(24px,5vw,64px)] h-16">
        <span className="text-lg font-bold tracking-tight text-foreground">RR VIAGENS</span>
        <ul className="flex gap-8 list-none">
          {["PACOTES","DESTINOS","SOBRE","PROCESSO"].map(l => (
            <li key={l}>
              <a href="#" className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors tracking-wide">
                {l}
              </a>
            </li>
          ))}
        </ul>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold tracking-wide px-[18px] py-2 rounded-full hover:opacity-90 transition-opacity">
          GET IN TOUCH <span className="inline-block w-[6px] h-[6px] rounded-full bg-primary-foreground" />
        </button>
      </nav>

      {/* HERO */}
      <section className="min-h-screen pt-16 px-[clamp(24px,5vw,64px)] grid grid-rows-[1fr_auto]">
        <div className="flex justify-between items-start pt-[clamp(40px,8vh,100px)]">
          <span className="t-label">Design System — 2026</span>
          <div className="text-right t-small">DM Sans<br />White mode · Navy text</div>
        </div>
        <div className="pb-[clamp(32px,5vh,64px)]">
          <h1 className="t-hero text-foreground mb-[clamp(24px,3vh,40px)]">
            PACOTES<br />
            <span className="block pl-[clamp(48px,12vw,200px)]">PELO MUNDO</span>
          </h1>
          <div className="flex justify-between items-end">
            <p className="t-body max-w-[320px]">Curadoria de expert para viajantes exigentes. 93 países. 19 anos de estrada.</p>
            <span className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground-subtle after:block after:w-8 after:h-px after:bg-foreground-subtle">
              SCROLL TO SEE TOKENS
            </span>
          </div>
        </div>
      </section>

      {/* GRID EDITORIAL */}
      <section className="px-[clamp(24px,5vw,64px)]">
        <div className="flex gap-3 items-end overflow-hidden">
          {[
            { label: "Turquia", flex: "0.6", h: "clamp(180px,28vw,380px)" },
            { label: "Japão",   flex: "1.1", h: "clamp(240px,36vw,500px)" },
            { label: "Grécia",  flex: "1.4", h: "clamp(180px,28vw,380px)" },
            { label: "Egito",   flex: "0.9", h: "clamp(240px,36vw,500px)" },
            { label: "Marrocos",flex: "0.7", h: "clamp(180px,28vw,380px)" },
            { label: "Islândia",flex: "1.2", h: "clamp(240px,36vw,500px)" },
          ].map(({ label, flex, h }) => (
            <div key={label} className="group cursor-pointer overflow-hidden" style={{ flex }}>
              <div className="w-full bg-background-section transition-transform duration-700 group-hover:scale-[1.04]" style={{ height: h }} />
              <p className="pt-[10px] text-[11px] font-semibold tracking-[0.06em] uppercase text-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GIANT LABEL */}
      <div className="px-[clamp(24px,5vw,64px)] border-b-2 border-foreground flex justify-between items-end pb-4 pt-[clamp(48px,8vh,100px)]"
           style={{ fontSize: "clamp(72px,13vw,180px)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.04em" }}>
        <span>TOKENS</span>
        <p className="t-small text-right pb-3 leading-relaxed">Cores · Tipografia · Componentes<br />Espaçamento · Radius · Sombras</p>
      </div>

      {/* TOKENS WRAP */}
      <div className="px-[clamp(24px,5vw,64px)]">

        {/* CORES */}
        <Section id="cores" title="Cores Principais">
          <div className="flex flex-wrap gap-3 mb-4">
            {[
              { name: "background",   hex: "#FAFAF8", var: "var(--color-background)" },
              { name: "elevated",     hex: "#F3F1EC", var: "var(--color-background-elevated)" },
              { name: "foreground",   hex: "#0D1F30", var: "var(--color-foreground)" },
              { name: "muted",        hex: "#3D5A6E", var: "var(--color-foreground-muted)" },
              { name: "subtle",       hex: "#7090A0", var: "var(--color-foreground-subtle)" },
              { name: "border",       hex: "#E0DBD4", var: "var(--color-border)" },
              { name: "primary/CTA",  hex: "#0D1F30", var: "var(--color-primary)" },
            ].map(s => <Swatch key={s.name} {...s} />)}
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { name: "destructive", hex: "#B83030", var: "var(--color-destructive)" },
              { name: "warning",     hex: "#A06020", var: "var(--color-warning)" },
              { name: "success",     hex: "#1A8A48", var: "var(--color-success)" },
            ].map(s => <Swatch key={s.name} {...s} />)}
          </div>
        </Section>

        {/* ESCALA */}
        <Section id="escala" title="Escala warm-gray (off-white → navy)">
          <div className="flex flex-wrap gap-3">
            {[
              { name:"50",  hex:"#FAFAF8" },{ name:"100", hex:"#F3F1EC" },
              { name:"200", hex:"#E8E4DF" },{ name:"300", hex:"#D4CEC6" },
              { name:"400", hex:"#A8A09A" },{ name:"500", hex:"#78706A" },
              { name:"600", hex:"#504840" },{ name:"700", hex:"#302C28" },
              { name:"800", hex:"#1C1816" },{ name:"900", hex:"#0D0C0B" },
            ].map(s => <Swatch key={s.name} name={s.name} hex={s.hex} var={s.hex} />)}
          </div>
        </Section>

        {/* TIPOGRAFIA */}
        <Section id="tipo" title="Hierarquia Tipográfica — DM Sans">
          <div className="flex flex-col divide-y divide-border">
            {[
              { role:"Hero",       css:"clamp(64,10vw,140px) · 700 · ls -0.03em", el:<span style={{fontSize:"clamp(36px,6vw,72px)",fontWeight:700,lineHeight:0.95,letterSpacing:"-0.03em"}}>PACOTES</span> },
              { role:"H1",         css:"56px · 700 · ls -0.02em",  el:<span style={{fontSize:56,fontWeight:700,lineHeight:1.05,letterSpacing:"-0.02em"}}>Destinos pelo Mundo</span> },
              { role:"H2",         css:"40px · 600 · ls -0.01em",  el:<span style={{fontSize:40,fontWeight:600,lineHeight:1.1,letterSpacing:"-0.01em"}}>Grupos do Ruas</span> },
              { role:"H3",         css:"32px · 600",               el:<span style={{fontSize:32,fontWeight:600,lineHeight:1.2}}>Pacotes Assinados</span> },
              { role:"H4",         css:"24px · 500",               el:<span style={{fontSize:24,fontWeight:500,lineHeight:1.3}}>Japão · Outubro 2026</span> },
              { role:"Body LG",    css:"17px · 400 · lh 1.7",      el:<span style={{fontSize:17,lineHeight:1.7,color:"hsl(var(--foreground-muted))"}}>Pacotes feitos por um verdadeiro expert. 93 países.</span> },
              { role:"Body",       css:"15px · 400 · lh 1.75",     el:<span style={{fontSize:15,lineHeight:1.75,color:"hsl(var(--foreground-muted))"}}>Saída em março 2026 · 12 dias · Ásia | África | Europa</span> },
              { role:"Small",      css:"13px · 400",                el:<span style={{fontSize:13,color:"hsl(var(--foreground-subtle))"}}>Saída em 15/03/2026 · 10 dias</span> },
              { role:"Label",      css:"11px · 600 · uppercase · ls 0.14em", el:<span style={{fontSize:11,fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase",color:"hsl(var(--foreground-subtle))"}}>Pacotes Feitos por um Expert</span> },
            ].map(r => (
              <div key={r.role} className="flex items-baseline gap-8 py-5">
                <div className="w-40 shrink-0">
                  <p className="text-sm font-medium text-foreground">{r.role}</p>
                  <p className="text-[11px] text-foreground-subtle leading-relaxed">{r.css}</p>
                </div>
                <div>{r.el}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* BOTÕES */}
        <Section id="botoes" title="Botões">
          <div className="flex flex-col gap-6">
            <div>
              <p className="t-label mb-3">Variantes</p>
              <div className="flex flex-wrap gap-3 items-center">
                <Btn variant="primary">GET IN TOUCH</Btn>
                <Btn variant="secondary">Ver Destinos</Btn>
                <Btn variant="ghost">Saiba Mais</Btn>
                <Btn variant="success">WhatsApp</Btn>
              </div>
            </div>
            <div>
              <p className="t-label mb-3">Tamanhos</p>
              <div className="flex flex-wrap gap-3 items-center">
                <Btn variant="primary" size="sm">Small</Btn>
                <Btn variant="primary" size="md">Medium</Btn>
                <Btn variant="primary" size="lg">Large</Btn>
              </div>
            </div>
          </div>
        </Section>

        {/* BADGES */}
        <Section id="badges" title="Badges">
          <div className="flex flex-wrap gap-3 items-center">
            <Badge variant="destructive">Esgotado</Badge>
            <Badge variant="warning">Últimas Vagas!</Badge>
            <Badge variant="success">Disponível</Badge>
            <Badge variant="default">Novidade</Badge>
          </div>
        </Section>

        {/* CARDS */}
        <Section id="cards" title="Card de Destino">
          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            {[
              { dest:"Japão · Out 2026",  date:"04/10", days:"12 dias", badge:"warning" as const },
              { dest:"Grécia · Jun 2026", date:"10/06", days:"10 dias", badge:"destructive" as const },
              { dest:"Egito · Mar 2026",  date:"15/03", days:"10 dias", badge:null },
            ].map(c => (
              <div key={c.dest} className="border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="aspect-[3/2] bg-background-section relative flex items-center justify-center">
                  {c.badge && (
                    <div className="absolute top-3 left-3">
                      <Badge variant={c.badge}>{c.badge === "warning" ? "Últimas Vagas!" : "Esgotado"}</Badge>
                    </div>
                  )}
                  <span className="t-label opacity-40">foto</span>
                </div>
                <div className="p-4">
                  <p className="text-base font-semibold text-foreground mb-1">{c.dest}</p>
                  <div className="flex gap-4 text-[11px] text-foreground-subtle">{c.date}<span>{c.days}</span></div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* SURFACE DARK */}
        <Section id="dark" title="Surface Dark — seção de contraste">
          <div className="bg-surface-dark text-surface-dark-text rounded-lg p-10 flex flex-col gap-6">
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase opacity-40">O Processo</span>
            <p className="t-h2 text-surface-dark-text">Chega no aeroporto.<br />O resto é com a gente.</p>
            <p className="t-body text-surface-dark-text opacity-60 max-w-md">93 países visitados. 19 anos de estrada. Mais de 1.500 viajantes levados.</p>
            <button className="self-start flex items-center gap-2 bg-surface-dark-text text-surface-dark text-sm font-semibold tracking-wide px-5 py-3 rounded-full hover:opacity-90 transition-opacity">
              Ver Destinos <span className="inline-block w-[7px] h-[7px] rounded-full bg-surface-dark" />
            </button>
          </div>
        </Section>

        {/* RADIUS */}
        <Section id="radius" title="Border Radius">
          <div className="flex gap-8 flex-wrap items-end">
            {[
              { label:"none", r:"0px",    cls:"rounded-none" },
              { label:"sm",   r:"4px",    cls:"rounded-sm" },
              { label:"md",   r:"8px",    cls:"rounded-md" },
              { label:"lg",   r:"16px",   cls:"rounded-lg" },
              { label:"full", r:"9999px", cls:"rounded-full" },
            ].map(({ label, r, cls }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className={`w-16 h-16 bg-background-section border border-border ${cls}`} />
                <p className="text-[11px] text-foreground-muted text-center leading-relaxed">
                  <strong className="block text-foreground">{label}</strong>{r}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* SOMBRAS */}
        <Section id="sombras" title="Sombras (tint navy)">
          <div className="flex gap-10 flex-wrap items-end">
            {[
              { label:"sm",  s:"0 1px 3px hsl(209 57% 12% / 0.08)"  },
              { label:"md",  s:"0 4px 12px hsl(209 57% 12% / 0.10)" },
              { label:"lg",  s:"0 8px 24px hsl(209 57% 12% / 0.12)" },
              { label:"xl",  s:"0 16px 48px hsl(209 57% 12% / 0.14)"},
            ].map(({ label, s }) => (
              <div key={label} className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-background rounded-lg" style={{ boxShadow: s }} />
                <p className="text-[11px] text-foreground-muted">{label}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ESPAÇAMENTO */}
        <Section id="spacing" title="Espaçamento" className="mb-24">
          <div className="flex flex-wrap gap-4 items-end">
            {[4,8,12,16,24,32,48,64,80,96].map(px => (
              <div key={px} className="flex flex-col items-center gap-1">
                <div className="bg-foreground opacity-10 h-5 rounded-sm" style={{ width: px }} />
                <p className="text-[10px] text-foreground-subtle text-center">{px}px</p>
              </div>
            ))}
          </div>
        </Section>

      </div>{/* /tokens-wrap */}
    </main>
  )
}

/* ─── COMPONENTES INTERNOS DA STYLE GUIDE ────────────────── */

function Section({ id, title, children, className = "" }: {
  id: string; title: string; children: React.ReactNode; className?: string
}) {
  return (
    <section id={id} className={`pt-16 mb-16 ${className}`}>
      <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-foreground-subtle mb-6 pb-3 border-b border-border">
        {title}
      </p>
      {children}
    </section>
  )
}

function Swatch({ name, hex, var: cssVar }: { name: string; hex: string; var: string }) {
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[80px]">
      <div className="h-14 rounded border border-border" style={{ background: hex }} />
      <div className="text-[11px] text-foreground-muted leading-tight">
        <strong className="block text-[13px] text-foreground font-medium">{name}</strong>
        {hex}
      </div>
    </div>
  )
}

function Btn({ children, variant = "primary", size = "md" }: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "ghost" | "success"
  size?: "sm" | "md" | "lg"
}) {
  const variants = {
    primary:   "bg-primary text-primary-foreground hover:opacity-90",
    secondary: "bg-transparent text-foreground border-[1.5px] border-foreground hover:bg-foreground hover:text-background",
    ghost:     "bg-transparent text-foreground-muted hover:text-foreground",
    success:   "bg-success text-success-foreground hover:opacity-90",
  }
  const sizes = {
    sm:  "px-[18px] py-2 text-[11px]",
    md:  "px-[22px] py-[11px] text-[13px]",
    lg:  "px-8 py-[14px] text-[15px]",
  }
  return (
    <button className={`inline-flex items-center gap-2 font-semibold tracking-wide rounded-full transition-all ${variants[variant]} ${sizes[size]}`}>
      {children}
      <span className="inline-block w-[6px] h-[6px] rounded-full opacity-80" style={{ background: "currentColor" }} />
    </button>
  )
}

function Badge({ children, variant = "default" }: {
  children: React.ReactNode
  variant?: "default" | "destructive" | "warning" | "success"
}) {
  const variants = {
    default:     "bg-foreground/[0.07] text-foreground border border-foreground/15",
    destructive: "bg-destructive/[0.08] text-destructive border border-destructive/20",
    warning:     "bg-warning/[0.08] text-warning border border-warning/20",
    success:     "bg-success/[0.08] text-success border border-success/20",
  }
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold tracking-[0.08em] uppercase px-[10px] py-[3px] rounded-full ${variants[variant]}`}>
      {children}
    </span>
  )
}
