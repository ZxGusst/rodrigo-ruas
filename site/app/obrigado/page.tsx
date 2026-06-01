import { NavBar, MagneticCursor, LineReveal, ScrollReveal, TransitionLink } from "@/components/gsap"
import { BtnForm } from "@/components/BtnForm"
import { CheckCircle, ArrowLeft, WhatsappLogo } from "@phosphor-icons/react/dist/ssr"

export const metadata = {
  title: "Obrigado — RR Viagens",
  description: "Recebemos seu contato. Nossa equipe entrará em contato em breve.",
}

export default function ObrigadoPage() {
  return (
    <main data-page-content className="bg-background text-foreground overflow-x-clip min-h-screen flex flex-col">
      <MagneticCursor />
      <NavBar />

      {/* ── Conteúdo central ───────────────────────────── */}
      <section className="flex-1 flex items-center justify-center py-32">
        <div className="wrap max-w-2xl text-center">

          {/* Ícone animado */}
          <ScrollReveal>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center">
                <CheckCircle size={40} weight="fill" className="text-background" />
              </div>
            </div>
          </ScrollReveal>

          {/* Label */}
          <ScrollReveal delay={0.1}>
            <p className="t-label mb-4">Mensagem recebida</p>
          </ScrollReveal>

          {/* Título */}
          <LineReveal as="h1" className="t-h1 text-foreground mb-6 leading-tight">
            Obrigado pelo seu interesse!
          </LineReveal>

          {/* Subtítulo */}
          <ScrollReveal delay={0.2}>
            <p className="t-body-lg text-foreground-muted mb-12 max-w-lg mx-auto">
              Recebemos seus dados e nossa equipe entrará em contato em até{" "}
              <strong className="text-foreground">1 hora</strong> pelo WhatsApp.
              Fique de olho no celular!
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <ScrollReveal delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <TransitionLink href="/" className="inline-flex items-center gap-2 t-small text-foreground-subtle hover:text-foreground transition-colors">
              <ArrowLeft size={16} weight="bold" />
              Voltar para a home
            </TransitionLink>

            <a
              href="https://wa.me/5511966401489"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground
                         text-[16px] font-semibold px-7 py-3.5 rounded-full
                         hover:opacity-90 transition-opacity"
            >
              <WhatsappLogo size={18} weight="fill" />
              Falar agora no WhatsApp
              <span className="w-[7px] h-[7px] rounded-full bg-primary-foreground shrink-0" />
            </a>
          </ScrollReveal>

        </div>
      </section>

      {/* ── Divisor + seção de destinos ────────────────── */}
      <section className="border-t border-border py-16">
        <div className="wrap text-center">
          <ScrollReveal>
            <p className="t-label mb-3">Enquanto isso...</p>
            <p className="t-h3 text-foreground mb-8">Explore nossos destinos</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <TransitionLink href="/pacotes/selecao">
              <span className="inline-flex items-center gap-3 border border-border text-foreground
                               text-[16px] font-semibold px-7 py-3.5 rounded-full
                               hover:border-foreground/40 transition-colors">
                Ver todos os pacotes
                <span className="w-[7px] h-[7px] rounded-full bg-foreground shrink-0" />
              </span>
            </TransitionLink>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Footer mínimo ──────────────────────────────── */}
      <footer className="py-6 border-t border-border">
        <div className="wrap flex justify-between items-center">
          <p className="font-bold tracking-tight text-foreground text-[15px]">RR VIAGENS</p>
          <p className="t-small text-foreground-subtle">© 2026 — Pacotes pelo Mundo</p>
        </div>
      </footer>
    </main>
  )
}
