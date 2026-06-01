const TOKEN = "skTMByodyxtOZHTjHhNJ0ZoGg81zpCQYsaWoeh2oteGTUMJqImOcSm2Gr2tnA0S06NbzF5PPvjCk7IOpk21lyvnf7SzBlNNuC8cUlgR954RzL6TgqcFaPi9lahIpKdaclOyJwWBYikxglc6pLn4PTBxEJIGLmM2ScD83p8lnA0I5Dj5biLKT"
const PROJECT = "6g3tj20r"
const DATASET = "production"

// Testa via HTTP direto (bypassa o SDK)
const res = await fetch(
  `https://${PROJECT}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${TOKEN}`,
    },
    /* tenta createOrReplace com _id explícito como draft */
    body: JSON.stringify({
      mutations: [{ createOrReplace: { _id: "drafts.seed-test-001", _type: "pacote", titulo: "__test__", slug: { _type:"slug", current:"__httptest__" }, prioridade:"oculto", ordem:999 } }]
    })
  }
)

const body = await res.json()
console.log("Status HTTP:", res.status)
console.log("Resposta:", JSON.stringify(body, null, 2))
