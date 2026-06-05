"use client"

import { useState, useEffect, useRef } from "react"
import gsap from "gsap"
import { X, CheckCircle, WarningCircle } from "@phosphor-icons/react"
import { urlFor } from "@/sanity/lib/image"

/* ─── Seletor dinâmico Programa + Destino ────────────────── */
interface Programa { valor: string; titulo: string; descricao?: string }
interface Destino  { titulo: string; slug: string; badge?: string; periodo?: string }

function ProgramaDestinoField({
  campo,
  values,
  onChange,
  error,
}: {
  campo: Campo & { programas?: Programa[] }
  values: Record<string, string>
  onChange: (key: string, val: string) => void
  error?: string
}) {
  const programaKey = `${campo.nome}_programa`
  const programaSelecionado = values[programaKey] ?? ""
  const destinoSelecionado  = values[campo.nome]  ?? ""

  const [destinos,        setDestinos]        = useState<Destino[]>([])
  const [loadingDestinos, setLoadingDestinos] = useState(false)

  /* Carrega destinos quando programa muda */
  useEffect(() => {
    if (!programaSelecionado) { setDestinos([]); return }
    setLoadingDestinos(true)
    onChange(campo.nome, "") // reseta destino ao trocar programa
    fetch(`/api/destinos?tipo=${programaSelecionado}`)
      .then(r => r.json())
      .then(setDestinos)
      .catch(() => setDestinos([]))
      .finally(() => setLoadingDestinos(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programaSelecionado])

  const programas: Programa[] = campo.programas ?? [
    { valor: "gruposDoRuas",      titulo: "Grupos do Ruas",      descricao: "Viaje comigo para os melhores destinos" },
    { valor: "assinadoByRuas",    titulo: "Pacotes Assinados",   descricao: "Curadoria validada por Rodrigo" },
    { valor: "gruposBrasileiros", titulo: "Grupos Brasileiros",  descricao: "Grupos para brasileiros pelo mundo" },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Etapa 1 — Programa */}
      <div>
        <p className="text-[13px] font-semibold text-white/60 tracking-wide mb-2">
          {campo.label ?? "Programa de interesse"}
          {campo.obrigatorio && <span className="text-warning/80 ml-1">*</span>}
        </p>
        <div className="flex flex-col gap-2">
          {programas.map(p => (
            <button
              key={p.valor}
              type="button"
              onClick={() => onChange(programaKey, p.valor)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200
                ${programaSelecionado === p.valor
                  ? "border-white/50 bg-white/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                }`}
            >
              <p className="text-[15px] font-semibold text-white">{p.titulo}</p>
              {p.descricao && <p className="text-[12px] text-white/40 mt-0.5">{p.descricao}</p>}
            </button>
          ))}
        </div>
      </div>

      {/* Etapa 2 — Destino (aparece só após escolher programa) */}
      {programaSelecionado && (
        <div>
          <p className="text-[13px] font-semibold text-white/60 tracking-wide mb-2">
            Destino de interesse
          </p>
          {loadingDestinos ? (
            <div className="flex items-center gap-2 text-white/40 text-[14px] py-3">
              <span className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              Carregando destinos...
            </div>
          ) : (
            <select
              value={destinoSelecionado}
              onChange={e => onChange(campo.nome, e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg
                         px-4 py-3.5 text-[16px] text-white placeholder-white/25
                         focus:outline-none focus:border-white/30 transition-colors"
              style={{ appearance: "none" }}
            >
              <option value="" style={{ color: "#0D1F30", background: "#fff" }}>
                {destinos.length ? "Selecione o destino..." : "Nenhum destino cadastrado"}
              </option>
              {destinos.map(d => (
                <option
                  key={d.slug}
                  value={d.titulo}
                  style={{ color: "#0D1F30", background: "#fff" }}
                >
                  {d.titulo}{d.badge === "esgotado" ? " — Esgotado" : d.badge === "vagas" ? " — Últimas vagas" : ""}{d.periodo ? ` · ${d.periodo}` : ""}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {error && (
        <p className="text-[12px] text-destructive flex items-center gap-1.5">
          <WarningCircle size={13} weight="fill" /> {error}
        </p>
      )}
    </div>
  )
}

/* Mapa: valor interno do tipo → label legível no select */
const TIPO_LABEL: Record<string, string> = {
  gruposDoRuas:      "Grupo do Ruas",
  assinadoByRuas:    "Pacotes Assinados",
  gruposBrasileiros: "Grupos Brasileiros",
}

interface Campo {
  tipo: "input" | "email" | "phone" | "textarea" | "select" | "programa-destino"
  label: string
  nome: string
  placeholder?: string
  obrigatorio?: boolean
  opcoes?: string[]
  programas?: Programa[]
}

interface FormConfig {
  titulo:            string
  descricao?:        string
  webhookUrl:        string
  redirectAoEnviar?: string
  mensagemSucesso:   string
  textoBotao:        string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imagemDestaque?:   any
  campos:            Campo[]
}

interface FormModalProps {
  config:  FormConfig
  isOpen:  boolean
  onClose: () => void
  pacote?: string
  tipo?:   string   /* gruposDoRuas | assinadoByRuas | gruposBrasileiros */
}

export function FormModal({ config, isOpen, onClose, pacote, tipo }: FormModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const drawerRef  = useRef<HTMLDivElement>(null)

  const [values, setValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errMsg, setErrMsg] = useState("")

  /* Pré-preenche produto/programa/destino quando vem de uma página de pacote */
  useEffect(() => {
    if (pacote || tipo) {
      setValues(v => ({
        ...v,
        ...(pacote ? { destino: pacote } : {}),
        ...(tipo   ? {
          destino_programa: tipo,
          tipo_produto: TIPO_LABEL[tipo] ?? "",
        } : {}),
      }))
    }
  }, [pacote, tipo])

  /* Auto-fill por URL: lê ?tipo= da URL quando o form abre sem prop explícita */
  useEffect(() => {
    if (!isOpen || tipo) return
    const urlTipo = new URLSearchParams(window.location.search).get("tipo") ?? ""
    if (urlTipo && TIPO_LABEL[urlTipo]) {
      setValues(v => ({
        ...v,
        destino_programa: urlTipo,
        tipo_produto:     TIPO_LABEL[urlTipo],
      }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  /* Animação de entrada/saída do drawer */
  useEffect(() => {
    const overlay = overlayRef.current
    const drawer  = drawerRef.current
    if (!overlay || !drawer) return

    if (isOpen) {
      /* Preserva a scrollbar sem "pular" o layout */
      const scrollW = window.innerWidth - document.documentElement.clientWidth
      document.body.style.paddingRight = `${scrollW}px`
      document.body.style.overflow = "hidden"
      gsap.set(overlay, { display: "block" })
      gsap.set(drawer,  { x: "100%" })
      gsap.to(overlay, { opacity: 1, duration: 0.5,  ease: "power2.inOut" })
      gsap.to(drawer,  { x: "0%", duration: 0.8,  ease: "power3.inOut" })
    } else {
      gsap.to(drawer,  { x: "100%", duration: 0.6, ease: "power3.inOut" })
      gsap.to(overlay, {
        opacity: 0, duration: 0.6, ease: "power2.inOut",
        onComplete: () => {
          gsap.set(overlay, { display: "none" })
          document.body.style.overflow     = ""
          document.body.style.paddingRight = ""
          setStatus("idle")
          setValues({})
          setErrors({})
        },
      })
    }
  }, [isOpen])

  function validate() {
    const newErrors: Record<string, string> = {}
    for (const campo of config.campos) {
      if (campo.tipo === "programa-destino") {
        /* Para programa-destino, valida que selecionou pelo menos o programa */
        if (campo.obrigatorio && !values[`${campo.nome}_programa`]?.trim())
          newErrors[campo.nome] = "Selecione um programa de interesse"
      } else {
        if (campo.obrigatorio && !values[campo.nome]?.trim())
          newErrors[campo.nome] = `${campo.label} é obrigatório`
        if (campo.tipo === "email" && values[campo.nome] && !/\S+@\S+\.\S+/.test(values[campo.nome]))
          newErrors[campo.nome] = "E-mail inválido"
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setStatus("loading")
    try {
      /* Chama a API route interna — sem CORS, URL do webhook fica no servidor */
      /* Monta payload limpando chaves internas (_programa) e renomeando para legibilidade */
      const cleanValues: Record<string, string> = {}
      for (const [k, v] of Object.entries(values)) {
        if (k.endsWith("_programa")) {
          /* converte nome_programa → nome_tipo_programa para o webhook */
          cleanValues[k] = v
        } else {
          cleanValues[k] = v
        }
      }

      const payload = {
        ...cleanValues,
        ...(config.webhookUrl ? { _webhookUrl: config.webhookUrl } : {}),
      }

      const res = await fetch("/api/submit-form", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        /* Webhook não configurado: avisa o admin, não o usuário */
        if (res.status === 422) {
          console.warn("Formulário: webhook não configurado no Sanity.")
        }
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }

      setStatus("success")
      if (config.redirectAoEnviar)
        setTimeout(() => { window.location.href = config.redirectAoEnviar! }, 1800)
    } catch (err) {
      console.error("Form submit error:", err)
      setStatus("error")
      setErrMsg("Ocorreu um erro ao enviar. Tente novamente ou fale pelo WhatsApp.")
    }
  }

  const inputBase = `
    w-full bg-white/[0.04] border border-white/10
    rounded-lg px-4 py-3.5 text-[16px] text-white
    placeholder-white/25 focus:outline-none
    focus:border-white/30 transition-colors duration-200
  `

  return (
    <>
      {/* Overlay escuro atrás do drawer */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 z-[9990]"
        style={{ display: "none", opacity: 0, background: "rgba(6,15,24,0.6)", backdropFilter: "blur(4px)" }}
      />

      {/* Drawer lateral direito */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 bottom-0 z-[9991]
                   w-full md:w-[45vw]
                   bg-[#080F16] overflow-y-auto flex flex-col"
        style={{ transform: "translateX(100%)", msOverflowStyle: "none", scrollbarWidth: "none" }}
      >

        {/* ── Topo: header fixo ──────────────────────────── */}
        <div className="flex items-center justify-between px-8 pt-8 pb-0 shrink-0">
          <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-white/40">
            (CONTATO)
          </span>
          <button
            onClick={onClose}
            className="text-[13px] font-semibold tracking-[0.1em] uppercase text-white/50
                       hover:text-white transition-colors flex items-center gap-2"
          >
            FECHAR <X size={14} weight="bold" />
          </button>
        </div>

        {/* ── Intro: texto + imagem lado a lado ──────────── */}
        <div className="px-8 pt-8 pb-6 grid grid-cols-[1fr_auto] gap-6 items-start shrink-0">
          <div>
            <h2 className="text-[22px] font-bold text-white leading-snug mb-3">
              {config.titulo}
            </h2>
            {config.descricao && (
              <p className="text-[14px] text-white/50 leading-relaxed">
                {config.descricao}
              </p>
            )}
          </div>
          {/* Imagem configurável no Sanity */}
          <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-white/5 border border-white/8">
            <img
              src={
                config.imagemDestaque
                  ? urlFor(config.imagemDestaque).width(200).height(200).fit("crop").url()
                  : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&q=80&fm=webp&fit=crop"
              }
              alt={config.titulo}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ── Divisor + label da seção ────────────────────── */}
        <div className="px-8 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-white/40">
              SEUS DADOS
            </span>
            <span className="text-[11px] font-bold tracking-[0.1em] text-white/25">
              {config.campos.length} CAMPOS
            </span>
          </div>
          <div className="border-t border-white/10 mb-6" />
        </div>

        {/* ── Formulário ─────────────────────────────────── */}
        <div className="flex-1 px-8 pb-8">

          {/* SUCCESS */}
          {status === "success" && (
            <div className="flex flex-col items-center gap-5 py-12 text-center">
              <CheckCircle size={56} weight="fill" className="text-success" />
              <p className="text-[20px] font-bold text-white leading-snug">
                {config.mensagemSucesso}
              </p>
              <p className="text-[14px] text-white/40">
                Entraremos em contato em breve.
              </p>
            </div>
          )}

          {/* FORM */}
          {status !== "success" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

              {config.campos.map(campo => (
                <div key={campo.nome} className="flex flex-col gap-2">

                  {/* Campo especial: Programa + Destino dinâmico */}
                  {campo.tipo === "programa-destino" && (
                    <ProgramaDestinoField
                      campo={campo}
                      values={values}
                      onChange={(key, val) => setValues(v => ({ ...v, [key]: val }))}
                      error={errors[campo.nome]}
                    />
                  )}

                  {campo.tipo !== "programa-destino" && (
                  <label className="text-[13px] font-semibold text-white/60 tracking-wide">
                    {campo.label}
                    {campo.obrigatorio && <span className="text-warning/80 ml-1">*</span>}
                  </label>)}

                  {campo.tipo === "textarea" && (
                    <textarea
                      name={campo.nome}
                      placeholder={campo.placeholder}
                      rows={3}
                      value={values[campo.nome] ?? ""}
                      onChange={e => setValues(v => ({ ...v, [campo.nome]: e.target.value }))}
                      className={`${inputBase} resize-none`}
                    />
                  )}

                  {campo.tipo === "select" && (
                    <select
                      name={campo.nome}
                      value={values[campo.nome] ?? ""}
                      onChange={e => setValues(v => ({ ...v, [campo.nome]: e.target.value }))}
                      className={`${inputBase} cursor-pointer`}
                      style={{ appearance: "none" }}
                    >
                      <option value=""      style={{ color: "#0D1F30", background: "#fff" }}>Selecione...</option>
                      {campo.opcoes?.map(op => (
                        <option key={op} value={op} style={{ color: "#0D1F30", background: "#fff" }}>{op}</option>
                      ))}
                    </select>
                  )}

                  {!["textarea", "select", "programa-destino"].includes(campo.tipo) && (
                    <input
                      type={campo.tipo === "email" ? "email" : campo.tipo === "phone" ? "tel" : "text"}
                      name={campo.nome}
                      placeholder={campo.placeholder}
                      value={values[campo.nome] ?? ""}
                      onChange={e => setValues(v => ({ ...v, [campo.nome]: e.target.value }))}
                      className={inputBase}
                    />
                  )}

                  {campo.tipo !== "programa-destino" && errors[campo.nome] && (
                    <p className="text-[12px] text-destructive flex items-center gap-1.5">
                      <WarningCircle size={13} weight="fill" />
                      {errors[campo.nome]}
                    </p>
                  )}
                </div>
              ))}

              {status === "error" && (
                <p className="text-[13px] text-destructive bg-destructive/10 rounded-lg px-4 py-3 border border-destructive/20">
                  {errMsg}
                </p>
              )}

              {/* Rodapé do form */}
              <div className="flex items-center justify-between pt-4 border-t border-white/8 mt-2">
                <p className="text-[12px] text-white/25">
                  Seus dados não são compartilhados.
                </p>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center gap-3 bg-white text-[#080F16]
                             text-[15px] font-bold px-6 py-3 rounded-full
                             hover:bg-gray-300 active:bg-gray-400
                             transition-colors duration-200
                             disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {status === "loading"
                    ? <span className="w-4 h-4 border-2 border-[#080F16]/30 border-t-[#080F16] rounded-full animate-spin" />
                    : <>{config.textoBotao} →</>
                  }
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
