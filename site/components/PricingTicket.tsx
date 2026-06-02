"use client"

import { BtnForm } from "@/components/BtnForm"
import { Airplane, Bag, Info, ShieldCheck } from "@phosphor-icons/react"

interface PricingTicketProps {
  titulo:                 string
  tipo?:                  string
  cidadePartida?:         string
  cidadePartidaNome?:     string
  destino:                string
  destinoNome?:           string
  partida?:               string
  chegada?:               string
  periodo?:               string
  dias?:                  number
  vagas?:                 number
  preco?:                 number
  precoSemAero?:          number
  taxaServico?:           number
  politicaCancelamento?:  string
  politicaReagendamento?: string
  incluso?:               string[]
}

const CANCEL: Record<string, { label: string; cls: string }> = {
  "nao-reembolsavel": { label: "Não reembolsável", cls: "text-destructive"   },
  "50-reembolsavel":  { label: "50% de reembolso",  cls: "text-warning"      },
  "reembolsavel":     { label: "Reembolso total",   cls: "text-success"      },
}

function fmt(v: number) {
  return `US$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

/* ── Card individual ── */
function TicketCard({
  titulo, tipo, label, price, taxaServico, isMain,
  cidadePartida, cidadePartidaNome, destino, destinoNome,
  partida, chegada, dias, vagas,
  incluso, cancelInfo, politicaReagendamento,
}: {
  titulo: string; tipo?: string; label?: string; price?: number; taxaServico: number; isMain: boolean
  cidadePartida: string; cidadePartidaNome: string; destino: string; destinoNome: string
  partida?: string; chegada?: string; dias?: number; vagas?: number
  incluso: string[]
  cancelInfo: { label: string; cls: string }; politicaReagendamento: string
}) {
  const base    = price && taxaServico > 0 ? price - taxaServico : null
  const taxes   = taxaServico > 0 ? taxaServico : null
  const part3   = cidadePartida.substring(0, 3).toUpperCase()
  const dest3   = destino.substring(0, 3).toUpperCase()

  return (
    <div className="rounded-[28px] overflow-hidden shadow-2xl flex-1 min-w-0"
         style={{ background: "linear-gradient(160deg, #EBF4FF 0%, #F5F9FF 40%, #FFFFFF 100%)" }}>

      {/* preço no topo quando existe */}
      {price && (
        <div className="px-8 pt-8 pb-0 flex items-baseline justify-between">
          <p className="text-[20px] font-semibold" style={{ color: "#7090A0" }}>{label ?? "Com aéreo"}</p>
          <div className="text-right">
            <p className="text-[40px] font-black leading-none" style={{ color: "#0D1F30" }}>{fmt(price)}</p>
            <p className="text-[20px]" style={{ color: "#7090A0" }}>Por pessoa</p>
          </div>
        </div>
      )}

      {/* ── ROTA ─────────────────────────────────────────── */}
      <div className="px-8 pt-8 pb-6">
        {/* Cidade longa */}
        <div className="flex justify-between mb-1">
          <p className="text-[20px]" style={{ color: "#7090A0" }}>{cidadePartidaNome}</p>
          <p className="text-[20px] text-right" style={{ color: "#7090A0" }}>{destinoNome}</p>
        </div>
        {/* Sigla + linha + sigla */}
        <div className="flex items-center gap-2">
          <div>
            <p className="text-[36px] font-black leading-none" style={{ color: "#0D1F30" }}>{part3}</p>
            {partida && <p className="text-[20px] font-semibold mt-1" style={{ color: "#0D1F30" }}>{partida}</p>}
          </div>
          <div className="flex-1 flex flex-col items-center gap-1.5 px-1">
            <div className="flex items-center w-full">
              {/* dot esquerdo */}
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: "#F59E0B" }} />
              <div className="flex-1 border-t-2 border-dashed mx-1" style={{ borderColor: "#CBD5E1" }} />
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                   style={{ background: "#0D1F30" }}>
                <Airplane size={14} weight="fill" className="text-white" />
              </div>
              <div className="flex-1 border-t-2 border-dashed mx-1" style={{ borderColor: "#CBD5E1" }} />
              {/* dot direito */}
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: "#F59E0B" }} />
            </div>
            {dias && (
              <p className="text-[20px]" style={{ color: "#7090A0" }}>⏱ {dias} dias</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-[36px] font-black leading-none" style={{ color: "#0D1F30" }}>{dest3}</p>
            {vagas && (
              <p className="text-[20px] font-semibold mt-1" style={{ color: "#0D1F30" }}>{vagas} vagas</p>
            )}
          </div>
        </div>
      </div>

      {/* ── INCLUSO ──────────────────────────────────────── */}
      {incluso.length > 0 && (
        <div className="mx-6 mb-4 rounded-2xl overflow-hidden" style={{ background: "white" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "#F1F5F9", borderStyle: "dashed" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bag size={18} weight="bold" style={{ color: "#0D1F30" }} />
                <p className="text-[20px] font-bold" style={{ color: "#0D1F30" }}>O que está incluso</p>
              </div>
              <span className="text-[20px] font-bold px-2.5 py-0.5 rounded-full"
                    style={{ background: "#EBF4FF", color: "#0D1F30" }}>
                {incluso.length}
              </span>
            </div>
          </div>
          <div className="px-5 py-3 flex flex-col gap-2.5">
            {incluso.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <p className="text-[18px]" style={{ color: "#3D5A6E" }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TERMOS ───────────────────────────────────────── */}
      <div className="mx-6 mb-4 rounded-2xl overflow-hidden" style={{ background: "white" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "#F1F5F9", borderStyle: "dashed" }}>
          <div className="flex items-center gap-2">
            <Info size={18} weight="bold" style={{ color: "#0D1F30" }} />
            <p className="text-[20px] font-bold" style={{ color: "#0D1F30" }}>Termos do pacote</p>
          </div>
        </div>
        <div className="px-5 py-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[18px]" style={{ color: "#3D5A6E" }}>Cancelamento</p>
            <p className={`text-[18px] font-semibold ${cancelInfo.cls}`}>{cancelInfo.label}</p>
          </div>
          <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: "#F1F5F9", borderStyle: "dashed" }}>
            <p className="text-[18px]" style={{ color: "#3D5A6E" }}>Reagendamento</p>
            <p className="text-[18px] font-semibold" style={{ color: "#3D5A6E" }}>{politicaReagendamento}</p>
          </div>
          <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: "#F1F5F9", borderStyle: "dashed" }}>
            <p className="text-[18px]" style={{ color: "#3D5A6E" }}>Seguro viagem</p>
            <p className="text-[18px] font-semibold" style={{ color: "#16A34A" }}>Incluso</p>
          </div>
        </div>
      </div>

      {/* ── BREAKDOWN ────────────────────────────────────── */}
      {price && (
        <div className="mx-4 mb-3 rounded-2xl px-5 py-3 flex flex-col gap-2" style={{ background: "white" }}>
          {base && (
            <div className="flex items-center justify-between">
              <p className="text-[20px]" style={{ color: "#3D5A6E" }}>Preço base (1 pessoa)</p>
              <p className="text-[20px]" style={{ color: "#0D1F30" }}>{fmt(base)}</p>
            </div>
          )}
          {taxes && (
            <div className="flex items-center justify-between">
              <p className="text-[20px]" style={{ color: "#3D5A6E" }}>Taxas e encargos</p>
              <p className="text-[20px]" style={{ color: "#0D1F30" }}>{fmt(taxes)}</p>
            </div>
          )}
          <div className="flex items-center justify-between pt-3 mt-1 border-t" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-[20px] font-bold" style={{ color: "#0D1F30" }}>Total</p>
            <p className="text-[28px] font-black" style={{ color: "#0D1F30" }}>{fmt(price)}</p>
          </div>
        </div>
      )}

      {/* ── CTA ──────────────────────────────────────────── */}
      <div className="px-4 pb-6 pt-3">
        <BtnForm pacote={titulo} tipo={tipo} className="w-full justify-center">
          {price ? "Garantir minha vaga" : "Solicitar orçamento"}
        </BtnForm>
        <p className="text-[20px] text-center mt-3" style={{ color: "#7090A0" }}>
          Atendimento direto — sem robô, sem fila
        </p>
      </div>

    </div>
  )
}

/* ── Componente principal ── */
export function PricingTicket({
  titulo, tipo, cidadePartida = "São Paulo", cidadePartidaNome,
  destino, destinoNome, partida, chegada, periodo,
  dias, vagas, preco, precoSemAero, taxaServico = 0,
  politicaCancelamento = "nao-reembolsavel",
  politicaReagendamento = "R$ 500,00",
  incluso = [],
}: PricingTicketProps) {
  const cancelInfo     = CANCEL[politicaCancelamento] ?? CANCEL["nao-reembolsavel"]
  const hasBoth        = !!(preco && precoSemAero)
  const cidPartidaNome = cidadePartidaNome ?? cidadePartida
  const destNome       = destinoNome ?? destino

  const commonProps = {
    titulo, tipo, cidadePartida, cidadePartidaNome: cidPartidaNome,
    destino, destinoNome: destNome, partida, chegada,
    dias, vagas, cancelInfo, politicaReagendamento, taxaServico,
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      {preco && (
        <TicketCard
          {...commonProps} price={preco} isMain label="Grupo exclusivo · Com aéreo"
          incluso={incluso}
        />
      )}
      {precoSemAero && (
        <TicketCard
          {...commonProps} price={precoSemAero} isMain={false} label="Grupo exclusivo · Sem aéreo"
          incluso={incluso.filter(i =>
            !i.toLowerCase().includes("passagem") && !i.toLowerCase().includes("aéreo")
          )}
        />
      )}
      {!preco && !precoSemAero && (
        <TicketCard
          {...commonProps} price={undefined} isMain label="Grupo exclusivo"
          incluso={incluso}
        />
      )}
    </div>
  )
}
