import { NavBar, ScrollReveal, LineReveal } from "@/components/gsap"
import { BtnPrimary } from "@/components/gsap/BtnPrimary"
import { WhatsappLogo, Envelope, MapPin, Phone } from "@phosphor-icons/react/dist/ssr"

const WA    = "https://wa.me/5511966401489"
const EMAIL = "contato@pacotespelomundo.com.br"
const CNPJ  = "52.437.341/0001-22"

export default function ContatoPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <NavBar />

      <section className="wrap pt-40 pb-24">
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

            <ScrollReveal delay={0.2} className="flex flex-col gap-5 mb-10">
              <a href={WA} target="_blank" rel="noreferrer"
                 className="flex items-center gap-3 text-[20px] font-medium
                            text-foreground hover:text-primary transition-colors group">
                <span className="w-10 h-10 rounded-full bg-background-section border border-border
                                 flex items-center justify-center group-hover:border-primary transition-colors">
                  <WhatsappLogo weight="fill" className="w-5 h-5 text-success" />
                </span>
                (11) 96640-1489
              </a>
              <a href={`mailto:${EMAIL}`}
                 className="flex items-center gap-3 text-[20px] font-medium
                            text-foreground hover:text-primary transition-colors group">
                <span className="w-10 h-10 rounded-full bg-background-section border border-border
                                 flex items-center justify-center group-hover:border-primary transition-colors">
                  <Envelope weight="fill" className="w-5 h-5 text-primary" />
                </span>
                {EMAIL}
              </a>
              <div className="flex items-center gap-3 text-[20px] text-foreground-muted">
                <span className="w-10 h-10 rounded-full bg-background-section border border-border
                                 flex items-center justify-center">
                  <MapPin weight="fill" className="w-5 h-5 text-foreground-subtle" />
                </span>
                São Paulo, Brasil
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <BtnPrimary href={WA} target="_blank" rel="noreferrer">
                Falar no WhatsApp agora
              </BtnPrimary>
              <p className="t-small mt-3 flex items-center gap-2 text-foreground-subtle">
                <Phone weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" />
                Resposta em até 1 hora
              </p>
            </ScrollReveal>
          </div>

          {/* Direita — card de contexto */}
          <ScrollReveal delay={0.15}
            className="bg-background-section rounded-2xl p-8 border border-border">
            <p className="t-label mb-6">Por que falar com a gente?</p>
            <div className="flex flex-col gap-6">
              {[
                { titulo: "Atendimento personalizado",  desc: "Você fala diretamente com alguém da equipe — sem robô, sem template." },
                { titulo: "Especialistas em cada rota", desc: "Rodrigo já visitou pessoalmente todos os destinos que oferecemos." },
                { titulo: "Sem compromisso inicial",    desc: "Pode perguntar tudo. Orçamento sem pressão, na hora que quiser." },
              ].map(({ titulo, desc }) => (
                <div key={titulo} className="border-t border-border pt-6 first:border-t-0 first:pt-0">
                  <p className="text-[20px] font-semibold text-foreground mb-2">{titulo}</p>
                  <p className="t-body text-foreground-muted">{desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

        </div>
      </section>
    </main>
  )
}

