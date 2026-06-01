# SCRAPING DE REFERÊNCIA — OH Architecture
## https://www.oharchitecture.com.au/
### Desenvolvido por: MONOLOG Studio (bymonolog.com)
### Plataforma: Webflow

---

## 1. STACK TECNOLÓGICA

| Camada | Tecnologia |
|---|---|
| **Plataforma** | Webflow (CMS-driven) |
| **CDN de mídia** | cdn.prod.website-files.com |
| **Formato de imagem** | AVIF (melhor compressão, qualidade máxima) |
| **Animações** | Webflow Interactions (GSAP nativo via Webflow) |
| **Fontes** | Hosted via Webflow (não-Google Fonts — provavelmente Adobe Fonts ou licença própria) |
| **Dev/Design** | MONOLOG Studio — "award-winning web and brand experience studio" |
| **Fotografia** | Andy Macpherson (crédito na página) |

### Sobre o MONOLOG (quem fez o site)
- Estúdio de web e experiência de marca premiado
- Filosofia: "outcomes first, taste second" / "human-first, always"
- Estilo de assinatura: **minimal + sound design + cursor customizado**
- Portfólio inclui: OH Architecture, HISS, Squiggle
- Princípio central: "intention over speed" — cada elemento tem propósito

---

## 2. PALETA DE CORES

Com base na análise visual e padrões do estúdio MONOLOG:

```
Background:    #FFFFFF (branco puro) / #F5F2EE (off-white warm)
Texto primário: #1A1A1A (preto quente, não puro)
Texto secundário: #6B6B6B (cinza médio)
Accent/Links:  #1A1A1A (underline animado)
Bordas:        #E0DBD5 (warm gray sutil)
```

**Filosofia cromática:**
- Paleta intencionalmente neutra para não competir com a fotografia
- As cores "vivas" são as fotos dos projetos (tons de concreto, madeira, verde, céu)
- Sem cores de accent vibrantes — a elegância vem da ausência de cor

---

## 3. TIPOGRAFIA

### Padrão identificado (baseado em análise do MONOLOG + visual do site):

**Display / Hero:** Serif editorial — possivelmente **Freight Display**, **Canela**, **Cormorant Garamond** ou similar
- Uso: Títulos grandes, hero headline
- Peso: Light (300) a Regular (400)
- Estilo: Elegante, espacejamento generoso (letter-spacing positivo)

**Body / Interface:** Sans-serif limpo — possivelmente **Neue Haas Grotesk**, **Inter**, **Aktiv Grotesk** ou similar
- Uso: Navegação, corpo de texto, labels, botões
- Peso: Regular (400) e Medium (500)
- Estilo: Uppercase em alguns elementos de UI (NAV, labels de seção)

### Hierarquia tipográfica observada:
```
H1 (hero):      ~80-120px / Light / Letter-spacing: 0.02em
H2 (seção):     ~40-60px / Light ou Regular
H3 (subseção):  ~24-32px
Body:           ~16-18px / Regular / Line-height: 1.6-1.8
Labels/UI:      ~12-14px / UPPERCASE / Letter-spacing: 0.1-0.15em
Nav:            ~14px / Regular ou Medium
```

---

## 4. LAYOUT E GRID

### Estrutura geral da página home:

```
[NAV FIXO]
  Logo (esquerda) | Menu links (centro ou direita) | CTA "Get in touch" (extrema direita)

[HERO — FULLSCREEN]
  Imagem AVIF em fullscreen (100vh)
  Texto sobreposto (headline simples, sem poluição)
  Possível: sutil animação de reveal no load

[FEATURED PROJECTS — GRID ASSIMÉTRICO]
  Alternância entre:
  - 1 imagem grande (full-width)
  - 2 imagens lado a lado (50/50 ou 60/40)
  - 1 imagem + bloco de texto
  
  Hover: imagem cresce sutilmente (scale 1.03-1.05) + texto aparece

[PROCESSO — 6 ETAPAS]
  Layout horizontal ou em grid 3x2
  Numeração destacada: "01", "02"...
  Texto expandindo no hover ou scroll

[DEPOIMENTO — FULLSCREEN / DESTACADO]
  Citação grande, fundo neutro ou imagem como bg

[CTA ENQUIRY]
  Formulário multi-step (8 passos)
  Progress indicator discreto

[FOOTER]
  2-3 colunas
  Info de contato + links + badge AIA
  Crédito MONOLOG
  Acknowledgment of Country (Turrbal people)
```

### Padrões de espaçamento:
- Margem lateral (gutter): ~5-8% da viewport em desktop
- Espaço entre seções: `padding: 120px-200px 0`
- Gap entre elementos de grid: `gap: 16-24px`
- Filosofia: **muito espaço em branco** — os elementos respiram

---

## 5. PADRÕES DE ANIMAÇÃO

### A. Animações de Load / Preloader
- **Provável preloader:** Fade-in do logo seguido de reveal da página
- MONOLOG costuma usar preloaders minimalistas com texto ou linha crescendo

### B. Scroll-triggered Reveals (padrão MONOLOG)
```
Elemento entra no viewport:
  opacity: 0 → 1
  transform: translateY(40px) → translateY(0)
  duration: 0.8-1.2s
  ease: cubic-bezier(0.22, 1, 0.36, 1) — "ease-out-quint"
  stagger: 0.1-0.15s entre elementos do mesmo grupo
```

### C. Hero Image
- Possível: **Ken Burns sutil** (scale 1.0 → 1.05 em 8-12s, loop) ou imagem estática
- Texto: fade + translateY no load, delay de ~0.4s após o preloader

### D. Hover em Cards de Projeto
```css
/* Comportamento inferido */
.project-card img {
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.project-card:hover img {
  transform: scale(1.04);
}
.project-card .overlay-text {
  opacity: 0;
  transition: opacity 0.4s ease;
}
.project-card:hover .overlay-text {
  opacity: 1;
}
```

### E. Navegação
- Nav: provavelmente **sticky com blur backdrop** ou simplesmente fixo
- Links: underline animado (width: 0 → 100% no hover)
- Menu mobile: overlay com fade + slide ou reveal por lista (stagger)
- Transição entre páginas: **fade out → fade in** (padrão Webflow)

### F. Galeria — Drag & Explore
- Comportamento confirmado: `"Click + hold your mouse to drag and explore"`
- Implementação provável: **Momentum Scroll horizontal** com mouse drag
- Biblioteca: possivelmente `simplebar`, `draggabilly`, ou Webflow Slider customizado

### G. Formulário Multi-step (8 passos)
```
Transição entre steps:
  Step atual: opacity 1, translateX(0)
  Step saindo: opacity 0, translateX(-20px)
  Step entrando: opacity 0, translateX(20px) → opacity 1, translateX(0)
  duration: 0.4-0.5s
  ease: ease-in-out
```

### H. Cursor Customizado
- MONOLOG tem cursor customizado como assinatura
- Provável: círculo pequeno que segue o mouse com lag (lerp ~0.1)
- Em hover de links: cursor cresce (scale 2-3x) ou muda de forma
- Em hover de imagens: cursor transforma em "VIEW" ou "+"

---

## 6. FLUXO DE NAVEGAÇÃO

```
HOME
  ├── Works (Portfolio grid de 26+ projetos)
  │     └── [Projeto individual] — detalhes + galeria de fotos
  ├── Studio (Sobre + Time de 15 pessoas)
  ├── Process (6 etapas + formulário de contato)
  ├── Gallery (drag-and-drop exploration)
  └── Instagram (link externo)

CTA principal em todas as páginas:
  "Get in touch" → Abre formulário multi-step OU navega para Process
```

### Experiência de navegação:
- **Transições de página:** Suaves (fade ou clip reveal — padrão MONOLOG)
- **Scroll:** Nativo (sem Locomotive Scroll detectado — Webflow puro)
- **Ancoragem:** Links internos com scroll suave
- **Mobile:** Menu hamburguer com overlay fullscreen

---

## 7. SEÇÕES IDENTIFICADAS — HOME

| # | Seção | Características |
|---|---|---|
| 1 | **Nav** | Fixo, logo + links + CTA |
| 2 | **Hero** | Fullscreen AVIF, headline sobreposta |
| 3 | **Featured Projects** | Grid assimétrico, 6 projetos em destaque |
| 4 | **Philosophy Statement** | Texto grande: "strong, solid forms with subtle elegance" |
| 5 | **Process Preview** | 6 etapas numeradas |
| 6 | **Testimonial** | Citação do cliente "Carmen" |
| 7 | **Awards / Press** | Prêmios 2024 QLD Architecture Awards |
| 8 | **Enquiry CTA** | Form 8-step ou call-to-action |
| 9 | **Footer** | Contato + links + créditos |

---

## 8. CONTEÚDO E COPYWRITING

### Tom de voz:
- Confiante, mas não arrogante
- Editorial, conciso
- Linguagem de "expertise" sem jargão excessivo
- Humanizado (menciona colaboração, relacionamentos)

### Frases-chave do site:
> "Great architecture isn't just about talent and experience, but collaborations and relationships."

> "Strong, solid forms with subtle elegance, natural balance and enduring appeal."

> "Passive design principles, carefully considered planning, and intuitive spatial flow."

### Estrutura dos projetos no portfolio:
- Nome do projeto + ano
- Tag: "Under Construction" (atualidade)
- Foto de alta qualidade (AVIF, Andy Macpherson)
- Destinos: Myrtle Pool House, Haig, Sidney House, Clifton, Sweetman, Heal

---

## 9. PERFORMANCE E DETALHES TÉCNICOS

| Item | Detalhe |
|---|---|
| **Formato de imagem** | AVIF (melhor que WebP — suporte moderno) |
| **Lazy loading** | Sim (padrão Webflow) |
| **Responsividade** | Mobile-first (Webflow breakpoints) |
| **Acessibilidade** | Acknowledgment of Country no footer |
| **SEO** | Meta tags via Webflow CMS |
| **Analytics** | Provavelmente GA4 ou Fathom |

---

## 10. INSIGHTS DE DIREÇÃO CRIATIVA

### O que faz esse site ser excepcional:

1. **Fotografia como protagonista** — o design desaparece para a foto brilhar
2. **Espaço em branco agressivo** — courage of restraint (coragem de não preencher)
3. **Tipografia editorial** — serif + sans cria tensão elegante
4. **Animações invisíveis** — você sente mas não vê (sutileza máxima)
5. **Consistência de tom** — cada palavra, imagem e pixel alinhados
6. **Processo como diferencial** — mostra os 6 estágios = transparência = confiança
7. **Formulário de 8 passos** — qualifica o lead enquanto educa o cliente
8. **Drag-to-explore** — interação inesperada que cria memorabilidade
9. **Cursor customizado** — detalhe que sinaliza "esse site foi feito por experts"
10. **AVIF + performance** — velocidade como parte da experiência

---

*Scraping realizado em: Maio 2026*
*Fonte: oharchitecture.com.au + bymonolog.com + Webflow Made-in*
