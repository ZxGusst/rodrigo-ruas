import { defineField, defineType, defineArrayMember } from "sanity"

export const formulario = defineType({
  name:  "formulario",
  title: "Formulário de Contato",
  type:  "document",

  fields: [

    /* ── Conteúdo do modal ─────────────────────────────── */
    defineField({
      name: "titulo",   title: "Título do formulário",
      type: "string",   initialValue: "Quero conhecer os pacotes",
    }),
    defineField({
      name: "descricao", title: "Descrição (aparece abaixo do título)",
      type: "text",      rows: 2,
      initialValue: "Preencha os dados abaixo e nossa equipe entra em contato em até 1 hora.",
    }),

    /* ── Destino do envio ──────────────────────────────── */
    defineField({
      name: "webhookUrl", title: "URL do Webhook (BotConversa)",
      type: "url",
      description: "Ex: https://hook.botconversa.dev/webhook/abc123",
      validation: r => r.required(),
    }),
    defineField({
      name: "redirectAoEnviar", title: "Redirecionar após envio (opcional)",
      type: "string",
      description: "Deixe vazio para mostrar mensagem de sucesso na tela. Ex: /obrigado",
    }),
    defineField({
      name: "mensagemSucesso", title: "Mensagem de sucesso",
      type: "string",
      initialValue: "Recebemos seus dados! Entraremos em contato em breve.",
    }),
    defineField({
      name: "textoBotao", title: "Texto do botão de envio",
      type: "string",
      initialValue: "Quero ser contatado",
    }),

    /* ── Imagem decorativa do header do modal ─────────── */
    defineField({
      name: "imagemDestaque",
      title: "Imagem do formulário (aparece ao lado do título)",
      type:  "image",
      options: { hotspot: true },
      description: "Aparece no canto superior direito do drawer. Sugestão: foto de um destino.",
    }),

    /* ── Campos do formulário ──────────────────────────── */
    defineField({
      name: "campos",
      title: "Campos",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "campo",
          fields: [
            defineField({
              name: "tipo",
              title: "Tipo de campo",
              type: "string",
              options: {
                list: [
                  { title: "Texto curto",                         value: "input"             },
                  { title: "E-mail",                              value: "email"             },
                  { title: "Telefone",                            value: "phone"             },
                  { title: "Texto longo",                         value: "textarea"          },
                  { title: "Seleção (lista fixa)",                value: "select"            },
                  { title: "⭐ Programa + Destino (dinâmico)",    value: "programa-destino"  },
                ],
                layout: "radio",
              },
              initialValue: "input",
            }),
            /* Configuração dos programas — só aparece quando tipo = programa-destino */
            defineField({
              name: "programas",
              title: "Opções de programa",
              type: "array",
              hidden: (props: any) => props.parent?.tipo !== "programa-destino",
              of: [defineArrayMember({
                type: "object",
                fields: [
                  defineField({ name: "valor",     title: "Valor (ex: gruposDoRuas)", type: "string" }),
                  defineField({ name: "titulo",    title: "Título exibido",           type: "string" }),
                  defineField({ name: "descricao", title: "Descrição curta",          type: "string" }),
                ],
                preview: { select: { title: "titulo" } },
              })],
              initialValue: [
                { _key: "p1", valor: "gruposDoRuas",   titulo: "Grupos do Ruas",      descricao: "Viaje comigo para os melhores destinos do mundo" },
                { _key: "p2", valor: "assinadoByRuas", titulo: "Pacotes Assinados",   descricao: "Curadoria validada por Rodrigo, executada com o padrão dele" },
                { _key: "p3", valor: "gruposBrasileiros", titulo: "Grupos Brasileiros", descricao: "Grupos organizados para brasileiros pelo mundo" },
              ],
            }),
            defineField({ name: "label",       title: "Label",            type: "string", validation: r => r.required() }),
            defineField({ name: "nome",        title: "Nome do campo (webhook)", type: "string",
              description: "Chave enviada no JSON. Ex: nome_completo, telefone",
              validation: r => r.required(),
            }),
            defineField({ name: "placeholder", title: "Placeholder",      type: "string" }),
            defineField({ name: "obrigatorio", title: "Obrigatório",       type: "boolean", initialValue: true }),
            defineField({
              name: "opcoes",
              title: "Opções (apenas para seleção)",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              hidden: props => (props.parent as any)?.tipo !== "select",
            }),
          ],
          preview: {
            select: { label: "label", tipo: "tipo" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare: (s: any) => ({ title: `${s.label}  (${s.tipo})` }),
          },
        }),
      ],
      initialValue: [
        { _key: "f1", tipo: "input",  label: "Seu nome",      nome: "nome",     placeholder: "João Silva",       obrigatorio: true  },
        { _key: "f2", tipo: "phone",  label: "WhatsApp",      nome: "telefone", placeholder: "(11) 9 9999-9999", obrigatorio: true  },
        { _key: "f3", tipo: "email",  label: "E-mail",        nome: "email",    placeholder: "joao@email.com",   obrigatorio: false },
        { _key: "f4", tipo: "select", label: "Destino de interesse", nome: "destino",  obrigatorio: false,
          opcoes: ["Japão","Grécia","Turquia","Egito","Islândia","Marrocos","Portugal","Outro"],
        },
      ],
    }),
  ],

  preview: {
    prepare: () => ({ title: "Formulário de Contato" }),
  },
})
