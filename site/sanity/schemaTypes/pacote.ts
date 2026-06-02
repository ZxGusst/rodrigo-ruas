import { defineField, defineType, defineArrayMember } from "sanity"

export const pacote = defineType({
  name:  "pacote",
  title: "Pacote",
  type:  "document",
  fields: [

    /* ── Identificação ────────────────────────────────── */
    defineField({
      name: "titulo", title: "Nome do destino",
      type: "string", validation: r => r.required(),
    }),
    defineField({
      name: "slug", title: "Slug (URL)",
      type: "slug",
      options: { source: "titulo" },
      validation: r => r.required(),
    }),
    defineField({
      name: "badge", title: "Badge",
      type: "string",
      options: { list: ["vagas", "esgotado"] },
    }),

    /* ── Tipo de produto ─────────────────────────────── */
    defineField({
      name: "tipo",
      title: "Tipo de produto",
      type: "string",
      options: {
        list: [
          { title: "🏆 Grupos do Ruas — Rodrigo guia pessoalmente",       value: "gruposDoRuas"      },
          { title: "✍️ Pacotes Assinados by Ruas — curadoria do Rodrigo",  value: "assinadoByRuas"    },
          { title: "🌎 Grupos de Brasileiros no Mundo — grupos organizados", value: "gruposBrasileiros" },
        ],
        layout: "radio",
      },
      initialValue: "gruposDoRuas",
      validation: r => r.required(),
    }),

    /* ── Homepage ─────────────────────────────────────── */
    defineField({
      name: "prioridade",
      title: "Posição na homepage (dentro do seu tipo)",
      type: "string",
      options: {
        list: [
          { title: "⭐ Destaque — card grande no topo",    value: "destaque"  },
          { title: "🎠 Carrossel — rolagem lateral",        value: "carrossel" },
          { title: "🙈 Não exibir na homepage",             value: "oculto"    },
        ],
        layout: "radio",
      },
      initialValue: "carrossel",
      validation: r => r.required(),
    }),
    defineField({
      name: "ordem",
      title: "Ordem no carrossel (1 aparece primeiro)",
      type: "number",
      initialValue: 99,
    }),
    defineField({
      name: "descricaoCurta",
      title: "Descrição curta (homepage)",
      type: "string",
      description: "Aparece nos cards da homepage. Máximo 120 caracteres.",
      validation: r => r.max(120).warning("Mantenha abaixo de 120 chars para não cortar no card"),
    }),

    /* ── Imagem hero ──────────────────────────────────── */
    defineField({
      name: "heroImage", title: "Imagem principal (hero)",
      type: "image",
      options: { hotspot: true },
      validation: r => r.required(),
    }),

    /* ── Info do pacote ───────────────────────────────── */
    defineField({ name: "periodo",  title: "Período (ex: Outubro 2026)", type: "string" }),
    defineField({ name: "dias",     title: "Duração (dias)",             type: "number" }),
    defineField({ name: "partida",  title: "Data de partida (ex: 04/10)",type: "string" }),
    defineField({ name: "vagas",    title: "Número de vagas",            type: "number" }),
    defineField({
      name: "preco",
      title: "Preço COM aéreo (R$/pessoa)",
      type: "number",
      description: "Pacote completo incluindo passagem aérea.",
    }),
    defineField({
      name: "precoSemAero",
      title: "Preço SEM aéreo (R$/pessoa)",
      type: "number",
      description: "Pacote terrestre sem passagem aérea.",
    }),
    defineField({
      name: "taxaServico",
      title: "Taxa de serviço (R$)",
      type: "number",
      description: "Taxas incluídas no preço. Aparece no breakdown.",
    }),
    defineField({
      name: "cidadePartida",
      title: "Cidade de partida",
      type: "string",
      initialValue: "São Paulo",
    }),
    defineField({
      name: "politicaCancelamento",
      title: "Política de cancelamento",
      type: "string",
      options: {
        list: [
          { title: "Não reembolsável",              value: "nao-reembolsavel"   },
          { title: "50% de reembolso",               value: "50-reembolsavel"    },
          { title: "Reembolso total (30+ dias antes)", value: "reembolsavel"     },
        ],
        layout: "radio",
      },
      initialValue: "nao-reembolsavel",
    }),
    defineField({
      name: "politicaReagendamento",
      title: "Taxa de reagendamento",
      type: "string",
      description: 'Ex: "R$ 500,00" ou "Gratuito até 60 dias antes"',
      initialValue: "R$ 500,00",
    }),
    defineField({
      name: "continentes", title: "Continentes / Regiões",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),

    /* ── Conteúdo editorial ───────────────────────────── */
    defineField({
      name: "intro", title: "Introdução (texto longo)",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      description: "Parágrafo editorial de abertura — aparece logo abaixo do hero.",
    }),
    defineField({
      name: "pullQuote", title: "Pull quote",
      type: "text", rows: 3,
      description: "Frase de destaque exibida em tamanho grande no meio da página.",
    }),

    /* ── Itinerário dia a dia ─────────────────────────── */
    defineField({
      name: "itinerario", title: "Itinerário",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "dia",
          title: "Dia",
          fields: [
            defineField({ name: "numero", title: "Dia nº", type: "number" }),
            defineField({ name: "titulo", title: "Título do dia", type: "string" }),
            defineField({
              name: "texto", title: "Descrição",
              type: "array",
              of: [defineArrayMember({ type: "block" })],
            }),
            defineField({
              name: "imagem", title: "Imagem do dia (opcional)",
              type: "image", options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: "titulo", numero: "numero" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare: (sel: any) => ({ title: `Dia ${sel.numero} — ${sel.title}` }),
          },
        }),
      ],
    }),

    /* ── Galeria ──────────────────────────────────────── */
    defineField({
      name: "galeria", title: "Galeria de fotos",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),

    /* ── Incluso / Não incluso ────────────────────────── */
    defineField({
      name: "incluso", title: "O que está incluso",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "naoIncluso", title: "O que NÃO está incluso",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),

    /* ── SEO / meta ───────────────────────────────────── */
    defineField({
      name: "metaDescricao", title: "Meta descrição (SEO)",
      type: "text", rows: 2,
    }),
  ],

  preview: {
    select: { title: "titulo", subtitle: "periodo", media: "heroImage" },
  },
})
