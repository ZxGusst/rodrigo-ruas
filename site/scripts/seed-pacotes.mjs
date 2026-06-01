/**
 * Seed de pacotes mockados no Sanity.
 * Roda com: node scripts/seed-pacotes.mjs
 */
import { createClient } from "@sanity/client"

const client = createClient({
  projectId: "6g3tj20r",
  dataset:   "production",
  apiVersion: "2024-01-01",
  token: "skTMByodyxtOZHTjHhNJ0ZoGg81zpCQYsaWoeh2oteGTUMJqImOcSm2Gr2tnA0S06NbzF5PPvjCk7IOpk21lyvnf7SzBlNNuC8cUlgR954RzL6TgqcFaPi9lahIpKdaclOyJwWBYikxglc6pLn4PTBxEJIGLmM2ScD83p8lnA0I5Dj5biLKT",
  useCdn: false,
})

const pacotes = [
  {
    titulo:        "Grécia",
    slug:          "grecia",
    badge:         "esgotado",
    prioridade:    "carrossel",
    ordem:         1,
    periodo:       "Junho 2026",
    dias:          10,
    partida:       "10/06",
    vagas:         18,
    descricaoCurta:"Atenas, Santorini e Mykonos com curadoria exclusiva. Grupo esgotado.",
    intro:         [{ _type:"block", _key:"intro1", style:"normal", children:[{ _type:"span", _key:"s1", text:"A Grécia é um destino que combina história milenar com beleza natural incomparável. Rodrigo selecionou os melhores restaurantes, praias escondidas e horários perfeitos para visitar cada local sem multidões." }], markDefs:[] }],
    pullQuote:     "A Grécia não é só uma viagem — é uma aula de civilização com vista para o mar.",
    incluso:       ["Passagem aérea São Paulo → Atenas → São Paulo","Hotel 4★ em Atenas e Santorini","Café da manhã incluso","Transfer entre ilhas (ferry e voo interno)","Guia brasileiro especializado","Seguro viagem"],
    naoIncluso:    ["Almoços e jantares não listados","Gastos pessoais","Passeios opcionais extras"],
    itinerario:    [
      { _type:"object", _key:"d1", numero:1, titulo:"Chegada em Atenas", texto:[{ _type:"block", _key:"b1", style:"normal", children:[{ _type:"span", _key:"s1", text:"Chegada ao aeroporto de Atenas, transfer para o hotel no centro histórico. À tarde, primeira caminhada pela Plaka e jantar com vista para a Acrópole." }], markDefs:[] }] },
      { _type:"object", _key:"d2", numero:2, titulo:"Acrópole e Museu Nacional", texto:[{ _type:"block", _key:"b2", style:"normal", children:[{ _type:"span", _key:"s1", text:"Visita guiada à Acrópole de manhã cedo, antes do calor e das multidões. Tarde no Museu da Acrópole e jantar em taverna tradicional." }], markDefs:[] }] },
      { _type:"object", _key:"d3", numero:3, titulo:"Voo para Santorini", texto:[{ _type:"block", _key:"b3", style:"normal", children:[{ _type:"span", _key:"s1", text:"Voo doméstico para a ilha mais fotogênica do mundo. Check-in em hotel com vista para a caldera, tarde livre para explorar Oia e assistir ao famoso pôr do sol." }], markDefs:[] }] },
    ],
  },
  {
    titulo:        "Turquia",
    slug:          "turquia",
    badge:         null,
    prioridade:    "carrossel",
    ordem:         2,
    periodo:       "Setembro 2026",
    dias:          10,
    partida:       "20/09",
    vagas:         20,
    descricaoCurta:"Istambul, Capadócia e a costa turca. Uma mistura única de Oriente e Ocidente.",
    intro:         [{ _type:"block", _key:"intro1", style:"normal", children:[{ _type:"span", _key:"s1", text:"A Turquia é o destino que divide o mundo em dois continentes. Rodrigo já esteve mais de dez vezes e conhece os hammams escondidos, os restaurantes sem cardápio em inglês e os hotéis em casas rupestres da Capadócia que fazem a diferença." }], markDefs:[] }],
    pullQuote:     "Istambul é a única cidade do mundo que fica em dois continentes. E vale cada um deles.",
    incluso:       ["Passagem aérea São Paulo → Istambul → São Paulo","Hotel 4★ selecionado","Café da manhã","Voo doméstico Istambul → Capadócia","Passeio de balão na Capadócia","Guia brasileiro","Seguro viagem"],
    naoIncluso:    ["Almoços e jantares não listados","Gastos pessoais","Ingresso separado em alguns museus"],
    itinerario:    [
      { _type:"object", _key:"d1", numero:1, titulo:"Chegada em Istambul", texto:[{ _type:"block", _key:"b1", style:"normal", children:[{ _type:"span", _key:"s1", text:"Chegada e transfer para o hotel no bairro histórico de Sultanahmet. Primeira caminhada pela Grande Muralha e jantar às margens do Bósforo." }], markDefs:[] }] },
      { _type:"object", _key:"d2", numero:2, titulo:"Istambul — Mesquitas e Bazar", texto:[{ _type:"block", _key:"b2", style:"normal", children:[{ _type:"span", _key:"s1", text:"Visita à Mesquita Azul, Hagia Sofia e o Grand Bazaar. Rodrigo conhece os comerciantes de confiança — sem mico de pagar preço de turista." }], markDefs:[] }] },
      { _type:"object", _key:"d3", numero:3, titulo:"Voo para Capadócia", texto:[{ _type:"block", _key:"b3", style:"normal", children:[{ _type:"span", _key:"s1", text:"Voo doméstico para Göreme. Check-in em hotel rupestre, passeio pelo Vale dos Pombos ao entardecer e jantar com culinária local." }], markDefs:[] }] },
    ],
  },
  {
    titulo:        "Egito",
    slug:          "egito",
    badge:         null,
    prioridade:    "carrossel",
    ordem:         3,
    periodo:       "Março 2026",
    dias:          10,
    partida:       "15/03",
    vagas:         20,
    descricaoCurta:"Pirâmides, cruzeiro pelo Nilo e Luxor. 5.000 anos de história em 10 dias.",
    intro:         [{ _type:"block", _key:"intro1", style:"normal", children:[{ _type:"span", _key:"s1", text:"Nenhum lugar no mundo tem o peso histórico do Egito. Rodrigo organizou um roteiro que combina o Egito antigo — pirâmides, templos e tumbas — com o Egito moderno de Cairo e seu mercado Khan el-Khalili." }], markDefs:[] }],
    pullQuote:     "Ficar na frente das Pirâmides de Gizé é uma experiência que muda a noção de tempo.",
    incluso:       ["Passagem aérea São Paulo → Cairo → São Paulo","Hotel 4★","Cruzeiro de 3 noites pelo Nilo","Café da manhã e jantar no cruzeiro","Entradas nos principais monumentos","Guia brasileiro","Seguro viagem"],
    naoIncluso:    ["Almoços não listados","Gorjetas (recomendado)","Gastos pessoais"],
    itinerario:    [
      { _type:"object", _key:"d1", numero:1, titulo:"Cairo — Pirâmides de Gizé", texto:[{ _type:"block", _key:"b1", style:"normal", children:[{ _type:"span", _key:"s1", text:"Chegada em Cairo, transfer e visita no mesmo dia às Pirâmides de Gizé e à Esfinge. Rodrigo chega cedo para pegar a melhor luz do dia e evitar as multidões." }], markDefs:[] }] },
      { _type:"object", _key:"d2", numero:2, titulo:"Museu Egípcio e Khan el-Khalili", texto:[{ _type:"block", _key:"b2", style:"normal", children:[{ _type:"span", _key:"s1", text:"Manhã no Museu Egípcio com a coleção de Tutancâmon. Tarde no mercado Khan el-Khalili — o lugar certo para comprar especiarias, perfumes e lembranças sem pagar preço de turista." }], markDefs:[] }] },
      { _type:"object", _key:"d3", numero:3, titulo:"Embarque no Cruzeiro do Nilo", texto:[{ _type:"block", _key:"b3", style:"normal", children:[{ _type:"span", _key:"s1", text:"Voo para Luxor e embarque no cruzeiro pelo Nilo. À tarde, visita ao Templo de Karnak — o maior complexo de templos do mundo antigo." }], markDefs:[] }] },
    ],
  },
  {
    titulo:        "Islândia",
    slug:          "islandia",
    badge:         "vagas",
    prioridade:    "carrossel",
    ordem:         4,
    periodo:       "Julho 2026",
    dias:          9,
    partida:       "05/07",
    vagas:         16,
    descricaoCurta:"Aurora boreal, géiseres e paisagens de outro mundo. A Islândia no verão ártico.",
    intro:         [{ _type:"block", _key:"intro1", style:"normal", children:[{ _type:"span", _key:"s1", text:"A Islândia é um dos destinos mais impressionantes do mundo — e um dos menos acessíveis sem um guia que conheça bem. Rodrigo monta o roteiro em torno das melhores condições meteorológicas e dos lugares que não aparecem nos guias comuns." }], markDefs:[] }],
    pullQuote:     "Na Islândia, a natureza não está no fundo do cenário. Ela é o show principal.",
    incluso:       ["Passagem aérea São Paulo → Reykjavik → São Paulo","Hotel 4★ e acomodações rurais","Café da manhã","Veículo 4x4 compartilhado","Guia brasileiro especializado","Seguro viagem completo com cobertura aventura"],
    naoIncluso:    ["Almoços e jantares não listados","Gorjetas","Gastos pessoais","Entradas individuais opcionais"],
    itinerario:    [
      { _type:"object", _key:"d1", numero:1, titulo:"Reykjavik — Capital do Fim do Mundo", texto:[{ _type:"block", _key:"b1", style:"normal", children:[{ _type:"span", _key:"s1", text:"Chegada em Reykjavik, a capital mais ao norte do mundo. Tarde livre para explorar a cidade — cervejarias locais, museus Viking e a icônica Hallgrímskirkja." }], markDefs:[] }] },
      { _type:"object", _key:"d2", numero:2, titulo:"Círculo Dourado", texto:[{ _type:"block", _key:"b2", style:"normal", children:[{ _type:"span", _key:"s1", text:"Dia completo no Círculo Dourado: géiser Strokkur, cachoeira Gullfoss e o parque de tectônicas Þingvellir. Rodrigo sabe o horário certo para ver o géiser explodir sem multidão." }], markDefs:[] }] },
      { _type:"object", _key:"d3", numero:3, titulo:"Geleiras e Lagoa de Iceberg", texto:[{ _type:"block", _key:"b3", style:"normal", children:[{ _type:"span", _key:"s1", text:"Visita à geleira Skaftafell e à lagoa de icebergs de Jökulsárlón — uma das paisagens mais surreais do planeta. Icebergs translúcidos na praia de areia preta." }], markDefs:[] }] },
    ],
  },
  {
    titulo:        "Marrocos",
    slug:          "marrocos",
    badge:         null,
    prioridade:    "carrossel",
    ordem:         5,
    periodo:       "Abril 2026",
    dias:          8,
    partida:       "08/04",
    vagas:         18,
    descricaoCurta:"Marrakech, o deserto do Saara e as cidades azuis. O Oriente Médio a 4h de Lisboa.",
    intro:         [{ _type:"block", _key:"intro1", style:"normal", children:[{ _type:"span", _key:"s1", text:"Marrocos é o destino mais subestimado da África. Rodrigo monta um roteiro que vai da frenética medina de Marrakech às dunas silenciosas do Saara, passando pela cidade azul de Chefchaouen." }], markDefs:[] }],
    pullQuote:     "Marrocos é o lugar onde você para no meio de um beco e não sabe em que século está.",
    incluso:       ["Passagem aérea São Paulo → Casablanca → São Paulo","Hotel riad 4★ em Marrakech","Pernoite no acampamento no Saara","Café da manhã","Transfer em veículo privativo","Guia local bilíngue","Seguro viagem"],
    naoIncluso:    ["Almoços e jantares","Gorjetas para guias locais","Gastos pessoais","Passeios de camelo opcionais"],
    itinerario:    [
      { _type:"object", _key:"d1", numero:1, titulo:"Marrakech — A Cidade Vermelha", texto:[{ _type:"block", _key:"b1", style:"normal", children:[{ _type:"span", _key:"s1", text:"Chegada em Marrakech e check-in em riad tradicional na medina. À tarde, primeira imersão na Praça Jemaa el-Fna — músicos, serpentes, contadores de histórias e os melhores sucos de laranja do mundo." }], markDefs:[] }] },
      { _type:"object", _key:"d2", numero:2, titulo:"Souks e Jardins", texto:[{ _type:"block", _key:"b2", style:"normal", children:[{ _type:"span", _key:"s1", text:"Manhã nos souks da medina com guia local de confiança. Tarde nos Jardins Majorelle (do Yves Saint Laurent) e no Museu Yves Saint Laurent." }], markDefs:[] }] },
      { _type:"object", _key:"d3", numero:3, titulo:"Rota para o Deserto", texto:[{ _type:"block", _key:"b3", style:"normal", children:[{ _type:"span", _key:"s1", text:"Saída de madrugada em 4x4 pelo Alto Atlas. Passagem pela cidade de Ouarzazate (a Hollywood do Marrocos) e chegada ao Saara ao pôr do sol. Acampamento nas dunas sob o céu mais estrelado que você já viu." }], markDefs:[] }] },
    ],
  },
  {
    titulo:        "Portugal",
    slug:          "portugal",
    badge:         null,
    prioridade:    "carrossel",
    ordem:         6,
    periodo:       "Maio 2026",
    dias:          7,
    partida:       "15/05",
    vagas:         20,
    descricaoCurta:"Lisboa, Porto e o Alentejo. Um roteiro que vai além do pastel de nata.",
    intro:         [{ _type:"block", _key:"intro1", style:"normal", children:[{ _type:"span", _key:"s1", text:"Portugal é o destino mais fácil para um brasileiro: mesma língua, comida incrível, vinhos baratos e história em cada esquina. Rodrigo monta um roteiro que vai além dos pontos turísticos e mostra o Portugal que os portugueses conhecem." }], markDefs:[] }],
    pullQuote:     "Portugal é o lugar onde o brasileiro finalmente entende o que é qualidade de vida.",
    incluso:       ["Passagem aérea São Paulo → Lisboa → São Paulo","Hotel 4★ em Lisboa e Porto","Café da manhã","Trem Lisboa → Porto (trem rápido)","Passeio pelo Douro em barco","Guia brasileiro","Seguro viagem"],
    naoIncluso:    ["Almoços e jantares","Transporte local (metro, uber)","Gastos pessoais"],
    itinerario:    [
      { _type:"object", _key:"d1", numero:1, titulo:"Lisboa — Alfama e Belém", texto:[{ _type:"block", _key:"b1", style:"normal", children:[{ _type:"span", _key:"s1", text:"Chegada em Lisboa, check-in e passeio pelo bairro histórico de Alfama. À tarde, Torre de Belém e pastéis de nata na Antiga Confeitaria de Belém — a original desde 1837." }], markDefs:[] }] },
      { _type:"object", _key:"d2", numero:2, titulo:"Sintra e Cascais", texto:[{ _type:"block", _key:"b2", style:"normal", children:[{ _type:"span", _key:"s1", text:"Dia de excursão a Sintra — palácios de conto de fadas no meio da floresta. Tarde em Cascais com vista para o Atlântico e jantar de frutos do mar." }], markDefs:[] }] },
      { _type:"object", _key:"d3", numero:3, titulo:"Trem para o Porto", texto:[{ _type:"block", _key:"b3", style:"normal", children:[{ _type:"span", _key:"s1", text:"Trem Alfa Pendular de Lisboa ao Porto. Chegada e imersão imediata nas caves de vinho do Porto em Gaia, com degustação guiada por Rodrigo." }], markDefs:[] }] },
    ],
  },
]

async function seed() {
  console.log(`Inserindo ${pacotes.length} pacotes no Sanity...`)

  for (const p of pacotes) {
    const { slug, itinerario, ...rest } = p

    const doc = {
      _type: "pacote",
      ...rest,
      slug: { _type: "slug", current: slug },
      itinerario: itinerario?.map((dia, i) => ({
        ...dia,
        _key: `dia${i}`,
      })),
    }

    try {
      // Verifica se já existe
      const existing = await client.fetch(
        `*[_type == "pacote" && slug.current == $slug][0]._id`,
        { slug }
      )

      if (existing) {
        console.log(`  ⏩ ${p.titulo} — já existe, pulando`)
        continue
      }

      await client.create(doc)
      console.log(`  ✓ ${p.titulo} criado`)
    } catch (err) {
      console.error(`  ✗ ${p.titulo}:`, err.message)
    }
  }

  console.log("\nSeed concluído!")
}

seed()
