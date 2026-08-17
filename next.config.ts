/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // remove o header X-Powered-By, não expõe stack, ganho mínimo mas gratuito
  compress: true,

  // O driver do mongodb tenta resolver dependências nativas opcionais
  // (kerberos, snappy, aws4 etc.) que não estão instaladas; isso evita o
  // bundler do servidor tentar empacotar essas.
  serverExternalPackages: ['mongodb'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'toroid.com.br',
        pathname: '/wp-content/uploads/**',
      },
      // Se a hospedagem servir mídia por CDN ou subdomínio próprio, duplicar o bloco acima
      // trocando hostname, ex.: { protocol: 'https', hostname: 'media.toroid.com.br', pathname: '/**' }
      // CONFIRMAR isso testando a URL de uma imagem de produto real do WP antes de assumir.
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 dias, imagem de produto não muda a cada deploy
  },

  async headers() {
    return [
      {
        // assets estáticos gerados pelo Next (JS/CSS com hash no nome): cache máximo seguro
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // imagens servidas diretamente da pasta /public do projeto (logo, ícones fixos)
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // Redirecionamentos 301 da migração do WordPress antigo.
  // Popular esta lista durante a Semana 3 (mapa de redirecionamento), a partir
  // do export completo de URLs indexadas no Search Console. Nenhuma URL antiga
  // pode ficar de fora: é o que preserva o histórico de SEO e a continuidade
  // das campanhas de Google Ads ativas.
  async redirects() {
    return [
      // Migração interna de URL (2026-08-17): página de nobreaks movida de
      // /transformadores-nobreaks para /aplicacoes/nobreaks, para entrar no
      // padrão de URL de aplicação/segmento do CLAUDE.md. Preserva o sinal de
      // ranking da URL antiga (ver ROADMAP.md).
      {
        source: '/transformadores-nobreaks',
        destination: '/aplicacoes/nobreaks',
        permanent: true,
      },

      // Defensivo: as três páginas de produto viveram em /produtos/... durante
      // o desenvolvimento e podem ter sido indexadas nesse caminho antes da
      // migração para rota de topo.
      {
        source: '/produtos/transformadores-de-corrente',
        destination: '/transformador-de-corrente',
        permanent: true,
      },
      {
        source: '/produtos/transformadores-toroidais',
        destination: '/transformadores-toroidais',
        permanent: true,
      },
      {
        source: '/produtos/indutores-e-reatores',
        destination: '/indutores-filtros-e-chokes',
        permanent: true,
      },
      // WordPress antigo: página removida mas ainda indexada (65 cliques /
      // 4.421 impressões no Search Console). Fonte: seo/arquitetura-de-conteudo.md.
      {
        source: '/transformadores-de-corrente__trashed',
        destination: '/transformador-de-corrente',
        permanent: true,
      },

      // Posts de blog indexados no WordPress antigo, preservando a mesma URL
      // sob /blog/. O conteúdo em si será reescrito na Fase 3 no padrão de
      // voz do brand book — o 301 aqui só protege o sinal de ranking que já
      // existe. ATENÇÃO: /blog/[slug] ainda não existe como rota (ver
      // ROADMAP.md), então até essa rota ser construída estes redirects
      // terminam em 404. Confirmar que /blog/[slug] existe antes do go-live.
      { source: '/o-que-realmente-difere-os-transformadores-toroidais-dos-modelos-convencionais', destination: '/blog/o-que-realmente-difere-os-transformadores-toroidais-dos-modelos-convencionais', permanent: true },
      { source: '/voce-sabe-o-que-e-classe-termica-em-transformadores-e-por-que-ela-importa', destination: '/blog/voce-sabe-o-que-e-classe-termica-em-transformadores-e-por-que-ela-importa', permanent: true },
      { source: '/religadores-automaticos-eficiencia-e-continuidade-com-transformadores-de-corrente-toroidais', destination: '/blog/religadores-automaticos-eficiencia-e-continuidade-com-transformadores-de-corrente-toroidais', permanent: true },
      { source: '/voce-sabe-qual-a-diferenca-entre-transformador-de-corrente-e-de-potencia', destination: '/blog/voce-sabe-qual-a-diferenca-entre-transformador-de-corrente-e-de-potencia', permanent: true },
      { source: '/mais-energia-menos-perda-e-maximo-desempenho', destination: '/blog/mais-energia-menos-perda-e-maximo-desempenho', permanent: true },
      { source: '/transformadores-toroidais-tdb-eficiencia-energetica-e-baixo-ruido-com-tecnologia-nacional', destination: '/blog/transformadores-toroidais-tdb-eficiencia-energetica-e-baixo-ruido-com-tecnologia-nacional', permanent: true },
      { source: '/empresas-de-transformadores-no-brasil', destination: '/blog/empresas-de-transformadores-no-brasil', permanent: true },
      { source: '/regulador-de-tensao-monofasico-da-toroid-estabilidade-e-protecao-para-redes-eletricas', destination: '/blog/regulador-de-tensao-monofasico-da-toroid-estabilidade-e-protecao-para-redes-eletricas', permanent: true },
      { source: '/transformadores-para-saida-de-audio', destination: '/blog/transformadores-para-saida-de-audio', permanent: true },
      { source: '/transformadores-toroidal-x-e-i-entenda-qual-entrega-mais-eficiencia-energetica', destination: '/blog/transformadores-toroidal-x-e-i-entenda-qual-entrega-mais-eficiencia-energetica', permanent: true },
      { source: '/a-importancia-dos-transformadores-de-corrente-toroidais-em-geradores-a-diesel', destination: '/blog/a-importancia-dos-transformadores-de-corrente-toroidais-em-geradores-a-diesel', permanent: true },
      { source: '/como-os-transformadores-toroidais-otimizam-espaco-em-projetos-eletricos', destination: '/blog/como-os-transformadores-toroidais-otimizam-espaco-em-projetos-eletricos', permanent: true },
      { source: '/indutores-toroidais-eficiencia-e-baixa-interferencia', destination: '/blog/indutores-toroidais-eficiencia-e-baixa-interferencia', permanent: true },
      { source: '/fabrica-de-transformadores-toroidais', destination: '/blog/fabrica-de-transformadores-toroidais', permanent: true },
      { source: '/alta-performance-em-som-automotivo-como-os-transformadores-toroidais-entregam-potencia-e-compactacao', destination: '/blog/alta-performance-em-som-automotivo-como-os-transformadores-toroidais-entregam-potencia-e-compactacao', permanent: true },
      { source: '/saturacao-x-protecao-como-um-reator-saturavel-atua-em-circuitos-criticos', destination: '/blog/saturacao-x-protecao-como-um-reator-saturavel-atua-em-circuitos-criticos', permanent: true },
      { source: '/toroidal-e-sinonimo-de-precisao-economia-e-silencio', destination: '/blog/toroidal-e-sinonimo-de-precisao-economia-e-silencio', permanent: true },
      { source: '/por-que-os-transformadores-toroidais-tdb-sao-ideais-para-ambientes-sensiveis', destination: '/blog/por-que-os-transformadores-toroidais-tdb-sao-ideais-para-ambientes-sensiveis', permanent: true },
      { source: '/quais-sao-as-aplicacoes-dos-transformadores-toroidais-de-potencia-da-linha-tdb', destination: '/blog/quais-sao-as-aplicacoes-dos-transformadores-toroidais-de-potencia-da-linha-tdb', permanent: true },

      // Restante dos posts de blog, completando o mapa a partir do export
      // integral do Search Console (paginasGSC.md) — inclui URLs com 0
      // cliques mas impressões reais, preservadas pela mesma regra acima.
      { source: '/transformadores-sob-medida-para-seu-projeto', destination: '/blog/transformadores-sob-medida-para-seu-projeto', permanent: true },
      { source: '/isolamento-eletrico-de-alta-seguranca-proteja-seus-equipamentos-com-a-linha-tdb-da-toroid', destination: '/blog/isolamento-eletrico-de-alta-seguranca-proteja-seus-equipamentos-com-a-linha-tdb-da-toroid', permanent: true },
      { source: '/enrolamento-com-energia-de-ponta', destination: '/blog/enrolamento-com-energia-de-ponta', permanent: true },
      { source: '/eficiencia-energetica-e-confiabilidade-sob-medida-para-o-seu-equipamento', destination: '/blog/eficiencia-energetica-e-confiabilidade-sob-medida-para-o-seu-equipamento', permanent: true },
      { source: '/energia-que-move-o-brasil', destination: '/blog/energia-que-move-o-brasil', permanent: true },
      { source: '/transformador-de-corrente-preco-toroid', destination: '/blog/transformador-de-corrente-preco-toroid', permanent: true },
      { source: '/toroid-e-esg', destination: '/blog/toroid-e-esg', permanent: true },
      { source: '/encapsulado-resinado-ou-simples-escolha-a-fixacao-ideal-para-seu-transformador-toroidal', destination: '/blog/encapsulado-resinado-ou-simples-escolha-a-fixacao-ideal-para-seu-transformador-toroidal', permanent: true },
      // Duplicata do post "ambientes sensíveis" acima (sufixo "-2" no WP,
      // provável republicação) — aponta pro mesmo destino canônico em vez de
      // criar uma segunda página igual.
      { source: '/por-que-os-transformadores-toroidais-tdb-sao-ideais-para-ambientes-sensiveis-2', destination: '/blog/por-que-os-transformadores-toroidais-tdb-sao-ideais-para-ambientes-sensiveis', permanent: true },
      { source: '/inovacao-que-impulsiona', destination: '/blog/inovacao-que-impulsiona', permanent: true },
      { source: '/paineis-eletricos-medicao-segura-com-transformadores-de-corrente-toroidais', destination: '/blog/paineis-eletricos-medicao-segura-com-transformadores-de-corrente-toroidais', permanent: true },
      { source: '/sistema-fotovoltaico-eficiencia-energetica-com-transformadores-de-corrente-toroidais', destination: '/blog/sistema-fotovoltaico-eficiencia-energetica-com-transformadores-de-corrente-toroidais', permanent: true },
      // Possível duplicata de /como-os-transformadores-toroidais-otimizam-espaco-em-projetos-eletricos
      // (mesmo sufixo de slug, prefixo diferente) — mantida separada por
      // falta de confirmação de que é o mesmo artigo. Conferir na Fase 3.
      { source: '/compactacao-inteligente-como-os-transformadores-toroidais-otimizam-espaco-em-projetos-eletricos', destination: '/blog/compactacao-inteligente-como-os-transformadores-toroidais-otimizam-espaco-em-projetos-eletricos', permanent: true },
      { source: '/esg-em-foco', destination: '/blog/esg-em-foco', permanent: true },
      { source: '/qualidade-que-transforma-certificacoes', destination: '/blog/qualidade-que-transforma-certificacoes', permanent: true },
      { source: '/precisao-que-protege-monitore-seu-gerador-com-toroid', destination: '/blog/precisao-que-protege-monitore-seu-gerador-com-toroid', permanent: true },
      { source: '/precisao-para-medir-e-seguranca-para-transformar', destination: '/blog/precisao-para-medir-e-seguranca-para-transformar', permanent: true },
      { source: '/engenharia-acustica-aplicada', destination: '/blog/engenharia-acustica-aplicada', permanent: true },
      { source: '/garantia-que-gera-confianca-como-a-toroid-vai-alem-da-entrega-com-suporte-e-qualidade', destination: '/blog/garantia-que-gera-confianca-como-a-toroid-vai-alem-da-entrega-com-suporte-e-qualidade', permanent: true },
      { source: '/menos-interferencia-mais-estabilidade-o-papel-dos-transformadores-toroidais-na-reducao-de-emi', destination: '/blog/menos-interferencia-mais-estabilidade-o-papel-dos-transformadores-toroidais-na-reducao-de-emi', permanent: true },
      { source: '/a-equipe-que-faz-a-transformacao-acontecer', destination: '/blog/a-equipe-que-faz-a-transformacao-acontecer', permanent: true },
      { source: '/transformadores-em-sistemas-scada-monitoramento-preciso-e-automacao-sem-interrupcoes', destination: '/blog/transformadores-em-sistemas-scada-monitoramento-preciso-e-automacao-sem-interrupcoes', permanent: true },
      { source: '/proteja-economize-e-entregue-mais-valor-os-beneficios-comerciais-da-linha-tdb-da-toroid', destination: '/blog/proteja-economize-e-entregue-mais-valor-os-beneficios-comerciais-da-linha-tdb-da-toroid', permanent: true },
      { source: '/a-parceira-ideal-para-seus-projetos-eletricos', destination: '/blog/a-parceira-ideal-para-seus-projetos-eletricos', permanent: true },
      // "30 anos" no título/slug — dado desatualizado (CLAUDE.md: são 32,
      // nunca 40). O redirect só preserva a URL; corrigir o texto é tarefa
      // de quem reescrever o conteúdo na Fase 3, não deste mapa.
      { source: '/30-anos-toroid-do-brasil', destination: '/blog/30-anos-toroid-do-brasil', permanent: true },
      { source: '/indutores-toroid-alta-performance-para-as-demandas-mais-exigentes-do-mercado', destination: '/blog/indutores-toroid-alta-performance-para-as-demandas-mais-exigentes-do-mercado', permanent: true },
      { source: '/na-toroid-qualidade-nao-e-apenas-promessa-e-compromisso', destination: '/blog/na-toroid-qualidade-nao-e-apenas-promessa-e-compromisso', permanent: true },
      { source: '/compromisso-com-a-excelencia', destination: '/blog/compromisso-com-a-excelencia', permanent: true },
      { source: '/seu-projeto-e-unico-e-nossos-transformadores-tambem', destination: '/blog/seu-projeto-e-unico-e-nossos-transformadores-tambem', permanent: true },
      // Mesma nota de "30 anos" acima.
      { source: '/mais-de-30-anos-de-lideranca-na-fabricacao-de-transformadores-e-indutores', destination: '/blog/mais-de-30-anos-de-lideranca-na-fabricacao-de-transformadores-e-indutores', permanent: true },
      { source: '/engenharia-que-entrega-performance-e-confianca', destination: '/blog/engenharia-que-entrega-performance-e-confianca', permanent: true },
      { source: '/durabilidade-comeca-na-estrutura-transforme-seu-projeto-com-tecnologia-toroid', destination: '/blog/durabilidade-comeca-na-estrutura-transforme-seu-projeto-com-tecnologia-toroid', permanent: true },
      { source: '/toroidais-x-convencionais', destination: '/blog/toroidais-x-convencionais', permanent: true },
      { source: '/iluminacao-eficiente-com-design-inteligente-transformadores-toroidais-em-projetos-arquitetonicos', destination: '/blog/iluminacao-eficiente-com-design-inteligente-transformadores-toroidais-em-projetos-arquitetonicos', permanent: true },
      { source: '/qualidade-certificada-desempenho-comprovado', destination: '/blog/qualidade-certificada-desempenho-comprovado', permanent: true },
      { source: '/juntos-transformamos-desafios-em-solucoes', destination: '/blog/juntos-transformamos-desafios-em-solucoes', permanent: true },
      { source: '/respeito-construindo-conexoes-que-fazem-a-diferenca', destination: '/blog/respeito-construindo-conexoes-que-fazem-a-diferenca', permanent: true },

      // /tranformadores-de-tensao/ (com o typo) é a URL real indexada e
      // aponta pro conteúdo correto — preservada exatamente como está.
      { source: '/tranformadores-de-tensao', destination: '/blog/tranformadores-de-tensao', permanent: true },
      // /transformadores-de-tensao/ (escrita correta, sem tráfego orgânico
      // hoje) redireciona atualmente para um arquivo de mídia do WP por
      // engano. Defensivo: manda pro mesmo destino da versão com typo acima,
      // caso alguém link a versão corrigida no futuro.
      { source: '/transformadores-de-tensao', destination: '/blog/tranformadores-de-tensao', permanent: true },

      // Arquivos de data do WordPress (listagem por dia, sem valor de
      // conteúdo próprio) — padrão de path em vez de lista literal, cobre
      // qualquer arquivo de data que o WP ainda sirva, não só os 6 que
      // apareceram no export do Search Console.
      {
        source: '/:ano(\\d{4})/:mes(\\d{2})/:dia(\\d{2})',
        destination: '/blog',
        permanent: true,
      },

      // /whatsapp/ era link de campanha de rastreio; encaminha direto para o
      // formulário de orçamento (a home já abre o formulário sozinha ao
      // carregar com #orcamento, ver components/forms/OrcamentoForm.tsx).
      {
        source: '/whatsapp',
        destination: '/#orcamento',
        permanent: true,
      },

      // Sem redirect de propósito, 404 natural aceito:
      // - /author/admin/ (arquivo de autor autogerado pelo WP, sem valor de conteúdo)
      // - /whatsapp-linkedin/, /whatsapp-google/, /fabrica-de-transformadores-linkedin/ (idem /whatsapp/, artefatos de rastreio — reestruturação de UTM é pendência à parte, ver ROADMAP.md)
      // - /lp/ (página descontinuada, decisão confirmada, sem página nem redirect)
      // PDFs técnicos (Transf-corrente.pdf, Transf-Transistorizados.pdf) continuam
      // servidos direto da Media Library do WordPress — sem migração, sem redirect,
      // o host de mídia do WP não sai do ar (só o front-end de páginas).
      // /isobox/ mantém o slug (Grupo A) — página nova a construir, sem prioridade
      // definida ainda, ver ROADMAP.md.
      // adicionar cada URL antiga → nova aqui, uma por linha, antes do go-live
    ];
  },
};

export default nextConfig;
