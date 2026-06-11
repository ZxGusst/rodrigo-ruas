// Script de teste do token Sanity
// Use: SANITY_TOKEN=sk... node scripts/test-token.mjs

const TOKEN   = process.env.SANITY_TOKEN
const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "6g3tj20r"
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET    ?? "production"

if (!TOKEN) {
  console.error("❌ Variável SANITY_TOKEN não definida.")
  console.error("   Use: SANITY_TOKEN=sk... node scripts/test-token.mjs")
  process.exit(1)
}

const res = await fetch(
  `https://${PROJECT}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      mutations: [{ createOrReplace: { _id: "drafts.seed-test-001", _type: "pacote", titulo: "__test__", slug: { _type:"slug", current:"__httptest__" }, prioridade:"oculto", ordem:999 } }]
    })
  }
)

const body = await res.json()
console.log("Status HTTP:", res.status)
console.log("Resposta:", JSON.stringify(body, null, 2))
