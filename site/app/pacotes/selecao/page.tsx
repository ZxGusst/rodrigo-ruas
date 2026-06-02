import { client } from "@/sanity/lib/client"
import { groq } from "next-sanity"
import { NavBar, MagneticCursor, TransitionLink } from "@/components/gsap"
import { BtnForm } from "@/components/BtnForm"
import { PackagesList } from "./PackagesList"
import { FilterPanel } from "./FilterPanel"
import { Suspense } from "react"

export const revalidate = 60

const QUERY = groq`
  *[_type == "pacote" && prioridade != "oculto"] | order(ordem asc) {
    _id,
    titulo,
    tipo,
    "slug": slug.current,
    badge,
    heroImage,
    periodo,
    dias,
    partida,
    descricaoCurta,
    continentes,
    preco,
  }
`

export default async function PacotesSelecionPage({
  searchParams,
}: {
  searchParams: Promise<{ continente?: string; precoMax?: string }>
}) {
  let pacotes: any[] = []
  try { pacotes = await client.fetch(QUERY) } catch {}

  const { continente, precoMax } = await searchParams
  const maxPreco = Number(precoMax ?? 0)

  const filtrados = pacotes
    .filter(p => !continente || p.continentes?.includes(continente))
    .filter(p => !maxPreco || !p.preco || p.preco <= maxPreco)

  return (
    <main data-page-content className="bg-[#060F18] text-white overflow-x-clip">
      <MagneticCursor />

      {/* Nav topo — relative z-50 para ficar acima do fixed blur do PackagesList */}
      <div className="relative z-50 flex items-center justify-between
                      px-[clamp(20px,5vw,64px)] h-20">
        <a href="/" className="text-[18px] font-medium text-white/60 hover:text-white transition-colors flex items-center gap-2">
          ← Voltar para a home
        </a>
        <BtnForm variant="inverted">Falar no WhatsApp</BtnForm>
      </div>

      {/* Filtros — painel expansível */}
      <FilterPanel />

      {/* Lista full-screen */}
      <PackagesList pacotes={filtrados} />

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
