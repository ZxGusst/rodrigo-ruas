# Handoff — RR Viagens

**Repositório:** https://github.com/ZxGusst/rodrigo-ruas.git  
**Stack:** Next.js 16 · Tailwind CSS v4 · GSAP · Sanity CMS  
**Data:** Junho 2026

---

## 1. Estrutura do repositório

```
rodrigo-ruas-clone/
└── site/                        ← projeto Next.js
    ├── app/
    │   ├── page.tsx             ← Homepage
    │   ├── layout.tsx           ← Layout raiz + providers
    │   ├── pacotes/
    │   │   ├── selecao/         ← Listagem de destinos com filtros
    │   │   └── [slug]/          ← Página individual de cada pacote
    │   ├── sobre/               ← Página sobre
    │   ├── contato/             ← Página contato
    │   ├── admin/               ← Sanity Studio (autenticado)
    │   └── api/
    │       ├── submit-form/     ← Recebe dados do formulário → envia ao webhook
    │       └── destinos/        ← Retorna pacotes por tipo (usado no form step 3)
    ├── components/
    │   ├── FormModal.tsx        ← Formulário multi-step (drawer lateral)
    │   ├── FormProvider.tsx     ← Context global para abrir/fechar o form
    │   └── gsap/
    │       ├── NavBar.tsx       ← Navbar desktop
    │       └── MobileMenu.tsx   ← Menu mobile (fullscreen)
    ├── sanity/
    │   ├── schemaTypes/         ← Schemas do CMS (pacote, formulario, homepage, etc.)
    │   └── components/
    │       └── GuiaDoc.tsx      ← Guia de uso exibido no Sanity Studio
    └── scripts/
        ├── seed-completo.mjs    ← Popula o CMS com dados iniciais
        └── test-token.mjs       ← Testa conexão com a API do Sanity
```

---

## 2. Setup local

```bash
# 1. Clonar
git clone https://github.com/ZxGusst/rodrigo-ruas.git
cd rodrigo-ruas-clone/site

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.local.example .env.local
# Editar .env.local com as credenciais (pedir ao Gustavo)

# 4. Rodar
npm run dev
# → http://localhost:3000
# → http://localhost:3000/admin  (Sanity Studio)
```

### Variáveis de ambiente (`.env.local`)

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ID do projeto Sanity (`6g3tj20r`) | ✅ |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset (`production`) | ✅ |
| `SITE_USUARIO` | Login do painel `/admin` | ✅ |
| `SITE_SENHA` | Senha do painel `/admin` | ✅ |
| `SANITY_TOKEN` | Token write — só para rodar scripts | Apenas para scripts |

---

## 3. CMS — Sanity

**Acesso:** `/admin` no site (autenticado via `SITE_USUARIO` / `SITE_SENHA`)  
**Project ID:** `6g3tj20r` · **Dataset:** `production`

### Tipos de documento

| Tipo | O que controla |
|------|---------------|
| `pacote` | Cada destino/viagem do site |
| `formulario` | Configuração do formulário de contato (webhook URL, campos, textos) |
| `homepage` | Título e subtítulo do hero da home |
| `whatsappGroup` | Cards da roda giratória "Comunidade RR Viagens" |

### Campo `tipo` do pacote (importante)

Controla **3 coisas ao mesmo tempo**:
1. Badge colorido na listagem
2. Filtro "Tipo" na página `/pacotes/selecao`
3. Quais pacotes aparecem no **Step 3 do formulário** quando o lead escolhe o programa

| Valor | Label |
|-------|-------|
| `gruposDoRuas` | Grupo do Ruas |
| `assinadoByRuas` | Pacotes Assinados |
| `gruposBrasileiros` | Grupos Brasileiros |

---

## 4. Formulário de contato

O formulário é um **drawer lateral em 3 etapas**:

```
Step 1 → Dados pessoais   (campos configurados no Sanity)
Step 2 → Programa         (cards hardcoded: Grupo do Ruas / Pacotes Assinados / Grupos Brasileiros)
Step 3 → Destino          (checkboxes carregados da API /api/destinos?tipo={programa})
```

### Comportamento de auto-preenchimento

Quando o usuário abre o form **a partir de uma página de pacote**, o formulário:
- Pré-seleciona o programa do pacote no Step 2
- Pré-marca o destino no Step 3

### Payload enviado ao webhook (nomes fixos — não alterar)

```json
{
  "nome": "...",
  "telefone": "+5511999999999",
  "email": "...",
  "destino_programa": "gruposDoRuas",
  "destino": "Japão, Ushuaia"
}
```

> ⚠️ A URL do webhook é configurada **no Sanity** (campo `webhookUrl` do documento `formulario`).  
> O webhook **nunca passa pelo browser** — a API route `/api/submit-form` busca a URL direto do Sanity.

### Campo de telefone

Usa a biblioteca `react-international-phone`:
- Seletor de bandeira + DDI (padrão 🇧🇷 +55)
- Máscara automática por país
- Validação: mínimo 10 dígitos

---

## 5. Navegação

| Link | Destino |
|------|---------|
| **Destinos** (NavBar) | Abre modal com destinos em destaque |
| **Grupos** (NavBar) | `/pacotes/selecao?tipo=gruposBrasileiros` (filtro pré-aplicado) |
| **Sobre** | `/sobre` |
| **Contato** | `/contato` |
| **Falar no WhatsApp** | Abre o FormModal |

---

## 6. Filtros na página de destinos (`/pacotes/selecao`)

Três filtros via URL searchParams:

| Parâmetro | Exemplo | Descrição |
|-----------|---------|-----------|
| `continente` | `?continente=Asia` | Filtra por região |
| `tipo` | `?tipo=gruposDoRuas` | Filtra por tipo de pacote |
| `precoMax` | `?precoMax=15000` | Filtra por preço máximo |

Os filtros são combináveis: `?continente=Asia&tipo=gruposDoRuas`

---

## 7. Segurança

### O que está protegido
- ✅ Token Sanity **nunca** está no código — apenas em `.env.local` (gitignored)
- ✅ URL do webhook **não chega ao browser** — buscada server-side
- ✅ API `/api/destinos` valida o parâmetro `tipo` contra whitelist
- ✅ API `/api/submit-form` ignora qualquer `_webhookUrl` enviado pelo cliente
- ✅ Painel `/admin` protegido por login via middleware

### ⚠️ Ação pendente (fazer antes de ir pra produção)

O token Sanity antigo (`skTMByody...`) foi encontrado no histórico do git em commits antigos.  
**Deve ser revogado e substituído:**

1. Acessar → sanity.io/manage → projeto `6g3tj20r`
2. **API → Tokens → Revogar** o token antigo
3. Criar novo token com permissão **Write**
4. Salvar em `.env.local` como `SANITY_TOKEN=sk...novo`
5. Compartilhar o novo token com os devs via canal seguro (não por git/chat)

---

## 8. Scripts úteis

```bash
# Seed do CMS (popula com pacotes reais)
SANITY_TOKEN=sk... node scripts/seed-completo.mjs

# Testar conexão com Sanity
SANITY_TOKEN=sk... node scripts/test-token.mjs

# Build de produção
npm run build

# Linting
npm run lint
```

---

## 9. Deploys

O projeto ainda não tem deploy configurado. Recomendação: **Vercel** (integração nativa com Next.js).

```bash
# Via CLI (dentro de site/)
npx vercel --prod
```

Variáveis de ambiente devem ser configuradas no painel da Vercel antes do primeiro deploy.

---

## 10. Contato

Dúvidas sobre o projeto: **gustavoalves@botconversa.com.br**
