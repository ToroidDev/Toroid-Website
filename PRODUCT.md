# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Engenheiro que especifica o componente: engenharia de projeto/desenvolvimento em OEMs, fabricantes de equipamento e integradores de sistemas elétricos, dimensionando um painel ou equipamento e precisando de um transformador/indutor sob medida antes de fechar o projeto. Segmentos confirmados pela copy existente: equipamentos médicos, nobreaks e condicionadores de energia, automação industrial, equipamentos laboratoriais, integradores de sistemas elétricos.

## Product Purpose

Site institucional da Toroid do Brasil (fabricante de transformadores de corrente, transformadores de potência e indutores/reatores, com núcleo toroidal ou convencional conforme o projeto). Existe para capturar busca de produto: 94% do tráfego orgânico atual é de marca, e a alavanca de crescimento real é aparecer para quem busca pelo componente técnico, não pelo nome da empresa. Sucesso: o engenheiro chega, reconhece que o produto é projetado para a aplicação dele (não vendido de catálogo fechado), e converte em orçamento técnico ou contato direto com engenharia (WhatsApp/formulário).

## Positioning

Engenharia sob medida a partir da aplicação do cliente, com especificação verificada antes de iniciar a produção, não venda por catálogo fixo. Isso é o mecanismo real (fluxo de projeto + ensaio elétrico documentado antes do embarque), não só linguagem de copy: um concorrente que vende peça de catálogo pronta não reproduz isso apenas copiando as especificações do produto. Nunca posicionar uma tecnologia (toroidal vs. outras) como superior: "cada tecnologia atende necessidades diferentes".

## Operating Context

- CMS: WordPress headless (REST API) alimenta o catálogo de produtos e aplicações; front-end nunca fala direto com `wp-json` do browser.
- Fluxo de conversão principal: engenheiro chega por busca de produto → vê produto/segmento relevante → solicita orçamento técnico ou fala com engenharia via WhatsApp. Ambos os caminhos tratados como eventos de conversão distintos (intenção vs. lead real).
- Produção e engenharia no mesmo endereço: planta em São José dos Pinhais · PR. Bobinagem, encapsulamento e ensaio elétrico com rastreabilidade de lote.
- Redirecionamentos 301 herdados do WordPress antigo precisam preservar histórico de SEO e campanhas de Google Ads ativas: nenhuma URL indexada antiga pode ficar sem destino.

## Capabilities and Constraints

- Três famílias de produto, cada uma com página própria: Transformadores de Corrente (`/transformador-de-corrente`), Transformadores de Potência (`/transformador-de-potencia`), Indutores & Reatores (`/indutores-filtros-e-chokes`). As URLs são exigidas por tráfego orgânico e campanhas de Ads já ativas, não seguem um padrão genérico — `/produtos` existe à parte como página própria de listagem das três famílias. Núcleo toroidal **não é uma família**, é uma tecnologia de núcleo que pode ser usada dentro de qualquer uma das três (TC, TP ou Indutor) — `/transformadores-toroidais` continua existindo (URL já indexada) como página explicativa/comparativa dessa tecnologia, sem tabela de especificação própria e sem representar um produto vendável isolado.
- Estrutura de dados WP: CPT `produto` (categoria, variante, faixa técnica, parâmetros de especificação, aplicações relacionadas, imagens) e CPT `aplicacao` (tier ICP, status de Ads, dor do segmento, produtos recomendados). Ver CLAUDE.md para o schema completo.
- Imagens de produto reais estão pendentes (Fase 3, virão do WordPress); a UI atual usa placeholders institucionais (`ProductPlaceholder`) com marcação já preparada para troca direta por `next/image` sem mudança estrutural.
- Meta de performance é requisito de produto, não só técnico: Lighthouse Performance ≥ 90, LCP < 2.5s, CLS < 0.1, INP < 200ms. Decisão de UI que comprometa isso não é uma opção neutra.

## Brand Commitments

- Nome oficial: Toroid do Brasil. Tagline: "Transformando energia e vidas."
- 32 anos de mercado (nunca "40 anos"), +18.000 projetos entregues, +3.000 clientes, garantia de 3 anos.
- Certificações confirmadas: ISO 9001 (RINA), ESG, RoHS Compliant, "Produto 100% brasileiro".
- Identidade visual, tom de voz e vocabulário proibido/obrigatório: ver seção "Identidade visual" e "Tom de voz" em CLAUDE.md, que são a autoridade vigente, não um ponto de partida.

## Evidence on Hand

- Certificações reais disponíveis como imagem: `cert-iso.png`, `cert-esg.png`, `cert-rina-iso9001.jpg`.
- Foto real da fábrica: `fabrica.jpg` (produto/planta reais, nunca produto sobre fundo branco flutuando, por diretriz de CLAUDE.md).
- **Sem cases ou depoimentos de cliente liberados ainda.** `Segmentos.tsx` marca isso explicitamente como `[CASE PENDENTE: aguardando aprovação comercial]`, placeholder real, não conteúdo a substituir por invenção. Nenhum case, depoimento ou nome de cliente deve ser fabricado até liberação comercial.
- **Contato oficial confirmado**: telefone (41) 3035-8282, WhatsApp (41) 3035-8263, e-mails vendas@/engenharia@/rh@toroid.com.br, endereço Rua Antônio Bianchetti, 541 - Iná, São José dos Pinhais, PR, CEP 83065-370, perfis reais de LinkedIn/Instagram/YouTube. Já refletido em `Footer.tsx`, `ContatoInfo.tsx`, `lib/whatsapp.ts` e no schema `Organization` (`components/seo/OrganizationSchema.tsx`). Nome legal: Indústria e Comércio de Transformadores Toroidais Ltda.

## Product Principles

1. Busca de produto, não de marca, é a alavanca de crescimento: toda decisão de conteúdo e estrutura de URL deve favorecer capturar essa busca.
2. O diferencial é engenharia sob medida com verificação prévia, nunca uma tecnologia específica sendo "superior" a outra.
3. Performance (Core Web Vitals) é requisito de produto no mesmo nível que conteúdo, não se sacrifica um pelo outro.
4. Prova institucional é feita de dados verificáveis (certificação, anos de mercado, volume de projetos) enquanto prova social por depoimento/case não está disponível. Não inventar para preencher esse vazio.
5. Todo conteúdo do produto (especificação, imagem, aplicação relacionada) vem do WordPress headless; o site não é a fonte de verdade do catálogo.

## Accessibility & Inclusion

Nenhum requisito específico além do padrão esperado de um site institucional B2B (contraste, navegação por teclado, textos alternativos em imagens de produto/certificação).
