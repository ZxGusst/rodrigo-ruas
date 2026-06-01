import { defineField, defineType, defineArrayMember } from "sanity"

export const homepage = defineType({
  name:  "homepage",
  title: "Homepage",
  type:  "document",
  fields: [

    /* ── HERO ─────────────────────────────────────── */
    defineField({
      name: "heroLabel", title: "Label acima do título",
      type: "string",
      description: 'Ex: "Curadoria de Expert"',
      initialValue: "Curadoria de Expert",
    }),
    defineField({
      name: "heroLine1", title: "Título — linha 1",
      type: "string",
      description: 'Ex: "PACOTES"',
      initialValue: "PACOTES",
    }),
    defineField({
      name: "heroLine2", title: "Título — linha 2",
      type: "string",
      description: 'Ex: "PELO MUNDO"',
      initialValue: "PELO MUNDO",
    }),
    defineField({
      name: "heroSub", title: "Subtítulo do hero",
      type: "text", rows: 2,
      description: "Aparece abaixo do título grande. Use \\n para quebrar linha.",
      initialValue: "Curadoria de expert para viajantes exigentes.\n93 países. 19 anos de estrada.",
    }),

    /* ── STATS ────────────────────────────────────── */
    defineField({
      name: "stats", title: "Números (seção de estatísticas)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "valor",  title: "Número",       type: "number" }),
            defineField({ name: "sufixo", title: "Sufixo",       type: "string", description: 'Ex: "+" ou deixe vazio' }),
            defineField({ name: "label",  title: "Rótulo",       type: "string", description: 'Ex: "países visitados"' }),
          ],
          preview: {
            select: { valor: "valor", sufixo: "sufixo", label: "label" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare: (s: any) => ({ title: `${s.valor}${s.sufixo ?? ""} — ${s.label}` }),
          },
        }),
      ],
      initialValue: [
        { _key: "s1", valor: 93,   sufixo: "",  label: "países visitados"    },
        { _key: "s2", valor: 19,   sufixo: "+", label: "anos de experiência" },
        { _key: "s3", valor: 1500, sufixo: "+", label: "viajantes levados"   },
        { _key: "s4", valor: 40,   sufixo: "+", label: "destinos ativos"     },
      ],
    }),

    /* ── PROCESSO ─────────────────────────────────── */
    defineField({
      name: "passos", title: "Processo (3 passos)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "passo",
          fields: [
            defineField({ name: "numero", title: "Número", type: "string", description: 'Ex: "01"' }),
            defineField({ name: "titulo", title: "Título",  type: "string" }),
            defineField({ name: "corpo",  title: "Descrição", type: "text", rows: 2 }),
          ],
          preview: {
            select: { numero: "numero", titulo: "titulo" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare: (s: any) => ({ title: `${s.numero} — ${s.titulo}` }),
          },
        }),
      ],
      initialValue: [
        { _key: "p1", numero: "01", titulo: "Escolha seu destino",   corpo: "Mais de 40 países com saídas programadas." },
        { _key: "p2", numero: "02", titulo: "Fale com nossa equipe", corpo: "Atendimento direto. Pessoa real, sem robô." },
        { _key: "p3", numero: "03", titulo: "Apareça no aeroporto",  corpo: "Passagem, hotel, passeios. O resto é com a gente." },
      ],
    }),

    /* ── SEÇÕES DE PRODUTOS ───────────────────────── */
    defineField({
      name: "secaoGruposLabel",  title: "Grupos do Ruas — label",
      type: "string", initialValue: "Viaje comigo",
    }),
    defineField({
      name: "secaoGruposTitulo", title: "Grupos do Ruas — título",
      type: "string", initialValue: "Grupos do Ruas",
    }),
    defineField({
      name: "secaoGruposDesc",   title: "Grupos do Ruas — descrição",
      type: "text", rows: 2,
      initialValue: "Viagens exclusivas onde o Rodrigo está presente em cada passo do roteiro. Curadoria 100% dele.",
    }),

    defineField({
      name: "secaoAssinadosLabel",  title: "Pacotes Assinados — label",
      type: "string", initialValue: "Curadoria validada",
    }),
    defineField({
      name: "secaoAssinadosTitulo", title: "Pacotes Assinados — título",
      type: "string", initialValue: "Pacotes Assinados by Ruas",
    }),
    defineField({
      name: "secaoAssinadosDesc",   title: "Pacotes Assinados — descrição",
      type: "text", rows: 2,
      initialValue: "Roteiros desenhados, curados e aprovados pelo Rodrigo. Executados com o padrão de qualidade da RR Viagens.",
    }),

    defineField({
      name: "secaoGruposBrLabel",  title: "Grupos Brasileiros — label",
      type: "string", initialValue: "Para o mundo",
    }),
    defineField({
      name: "secaoGruposBrTitulo", title: "Grupos Brasileiros — título",
      type: "string", initialValue: "Grupos de Brasileiros no Mundo",
    }),
    defineField({
      name: "secaoGruposBrDesc",   title: "Grupos Brasileiros — descrição",
      type: "text", rows: 2,
      initialValue: "Grupos organizados para brasileiros que querem viajar com outros compatriotas para os melhores destinos.",
    }),

    /* ── DEPOIMENTO ───────────────────────────────── */
    defineField({
      name: "depoimentoTexto", title: "Depoimento — texto",
      type: "text", rows: 3,
      initialValue: "Eu nunca tinha viajado para fora do Brasil. Com o Rodrigo, fui para o Japão e voltei diferente.",
    }),
    defineField({
      name: "depoimentoAutor", title: "Depoimento — autor",
      type: "string",
      initialValue: "Maria C., São Paulo",
    }),

    /* ── CTA FINAL ────────────────────────────────── */
    defineField({
      name: "ctaTitulo", title: "CTA — título",
      type: "string",
      initialValue: "Sua próxima viagem começa com uma mensagem.",
    }),
    defineField({
      name: "ctaSubtitulo", title: "CTA — subtítulo",
      type: "text", rows: 2,
      initialValue: "Vagas limitadas. Atendimento personalizado. Sem chatbot, sem fila.",
    }),
  ],

  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
})
