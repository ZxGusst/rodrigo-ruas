# PROMPT COMPLETO — Claude Design
## Criar página no nível de OH Architecture (oharchitecture.com.au)

---

> **Como usar:** Cole este prompt inteiro no Claude (claude.ai) ou no Claude Code.
> Substitua os campos marcados com `[COLCHETES]` com os dados do seu projeto.

---

## PROMPT

---

Você é um designer e desenvolvedor front-end de nível world-class, especializado em experiências digitais editoriais e minimalistas de alto padrão.

Preciso que você crie uma **página web completa em HTML/CSS/JS standalone** (um único arquivo `.html`) com o mesmo nível de qualidade, direção criativa e sofisticação técnica do site **oharchitecture.com.au** — desenvolvido pelo estúdio MONOLOG.

---

### REFERÊNCIA DE QUALIDADE — OH Architecture

O site de referência tem estas características que você DEVE replicar em nível de qualidade (não copiar o conteúdo, mas igualar a sofisticação):

**Direção criativa:**
- Design editorial minimalista onde o conteúdo visual é protagonista
- Paleta neutra (branco, off-white, preto quente) que não compete com as imagens
- Tipografia com tensão elegante entre serif (display) e sans-serif (interface)
- "Coragem da restrição" — espaço em branco agressivo, nunca preencher por preencher
- Cada elemento tem propósito. Se não tem propósito, não existe.

**Animações e interações:**
- Scroll-triggered reveals sutis: `opacity 0→1` + `translateY(40px→0)`, ease-out-quint
- Stagger de 0.1-0.15s entre elementos do mesmo grupo
- Hover em cards: scale sutil `1.0→1.04` na imagem, `overflow: hidden`
- Cursor customizado: círculo que segue o mouse com lerp (lag suave)
- Nav: underline animado em links (width 0→100%)
- Transição de página: fade global suave
- Nenhuma animação é chamativa — você SENTE mas não VÊ

**Layout:**
- Grid assimétrico para portfólio (não coluna uniforme)
- Fullscreen hero (100vh) com imagem e texto sobreposto
- Seções com `padding: 120-200px 0` — muito espaço
- Gutter lateral: ~6% da viewport
- Gap entre cards: 16-24px

---

### SOBRE O PROJETO QUE VOCÊ VAI CRIAR

**Cliente / Marca:** [RODRIGO RUAS — RR Viagens / Pacotes pelo Mundo]

**O que é:** [Agência de viagens de alto padrão curada por Rodrigo Ruas, apresentador de TV com 19 anos de experiência em 93 países. Especializada em grupos de brasileiros para destinos internacionais premium.]

**Tom de voz:** [Confiante. Editorial. Expert sem arrogância. Humanizado. Ex: "Já estive em 93 países para que você não precise descobrir no erro."]

**Público-alvo:** [Brasileiros 35-65 anos, renda alta, que querem viver experiências reais no mundo com segurança, conforto e a curadoria de um expert de confiança.]

**Paleta de cores:**
```
Background:     #FAFAF8 (off-white quente)
Texto primário: #1C1C1A (quase preto)
Texto secundário: #717167 (cinza quente)
Accent:         #C4A882 (dourado areia — remete a viagem, areia, aventura)
Borda sutil:    #E8E4DF
```

**Fontes (use Google Fonts — gratuitas):**
- Display/Serif: `Cormorant Garamond` — Light 300, Regular 400 (para headlines grandes)
- Sans-serif: `DM Sans` — Regular 400, Medium 500 (para body, nav, labels)

---

### ESTRUTURA DA PÁGINA (seções em ordem)

#### 1. NAV
- Logo: "RR" (simples, tipográfico) à esquerda
- Links centrais: `Destinos | Sobre | Processo | Galeria`
- CTA à direita: botão `"Quero Viajar →"` (sem preenchimento, apenas borda)
- Fixo no topo, `backdrop-filter: blur(12px)` com leve transparência no scroll
- Em mobile: hamburguer que abre overlay fullscreen com links em lista grande

#### 2. HERO — FULLSCREEN
- `height: 100vh`, imagem de fundo com `object-fit: cover`
- Use um placeholder de imagem de paisagem viagem (`https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80` — montanha/natureza)
- Sobreposição escura sutil: `rgba(0,0,0,0.25)`
- Texto centralizado ou canto inferior esquerdo:
  ```
  [Label pequeno, uppercase, tracking largo]: "Curadoria de Expert"
  [Headline grande, Cormorant Garamond Light]: "O mundo inteiro.
  Sem o estresse de planejar."
  [Sub, DM Sans]: "Pacotes curados por quem já viajou 93 países."
  [CTA]: "Ver destinos →"
  ```
- Animação de load: texto entra com `opacity 0→1` + `translateY(30px→0)` em sequência (stagger 0.2s)
- Scroll indicator: seta ou texto "scroll" pulsando suavemente no bottom center

#### 3. DESTINOS EM DESTAQUE — GRID ASSIMÉTRICO
- Título da seção: `"Destinos"` (pequeno, uppercase, cinza) + `"Onde você quer ir?"` (grande, Cormorant)
- Grid com pelo menos 4 cards em layout assimétrico:
  ```
  [Card grande — 60%]  [Card pequeno — 38%]
  [Card pequeno — 38%] [Card grande — 60%]
  ```
- Cada card: imagem `overflow:hidden` + nome do destino + número de dias
- Imagens placeholder do Unsplash:
  - Japão: `photo-1540959733332-eab4deabeeaf`
  - Grécia: `photo-1555993539-1732b0258235`
  - Turquia: `photo-1524231757912-21f4fe3a7200`
  - Egito: `photo-1539650116574-75c0c6d73f6e`
- Hover: imagem cresce `scale(1.04)`, nome do destino sobe com `opacity 0→1`
- Scroll reveal: cada card entra com delay sequencial

#### 4. MANIFESTO / FILOSOFIA
- Fundo: `#1C1C1A` (escuro) — quebra o ritmo visual
- Texto grande centralizado, Cormorant Garamond Light, branco:
  ```
  "Já estive em 93 países.
  Sei o que vale cada hora,
  cada hotel, cada rota."
  ```
  — Rodrigo Ruas
- Sub pequeno: "19 anos de estrada. 1.500 viajantes levados. Uma missão."
- Animação: texto aparece palavra por palavra (word-by-word reveal no scroll)

#### 5. COMO FUNCIONA — PROCESSO EM 3 PASSOS
- Título: `"O processo"` (pequeno) + `"Simples assim."` (grande)
- 3 colunas numeradas:
  ```
  01 — Escolha seu destino
       Mais de 40 países disponíveis com saídas programadas.
  
  02 — Fale com a equipe
       WhatsApp direto. Sem chatbot, sem fila, sem demora.
  
  03 — Apareça no aeroporto
       O resto é com a gente. Guia, hotel, traslado — tudo incluso.
  ```
- Animação: número cresce de 0 para o tamanho final quando entra no viewport

#### 6. PROVA SOCIAL — NÚMEROS
- Fundo: off-white
- 4 números grandes em grid 2x2:
  ```
  93        19+
  países    anos de experiência
  
  1.500+    40+
  viajantes destinos ativos
  ```
- Animação: counter animado (de 0 até o número final quando entra no viewport)
- Cormorant Garamond para os números grandes, DM Sans para as labels

#### 7. DEPOIMENTO
- Citação longa em destaque, Cormorant Garamond Italic:
  ```
  "Eu nunca tinha viajado para fora do Brasil.
  Com o Rodrigo, fui para o Japão e voltei diferente."
  ```
  Nome: — Maria C., São Paulo
- Fundo: imagem de destino com overlay escura, texto branco
- Sem carrossel — apenas uma citação poderosa

#### 8. CTA FINAL
- Fundo: `#C4A882` (dourado areia)
- Headline grande: `"Sua próxima viagem começa aqui."`
- Sub: `"Vagas limitadas por grupo. Reserve sua consulta gratuita."`
- Botão: escuro `"Falar no WhatsApp →"` com link `https://wa.me/5511966401489`
- Animação: botão tem efeito de hover com background fill da esquerda para direita

#### 9. FOOTER
- Fundo: `#1C1C1A`
- 3 colunas:
  - Esquerda: Logo "RR" + tagline curta
  - Centro: Links de navegação
  - Direita: Contato (WhatsApp, email, Instagram)
- Bottom bar: `"© 2025 RR Viagens — CNPJ 52.437.341/0001-22"` + `"Feito com ♥ no Brasil"`

---

### ANIMAÇÕES — ESPECIFICAÇÃO TÉCNICA

Implemente todas estas animações com JavaScript vanilla (sem bibliotecas externas, exceto se necessário):

```javascript
// 1. CURSOR CUSTOMIZADO
// Círculo de 20px que segue o mouse com lerp (fator 0.12)
// Em hover de links/cards: cresce para 50px + muda cor

// 2. SCROLL REVEAL
// IntersectionObserver com threshold: 0.15
// Ao entrar no viewport: opacity 0→1 + translateY(40px→0)
// Transition: 0.9s cubic-bezier(0.22, 1, 0.36, 1)
// Stagger via data-delay="0", "100", "200"... em ms

// 3. NAV SCROLL BEHAVIOR
// Ao scrollar > 80px: adiciona classe .scrolled com backdrop-blur
// Links: underline cresce de 0→100% no hover via CSS

// 4. COUNTER ANIMATION
// Quando entra no viewport, conta de 0 até o número em 2s
// easing: ease-out

// 5. HERO PARALLAX SUTIL
// Imagem do hero: translateY(scrollY * 0.3) — parallax leve

// 6. HOVER NOS CARDS
// Scale 1.04 na imagem (com overflow hidden no container)
// Texto de overlay: opacity 0→1

// 7. WORD REVEAL (seção manifesto)
// Cada palavra envelopa em <span>
// Cada span entra sequencialmente no scroll

// 8. SMOOTH SCROLL
// Scroll suave nativo: html { scroll-behavior: smooth; }
// Offset para nav fixo: scroll-padding-top: 80px
```

---

### CSS — VARIÁVEIS E SISTEMA

```css
:root {
  --bg: #FAFAF8;
  --bg-dark: #1C1C1A;
  --text: #1C1C1A;
  --text-muted: #717167;
  --accent: #C4A882;
  --border: #E8E4DF;
  
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'DM Sans', -apple-system, sans-serif;
  
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 2rem;
  --space-lg: 4rem;
  --space-xl: 8rem;
  --space-2xl: 12rem;
  
  --gutter: clamp(24px, 6vw, 80px);
  --max-width: 1440px;
  
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  
  --radius-sm: 4px;
  --radius-md: 8px;
  
  --transition-fast: 0.25s var(--ease-in-out);
  --transition-medium: 0.6s var(--ease-out-quint);
  --transition-slow: 1.0s var(--ease-out-quint);
}
```

---

### QUALIDADE EXIGIDA — CHECKLIST

Antes de finalizar, confira:

- [ ] Cursor customizado funcionando em desktop
- [ ] Todos os reveals de scroll funcionando com stagger
- [ ] Nav muda visual ao scrollar
- [ ] Hover nos cards com scale + overlay
- [ ] Counter animado nos números
- [ ] Word reveal no manifesto
- [ ] CTA final com hover animado
- [ ] Mobile responsivo (breakpoint 768px e 480px)
- [ ] Menu mobile funcional (open/close)
- [ ] Fontes carregadas do Google Fonts
- [ ] Nenhum elemento com animação brusca ou desnecessária
- [ ] Paleta de cores consistente em todo o documento
- [ ] Tipografia hierárquica e legível
- [ ] Espaçamentos generosos (não encher)
- [ ] Imagens com object-fit: cover e overflow: hidden nos containers
- [ ] Smooth scroll ativo
- [ ] Performance: sem JavaScript bloqueante

---

### OUTPUT ESPERADO

Entregue **um único arquivo `index.html`** que:
1. Funciona ao abrir no browser sem servidor
2. Carrega fontes do Google Fonts via `<link>`
3. Tem todo CSS dentro de `<style>`
4. Tem todo JS dentro de `<script>` no final do body
5. Usa imagens do Unsplash via URL (sem download)
6. É completamente responsivo
7. Passa no "wow test" — quando aberto, impressiona nos primeiros 3 segundos

**Nível de referência:** oharchitecture.com.au — não menos que isso.

---

*Prompt criado em: Maio 2026*
*Referência: oharchitecture.com.au / MONOLOG Studio*
