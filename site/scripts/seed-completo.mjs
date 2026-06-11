/**
 * Seed completo com conteúdo real do site pacotespelomundo.com.br
 * Roda com: node scripts/seed-completo.mjs
 *
 * Categorias:
 *   gruposDoRuas      — Rodrigo vai junto, grupos exclusivos
 *   assinadoByRuas    — Pacotes privativos, saída a qualquer data
 *   gruposBrasileiros — Grupos com guia bilíngue, datas fixas
 */
import { createClient } from "@sanity/client"

if (!process.env.SANITY_TOKEN) {
  console.error("❌ Variável SANITY_TOKEN não definida.")
  console.error("   Use: SANITY_TOKEN=sk... node scripts/seed-completo.mjs")
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "6g3tj20r",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET    ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

function block(text) {
  return [{ _type:"block", _key:"b1", style:"normal", markDefs:[], children:[{ _type:"span", _key:"s1", text }] }]
}

const pacotes = [

  /* ═══════════════════════════════════════════════════════
     GRUPOS DO RUAS — Rodrigo acompanha pessoalmente
  ═══════════════════════════════════════════════════════ */

  {
    _id: "pacote-japao-out2026",
    tipo: "gruposDoRuas",
    prioridade: "destaque",
    ordem: 1,
    titulo: "Japão",
    slug: "japao",
    badge: "vagas",
    periodo: "Outubro 2026",
    dias: 10,
    partida: "08/10",
    vagas: 20,
    continentes: ["asia"],
    preco: null,
    cidadePartida: "São Paulo",
    politicaCancelamento: "nao-reembolsavel",
    politicaReagendamento: "R$ 500,00",
    descricaoCurta: "Rodrigo guia pessoalmente. Kyoto, Tóquio, Osaka e roteiros que só ele conhece.",
    pullQuote: "O Japão é o destino que mais transforma quem vai. Não é só uma viagem — é um choque cultural suave, uma lição de respeito, silêncio e beleza.",
    incluso: [
      "Passagem aérea São Paulo → Tóquio → São Paulo",
      "Hospedagem em hotéis 4★ selecionados por Rodrigo",
      "Café da manhã todos os dias",
      "Transfer aeroporto + passeios em grupo",
      "Rodrigo Ruas como guia durante todo o roteiro",
      "Seguro viagem completo",
    ],
    naoIncluso: [
      "Almoços e jantares não especificados",
      "Gastos pessoais e compras",
      "Passeios opcionais extras",
      "Gorjetas",
    ],
    intro: block("O Japão é o destino que mais transforma quem vai. Rodrigo já esteve oito vezes — e cada vez descobre algo novo. Este roteiro de 10 dias foi construído para quem quer ir além das fotos no Senso-ji: os templos às 6h sem turista, os restaurantes onde os chefs reconhecem Rodrigo, os trens noturnos, os onsen escondidos. Grupo máximo de 20 pessoas. Você só precisa aparecer no aeroporto."),
    itinerario: [
      { _type:"object", _key:"d1", numero:1, titulo:"Chegada em Tóquio — Shinjuku", texto: block("Após o voo, check-in no hotel em Shinjuku. Tarde pela rua Takeshita e Parque Yoyogi. Jantar em izakaya tradicional em Shibuya.") },
      { _type:"object", _key:"d2", numero:2, titulo:"Tóquio — Asakusa, Akihabara e Ueno", texto: block("Manhã no templo Senso-ji. Almoço em Ueno. Tarde em Akihabara. Rodrigo leva a lugares que guias comuns não conhecem.") },
      { _type:"object", _key:"d3", numero:3, titulo:"Dia livre em Tóquio ou Monte Fuji", texto: block("Dia à disposição para compras no Ginza, TeamLab ou mercado de peixe de Toyosu. Excursão opcional ao Monte Fuji.") },
      { _type:"object", _key:"d4", numero:4, titulo:"Shinkansen para Kyoto", texto: block("Trem-bala de Tóquio a Kyoto. Chegada ao meio-dia. Caminhada pelo distrito de Gion. Jantar kaiseki.") },
      { _type:"object", _key:"d5", numero:5, titulo:"Fushimi Inari e Arashiyama", texto: block("Subida nos mil torii do santuário Fushimi Inari de manhã cedo. Tarde no bambuzal de Arashiyama.") },
      { _type:"object", _key:"d6", numero:6, titulo:"Nara e Osaka", texto: block("Visita a Nara com os veados sagrados. Tarde em Osaka na Dotonbori para o melhor street food do Japão.") },
    ],
  },

  {
    _id: "pacote-japao-coreia-out2026",
    tipo: "gruposDoRuas",
    prioridade: "carrossel",
    ordem: 2,
    titulo: "Japão + Coreia do Sul",
    slug: "japao-coreia",
    badge: null,
    periodo: "Outubro 2026",
    dias: 14,
    partida: "12/10",
    vagas: 20,
    continentes: ["asia"],
    preco: null,
    cidadePartida: "São Paulo",
    politicaCancelamento: "nao-reembolsavel",
    politicaReagendamento: "R$ 500,00",
    descricaoCurta: "Dois países, uma viagem inesquecível. Kyoto, Tóquio, Hakone, Seul e Busan com Rodrigo.",
    pullQuote: "Japão e Coreia são vizinhos que não poderiam ser mais diferentes. E essa diferença é exatamente o que torna essa combinação perfeita.",
    incluso: [
      "Hospedagem completa em hotéis 4★ (Kyoto 4n, Hakone 1n, Tóquio 4n, Seul 4n)",
      "Café da manhã diário",
      "Transfers aeroporto-hotel",
      "Rodrigo Ruas como guia durante todo o roteiro",
      "2 jantares inclusos (Kyoto e Seul)",
      "Trem Kyoto → Hakone (primeira classe)",
      "Seguro viagem completo",
    ],
    naoIncluso: [
      "Voos internacionais",
      "Almoços e demais jantares",
      "Vistos e documentação",
      "Passeios opcionais",
      "Gorjetas",
    ],
    intro: block("Dois países vizinhos, mundos completamente diferentes. O Japão da ordem, do silêncio e da perfeição. A Coreia da energia, da comida explosiva e da modernidade. Rodrigo monta um roteiro de 14 dias que captura o melhor dos dois — de Kyoto às vielas de Gyeongbukgung em Seul."),
    itinerario: [
      { _type:"object", _key:"d1", numero:1, titulo:"Osaka/Kyoto — Chegada", texto: block("Chegada e check-in em Kyoto. Primeira caminhada pelo distrito de Gion ao entardecer.") },
      { _type:"object", _key:"d2", numero:2, titulo:"Kyoto — Templos e Fushimi Inari", texto: block("Fushimi Inari de manhã cedo. Tarde em Arashiyama. Jantar kaiseki incluído.") },
      { _type:"object", _key:"d5", numero:5, titulo:"Hakone — Ryokan e Monte Fuji", texto: block("Trem de primeira classe para Hakone. Check-in em ryokan tradicional. Vista para o Monte Fuji ao pôr do sol.") },
      { _type:"object", _key:"d6", numero:6, titulo:"Tóquio — Chegada", texto: block("Shinkansen para Tóquio. Tarde em Shibuya e Harajuku. Jantar em ramen local.") },
      { _type:"object", _key:"d10", numero:10, titulo:"Voo para Seul", texto: block("Voo doméstico para Seul. Check-in e primeiro mergulho na culinária coreana em Myeongdong.") },
      { _type:"object", _key:"d11", numero:11, titulo:"Seul — Palácio e Mercado", texto: block("Gyeongbukgung Palace de manhã. Tarde no Mercado de Gwangjang. Jantar de galinha ao ginseng incluído.") },
    ],
  },

  {
    _id: "pacote-ushuaia-ago2026-1",
    tipo: "gruposDoRuas",
    prioridade: "carrossel",
    ordem: 3,
    titulo: "Ushuaia",
    slug: "ushuaia",
    badge: "vagas",
    periodo: "Agosto 2026",
    dias: 6,
    partida: "06/08",
    vagas: 20,
    continentes: ["america-sul"],
    preco: null,
    cidadePartida: "São Paulo",
    politicaCancelamento: "nao-reembolsavel",
    politicaReagendamento: "R$ 500,00",
    descricaoCurta: "O fim do mundo existe e Rodrigo vai te levar lá. Neve, glaciares e o Canal Beagle em agosto.",
    pullQuote: "Ushuaia é o lugar onde o mundo acaba — e começa uma das aventuras mais inesquecíveis que você já vai viver.",
    incluso: [
      "Passagem aérea GRU → USH → GRU (saída 9h10, retorno 16h35)",
      "Transfers aeroporto ↔ hotel",
      "Guides especializados Rodrigo Ruas",
      "Experiência antártica com fondue (dia 1)",
      "Resort de neve: snowshoeing, ski, snowmobile, ATV (dia 2)",
      "Trem Parque Nacional Tierra del Fuego + navegação Canal Beagle (dia 3)",
      "Expedição 4x4 + jantar no Hotel Arakur (dia 5)",
      "Refeições especificadas no roteiro",
      "Seguro viagem",
    ],
    naoIncluso: [
      "Taxa de entrada no Parque Nacional",
      "Aluguel de equipamentos extras",
      "Roupas impermeáveis (recomendado levar)",
      "Gastos pessoais",
    ],
    intro: block("Ushuaia fica no extremo sul da Argentina — a cidade mais austral do mundo. Em agosto, está coberta de neve. Rodrigo organiza 6 dias de experiências que você não encontra em nenhum pacote padrão: resort de neve, expedição 4x4, navegação pelo Canal Beagle e o incrível jantar no Hotel Arakur com vista para as montanhas nevadas."),
    itinerario: [
      { _type:"object", _key:"d1", numero:1, titulo:"Chegada e Experiência Antártica", texto: block("Voo GRU 9h10 → USH 15h05. Chegada e transfer. À noite, experiência antártica com fondue.") },
      { _type:"object", _key:"d2", numero:2, titulo:"Resort de Neve", texto: block("Dia completo no resort: snowshoeing, aulas de ski cross-country, trenó, snowmobile e quadricycle. Jantar incluído.") },
      { _type:"object", _key:"d3", numero:3, titulo:"Parque Nacional e Canal Beagle", texto: block("Manhã no Parque Nacional Tierra del Fuego com trem premium (refeição e bebidas incluídas). Tarde: catamarã pelo Canal Beagle.") },
      { _type:"object", _key:"d4", numero:4, titulo:"Ski ou Cerro Castor", texto: block("Escolha: aulas de ski/snowboard + interação com husky + churrasco patagônico OU visitação ao Cerro Castor ski station.") },
      { _type:"object", _key:"d5", numero:5, titulo:"Expedição 4x4 e Hotel Arakur", texto: block("Expedição 4x4 off-road. Jantar no Hotel Arakur com charcuterie, picanha e bebidas à vontade.") },
      { _type:"object", _key:"d6", numero:6, titulo:"Retorno", texto: block("Transfer ao aeroporto. USH 16h35 → GRU 22h15.") },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     PACOTES ASSINADOS — Privativos, qualquer data, sem aéreo
  ═══════════════════════════════════════════════════════ */

  {
    _id: "pacote-grecia-assinado",
    tipo: "assinadoByRuas",
    prioridade: "carrossel",
    ordem: 1,
    titulo: "Grécia",
    slug: "grecia",
    badge: null,
    periodo: "Qualquer data",
    dias: 11,
    partida: null,
    vagas: null,
    continentes: ["europa"],
    preco: null,
    cidadePartida: "São Paulo",
    politicaCancelamento: "nao-reembolsavel",
    politicaReagendamento: "R$ 500,00",
    descricaoCurta: "Atenas, Mykonos e Santorini. Pacote privativo com curadoria de Rodrigo. Sai quando quiser.",
    pullQuote: "A Grécia não é só uma viagem — é uma aula de civilização com vista para o mar.",
    incluso: [
      "Hotéis 4-5★ em Atenas (3n), Mykonos (3n) e Santorini (3n)",
      "Café da manhã todos os dias",
      "Transfers aeroporto e entre ilhas",
      "Roteiro curado por Rodrigo Ruas",
      "Guia local bilíngue (PT/ES)",
      "Suporte 24h durante a viagem",
    ],
    naoIncluso: [
      "Passagem aérea internacional",
      "Almoços e jantares",
      "Passeios opcionais",
      "Gastos pessoais",
    ],
    intro: block("A Grécia Privativa by Ruas é para quem quer viver a Grécia no seu ritmo, sem depender de grupo. 11 dias percorrendo Atenas histórica, as festas de Mykonos e o por do sol de Santorini — com hotéis escolhidos a dedo e um roteiro que funciona. Aéreo não incluso: você compra quando quiser e parte na data que escolher."),
  },

  {
    _id: "pacote-turquia-assinado",
    tipo: "assinadoByRuas",
    prioridade: "carrossel",
    ordem: 2,
    titulo: "Turquia",
    slug: "turquia",
    badge: null,
    periodo: "Qualquer data",
    dias: 7,
    partida: null,
    vagas: null,
    continentes: ["europa", "asia"],
    preco: null,
    cidadePartida: "São Paulo",
    politicaCancelamento: "nao-reembolsavel",
    politicaReagendamento: "R$ 500,00",
    descricaoCurta: "Istambul e Capadócia em 7 dias. Hotéis 5★, roteiro privativo, na sua data.",
    pullQuote: "Istambul é a única cidade do mundo que fica em dois continentes. E vale cada um deles.",
    incluso: [
      "Hotéis 5★ em Istambul e Capadócia (hotel rupestre)",
      "Café da manhã e almoços selecionados",
      "Transfers aeroporto e entre cidades",
      "Visitas guiadas em PT/ES/EN",
      "Cruzeiro pelo Bósforo",
      "Suporte 24h durante a viagem",
    ],
    naoIncluso: [
      "Passagem aérea internacional",
      "Passeio de balão (opcional, ~$200)",
      "Demais refeições",
      "Gastos pessoais",
    ],
    intro: block("Sete dias atravessando dois continentes. Istambul com a Mesquita Azul, Hagia Sofia, Grand Bazaar e o cruzeiro pelo Bósforo. Capadócia com as chaminés de fadas, cidades subterrâneas e o famoso passeio de balão ao amanhecer. Tudo privativo, no seu ritmo, nos hotéis certos."),
  },

  {
    _id: "pacote-croacia-assinado",
    tipo: "assinadoByRuas",
    prioridade: "carrossel",
    ordem: 3,
    titulo: "Croácia",
    slug: "croacia",
    badge: null,
    periodo: "Qualquer data",
    dias: 9,
    partida: null,
    vagas: null,
    continentes: ["europa"],
    preco: null,
    cidadePartida: "São Paulo",
    politicaCancelamento: "nao-reembolsavel",
    politicaReagendamento: "R$ 500,00",
    descricaoCurta: "Dubrovnik, Split, Hvar e Plitvice. Roteiro privativo para casais e viagens solo.",
    pullQuote: "Dubrovnik é o lugar onde o Game of Thrones foi filmado por um motivo: é impossível que um lugar assim exista de verdade.",
    incluso: [
      "Hotéis 4-5★ em Dubrovnik (3n), Split (2n) e Zagreb (2n)",
      "Café da manhã todos os dias",
      "Cruzeiro privativo em Hvar e Ilhas Pakleni",
      "Transfers entre cidades",
      "Visita guiada ao Parque Nacional de Plitvice",
      "Guia local bilíngue PT/ES",
    ],
    naoIncluso: [
      "Passagem aérea internacional",
      "Almoços e jantares",
      "Passeios opcionais extras",
      "Gastos pessoais",
    ],
    intro: block("A Croácia é um dos segredos mais bem guardados da Europa — até que você chega e entende por que todo mundo volta. Dubrovnik com suas muralhas medievais, Split com o Palácio de Diocleciano de 1.700 anos, as cascatas de Plitvice e o cruzeiro pelas ilhas de Hvar. 9 dias, 4 cidades, todas as surpresas."),
  },

  {
    _id: "pacote-toscana-assinado",
    tipo: "assinadoByRuas",
    prioridade: "carrossel",
    ordem: 4,
    titulo: "Toscana",
    slug: "toscana",
    badge: null,
    periodo: "Qualquer data",
    dias: 9,
    partida: null,
    vagas: null,
    continentes: ["europa"],
    preco: null,
    cidadePartida: "São Paulo",
    politicaCancelamento: "nao-reembolsavel",
    politicaReagendamento: "R$ 500,00",
    descricaoCurta: "Florença, Siena, Chianti e Val d'Orcia. A Itália que vai além do turismo de massa.",
    pullQuote: "A Toscana é a Itália que você imagina quando fecha os olhos. Ciprestes, vinhedos, torres medievais e luz perfeita o dia todo.",
    incluso: [
      "Hotéis 4★ em Florença (3n) e Siena (3n)",
      "Café da manhã todos os dias",
      "Degustação de vinho em quinta do Chianti",
      "Transfers e transporte no roteiro",
      "Guia local especializado PT/ES",
      "Visita a Pisa, San Gimignano e Volterra",
    ],
    naoIncluso: [
      "Passagem aérea internacional",
      "Almoços e jantares (exceto degustação)",
      "Ingressos opcionais (Uffizi, Duomo)",
      "Gastos pessoais",
    ],
    intro: block("A Toscana é a região italiana mais fotografada do mundo — e com razão. 9 dias percorrendo Florença com o Duomo e a Galleria degli Uffizi, Siena medieval, os vinhedos do Chianti, a Val d'Orcia (patrimônio UNESCO) e as torres de San Gimignano. Um roteiro construído para quem quer entender a Itália de verdade, não só tirar foto."),
  },

  /* ═══════════════════════════════════════════════════════
     GRUPOS BRASILEIROS NO MUNDO — Guia bilíngue, datas fixas
  ═══════════════════════════════════════════════════════ */

  {
    _id: "pacote-turquiagrecia-gbm",
    tipo: "gruposBrasileiros",
    prioridade: "destaque",
    ordem: 1,
    titulo: "Turquia e Grécia",
    slug: "turquia-grecia-gbm",
    badge: "vagas",
    periodo: "Junho 2026",
    dias: 17,
    partida: "10/06",
    vagas: 20,
    continentes: ["europa", "asia"],
    preco: null,
    cidadePartida: "São Paulo",
    politicaCancelamento: "nao-reembolsavel",
    politicaReagendamento: "R$ 500,00",
    descricaoCurta: "Istambul, Capadócia, Pamukkale e cruzeiro pelas Ilhas Gregas — 17 dias inesquecíveis.",
    pullQuote: "Dois países, uma única viagem que conecta Europa e Ásia, mar e deserto, Oriente e Ocidente.",
    incluso: [
      "Guia brasileiro durante toda a viagem",
      "Hotéis 1ª categoria e luxo",
      "15 cafés da manhã tipo buffet",
      "9 refeições ao longo do roteiro",
      "Todas as refeições do cruzeiro",
      "Guias locais bilíngues PT/ES",
      "Voos domésticos no exterior",
    ],
    naoIncluso: [
      "Passagem aérea internacional (opcional)",
      "Refeições não listadas",
      "Gastos pessoais",
      "Gorjetas",
    ],
    intro: block("17 dias atravessando dois continentes. Istambul (4n) com toda a sua história. Capadócia (2n) com hotéis rupestres e passeio de balão. Pamukkale (2n) com as piscinas termais. Um cruzeiro de 4 dias pelas Ilhas Gregas visitando Patmos, Rodes e Santorini. Atenas (3n) para fechar. Com guia brasileiro do início ao fim."),
  },

  {
    _id: "pacote-china-gbm-jun",
    tipo: "gruposBrasileiros",
    prioridade: "carrossel",
    ordem: 2,
    titulo: "Grandes Luzes da China",
    slug: "china",
    badge: null,
    periodo: "Junho 2026",
    dias: 18,
    partida: "27/06",
    vagas: 20,
    continentes: ["asia"],
    preco: null,
    cidadePartida: "São Paulo",
    politicaCancelamento: "nao-reembolsavel",
    politicaReagendamento: "R$ 500,00",
    descricaoCurta: "Beijing, Xi'an, Hangzhou, Shanghai, Macau, Hong Kong e Dubai. A China de verdade em 18 dias.",
    pullQuote: "A China não é um país — é um universo paralelo. 1,4 bilhão de pessoas, 5.000 anos de história e uma modernidade que vai te deixar sem fôlego.",
    incluso: [
      "Guia brasileiro durante toda a viagem",
      "Hotéis superior e luxo moderado",
      "17 cafés da manhã tipo buffet",
      "6 refeições ao longo do roteiro",
      "Guias locais bilíngues PT/ES",
      "Voos domésticos no exterior",
      "Maleteiros na chegada/saída (1 mala/pessoa)",
    ],
    naoIncluso: [
      "Passagem aérea internacional",
      "Refeições não listadas",
      "Visto para a China (obrigatório)",
      "Gastos pessoais",
    ],
    intro: block("18 dias percorrendo o gigante asiático. A Grande Muralha e a Cidade Proibida em Beijing. O Exército de Terracota em Xi'an. O Lago Oeste de Hangzhou. A skyline futurista de Shanghai. A efervescência de Macau e Hong Kong. Com parada em Dubai na chegada. Uma China única — com atrações e experiências que tornam esta uma jornada fascinante."),
  },

  {
    _id: "pacote-alemanha-norte-gbm",
    tipo: "gruposBrasileiros",
    prioridade: "carrossel",
    ordem: 3,
    titulo: "Norte da Alemanha",
    slug: "alemanha-norte",
    badge: null,
    periodo: "Setembro 2026",
    dias: 15,
    partida: "04/09",
    vagas: 20,
    continentes: ["europa"],
    preco: null,
    cidadePartida: "São Paulo",
    politicaCancelamento: "nao-reembolsavel",
    politicaReagendamento: "R$ 500,00",
    descricaoCurta: "Hamburgo, Bremen, Lübeck, Berlim e a Floresta Negra. A Alemanha além da Baviera.",
    pullQuote: "O norte da Alemanha é diferente do sul — mais marítimo, mais histórico, mais surpreendente para quem pensava que já conhecia o país.",
    incluso: [
      "Guia brasileiro durante toda a viagem",
      "Hotéis 1ª categoria",
      "Cafés da manhã tipo buffet",
      "Refeições selecionadas",
      "Guias locais bilíngues PT/ES",
      "Voos internacionais (com opção aéreo)",
      "Maleteiros na chegada",
    ],
    naoIncluso: [
      "Passagem aérea (opcional — ver preço com aéreo)",
      "Refeições não listadas",
      "Gastos pessoais",
    ],
    intro: block("15 dias descobrindo a Alemanha que a maioria dos turistas não conhece. Hamburgo, a cidade portuária com o maior porto da Europa. Bremen, com sua praça medieval. Lübeck, cidade da Hanseatische Liga. Schwerin com o castelo na ilha. Berlim (3n) com toda a sua história. Um roteiro que vai te surpreender."),
  },

  {
    _id: "pacote-srilanka-maldivas-gbm",
    tipo: "gruposBrasileiros",
    prioridade: "carrossel",
    ordem: 4,
    titulo: "Sri Lanka e Maldivas",
    slug: "srilanka-maldivas",
    badge: null,
    periodo: "Outubro 2026",
    dias: 17,
    partida: "06/10",
    vagas: 20,
    continentes: ["asia"],
    preco: null,
    cidadePartida: "São Paulo",
    politicaCancelamento: "nao-reembolsavel",
    politicaReagendamento: "R$ 500,00",
    descricaoCurta: "Budismo, elefantes, praias e o paraíso das Maldivas. 17 dias entre dois mundos.",
    pullQuote: "O Sri Lanka é um país que ainda não foi descoberto pelo turismo de massa — e isso é exatamente o que o torna tão especial.",
    incluso: [
      "Guia brasileiro durante toda a viagem",
      "Hotéis 1ª superior e luxo moderado",
      "15 cafés da manhã tipo buffet",
      "13 refeições ao longo do roteiro",
      "3 noites nas Maldivas",
      "2 noites em Dubai",
      "Guias locais bilíngues PT/ES",
      "Voos domésticos/internacionais no exterior",
    ],
    naoIncluso: [
      "Passagem aérea internacional",
      "Refeições não listadas",
      "Gastos pessoais",
      "Gorjetas",
    ],
    intro: block("17 dias combinando dois destinos completamente diferentes. O Sri Lanka budista, com elefantes, templos milenares, plantações de chá e praias intocadas. As Maldivas com 3 noites em resort over-water — o paraíso que você sempre viu nas fotos. Com parada em Dubai para descanso. Um grupo de brasileiros, um guia que fala português, e experiências que não cabem em descrição."),
  },

  {
    _id: "pacote-china-gbm-out",
    tipo: "gruposBrasileiros",
    prioridade: "carrossel",
    ordem: 5,
    titulo: "Grandes Luzes da China",
    slug: "china-outubro",
    badge: null,
    periodo: "Outubro 2026",
    dias: 18,
    partida: "17/10",
    vagas: 20,
    continentes: ["asia"],
    preco: null,
    cidadePartida: "São Paulo",
    politicaCancelamento: "nao-reembolsavel",
    politicaReagendamento: "R$ 500,00",
    descricaoCurta: "Segunda saída de outubro para a China. Beijing, Shanghai, Hong Kong e Dubai em 18 dias.",
    pullQuote: "A China não é um país — é um universo paralelo. 5.000 anos de história e uma modernidade que vai te deixar sem fôlego.",
    incluso: [
      "Guia brasileiro durante toda a viagem",
      "Hotéis superior e luxo moderado",
      "17 cafés da manhã tipo buffet",
      "6 refeições ao longo do roteiro",
      "Guias locais bilíngues PT/ES",
      "Voos domésticos no exterior",
    ],
    naoIncluso: [
      "Passagem aérea internacional",
      "Visto para a China",
      "Refeições não listadas",
      "Gastos pessoais",
    ],
    intro: block("Mesma jornada incrível pela China, segunda saída de outubro para quem não conseguiu vaga em junho. Beijing, Xi'an, Hangzhou, Shanghai, Macau, Hong Kong e Dubai. 18 dias que vão mudar sua visão de mundo."),
  },
]

async function seed() {
  console.log(`\n🌍 Iniciando seed completo — ${pacotes.length} pacotes\n`)

  for (const p of pacotes) {
    const { _id, slug, itinerario, intro, ...rest } = p

    const doc = {
      _id,
      _type: "pacote",
      ...rest,
      slug: { _type: "slug", current: slug },
      intro: intro ?? undefined,
      itinerario: itinerario?.map((dia, i) => ({
        ...dia,
        _key: `dia${i + 1}`,
      })),
    }

    try {
      await client.createOrReplace(doc)
      console.log(`  ✓ ${p.titulo} (${p.tipo}) — ${p.periodo}`)
    } catch (err) {
      console.error(`  ✗ ${p.titulo}:`, err.message)
    }
  }

  console.log("\n✅ Seed concluído!\n")
}

seed()
