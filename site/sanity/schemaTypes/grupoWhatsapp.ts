import { defineField, defineType } from "sanity"

export const grupoWhatsapp = defineType({
  name:  "grupoWhatsapp",
  title: "Grupos WhatsApp (Comunidade)",
  type:  "document",
  fields: [
    defineField({
      name: "nome", title: "Nome do grupo",
      type: "string",
      description: 'Ex: "Japão 2026"',
      validation: r => r.required(),
    }),
    defineField({
      name: "destino", title: "Destino (slug da imagem)",
      type: "string",
      description: 'Slug usado para buscar imagem: japao, turquia, grecia...',
    }),
    defineField({
      name: "heroImage", title: "Foto do grupo",
      type: "image",
      options: { hotspot: true },
      description: "Opcional — se não tiver, usa a imagem do destino.",
    }),
    defineField({
      name: "partida", title: "Data de partida",
      type: "string",
      description: 'Ex: "08 Out 2026"',
    }),
    defineField({
      name: "membros", title: "Membros atuais",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "maxMembros", title: "Máximo de membros",
      type: "number",
      initialValue: 20,
    }),
    defineField({
      name: "status", title: "Status",
      type: "string",
      options: {
        list: [
          { title: "🟢 Aberto",          value: "aberto"    },
          { title: "🟡 Últimas vagas",    value: "vagas"     },
          { title: "🔴 Esgotado",         value: "esgotado"  },
        ],
        layout: "radio",
      },
      initialValue: "aberto",
      validation: r => r.required(),
    }),
    defineField({
      name: "ordem", title: "Ordem de exibição",
      type: "number",
      initialValue: 99,
      description: "Menor número aparece primeiro.",
    }),
    defineField({
      name: "ativo", title: "Exibir na home?",
      type: "boolean",
      initialValue: true,
    }),
  ],

  preview: {
    select: { title: "nome", subtitle: "partida", status: "status" },
    prepare: ({ title, subtitle, status }) => ({
      title,
      subtitle: `${subtitle ?? "—"} · ${status ?? ""}`,
    }),
  },

  orderings: [
    { title: "Ordem manual", name: "ordemAsc", by: [{ field: "ordem", direction: "asc" }] },
  ],
})
