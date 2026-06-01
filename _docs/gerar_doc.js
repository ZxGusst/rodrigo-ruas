const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  PageNumber, Header, Footer, ExternalHyperlink, LevelFormat, PageBreak,
  VerticalAlign,
} = require("docx");
const fs = require("fs");

const BLUE = "1B4F8C";
const LIGHT_BLUE = "D0E4F7";
const DARK = "1A1A2E";
const GRAY = "555555";
const WHITE = "FFFFFF";
const LIGHT_GRAY = "F5F7FA";

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: false,
    spacing: { before: 400, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BLUE, space: 6 } },
    children: [
      new TextRun({ text, bold: true, size: 36, color: BLUE, font: "Arial" }),
    ],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 120 },
    children: [
      new TextRun({ text, bold: true, size: 28, color: DARK, font: "Arial" }),
    ],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({ text, bold: true, size: 24, color: BLUE, font: "Arial" }),
    ],
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [
      new TextRun({
        text,
        size: 22,
        font: "Arial",
        color: opts.color || DARK,
        bold: opts.bold || false,
        italics: opts.italic || false,
      }),
    ],
  });
}

function bullet(text, bold = false) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial", color: DARK, bold })],
  });
}

function numbered(text) {
  return new Paragraph({
    numbering: { reference: "numbers", level: 0 },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial", color: DARK })],
  });
}

function spacer() {
  return new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun("")] });
}

function infoRow(label, value) {
  return new TableRow({
    children: [
      new TableCell({
        borders,
        width: { size: 2800, type: WidthType.DXA },
        shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, font: "Arial", color: BLUE })] })],
      }),
      new TableCell({
        borders,
        width: { size: 6560, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, font: "Arial", color: DARK })] })],
      }),
    ],
  });
}

function priceTable(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3120, 3120, 3120],
    rows: [
      new TableRow({
        children: ["Pacote / Destino", "Modalidade", "Valor"].map(h => new TableCell({
          borders,
          width: { size: 3120, type: WidthType.DXA },
          shading: { fill: BLUE, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, bold: true, color: WHITE, size: 20, font: "Arial" })] })],
        })),
      }),
      ...rows.map(([pacote, modalidade, valor], i) => new TableRow({
        children: [pacote, modalidade, valor].map(cell => new TableCell({
          borders,
          width: { size: 3120, type: WidthType.DXA },
          shading: { fill: i % 2 === 0 ? LIGHT_GRAY : WHITE, type: ShadingType.CLEAR },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: cell, size: 19, font: "Arial", color: DARK })] })],
        })),
      })),
    ],
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
      {
        reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
    ],
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: BLUE },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: DARK },
        paragraph: { spacing: { before: 320, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: BLUE },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
    ],
  },
  sections: [
    // ===================== CAPA =====================
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        spacer(), spacer(), spacer(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 120 },
          children: [new TextRun({ text: "DOCUMENTO DA VERDADE", bold: true, size: 52, color: BLUE, font: "Arial" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 200 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: BLUE, space: 8 } },
          children: [new TextRun({ text: "Rodrigo Ruas & RR Viagens", bold: true, size: 36, color: DARK, font: "Arial" })],
        }),
        spacer(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 80 },
          children: [new TextRun({ text: "Produto: Pacotes de Viagem Curados por Expert", size: 26, color: GRAY, font: "Arial", italics: true })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text: "Site: pacotespelomundo.com.br", size: 22, color: GRAY, font: "Arial" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text: "Instagram: @rodrigoruas", size: 22, color: GRAY, font: "Arial" })],
        }),
        spacer(), spacer(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 80 },
          children: [new TextRun({ text: "Versao 1.0 | Maio 2026", size: 20, color: GRAY, font: "Arial", italics: true })],
        }),
        new Paragraph({ children: [new PageBreak()] }),
      ],
    },
    // ===================== CONTEUDO =====================
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, right: 1440, bottom: 1080, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE, space: 4 } },
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "DOCUMENTO DA VERDADE | Rodrigo Ruas & RR Viagens", size: 16, color: GRAY, font: "Arial" })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 4 } },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Pagina ", size: 16, color: GRAY, font: "Arial" }),
              new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GRAY, font: "Arial" }),
              new TextRun({ text: " | Uso interno - Confidencial", size: 16, color: GRAY, font: "Arial" }),
            ],
          })],
        }),
      },
      children: [

        // ---- 1. QUEM E RODRIGO RUAS ----
        h1("1. Quem e Rodrigo Ruas"),

        h2("Perfil Pessoal e Profissional"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2800, 6560],
          rows: [
            infoRow("Nome", "Rodrigo Ruas"),
            infoRow("Ocupacao", "Viajante profissional, apresentador televisivo e empreendedor"),
            infoRow("Experiencia", "Mais de 19 anos de experiencia pelo mundo"),
            infoRow("Paises visitados", "93 paises (gravou programa de viagens em todos)"),
            infoRow("Desde quando organiza grupos", "2019 (6 anos a frente da agencia em 2025)"),
            infoRow("Viajantes conduzidos", "Mais de 1.500 viajantes ate o momento"),
            infoRow("Instagram", "@rodrigoruas"),
            infoRow("WhatsApp comercial", "(11) 96640-1489"),
          ],
        }),

        spacer(),
        h2("Credenciais e Autoridade"),
        bullet("Apresentador televisivo reconhecido internacionalmente"),
        bullet("Gravou programa de viagens em 93 paises — cobrindo culturas, paisagens e experiencias unicas"),
        bullet("Mais de 19 anos de experiencia pratica como viajante profissional"),
        bullet("Fundador e curador da RR Viagens desde 2019"),
        bullet("Ja levou mais de 1.500 brasileiros para seus destinos sonhados"),
        bullet("Equipe que viaja, explora e vive na pratica cada destino antes de oferece-lo"),

        spacer(),
        h2("Proposta de Valor Pessoal"),
        p("Rodrigo Ruas nao e apenas um agente de viagens — ele e um expert que ja esteve pessoalmente em cada destino que vende. Sua autoridade vem da experiencia real, nao de catalogos. Ele usa sua rede de contatos, seu conhecimento editorial (de apresentador de TV) e sua paixao genuina para criar roteiros que vao alem do turistico convencional."),

        spacer(),
        new Paragraph({ children: [new PageBreak()] }),

        // ---- 2. A EMPRESA ----
        h1("2. A Empresa — RR Viagens / Pacotes pelo Mundo"),

        h2("Dados da Empresa"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2800, 6560],
          rows: [
            infoRow("Nome comercial", "RR Viagens / Pacotes pelo Mundo"),
            infoRow("Razao social", "BUENO ALVES PRODUCOES LTDA"),
            infoRow("CNPJ", "52.437.341/0001-22"),
            infoRow("Site", "pacotespelomundo.com.br"),
            infoRow("WhatsApp", "(11) 96640-1489"),
            infoRow("Total de roteiros", "Mais de 141 rotas ativas com saidas em 2025 e 2026"),
          ],
        }),

        spacer(),
        h2("Missao"),
        p("Compartilhar a paixao por viagens atraves de grupos cuidadosamente planejados, proporcionando experiencias inesqueciveis e autenticas a cada viajante."),

        spacer(),
        h2("Valores e Metodo"),
        bullet("Atencao aos detalhes em cada roteiro — nada e deixado ao acaso"),
        bullet("Seguranca como prioridade maxima"),
        bullet("Autenticidade — experiencias genuinas, alem do turistico de massa"),
        bullet("Curadoria exclusiva do fundador em cada pacote"),
        bullet("Equipe vivencial — colaboradores que testam destinos pessoalmente"),
        bullet("Solucoes personalizadas baseadas na necessidade de cada viajante"),

        spacer(),
        new Paragraph({ children: [new PageBreak()] }),

        // ---- 3. LINHA DE PRODUTOS ----
        h1("3. Linha de Produtos e Servicos"),

        h2("Visao Geral"),
        p("A RR Viagens oferece tres grandes categorias de produtos, atendendo desde quem quer a experiencia maxima com o Rodrigo ate quem busca pacotes mais economicos em grupo:"),

        spacer(),
        h3("CATEGORIA 1 — Pacotes Assinados por Rodrigo Ruas (Premium)"),
        p("O produto TOPO de linha. Sao pacotes com a assinatura e curadoria direta de Rodrigo Ruas. Podem incluir sua presenca ou a de sua equipe de confianca. Voltados para quem quer a experiencia RR completa."),
        bullet("Saidas a datas especificas ao longo do ano"),
        bullet("Destinos minuciosamente selecionados pelo Rodrigo"),
        bullet("Hospedagem em hoteis de primeira categoria"),
        bullet("Guia em portugues do inicio ao fim"),
        bullet("Grupos pequenos e curados"),
        bullet("Incluem experiencias gastronomicas e culturais exclusivas"),

        spacer(),
        new Paragraph({
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text: "Exemplos de destinos nesta categoria:", bold: true, size: 22, font: "Arial", color: DARK })],
        }),
        bullet("Turquia (Istambul + Capadocia) — Jun/2025"),
        bullet("Egito (Cairo + cruzeiro no Nilo) — Mar/2026"),
        bullet("Grecia (Atenas + Mykonos + Santorini) — Mai/2026"),
        bullet("Dubai — Abr/2025"),
        bullet("Tailandia — Mar/2025"),
        bullet("Turquia + Grecia — Jun/2025"),

        spacer(),
        h3("CATEGORIA 2 — Grupos Regulares de Brasileiros pelo Mundo (GBM)"),
        p("Grupos de viajantes brasileiros organizados com roteiros pre-definidos e saidas multiplas ao longo do ano. Excelente custo-beneficio mantendo alto padrao de qualidade."),
        bullet("Multiplas saidas durante o ano por destino"),
        bullet("Guia brasileiro desde o embarque ate o desembarque no Brasil"),
        bullet("Hospedagem em hoteis primeira categoria"),
        bullet("Cafe da manha em buffet + refeicoes programadas"),
        bullet("Servico de maleteiros incluso (1 mala por pessoa)"),
        bullet("Acompanhamento completo durante toda a viagem"),

        spacer(),
        new Paragraph({
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text: "Exemplos de roteiros GBM:", bold: true, size: 22, font: "Arial", color: DARK })],
        }),
        bullet("Duas Irlandas e Escocia (16 dias)"),
        bullet("O Exotico Marrocos Imperial + Madri (15 dias)"),
        bullet("Ensolaradas Ilhas Gregas"),
        bullet("Africa do Sul"),
        bullet("Costa Leste/Oeste Canadense"),
        bullet("Dinamarca, Noruega, Suecia e Finlandia"),
        bullet("Coreia do Sul e Taiwan"),
        bullet("Arábia Saudita e Bahrain"),
        bullet("Andaluzia, Costa do Sol e Barcelona"),
        bullet("Kosovo, Albania, Macedonia e Grecia"),
        bullet("Armenia, Georgia e Azerbaijao"),
        bullet("Rota do Country, Blues e Jazz (EUA)"),

        spacer(),
        h3("CATEGORIA 3 — Pacotes Privativos (Assinados)"),
        p("Viagens privativas com saidas a qualquer data do ano — maximo de flexibilidade para casais, familias ou grupos de amigos."),
        bullet("Saida em qualquer data do ano"),
        bullet("Roteiro totalmente customizavel"),
        bullet("Privativo — exclusivo para o seu grupo"),
        bullet("Atendimento personalizado"),

        spacer(),
        new Paragraph({
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text: "Destinos disponiveis para formato privativo:", bold: true, size: 22, font: "Arial", color: DARK })],
        }),
        bullet("America do Sul: Santiago/Atacama, Lima/Cusco/Machu Picchu, Buenos Aires/Ushuaia"),
        bullet("Asia: Japao, Coreia do Sul, Tailandia"),
        bullet("Europa: Inglaterra, Escocia, Croacia, Eslovenia, Italia (Puglia, Toscana, Costa Amalfitana)"),
        bullet("Outros: Dubai, Grecia (Atenas/Miconos/Santorini), Turquia, Africa do Sul"),

        spacer(),
        new Paragraph({ children: [new PageBreak()] }),

        // ---- 4. ESTRUTURA DOS PACOTES ----
        h1("4. Estrutura dos Pacotes — O que Inclui e o que nao Inclui"),

        h2("O que normalmente esta INCLUIDO"),
        bullet("Hospedagem em hoteis de primeira categoria (5 estrelas em alguns roteiros)"),
        bullet("Voos internacionais e domesticos/regionais (na opcao 'com aereo')"),
        bullet("Traslados aeroporto/hotel durante todo o roteiro"),
        bullet("Guia brasileiro desde o embarque no Brasil ate o desembarque"),
        bullet("Refeicoes conforme roteiro: cafes da manha em buffet + refeicoes programadas"),
        bullet("Servico de maleteiros — 1 mala despachada por pessoa inclusa"),
        bullet("Passeios e entradas nas atracoes do itinerario"),
        bullet("Passeios de barco/ferry quando previstos no roteiro"),
        bullet("Taxas de embarque aeroportuarias (quando aereo incluso)"),
        bullet("Em alguns roteiros: gorjetas de maleteiros e garcons ja inclusas"),
        bullet("Vistos de entrada quando especificados (ex: Egito)"),

        spacer(),
        h2("O que normalmente NAO esta incluido"),
        bullet("Refeicoes em dias livres (quando nao previstas no roteiro)"),
        bullet("Atividades opcionais (ex: passeio de balao na Capadocia ~EUR 330/pessoa)"),
        bullet("Gorjeta do guia (sugestao: ~U$5/dia/pessoa)"),
        bullet("Despesas pessoais e compras"),
        bullet("Bebidas em refeicoes nao inclusas"),
        bullet("Seguro viagem (recomendado mas nao incluso)"),
        bullet("Passagem aerea internacional na opcao 'sem aereo'"),

        spacer(),
        h2("Forma de Pagamento"),
        bullet("Entrada + parcelas mensais (varia por pacote: 6x a 10x)"),
        bullet("Alguns pacotes tem valores em USD, outros em EUR, outros em BRL"),
        bullet("Cambio conforme data do fechamento do contrato"),
        bullet("Opcoes com aéreo e sem aereo para a maioria dos destinos"),

        spacer(),
        new Paragraph({ children: [new PageBreak()] }),

        // ---- 5. PRECOS ----
        h1("5. Tabela de Precos — Exemplos de Pacotes"),

        p("Os valores abaixo sao referencias extraidas das paginas de cada pacote. O cambio pode variar conforme data de fechamento."),
        spacer(),

        priceTable([
          ["Turquia — Jun/2025 (10 dias)", "Com aereo (entrada)", "R$ 10.100,00"],
          ["Turquia — Jun/2025 (10 dias)", "Parcelamento", "10x R$ 3.951,71"],
          ["Marrocos + Madri — Mar/2026 (15 dias)", "Com aereo (entrada)", "USD 794,70"],
          ["Marrocos + Madri — Mar/2026 (15 dias)", "Com aereo (parcelas)", "6x USD 1.192,05"],
          ["Marrocos + Madri — Mar/2026 (15 dias)", "Sem aereo (entrada)", "USD 640,80"],
          ["Marrocos + Madri — Mar/2026 (15 dias)", "Sem aereo (parcelas)", "6x USD 961,20"],
          ["2 Irlandas e Escocia — Set/2025 (16 dias)", "Com aereo (entrada)", "USD 1.215,00"],
          ["2 Irlandas e Escocia — Set/2025 (16 dias)", "Com aereo (parcelas)", "6x USD 1.822,50"],
          ["2 Irlandas e Escocia — Set/2025 (16 dias)", "Sem aereo (entrada)", "USD 1.040,50"],
          ["2 Irlandas e Escocia — Set/2025 (16 dias)", "Sem aereo (parcelas)", "6x USD 1.560,75"],
          ["Egito — Mar/2026 (10 dias)", "Com aereo (entrada)", "USD 2.300,00"],
          ["Egito — Mar/2026 (10 dias)", "Com aereo (parcelas)", "7x USD 685,00"],
          ["Egito — Mar/2026 (10 dias)", "Sem aereo (entrada)", "USD 2.300,00"],
          ["Egito — Mar/2026 (10 dias)", "Sem aereo (parcelas)", "7x USD 514,00"],
          ["Grecia/Mykonos/Santorini — Mai/2026 (10 dias)", "Com aereo (TOTAL)", "EUR 8.100,00"],
          ["Grecia/Mykonos/Santorini — Mai/2026 (10 dias)", "Sem aereo (TOTAL)", "EUR 7.000,00"],
        ]),

        spacer(),
        p("NOTA: A maioria dos pacotes e vendida por quarto duplo/pessoa. Existe opcao para quarto single com acrescimo. Valores sujeitos a alteracao — sempre confirmar via WhatsApp.", { italic: true, color: GRAY }),

        spacer(),
        new Paragraph({ children: [new PageBreak()] }),

        // ---- 6. DESTINOS ----
        h1("6. Portfolio Completo de Destinos"),

        p("A RR Viagens opera mais de 141 roteiros cobrindo todos os continentes habitados:"),
        spacer(),

        h3("America do Norte"),
        bullet("Canada — Costa Leste (ex: Toronto, Ottawa, Quebec, Montreal)"),
        bullet("Canada — Costa Oeste (ex: Vancouver, Banff, Calgary)"),
        bullet("EUA — Grand Teton e Yellowstone"),
        bullet("EUA — Custer Park e California"),
        bullet("EUA — Rota do Country, Blues e Jazz"),

        spacer(),
        h3("America Central"),
        bullet("Mexico"),
        bullet("Colombia e Panama"),

        spacer(),
        h3("America do Sul"),
        bullet("Argentina — Buenos Aires e Ushuaia"),
        bullet("Peru — Lima, Cusco e Machu Picchu / O Melhor do Peru"),
        bullet("Chile — Santiago e Atacama"),
        bullet("Argentina — Mendoza e Salta"),

        spacer(),
        h3("Europa"),
        bullet("Portugal — Grande viagem pela Peninsula Iberica"),
        bullet("Espanha — Andaluzia, Costa do Sol e Barcelona"),
        bullet("Franca e Italia"),
        bullet("Inglaterra e Escocia"),
        bullet("Duas Irlandas e Escocia"),
        bullet("Suica, Alemanha e Austria"),
        bullet("Paises Balticos"),
        bullet("Grecia — Ilhas Gregas / Atenas, Mykonos, Santorini"),
        bullet("Turquia — Istambul e Capadocia"),
        bullet("Balcas — Servia, Bosnia, Croacia, Montenegro, Albania, Kosovo"),
        bullet("Kosovo, Albania, Macedonia e Grecia"),
        bullet("Dinamarca, Noruega, Suecia e Finlandia"),
        bullet("Armenia, Georgia e Azerbaijao"),

        spacer(),
        h3("Asia"),
        bullet("Japao"),
        bullet("Coreia do Sul e Taiwan"),
        bullet("Tailandia — multiplos roteiros"),
        bullet("Vietna, Laos e Camboja"),
        bullet("Indonesia e Singapura"),
        bullet("India e Nepal"),
        bullet("Sri Lanka e Maldivas"),
        bullet("Cazaquistao, Quirguistao e Uzbequistao"),
        bullet("China"),

        spacer(),
        h3("Oriente Medio"),
        bullet("Dubai (EAU)"),
        bullet("Arabia Saudita e Bahrain"),
        bullet("Turquia (tambem listada em Europa pelo roteiro)"),

        spacer(),
        h3("Africa"),
        bullet("Marrocos — O Exotico Marrocos Imperial"),
        bullet("Tunísia"),
        bullet("Africa do Sul"),
        bullet("Egito — Cairo, Cruzeiro no Nilo, Piramides"),
        bullet("Quenia e Tanzania (safari)"),

        spacer(),
        h3("Oceania"),
        bullet("Australia"),
        bullet("Nova Zelandia"),

        spacer(),
        new Paragraph({ children: [new PageBreak()] }),

        // ---- 7. DIFERENCIAIS ----
        h1("7. Diferenciais Competitivos"),

        h2("Por que escolher a RR Viagens?"),

        numbered("EXPERT REAL — Rodrigo tem 19+ anos de experiencia e ja visitou 93 paises. Ele nao vende o que nao conhece."),
        numbered("AUTORIDADE DE TV — Como apresentador de programa de viagens, ele tem visao editorial e narrativa que transforma cada destino em uma historia."),
        numbered("GUIA BRASILEIRO DO INICIO AO FIM — Nos grupos GBM, um guia brasileiro acompanha do embarque no Brasil ao desembarque. Conforto e seguranca totais."),
        numbered("EQUIPE VIVENCIAL — A equipe da RR Viagens viaja, explora e testa cada destino pessoalmente antes de oferece-lo aos clientes."),
        numbered("ALCANCE GLOBAL — 141+ roteiros em todos os continentes. Uma agencia, o mundo inteiro."),
        numbered("COMUNIDADE BRASILEIRA — Viagens em grupos de brasileiros criam networking, amizades e experiencias compartilhadas unicos."),
        numbered("HOTEIS PRIMEIRA CATEGORIA — Padrao elevado de hospedagem em todos os roteiros."),
        numbered("FLEXIBILIDADE — Opcoes com e sem aereo, grupos regulares ou privativo, datas fixas ou abertas."),
        numbered("TRACK RECORD — Mais de 1.500 viajantes conduzidos com seguranca e satisfacao."),
        numbered("PAGAMENTO FACILITADO — Entrada + parcelas com opcoes para todos os perfis financeiros."),

        spacer(),
        new Paragraph({ children: [new PageBreak()] }),

        // ---- 8. PUBLICO-ALVO ----
        h1("8. Publico-Alvo"),

        h2("Quem compra os pacotes da RR Viagens"),
        bullet("Brasileiros adultos (geralmente 30-65 anos) com renda media-alta"),
        bullet("Pessoas que ja viajaram e querem uma experiencia mais curada e segura"),
        bullet("Quem nao quer se preocupar com logistica — quer chegar e curtir"),
        bullet("Fans/seguidores de Rodrigo Ruas que confiam na sua cura"),
        bullet("Casais, amigos e familias em busca de experiencias internacionais"),
        bullet("Profissionais liberais, empresarios e aposentados com poder aquisitivo"),
        bullet("Pessoas que valorizam conforto, qualidade e seguranca acima do preco"),

        spacer(),
        h2("Dores que o produto resolve"),
        bullet("Medo de organizar viagem internacional sozinho"),
        bullet("Inseguranca com idioma e navegacao em paises estrangeiros"),
        bullet("Preocupacao com qualidade dos hoteis e atracoes"),
        bullet("Dificuldade de encontrar roteiros que equilibrem aventura e conforto"),
        bullet("Desejo de viajar com pessoas brasileiras (conforto cultural)"),
        bullet("Querer a curadoria de quem REALMENTE conhece o destino"),

        spacer(),
        new Paragraph({ children: [new PageBreak()] }),

        // ---- 9. COMO RESERVAR ----
        h1("9. Processo de Compra e Reserva"),

        h2("Como o cliente compra"),
        numbered("Cliente acessa o site pacotespelomundo.com.br ou vê algum destino nas redes sociais"),
        numbered("Clica no roteiro de interesse e visualiza itinerario, inclusoes e preco"),
        numbered("Clica no botao 'CLIQUE AQUI E RECEBA NO WHATSAPP O ROTEIRO COMPLETO'"),
        numbered("Equipe entra em contato via WhatsApp (11) 96640-1489"),
        numbered("Consultor apresenta detalhes, tira duvidas e envia proposta"),
        numbered("Cliente efetua entrada e inicio do parcelamento"),
        numbered("Viagem confirmada e toda logistica e gerenciada pela RR Viagens"),

        spacer(),
        h2("Contato Comercial"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2800, 6560],
          rows: [
            infoRow("WhatsApp principal", "(11) 96640-1489"),
            infoRow("Site", "pacotespelomundo.com.br"),
            infoRow("Instagram", "@rodrigoruas"),
            infoRow("CTA principal", "'CLIQUE AQUI E RECEBA NO WHATSAPP O ROTEIRO COMPLETO'"),
          ],
        }),

        spacer(),
        new Paragraph({ children: [new PageBreak()] }),

        // ---- 10. EXEMPLO DE ITINERARIO ----
        h1("10. Exemplo de Itinerario Detalhado — Turquia (Jun/2025)"),

        h2("Turquia | 10 dias | 08/06 a 17/06/2025"),
        p("Este pacote e um exemplo de Pacote Assinado. Ilustra o nivel de detalhamento e cuidado nos roteiros da RR Viagens."),
        spacer(),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [1400, 1200, 6760],
          rows: [
            new TableRow({
              children: ["Dia", "Data", "Atividades"].map(h => new TableCell({
                borders,
                shading: { fill: BLUE, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, bold: true, color: WHITE, size: 20, font: "Arial" })] })],
              })),
            }),
            ...[
              ["Dia 1", "08/jun", "Embarque em Guarulhos com destino a Istambul"],
              ["Dias 2-4", "09-11/jun", "Istambul (3 noites): Palacio Topkapi, Cisterna Basilica, Torre de Galata, Mesquita Azul, Santa Sofia, Hipódromo, Mercado de Especiarias, Grande Bazar"],
              ["Dia 5", "12/jun", "Voo para Kayseri + traslado a Capadocia (3 noites)"],
              ["Dias 6-7", "13-14/jun", "Capadocia: Vale de Goreme, Uchisar, Pasabag, por do sol, jantar em restaurante-caverna com show tipico"],
              ["Dia 8", "15/jun", "Retorno a Istambul (2 noites) + passeio de barco privado pelo Bosforo"],
              ["Dias 9-10", "16-17/jun", "Atividades livres + retorno ao Brasil"],
            ].map(([dia, data, ativ], i) => new TableRow({
              children: [dia, data, ativ].map((cell, j) => new TableCell({
                borders,
                shading: { fill: i % 2 === 0 ? LIGHT_GRAY : WHITE, type: ShadingType.CLEAR },
                margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: cell, size: 19, font: "Arial", color: DARK })] })],
              })),
            })),
          ],
        }),

        spacer(),
        h3("O que estava incluido neste pacote:"),
        bullet("Passagens aereas internacionais e domesticas"),
        bullet("Traslados aeroporto/hotel"),
        bullet("Passeio de barco privado no Bosforo (1h30)"),
        bullet("Visitas guiadas com guia local"),
        bullet("Entradas nos monumentos historicos"),
        bullet("Jantares em: Elai Restaurant, Uranos Sarikaya (com show), Nomads (bebidas ilimitadas + show)"),
        bullet("Degustacao de vinhos ao por do sol na Capadocia"),
        bullet("Almoco com vinho/cerveja em passeios selecionados"),

        spacer(),
        h3("Hospedagem:"),
        bullet("Istambul: hotel 5 estrelas — 3 noites (dias 2-4) + 2 noites (dias 8-9)"),
        bullet("Capadocia: 3 noites em hotel de caverna"),

        spacer(),
        h3("Opcional nao incluso:"),
        bullet("Passeio de balao na Capadocia: aprox. EUR 330 por pessoa"),

        spacer(),
        new Paragraph({ children: [new PageBreak()] }),

        // ---- 11. INFORMACOES ADICIONAIS ----
        h1("11. Observacoes e Lacunas a Completar"),

        h2("Dados ainda nao coletados"),
        p("As informacoes abaixo devem ser completadas com base na gravacao da reuniao e outros materiais disponibilizados:"),
        spacer(),
        bullet("Numero medio de participantes por grupo"),
        bullet("Politica de cancelamento e reembolso"),
        bullet("Se Rodrigo Ruas viaja pessoalmente nos grupos assinados ou apenas 'assina' os roteiros"),
        bullet("Depoimentos e casos de sucesso de clientes"),
        bullet("Processo de selecao de hoteis e fornecedores"),
        bullet("Politica de seguro viagem"),
        bullet("Se ha programa de fidelidade ou indicacao"),
        bullet("Volume mensal/anual de vendas"),
        bullet("Qual o ticket medio das vendas"),
        bullet("Canais de aquisicao de clientes (organico, pago, influenciadores)"),
        bullet("Estrategia de conteudo e presenca digital alem do Instagram"),

        spacer(),
        h2("Fonte dos dados deste documento"),
        bullet("Site oficial: pacotespelomundo.com.br (maio/2026)"),
        bullet("Pagina 'Quem Somos': quem-somos"),
        bullet("Paginas de destinos especificos: Turquia, Egito, Grecia, Marrocos, Irlanda/Escocia"),
        bullet("Sitemap com 141 URLs mapeadas"),
        bullet("*** PENDENTE: gravacao da reuniao com Rodrigo Ruas ***"),

        spacer(),
        spacer(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: BLUE, space: 6 } },
          spacing: { before: 200, after: 80 },
          children: [new TextRun({ text: "Documento gerado em: Maio de 2026", size: 18, color: GRAY, font: "Arial", italics: true })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 0 },
          children: [new TextRun({ text: "Uso interno e confidencial — atualizar apos revisao da gravacao da reuniao", size: 18, color: GRAY, font: "Arial", italics: true })],
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then(buffer => {
  const outPath = "Documento da Verdade - Rodrigo Ruas & RR Viagens.docx";
  fs.writeFileSync(outPath, buffer);
  console.log("OK: " + outPath);
});
