import { client } from "@/sanity/lib/client"
import { groq } from "next-sanity"
import { NavBar, MagneticCursor, TransitionLink, LineReveal, ScrollReveal } from "@/components/gsap"
import { PackagesList } from "./PackagesList"

export const revalidate = 60

const QUERY = groq`
  *[_type == "pacote" && prioridade != "oculto"] | order(ordem asc) {
    _id,
    titulo,
    "slug": slug.current,
    badge,
    heroImage,
    periodo,
    dias,
    partida,
    descricaoCurta,
  }
`

export default async function PacotesSelecionPage() {
  let pacotes: any[] = []
  try { pacotes = await client.fetch(QUERY) } catch {}

  return (
    <main data-page-content className="bg-[#060F18] text-white overflow-x-clip">
      <MagneticCursor />

      {/* Nav adaptada para tema dark */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between
                      px-[clamp(20px,5vw,64px)] h-20">
        <a href="/" className="flex flex-col leading-tight">
          <span className="text-xl font-bold tracking-tight text-white">RR VIAGENS</span>
          <span className="text-[12px] tracking-[0.1em] text-white/40 uppercase">Pacotes pelo Mundo</span>
        </a>
        <a href="https://wa.me/5511966401489" target="_blank" rel="noreferrer"
           className="hidden md:inline-flex items-center gap-3 bg-white text-[#060F18]
                      text-[16px] font-semibold px-7 py-3.5 rounded-full
                      hover:opacity-90 transition-opacity">
          Falar no WhatsApp
          <span className="w-[7px] h-[7px] rounded-full bg-[#060F18] shrink-0" />
        </a>
      </div>

      {/* Lista full-screen */}
      <PackagesList pacotes={pacotes} />

      {/* Footer */}
      <footer className="bg-[#030A12] py-8 px-[clamp(20px,5vw,64px)]
                         flex justify-between items-center border-t border-white/10">
        <p className="font-bold tracking-tight text-white">RR VIAGENS</p>
        <TransitionLink href="/" className="text-[15px] text-white/40 hover:text-white transition-colors">
          ← Voltar para a home
        </TransitionLink>
      </footer>
    </main>
  )
}
