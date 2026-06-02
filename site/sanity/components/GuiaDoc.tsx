const S = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <span style={style}>{children}</span>
)

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 40 }}>
    <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
                  color: "#f97316", marginBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.1)",
                  paddingBottom: 8 }}>
      {title}
    </h2>
    {children}
  </section>
)

const Field = ({ name, desc }: { name: string; desc: string }) => (
  <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
    <code style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, padding: "2px 8px",
                   fontSize: 13, color: "#a5f3fc", whiteSpace: "nowrap", alignSelf: "flex-start",
                   marginTop: 1 }}>
      {name}
    </code>
    <span style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.55 }}>{desc}</span>
  </div>
)

const Note = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)",
                borderRadius: 8, padding: "12px 16px", fontSize: 14,
                color: "rgba(255,255,255,0.8)", marginTop: 16, lineHeight: 1.6 }}>
    <strong style={{ color: "#f97316" }}>Dica: </strong>{children}
  </div>
)

export function GuiaDoc() {
  return (
    <div style={{ padding: "48px 56px", maxWidth: 760, fontFamily: "system-ui, sans-serif",
                  color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>

      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>
          Guia de uso — RR Viagens CMS
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>
          Como gerenciar os conteúdos do site rrviagens.com.br
        </p>
      </div>

      {/* PACOTES */}
      <Section title="Pacotes">
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>
          Cada entrada em <strong>Pacotes</strong> vira uma página no site (ex: /pacotes/japao) e aparece
          na lista de destinos. Para criar: clique em "Pacotes" no menu lateral → "Criar novo".
        </p>
        <Field name="Título"         desc="Nome do destino que aparece na lista e na página. Ex: Japão, Grécia + Turquia." />
        <Field name="Slug"           desc="URL da página. Gerado automaticamente a partir do título. Só altere se souber o que está fazendo." />
        <Field name="Tipo"           desc="Categoria do pacote: Grupo do Ruas (Rodrigo vai junto), Assinado By Ruas (curadoria sem Rodrigo) ou Grupo Brasileiro (grupo organizado com guia). Aparece como badge colorido na lista." />
        <Field name="Badge"          desc="Status de disponibilidade: Vagas limitadas (aviso amarelo) ou Esgotado (pacote fica opaco e sem link)." />
        <Field name="Imagem hero"    desc="Foto principal do destino. Use imagens em paisagem (16:9). Recomendado: mínimo 1600px de largura." />
        <Field name="Período"        desc="Texto livre da data. Ex: Out 2026, Nov/Dez 2026, Qualquer data." />
        <Field name="Duração (dias)" desc="Número de dias da viagem. Aparece como '11 dias' na lista." />
        <Field name="Partida"        desc="Cidade de saída. Ex: São Paulo. Aparece como 'Partida São Paulo'." />
        <Field name="Descrição curta" desc="Frase de 1-2 linhas que resume o roteiro. Aparece na lista quando o destino está selecionado." />
        <Field name="Descrição longa" desc="Texto completo da página do pacote (suporta formatação)." />
        <Field name="Continentes"    desc="Usado para o filtro por região na lista. Selecione um ou mais." />
        <Field name="Preço (R$)"     desc="Valor a partir de. Usado no filtro de preço máximo." />
        <Field name="Prioridade"     desc="Controla a visibilidade: Normal (aparece), Destaque (fica no topo), Oculto (some do site sem apagar)." />
        <Field name="Ordem"          desc="Número de ordenação. Menor número aparece primeiro na lista." />
        <Note>
          Para ocultar temporariamente um pacote sem apagar, mude <code style={{ color: "#a5f3fc" }}>Prioridade</code> para <strong>Oculto</strong>.
          Para marcar como esgotado, use o campo <code style={{ color: "#a5f3fc" }}>Badge</code> → Esgotado.
        </Note>
      </Section>

      {/* GRUPOS WHATSAPP */}
      <Section title="Grupos WhatsApp">
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>
          Aparecem na roda giratória da home ("Comunidade RR Viagens"). Cada card representa um grupo
          ativo com vagas. Para criar: clique em "Grupos WhatsApp" → "Criar novo".
        </p>
        <Field name="Nome do grupo"      desc="Nome que aparece no card. Ex: Japão 2026, Turquia + Grécia." />
        <Field name="Destino (slug)"     desc="Slug do destino para buscar a imagem de fundo. Ex: japao, turquia, grecia. Só necessário se não tiver foto própria." />
        <Field name="Foto do grupo"      desc="Imagem opcional do grupo. Se não preencher, usa a imagem do destino pelo slug." />
        <Field name="Data de partida"    desc="Texto livre. Ex: 08 Out 2026, Novembro 2026." />
        <Field name="Membros atuais"     desc="Número de pessoas já confirmadas. Atualizar conforme entram novos membros." />
        <Field name="Máximo de membros"  desc="Capacidade total do grupo. O card mostra '12/20 membros'." />
        <Field name="Status"             desc="Aberto (aceita novos), Últimas vagas (alerta visual), Esgotado (sem botão de entrar)." />
        <Field name="Ordem"              desc="Posição na roda giratória. Menor número aparece primeiro." />
        <Field name="Exibir na home"     desc="Ativar/desativar o card sem apagar. Desative para grupos encerrados." />
        <Note>
          Atualize <code style={{ color: "#a5f3fc" }}>Membros atuais</code> regularmente.
          Quando chegar no máximo, mude o <code style={{ color: "#a5f3fc" }}>Status</code> para
          <strong> Esgotado</strong> para o card refletir isso automaticamente.
        </Note>
      </Section>

      {/* HOMEPAGE */}
      <Section title="Homepage">
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>
          O documento <strong>Homepage</strong> controla os textos e configurações da página inicial.
          É um documento único — não é possível criar múltiplas homepages.
        </p>
        <Field name="Título principal" desc="Texto grande do hero. Aparece sobre o carrossel de fotos." />
        <Field name="Subtítulo"        desc="Texto secundário abaixo do título." />
        <Note>
          As fotos do carrossel do hero são gerenciadas diretamente no código e atualizam com as
          imagens dos pacotes cadastrados.
        </Note>
      </Section>

      {/* DICAS GERAIS */}
      <Section title="Dicas gerais">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            ["Publicar alterações", "Após editar qualquer documento, clique no botão azul 'Publicar' no canto inferior direito. Alterações não publicadas ficam como rascunho e não aparecem no site."],
            ["Imagens", "Arraste direto para o campo de imagem ou clique para selecionar. Formatos aceitos: JPG, PNG, WebP. O site converte automaticamente para WebP na entrega."],
            ["Desfazer alterações", "Use Ctrl+Z para desfazer dentro do campo. Para reverter um documento publicado, clique nos três pontinhos (···) ao lado de 'Publicar' → 'Reverter para publicado'."],
            ["Histórico de versões", "Clique no ícone de relógio no painel direito para ver e restaurar versões anteriores de qualquer documento."],
            ["Busca rápida", "Use Ctrl+K para abrir a busca global e encontrar qualquer pacote ou documento pelo nome."],
          ].map(([title, desc]) => (
            <div key={title} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8,
                                      padding: "14px 18px", borderLeft: "3px solid rgba(249,115,22,0.4)" }}>
              <strong style={{ fontSize: 14, display: "block", marginBottom: 4, color: "#fff" }}>
                {title}
              </strong>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>{desc}</span>
            </div>
          ))}
        </div>
      </Section>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, marginTop: 8,
                    fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
        RR Viagens — Dúvidas? Fale com o desenvolvedor.
      </div>
    </div>
  )
}
