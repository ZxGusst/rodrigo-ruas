# PROMPT CLAUDE DESIGN — v2
## RR Viagens × OH Architecture — Nível World-Class

> **Como usar:** Cole este prompt inteiro no Claude (claude.ai ou Claude Code).
> Ele já contém todo o design system, animações GSAP e conteúdo real do Rodrigo Ruas.

---

Você é um designer e desenvolvedor front-end de nível world-class, especializado em experiências digitais editoriais e minimalistas de alto padrão — no nível do estúdio **MONOLOG** (bymonolog.com), responsável pelo site oharchitecture.com.au.

Crie uma **página web completa em um único arquivo `index.html`** para **Rodrigo Ruas / RR Viagens**, igualando a sofisticação técnica e criativa do OH Architecture.

---

## PARTE 1 — O QUE FAZ O OH ARCHITECTURE SER EXCEPCIONAL

Estes são os padrões que você DEVE replicar — não o conteúdo, mas o nível:

### Princípio central: "Intention over speed"
Cada elemento tem propósito. Se não tem propósito, não existe. Espaço em branco agressivo é escolha de design, não falha.

### Fotografia como protagonista
O design desaparece para o visual brilhar. A paleta neutra não compete com as imagens — ela serve para emoldurá-las.

### Animações invisíveis
Você **sente** mas não **vê**. Nenhuma animação é chamativa. A sofisticação está na sutileza: easing correto, timing certo, stagger preciso.

### Tensão tipográfica
Serif editorial (display) contra sans-serif limpo (interface) cria elegância sem esforço.

---

## PARTE 2 — DESIGN SYSTEM COMPLETO

### Paleta de Cores

```css
:root {
  --bg:           #FAFAF8;  /* off-white quente — fundo principal */
  --bg-dark:      #1C1C1A;  /* quase preto — seções de contraste */
  --text:         #1C1C1A;  /* texto primário */
  --text-muted:   #717167;  /* texto secundário, labels */
  --accent:       #C4A882;  /* dourado areia — remete a viagem, destinos */
  --border:       #E8E4DF;  /* borda sutil */
  --white:        #FFFFFF;
}
```

### Sistema Tipográfico Completo

**Fontes (Google Fonts — gratuitas):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

```css
:root {
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'DM Sans', -apple-system, sans-serif;
}

/* HIERARQUIA TIPOGRÁFICA COMPLETA */
/* H1 — Hero headline */
.t-hero {
  font-family: var(--font-display);
  font-size: clamp(56px, 9vw, 120px);
  font-weight: 300;           /* Light — elegância vem da leveza */
  line-height: 1.05;
  letter-spacing: 0.02em;
}

/* H2 — Títulos de seção */
.t-section-title {
  font-family: var(--font-display);
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: 0.01em;
}

/* H3 — Sub-headlines */
.t-sub {
  font-family: var(--font-display);
  font-size: clamp(22px, 2.5vw, 32px);
  font-weight: 400;
  line-height: 1.3;
}

/* Label / eyebrow — UPPERCASE pequeno acima dos títulos */
.t-label {
  font-family: var(--font-body);
  font-size: clamp(11px, 1vw, 13px);
  font-weight: 500;
  letter-spacing: 0.14em;     /* tracking largo — essencial */
  text-transform: uppercase;
}

/* Body text */
.t-body {
  font-family: var(--font-body);
  font-size: clamp(15px, 1.2vw, 18px);
  font-weight: 400;
  line-height: 1.75;           /* generoso — facilita leitura */
  color: var(--text-muted);
}

/* Nav */
.t-nav {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.01em;
}

/* Número grande (stats) */
.t-stat {
  font-family: var(--font-display);
  font-size: clamp(60px, 8vw, 100px);
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.01em;
}

/* Quote / depoimento */
.t-quote {
  font-family: var(--font-display);
  font-size: clamp(24px, 3vw, 40px);
  font-style: italic;
  font-weight: 300;
  line-height: 1.4;
}
```

### Sistema de Espaçamento e Layout

```css
:root {
  --gutter:     clamp(24px, 6vw, 80px);   /* margem lateral responsiva */
  --max-width:  1440px;

  --space-xs:   0.5rem;    /* 8px */
  --space-sm:   1rem;      /* 16px */
  --space-md:   2rem;      /* 32px */
  --space-lg:   4rem;      /* 64px */
  --space-xl:   8rem;      /* 128px */
  --space-2xl:  14rem;     /* 224px — entre seções */

  /* Easing customizado — o "segredo" das animações elegantes */
  --ease-out-quint:  cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);
  --ease-expo:       cubic-bezier(0.16, 1, 0.3, 1);

  --transition-fast:   0.25s var(--ease-in-out);
  --transition-medium: 0.65s var(--ease-out-quint);
  --transition-slow:   1.1s  var(--ease-out-quint);
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--gutter);
}
```

---

## PARTE 3 — ANIMAÇÕES COM GSAP

**Carregue via CDN (no `<head>`):**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

### A. Cursor Customizado (GSAP lerp)

```javascript
// HTML necessário:
// <div class="cursor" id="cursor"></div>
// <div class="cursor-follower" id="cursor-follower"></div>

gsap.set("#cursor", { xPercent: -50, yPercent: -50 });
gsap.set("#cursor-follower", { xPercent: -50, yPercent: -50 });

let posX = 0, posY = 0;
let mouseX = 0, mouseY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to("#cursor", { x: mouseX, y: mouseY, duration: 0.1 });
});

gsap.ticker.add(() => {
  posX += (mouseX - posX) * 0.12;  // lerp fator 0.12 — lag suave
  posY += (mouseY - posY) * 0.12;
  gsap.set("#cursor-follower", { x: posX, y: posY });
});

// Hover em links e cards: cursor cresce
document.querySelectorAll("a, .card, button").forEach(el => {
  el.addEventListener("mouseenter", () => {
    gsap.to("#cursor-follower", { scale: 2.5, duration: 0.4, ease: "power2.out" });
    gsap.to("#cursor", { opacity: 0, duration: 0.2 });
  });
  el.addEventListener("mouseleave", () => {
    gsap.to("#cursor-follower", { scale: 1, duration: 0.4, ease: "power2.out" });
    gsap.to("#cursor", { opacity: 1, duration: 0.2 });
  });
});
```

```css
.cursor {
  position: fixed;
  width: 8px;
  height: 8px;
  background: var(--text);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
}
.cursor-follower {
  position: fixed;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(28,28,26,0.4);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
}
```

### B. Scroll Reveal com GSAP ScrollTrigger

```javascript
gsap.registerPlugin(ScrollTrigger);

// Adicione data-reveal="true" nos elementos que devem aparecer no scroll
// Stagger automático para grupos com data-reveal-group

document.querySelectorAll("[data-reveal]").forEach((el, i) => {
  const delay = parseFloat(el.dataset.delay || 0) / 1000;

  gsap.fromTo(el,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1.0,
      delay: delay,
      ease: "power4.out",          // equivale ao ease-out-quint
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none"
      }
    }
  );
});

// Grupos com stagger (adicione data-reveal-group no wrapper)
document.querySelectorAll("[data-reveal-group]").forEach(group => {
  const children = group.children;
  gsap.fromTo(children,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.12,               // 0.12s entre cada filho — padrão MONOLOG
      ease: "power4.out",
      scrollTrigger: {
        trigger: group,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    }
  );
});
```

### C. Word Reveal — Seção Manifesto

```javascript
// Quebra o texto em palavras e revela sequencialmente
function wordReveal(selector) {
  const el = document.querySelector(selector);
  if (!el) return;

  const words = el.innerText.split(" ");
  el.innerHTML = words
    .map(w => `<span class="word-wrap"><span class="word">${w}</span></span>`)
    .join(" ");

  gsap.fromTo(`${selector} .word`,
    { y: "100%", opacity: 0 },
    {
      y: "0%",
      opacity: 1,
      duration: 0.8,
      stagger: 0.04,               // 40ms por palavra — rápido e fluido
      ease: "power3.out",
      scrollTrigger: {
        trigger: selector,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    }
  );
}

wordReveal(".manifesto-text");
```

```css
.word-wrap {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
}
.word {
  display: inline-block;
}
```

### D. Hero — Reveal no Load + Parallax Sutil

```javascript
// Sequência de entrada do hero (executa direto, sem ScrollTrigger)
const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });

heroTl
  .fromTo(".hero-label",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8 },
    0.4
  )
  .fromTo(".hero-title",
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1.1 },
    0.6
  )
  .fromTo(".hero-sub",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8 },
    0.9
  )
  .fromTo(".hero-cta",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7 },
    1.1
  );

// Parallax sutil na imagem do hero
gsap.to(".hero-img", {
  yPercent: 25,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});
```

### E. Counter Animado — Seção Stats

```javascript
document.querySelectorAll("[data-count]").forEach(el => {
  const target = parseInt(el.dataset.count);

  ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    once: true,
    onEnter: () => {
      gsap.to({ val: 0 }, {
        val: target,
        duration: 2,
        ease: "power2.out",
        onUpdate: function() {
          el.textContent = Math.round(this.targets()[0].val).toLocaleString("pt-BR");
        },
        onComplete: () => {
          el.textContent = el.dataset.suffix
            ? target + el.dataset.suffix
            : target.toLocaleString("pt-BR");
        }
      });
    }
  });
});
```

### F. Hover nos Cards de Destino

```css
/* CSS — overflow: hidden no container é essencial */
.destination-card {
  overflow: hidden;
  cursor: none;     /* usa cursor customizado */
}
.destination-card .card-img {
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
.destination-card:hover .card-img {
  transform: scale(1.05);
}
.destination-card .card-overlay {
  opacity: 0;
  transition: opacity 0.45s ease;
}
.destination-card:hover .card-overlay {
  opacity: 1;
}
```

### G. Nav — Scroll Behavior + Underline Animado

```javascript
ScrollTrigger.create({
  start: "top -80px",
  onUpdate: self => {
    document.querySelector("nav").classList.toggle("nav--scrolled", self.progress > 0);
  }
});
```

```css
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 24px var(--gutter);
  transition: background 0.4s ease, backdrop-filter 0.4s ease;
}
nav.nav--scrolled {
  background: rgba(250, 250, 248, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
}

/* Underline animado nos links */
.nav-link {
  position: relative;
  text-decoration: none;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 0; height: 1px;
  background: var(--text);
  transition: width 0.35s var(--ease-out-quint);
}
.nav-link:hover::after {
  width: 100%;
}
```

---

## PARTE 4 — ESTRUTURA COMPLETA DA PÁGINA

### SEÇÃO 1 — NAV
```
Logo: "RR" tipográfico à esquerda
Links: Destinos | Sobre | Processo | Galeria  (centro)
CTA: "Quero Viajar →"  (direita — borda, sem fill)
Mobile: hamburguer → overlay fullscreen com links grandes + stagger GSAP
```

### SEÇÃO 2 — HERO (100vh)
```
Imagem fullscreen com parallax sutil (GSAP scrub)
Overlay: rgba(0,0,0,0.28)
Posição do texto: canto inferior esquerdo (mais editorial que centralizado)

[Label] "Curadoria de Expert" — uppercase 13px tracking 0.14em
[H1]   "O mundo inteiro.
        Sem o estresse
        de planejar."              — Cormorant Light 80-120px
[Sub]  "Curado por quem já viajou 93 países."  — DM Sans 18px
[CTA]  "Ver destinos →"

Scroll indicator: "scroll" ou seta pulsando no bottom center
```

### SEÇÃO 3 — DESTINOS EM DESTAQUE (Grid Assimétrico)
```
Eyebrow: "Destinos"
Título: "Onde você quer ir?"

Grid — 2 linhas alternadas:
  Linha 1: [Card 62%] gap [Card 36%]
  Linha 2: [Card 36%] gap [Card 62%]

Cada card: imagem + overlay escuro + nome do destino + "X dias"
Hover: scale(1.05) na imagem + overlay com nome maior

Destinos para usar:
  Turquia 10 dias  — photo-1524231757912-21f4fe3a7200
  Grécia 10 dias   — photo-1555993539-1732b0258235
  Japão 12 dias    — photo-1540959733332-eab4deabeeaf
  Egito 10 dias    — photo-1539650116574-75c0c6d73f6e
```

### SEÇÃO 4 — MANIFESTO (Fundo Escuro)
```
Background: #1C1C1A
Fonte: Cormorant Light, branco, 48-72px
Word reveal com GSAP (cada palavra entra sequencialmente)

Texto:
  "Já estive em 93 países.
   Sei o que vale cada hora,
   cada hotel, cada rota."
   — Rodrigo Ruas

Sub: "19 anos de estrada. 1.500 viajantes levados. Uma missão."
     DM Sans, cinza claro, 16px
```

### SEÇÃO 5 — PROCESSO (3 Passos)
```
Eyebrow: "O processo"
Título: "Simples assim."

3 colunas numeradas (data-reveal-group para stagger):
  01   Escolha seu destino
       Mais de 40 países com saídas programadas.

  02   Fale com a equipe
       WhatsApp direto. Sem chatbot, sem fila.

  03   Apareça no aeroporto
       O resto é com a gente.

Número "01, 02, 03": Cormorant 80px, accent color #C4A882
Título: DM Sans Medium
Body: DM Sans Regular, muted
```

### SEÇÃO 6 — PROVA SOCIAL (Números)
```
Grid 2×2, fundo off-white

  93              19+
  países          anos de experiência

  1.500+          40+
  viajantes       destinos ativos

Número: data-count="93" data-suffix="+" — counter GSAP de 0 até o valor
Número: Cormorant Light 80-100px, var(--accent)
Label: DM Sans 14px uppercase tracking largo, muted
```

### SEÇÃO 7 — DEPOIMENTO
```
Fundo: imagem de destino + overlay rgba(28,28,26,0.75)
Texto: branco

[Quote Cormorant Italic 32-40px]
"Eu nunca tinha viajado para fora do Brasil.
 Com o Rodrigo, fui para o Japão e voltei diferente."

[Autor DM Sans 14px uppercase tracking]
— MARIA C., SÃO PAULO

Sem carrossel. Uma citação. Máximo impacto.
```

### SEÇÃO 8 — CTA FINAL
```
Background: #C4A882 (dourado areia)
Texto escuro

Título: "Sua próxima viagem começa aqui."
Sub: "Vagas limitadas por grupo. Reserve sua consulta gratuita."

Botão: fundo #1C1C1A, texto branco, "Falar no WhatsApp →"
Hover: fill da esquerda para direita (clip-path ou pseudo-element)
Link: https://wa.me/5511966401489
```

### SEÇÃO 9 — FOOTER
```
Background: #1C1C1A

3 colunas:
  Esquerda: Logo "RR" + "Pacotes pelo Mundo"
  Centro: Destinos | Sobre | Processo | WhatsApp
  Direita: @rodrigoruas | contato@rrviagens.com.br

Bottom bar:
  "© 2025 RR Viagens — CNPJ 52.437.341/0001-22" | "Feito com ♥ no Brasil"
```

---

## PARTE 5 — CHECKLIST DE QUALIDADE

Antes de entregar, confirme cada item:

**Animações GSAP:**
- [ ] Cursor customizado com lerp funcionando em desktop
- [ ] ScrollTrigger ativo em todos os reveals
- [ ] Stagger de 0.12s nos grupos (data-reveal-group)
- [ ] Word reveal no manifesto (cada palavra separada)
- [ ] Hero reveal sequencial no load (timeline GSAP)
- [ ] Counter animado nos números (de 0 ao valor)
- [ ] Parallax sutil na imagem do hero
- [ ] Nav muda ao scrollar (backdrop-blur + border)

**Tipografia:**
- [ ] Cormorant Garamond Light nos display/hero (weight 300)
- [ ] DM Sans nos labels uppercase com letter-spacing 0.14em
- [ ] Hierarquia clara: hero > seção > sub > body > label
- [ ] Line-height 1.75 no body text

**Layout:**
- [ ] Grid assimétrico nos destinos (62/36, invertido na segunda linha)
- [ ] Gutter responsivo com clamp()
- [ ] Padding entre seções: 120-200px
- [ ] overflow: hidden em todos os containers de imagem

**Hover:**
- [ ] scale(1.05) nas imagens dos cards
- [ ] Underline animado nos links do nav (CSS, width 0→100%)
- [ ] Botão CTA com fill animado no hover

**Responsivo:**
- [ ] Breakpoint 768px: grid vira coluna única
- [ ] Breakpoint 480px: tipografia reduzida (clamp já cuida)
- [ ] Menu mobile: hamburguer → overlay com links grandes
- [ ] Cursor customizado: desativado em touch/mobile

**Performance:**
- [ ] Fontes com `display=swap`
- [ ] Imagens com `loading="lazy"` (exceto hero)
- [ ] GSAP CDN no head (não bloqueia render)
- [ ] `will-change: transform` apenas onde há animação

---

## PARTE 6 — CONTEÚDO REAL (Copiar direto)

### Credenciais do Rodrigo Ruas
- 93 países visitados pessoalmente (programa de TV)
- 19 anos de experiência na estrada
- Desde 2019 organizando grupos estruturados
- Mais de 1.500 viajantes conduzidos
- 141+ roteiros ativos em todos os continentes
- Instagram: @rodrigoruas
- CNPJ: 52.437.341/0001-22

### Frases do vocabulário dele
- "Pacotes feitos por um verdadeiro expert"
- "Experiências inesquecíveis e autênticas"
- "Atenção aos detalhes, segurança e autenticidade"
- "A equipe que viaja, explora e vive na prática cada destino"
- "Culturas, paisagens e experiências únicas"

### Headlines testadas para usar
- "93 países depois, Rodrigo Ruas abre vagas para te levar junto"
- "Chega no aeroporto. O resto é com a gente."
- "A única agência onde o dono já foi em cada destino que vende"
- "Aquela viagem que você adiou 3 vezes — ela ainda está esperando por você"

### Proposta de valor central
> "Viajar para qualquer lugar do mundo com segurança, conforto e a curadoria de quem já foi em 93 países — sem precisar planejar nada."

### WhatsApp CTA
Link: `https://wa.me/5511966401489`
Texto: "Falar no WhatsApp →"

---

## OUTPUT ESPERADO

Entregue **um único arquivo `index.html`** que:
1. Abre no browser sem servidor
2. Carrega GSAP 3.12 + ScrollTrigger via CDN
3. Carrega Cormorant Garamond + DM Sans via Google Fonts
4. Tem todo CSS dentro de `<style>`
5. Tem todo JS dentro de `<script>` no final do body
6. Usa imagens Unsplash via URL direta
7. É completamente responsivo (mobile-first)
8. Passa no "wow test" — impressiona nos primeiros 3 segundos

**Nível de referência:** oharchitecture.com.au — não menos que isso.

---

*Prompt v2 — Maio 2026*
*Referência: oharchitecture.com.au / MONOLOG Studio*
*Conteúdo: Rodrigo Ruas & RR Viagens*
