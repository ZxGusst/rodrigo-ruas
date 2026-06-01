import {
  NavBar, ScrollReveal, LineReveal,
  RevealImage, BtnPrimary, MagneticCursor, ImagePlaceholder,
  TransitionLink,
} from "@/components/gsap"
import { ImageOverlay } from "@/components/ImageOverlay"
import { Clock, Airplane, Users, MapPin, Star, Check, X } from "@phosphor-icons/react/dist/ssr"

const WA = "https://wa.me/5511966401489"

const ITINERARIO = [
  {
    dia: 1,
    titulo: "Chegada em Tóquio — Shinjuku e Harajuku",
    texto: "Após o voo, check-in no hotel em Shinjuku — um dos bairros mais vibrantes do Japão. À tarde, primeira imersão pela rua Takeshita e pelo Parque Yoyogi. Jantar em izakaya tradicional no bairro de Shibuya.",
    lado: "esq",
  },
  {
    dia: 2,
    titulo: "Tóquio profundo — Asakusa, Akihabara e Ueno",
    texto: "Manhã no templo Senso-ji, o mais antigo de Tóquio. Almoço em Ueno, visita ao parque e museus. À tarde, Akihabara para quem quiser mergulhar na cultura pop japonesa. Rodrigo conhece os lugares que os guias comuns não mostram.",
    lado: "dir",
  },
  {
    dia: 3,
    titulo: "Dia Livre em Tóquio — ou excursão ao Monte Fuji",
    texto: "Dia à disposição para explorar no seu ritmo — compras no Ginza, uma visita ao TeamLab, ou o famoso mercado de peixe de Toyosu. Para quem preferir, excursão opcional ao Monte Fuji com parada no Lago Kawaguchi.",
    lado: "esq",
  },
  {
    dia: 4,
    titulo: "Trem-bala para Kyoto — primeira imersão",
    texto: "Shinkansen de Tóquio a Kyoto: a experiência do Japão moderno em alta velocidade. Chegada ao meio-dia, check-in e primeira caminhada pelo distrito de Gion — o bairro das gueixas. Jantar kaiseki com menu degustação.",
    lado: "dir",
  },
  {
    dia: 5,
    titulo: "Kyoto dos Templos — Fushimi Inari e Arashiyama",
    texto: "Manhã subindo os famosos mil torii do santuário Fushimi Inari — chegada cedo para evitar multidões. Almoço no caminho. Tarde no bambuzal de Arashiyama e visita ao templo Tenryu-ji, patrimônio da UNESCO.",
    lado: "esq",
  },
  {
    dia: 6,
    titulo: "Nara e Osaka — cervo sagrado e street food",
    texto: "Dia de passeio a Nara, onde os veados sagrados circulam livremente pelo parque. Visita ao grande Buda de Todai-ji. À tarde, chegada em Osaka e mergulho na Dotonbori para o melhor street food do Japão.",
    lado: "dir",
  },
]

const INCLUSO = [
  "Passagem aérea São Paulo → Tóquio → São Paulo (classe econômica)",
  "Hospedagem em hotéis 4★ selecionados por Rodrigo",
  "Café da manhã todos os dias",
  "3 jantares em grupo em restaurantes curados",
  "Passe JR Rail Pass para o shinkansen",
  "Guia brasileiro especializado durante todo o roteiro",
  "Transfer aeroporto + passeios em grupo",
  "Seguro viagem completo",
]

const NAO_INCLUSO = [
  "Almoços e jantares não especificados acima",
  "Gastos pessoais e compras",
  "Passeios opcionais extras",
  "Taxas de entrada individuais não listadas",
  "Upgrade de classe aérea",
]

export default function JapaoPacotePage() {
  return (
    <main data-page-content className="bg-background text-foreground overflow-x-clip">
      <MagneticCursor />
      <NavBar />

      {/* ══ HERO ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <ImagePlaceholder className="w-full h-full" iconSize={96} />
        </div>

        {/* Gradiente escuro — sem blur aqui para não capturar fundo branco */}
        <ImageOverlay darkFrom={0.88} darkMid={0.25} />

        <div className="relative z-10 wrap pb-16 w-full">
          <span className="inline-flex items-center gap-1.5 bg-warning/90 text-white
                           text-[13px] font-bold uppercase tracking-wide px-4 py-2 rounded-full mb-6">
            <Clock size={13} weight="bold" /> Últimas Vagas
          </span>
          <LineReveal as="h1" className="t-hero text-white leading-none mb-6">
            JAPÃO
          </LineReveal>
          <div className="flex flex-wrap gap-6 text-white/80 text-[16px]">
            <span className="flex items-center gap-2"><Clock    size={16} /> Outubro 2026</span>
            <span className="flex items-center gap-2"><Airplane size={16} /> 12 dias</span>
            <span className="flex items-center gap-2"><MapPin   size={16} /> Partida: 04/10</span>
            <span className="flex items-center gap-2"><Users    size={16} /> 20 vagas</span>
          </div>
        </div>
      </section>

      {/* ══ BARRA INFO ═════════════════════════════════════ */}
      <div className="border-y border-border bg-background-elevated">
        <div className="wrap py-6">
          <div className="flex flex-wrap gap-8 items-center justify-between">
            <div className="flex flex-wrap gap-10">
              {[
                { label: "Duração",  value: "12 dias"        },
                { label: "Partida",  value: "04/10/2026"     },
                { label: "Período",  value: "Outubro 2026"   },
                { label: "Vagas",    value: "20 por grupo"   },
                { label: "Grupo",    value: "Exclusivo BR"   },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="t-label mb-1">{label}</p>
                  <p className="text-[18px] font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>
            <BtnPrimary href={WA} target="_blank" rel="noreferrer">
              Quero este pacote
            </BtnPrimary>
          </div>
        </div>
      </div>

      {/* ══ INTRO EDITORIAL ════════════════════════════════ */}
      <section className="py-20">
        <div className="wrap" style={{ maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
          <ScrollReveal>
            <p className="t-label mb-8 flex items-center gap-2">
              <Star size={14} weight="fill" /> Curadoria de Rodrigo Ruas
            </p>
            <p className="t-body-lg mb-5">
              O Japão é o destino que mais transforma quem vai. Não é só uma viagem — é um choque cultural
              suave, uma lição de respeito, silêncio e beleza. Eu já fui oito vezes. Cada vez que volto,
              descubro algo novo.
            </p>
            <p className="t-body-lg mb-5">
              Este roteiro de 12 dias foi construído para quem quer ir além das fotos no Senso-ji.
              Vamos ao Japão que eu conheço: os restaurantes onde os chefs me reconhecem, os templos
              às 6h da manhã sem turista, os trens noturnos, os onsen escondidos.
            </p>
            <p className="t-body-lg">
              Grupo máximo de 20 pessoas. Guia brasileiro o tempo todo. Você só precisa aparecer no
              aeroporto — o resto é comigo.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ IMAGEM FULL WIDTH ══════════════════════════════ */}
      <RevealImage direction="up" className="overflow-hidden" data-cursor="expand">
        <div className="aspect-[21/9] group">
          <div className="w-full h-full transition-transform duration-700 group-hover:scale-[1.03]">
            <ImagePlaceholder className="w-full h-full" iconSize={72} />
          </div>
        </div>
      </RevealImage>

      {/* ══ PULL QUOTE ═════════════════════════════════════ */}
      <section className="border-t border-b border-border py-20 bg-background-section">
        <div className="wrap max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <p className="font-light italic text-foreground leading-relaxed"
               style={{ fontSize: "clamp(22px,3vw,38px)" }}>
              "Já fui ao Japão oito vezes. Cada vez que volto, o país me surpreende com algo que eu ainda
              não tinha visto."
            </p>
            <p className="t-label text-foreground-subtle mt-6">— Rodrigo Ruas</p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ ITINERÁRIO ═════════════════════════════════════ */}
      <section className="py-20 border-t border-border">
        <div className="wrap">
          <ScrollReveal><p className="t-label mb-2">O roteiro</p></ScrollReveal>
          <LineReveal as="h2" className="t-h2 text-foreground mb-16">Dia a dia</LineReveal>

          <div className="flex flex-col gap-20">
            {ITINERARIO.map((item, i) => (
              <div
                key={item.dia}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start`}
              >
                {/* Texto */}
                <ScrollReveal className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <p className="t-label mb-3">Dia {item.dia}</p>
                  <h3 className="t-h3 text-foreground mb-5">{item.titulo}</h3>
                  <p className="t-body-lg">{item.texto}</p>
                </ScrollReveal>

                {/* Imagem */}
                <RevealImage
                  direction={i % 2 === 0 ? "right" : "left"}
                  className={`overflow-hidden group ${i % 2 === 1 ? "lg:order-1" : ""}`}
                  data-cursor="expand"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <div className="w-full h-full transition-transform duration-700 group-hover:scale-[1.04]">
                      <ImagePlaceholder className="w-full h-full" iconSize={40} />
                    </div>
                  </div>
                </RevealImage>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GALERIA ════════════════════════════════════════ */}
      <section className="py-20 border-t border-border bg-background-section">
        <div className="wrap">
          <ScrollReveal>
            <p className="t-label mb-2">Galeria</p>
            <h2 className="t-h2 text-foreground mb-12">Imagens do destino</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <RevealImage key={i} direction="up" delay={i * 0.06}
                           className="overflow-hidden group" data-cursor="expand">
                <div className={`${i === 0 ? "aspect-[4/3] md:col-span-2" : "aspect-square"}
                                transition-transform duration-700 group-hover:scale-[1.05]`}>
                  <ImagePlaceholder className="w-full h-full" iconSize={32} />
                </div>
              </RevealImage>
            ))}
          </div>
        </div>
      </section>

      {/* ══ INCLUSO / NÃO INCLUSO ══════════════════════════ */}
      <section className="border-t-2 border-foreground">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* ── INCLUSO — navy ─────────────────────────────── */}
          <div className="bg-foreground text-primary-foreground p-[clamp(32px,6vw,72px)]">
            <ScrollReveal>
              <p className="t-label text-primary-foreground/40 mb-3">O que está incluso</p>
              <h3 className="font-bold text-primary-foreground mb-10"
                  style={{ fontSize: "clamp(32px,4vw,56px)", letterSpacing: "-0.02em" }}>
                Incluso no pacote
              </h3>
            </ScrollReveal>

            <div className="flex flex-col divide-y divide-primary-foreground/10">
              {INCLUSO.map((item, i) => (
                <ScrollReveal
                  key={i}
                  delay={i * 0.04}
                  className="flex items-center gap-5 py-5"
                >
                  {/* ✓ bem visível */}
                  <span className="shrink-0 w-8 h-8 rounded-full bg-primary-foreground/15
                                   flex items-center justify-center">
                    <Check size={18} weight="bold" className="text-primary-foreground" />
                  </span>
                  <p className="text-[17px] font-medium text-primary-foreground leading-snug">
                    {item}
                  </p>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* ── NÃO INCLUSO — claro ────────────────────────── */}
          <div className="bg-background-section p-[clamp(32px,6vw,72px)]
                          border-t-2 lg:border-t-0 lg:border-l-2 border-foreground">
            <ScrollReveal>
              <p className="t-label text-foreground-subtle mb-3">O que não está incluso</p>
              <h3 className="font-bold text-foreground mb-10"
                  style={{ fontSize: "clamp(32px,4vw,56px)", letterSpacing: "-0.02em" }}>
                Não incluso
              </h3>
            </ScrollReveal>

            <div className="flex flex-col divide-y divide-border">
              {NAO_INCLUSO.map((item, i) => (
                <ScrollReveal
                  key={i}
                  delay={i * 0.04}
                  className="flex items-center gap-5 py-5"
                >
                  {/* ✗ claro mas legível */}
                  <span className="shrink-0 w-8 h-8 rounded-full bg-foreground/8
                                   flex items-center justify-center border border-border">
                    <X size={16} weight="bold" className="text-foreground-muted" />
                  </span>
                  <p className="text-[17px] text-foreground-muted leading-snug">
                    {item}
                  </p>
                </ScrollReveal>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ══ CTA FINAL ══════════════════════════════════════ */}
      <section className="bg-foreground text-primary-foreground py-24">
        <div className="wrap text-center">
          <ScrollReveal><p className="t-label text-primary-foreground/50 mb-4">Pronto para ir?</p></ScrollReveal>
          <LineReveal as="h2" className="t-h1 text-primary-foreground mb-6 max-w-2xl mx-auto">
            Garanta sua vaga no Japão 2026.
          </LineReveal>
          <ScrollReveal delay={0.15}>
            <p className="t-body-lg text-primary-foreground/60 mb-10 max-w-md mx-auto">
              Grupo de 20 pessoas. Atendimento direto com Rodrigo. Vagas limitadas.
            </p>
            <BtnPrimary href={WA} target="_blank" rel="noreferrer"
                        className="!bg-primary-foreground !text-primary">
              Falar no WhatsApp agora
            </BtnPrimary>
            <p className="t-small mt-4 flex items-center justify-center gap-2 text-primary-foreground/40">
              <Clock size={14} /> Resposta em até 1 hora
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ FOOTER SIMPLES ═════════════════════════════════ */}
      <footer className="py-8 border-t border-border">
        <div className="wrap flex justify-between items-center">
          <p className="font-bold tracking-tight text-foreground">RR VIAGENS</p>
          <TransitionLink href="/" className="t-small text-foreground-subtle hover:text-foreground transition-colors">
            ← Voltar para a home
          </TransitionLink>
        </div>
      </footer>
    </main>
  )
}
