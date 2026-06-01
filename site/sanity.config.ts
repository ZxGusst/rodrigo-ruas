import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { schema } from "./sanity/schema"

const HOMEPAGE_ID = "singleton-homepage"

export default defineConfig({
  name:    "rr-viagens",
  title:   "RR Viagens — Admin",
  basePath: "/admin",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "placeholder",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Conteúdo")
          .items([
            /* Homepage — singleton, abre direto sem lista */
            S.listItem()
              .title("Homepage")
              .child(
                S.document()
                  .schemaType("homepage")
                  .documentId(HOMEPAGE_ID)
                  .title("Homepage")
              ),
            S.divider(),
            /* Formulário — singleton */
            S.listItem()
              .title("Formulário de Contato")
              .child(
                S.document()
                  .schemaType("formulario")
                  .documentId("singleton-formulario")
                  .title("Formulário de Contato")
              ),
            S.divider(),
            /* Pacotes — lista normal */
            S.documentTypeListItem("pacote").title("Pacotes"),
          ]),
    }),
    visionTool(),
  ],

  schema,
})
