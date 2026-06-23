# KV DESIGN SYSTEM — RR Viagens / Rodrigo Ruas
## Referência Visual · Para Editor de Vídeo

> **O que é este doc:** Guia completo da identidade visual (KV) da marca RR Viagens.
> Use como referência para garantir consistência em títulos, overlays, grades de cor,
> ritmo de edição e sentimento geral dos vídeos.

---

## 1. A ALMA DA MARCA

### O que RR Viagens representa visualmente

**Editorial. Minimalista. Confiante.**

O visual da RR Viagens não compete com os destinos — ele serve para emoldurá-los.
A fotografia é protagonista. O design existe para dar contexto, não para chamar atenção.

### Os 4 princípios que guiam tudo

**1. Intenção acima de velocidade**
Cada elemento tem propósito. Se não tem propósito, não existe.
Espaço vazio é escolha criativa — não ausência de conteúdo.

**2. A imagem é a estrela**
Paleta neutra, tipografia discreta, overlays sutis.
O destino deve hipnotizar — o texto só precisa orientar.

**3. Movimento que você sente, não vê**
Nenhuma transição é chamativa. A sofisticação está na sutileza:
easing correto, timing certo, ritmo preciso.
Se o espectador perceber a edição, a edição errou.

**4. Tensão tipográfica**
Serif editorial (display) contra sans-serif limpo (interface) cria elegância sem esforço.
As duas fontes nunca competem — elas se complementam.

---

## 2. PALETA DE CORES

### Cores principais

| Nome | HEX | Uso |
|---|---|---|
| **Off-white quente** | `#FAFAF8` | Fundo de slides, texto sobre escuro, overlays claros |
| **Quase preto** | `#1C1C1A` | Fundo escuro, overlays de imagem, texto principal |
| **Dourado areia** | `#C4A882` | Cor de destaque — títulos especiais, elementos de UI, numerais |
| **Cinza quente** | `#717167` | Texto secundário, labels, legendas |
| **Borda neutra** | `#E8E4DF` | Separadores, linhas decorativas, elementos sutis |

### Como usar as cores em vídeo

- **Grade de cor geral:** levemente quente, nunca fria. Evitar tons azulados ou dessaturados demais.
- **Texto sobre imagem:** sempre em `#FAFAF8` (off-white) ou `#FFFFFF` — nunca amarelo puro.
- **Destaque de copy:** use `#C4A882` (dourado areia) com parcimônia — apenas para o elemento mais importante do frame.
- **Telas de fundo sólido:** preferencialmente `#1C1C1A` (quase preto) ou `#FAFAF8` (off-white).
- **Overlay escuro sobre imagem:** `rgba(28, 28, 26, 0.28)` a `rgba(28, 28, 26, 0.75)` conforme necessidade de leitura.

---

## 3. TIPOGRAFIA

### As duas fontes

**Display / Títulos grandes**
> **Cormorant Garamond** — peso Light (300)
> Usada em: headlines do hero, citações, nomes de destinos, números grandes

**Corpo / Interface**
> **DM Sans** — peso Regular (400) e Medium (500)
> Usada em: labels uppercase, legendas, corpo de texto, CTAs

*Download gratuito: Google Fonts — buscar "Cormorant Garamond" e "DM Sans"*

---

### Hierarquia tipográfica

#### Hero / Headline principal
```
Fonte: Cormorant Garamond Light
Tamanho: muito grande (80–120px equivalente)
Cor: #FAFAF8 sobre escuro / #1C1C1A sobre claro
Espaçamento: tracking +0.02em (levemente aberto)
Linha: 1.05 (compacto — as linhas se tocam quase)
```

Exemplo de copy para hero:
> *"O mundo inteiro.*
> *Sem o estresse*
> *de planejar."*

---

#### Label / Eyebrow (texto pequeno acima do título)
```
Fonte: DM Sans Medium
Tamanho: pequeno (11–13px equivalente)
Cor: #717167 (cinza quente) ou #C4A882 (dourado) para destaque
Texto: SEMPRE UPPERCASE
Tracking: 0.14em (muito aberto — essencial para o estilo)
```

Exemplo:
> *CURADORIA DE EXPERT*

---

#### Citação / Depoimento
```
Fonte: Cormorant Garamond Italic
Tamanho: médio-grande (24–40px equivalente)
Cor: #FAFAF8 sobre fundo escuro
Linha: 1.4
```

Exemplo:
> *"Eu nunca tinha viajado para fora do Brasil.*
> *Com o Rodrigo, fui para o Japão e voltei diferente."*
> — MARIA C., SÃO PAULO

---

#### Números / Stats grandes
```
Fonte: Cormorant Garamond Light
Tamanho: enorme (60–100px equivalente)
Cor: #C4A882 (dourado areia) — os números são o destaque
Label abaixo: DM Sans, uppercase, cinza quente
```

Os 4 números da marca:
- **93** países visitados pessoalmente
- **19+** anos de experiência
- **1.500+** viajantes conduzidos
- **40+** destinos ativos

---

#### Corpo de texto
```
Fonte: DM Sans Regular
Tamanho: confortável para leitura (15–18px equivalente)
Cor: #717167 (cinza quente)
Linha: 1.75 (generoso)
```

---

## 4. RITMO E MOVIMENTO

### Princípio geral
> Tudo entra devagar e sai com intenção.
> Nunca corte seco em elementos de texto — sempre fade ou slide.

### Referência de timing

| Elemento | Duração de entrada | Easing |
|---|---|---|
| Headline principal (hero) | 1.0–1.2s | ease-out forte (desacelera no final) |
| Subtítulo / body | 0.8s | ease-out |
| Label / eyebrow | 0.7s | ease-out |
| CTA / botão | 0.6s | ease-out |
| Cards / imagens | 0.9s | ease-out forte |
| Números (counter) | 2.0s contando de 0 | ease-out suave |

### Stagger entre elementos
Quando múltiplos elementos entram em sequência, use **0.10–0.15s de delay** entre cada um.
Nunca todos ao mesmo tempo — o escalonamento é o que cria elegância.

### Movimento de texto
- Entrada padrão: `opacity 0→1` + `translateY +40px→0` (sobe levemente enquanto aparece)
- Nunca usar `scale` em texto — só em imagens
- Citações/manifestos: revelar **palavra por palavra**, 40ms entre cada palavra

### Parallax em imagens
- Imagens de fundo em movimento: velocidade 20–30% mais lenta que o scroll/câmera
- Cria sensação de profundidade sem chamar atenção

### Transições de cena
- **Fade global:** preferência para transição entre seções/cenas diferentes
- **Não usar:** wipe, push, zoom crash, glitch, flash branco/preto
- **Opcional:** cross-dissolve lento (0.5–0.8s) para sequências de destinos

---

## 5. IMAGENS E FOTOGRAFIA

### O que funciona na grade
- Fotografia de paisagem ampla com horizonte
- Cores quentes: dourado, terracota, areia, verde musgo
- Luz dourada (hora mágica) ou difusa
- Pessoas pequenas no frame (escala humana, não close de rosto)
- Composição com espaço em branco para texto overlay

### O que evitar
- Filtros saturados demais (estilo Instagram antigo)
- Azul frio ou verde néon
- Imagens muito busy / cheias de elementos

### Overlay sobre imagem
- Overlay escuro para legibilidade de texto: `rgba(28,28,26, 0.28–0.75)`
- Gradiente de baixo para cima quando o texto fica no rodapé do frame
- Gradiente de cima para baixo quando o texto fica no topo

---

## 6. TOM DE VOZ E COPY

### Como Rodrigo Ruas se comunica

**Confiante. Editorial. Expert sem arrogância. Humanizado.**

Ele não vende viagem — ele compartilha conhecimento de quem já errou por você.

### Vocabulário da marca

- "Pacotes feitos por um verdadeiro expert"
- "Experiências inesquecíveis e autênticas"
- "Atenção aos detalhes, segurança e autenticidade"
- "Culturas, paisagens e experiências únicas"
- "A equipe que viaja, explora e vive na prática cada destino"

### Headlines prontas para overlay de vídeo

1. *"O mundo inteiro. Sem o estresse de planejar."*
2. *"93 países depois, Rodrigo Ruas abre vagas para te levar junto."*
3. *"Chega no aeroporto. O resto é com a gente."*
4. *"A única agência onde o dono já foi em cada destino que vende."*
5. *"Aquela viagem que você adiou 3 vezes — ela ainda está esperando."*
6. *"Já estive em 93 países. Sei o que vale cada hora, cada hotel, cada rota."*

### CTA padrão
> **"Falar no WhatsApp →"**
> Link: https://wa.me/5511966401489

---

## 7. IDENTIDADE EM RESUMO (1 parágrafo)

RR Viagens é a marca visual de um expert que já viu o mundo — e quer te mostrar o melhor dele. O design é sóbrio e editorial porque o produto é sério: hotéis de primeira, roteiros curados, 19 anos de experiência. A paleta neutra (off-white, quase-preto, dourado areia) nunca compete com as imagens dos destinos. A tipografia mistura a elegância de um serif de revista com a clareza de um sans-serif moderno. O ritmo é lento, deliberado, confiante — nunca apressado. A mensagem é: *você está em boas mãos.*

---

## 8. REFERÊNCIA VISUAL DE MOOD

**Site de referência:** oharchitecture.com.au (MONOLOG Studio)
Use como referência de **nível de sofisticação e ritmo visual** — não de conteúdo.
A lógica é a mesma: design editorial minimalista onde o conteúdo visual é protagonista.

**Outros moodboards:**
- Revistas Monocle, Wallpaper, Condé Nast Traveler
- Sites de hotéis boutique e lodges de luxo
- Fotografia de viagem editorial (não turística)

---

*Design System KV — RR Viagens / Rodrigo Ruas*
*Compilado: Junho 2026 | v1.0*
*Baseado em: 02-prompt-claude-design.md + 03-prompt-claude-design-v2.md*
