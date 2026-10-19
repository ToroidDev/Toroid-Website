# Catálogo de componentes e módulos

Referência para achar o que já existe antes de criar algo novo. Coluna **Tipo**: `S` = Server Component (sem JS no navegador), `C` = Client Component (`"use client"`, vai para o bundle).

Regra do projeto: só use `"use client"` quando houver interação real (estado, evento, efeito, API do navegador). Quando só um pedaço precisa de interatividade, isole esse pedaço num componente pequeno (como `CookieSettingsLink` dentro do `Footer`, ou `<T>` dentro de uma seção estática).

---

## 1. `lib/`: lógica sem interface

| Arquivo | Responsabilidade | Exports principais | Roda em |
|---|---|---|---|
| [wordpress.ts](../lib/wordpress.ts) | Tipos, mapeamento e fetch da REST API do WP | `getPostsPagina`, `getPosts`, `getPostPorSlug`, `getProduto*`, `getAplicac*`, tipos `Post`, `PostResumo`, `Produto`, `Aplicacao`, `CATEGORIAS_PRODUTO` | Servidor |
| [blog.ts](../lib/blog.ts) | Tema do post derivado do título, formatação de data, decodificação de entidades HTML | `temaDoPost`, `formatarData`, `dataISO`, `decodificarEntidades` | Ambos |
| [produtos.ts](../lib/produtos.ts) | Lista das 4 linhas de produto (TC, TP, Indutores, Isobox) | `produtos`, tipos `Produto`, `ProdutoIcone` | Ambos |
| [segmentos.ts](../lib/segmentos.ts) | Lista dos 5 segmentos com textos em pt/es/en | `SEGMENTOS`, tipo `Segmento` | Ambos |
| [routes.ts](../lib/routes.ts) | Lista de rotas reais (fonte do sitemap e do Markdown) | `ROTAS_ESTATICAS`, `PREFIXOS_DINAMICOS`, `isRotaConhecida` | Ambos |
| [seo.ts](../lib/seo.ts) | Domínio canônico, título/descrição padrão, Open Graph | `SITE_URL`, `absoluteUrl`, `TITULO_PADRAO`, `DESCRICAO_PADRAO`, `metadataOg` | Ambos |
| [institucional.ts](../lib/institucional.ts) | Anos de mercado calculados da fundação (01/05/1994) | `getAnosDeMercado` | Ambos |
| [i18n.ts](../lib/i18n.ts) | Idiomas, cookies, mapa de espelhos, dicionários do Nav/Footer | `LOCALES`, `Locale`, `localizedPath`, `localeFromCountry`, `navDictionary`, `footerDictionary` | Ambos |
| [whatsapp.ts](../lib/whatsapp.ts) | Montagem do link `wa.me` e mensagem padrão por idioma | `montarWhatsappLink`, `resolverMensagem`, `MENSAGEM_PADRAO`, tipo `MensagemWhatsapp` | Ambos |
| [social.ts](../lib/social.ts) | URLs das redes com UTM fixo de saída | `linkSocial(rede, contexto)` | Ambos |
| [attribution.ts](../lib/attribution.ts) | Captura e leitura de UTM/gclid/fbclid (primeiro e último toque) | `capturarAtribuicao`, `obterAtribuicaoAtual` | Navegador |
| [analytics.ts](../lib/analytics.ts) | Eventos GA4 com UTM de último toque | `trackWhatsappClick`, `trackFormSubmit`, `trackSocialClick` | Navegador |
| [consent.ts](../lib/consent.ts) | Preferência de cookies (localStorage, 365 dias) e eventos globais | `getSavedConsent`, `saveConsent`, `EVENTO_ABRIR_CONSENTIMENTO`, `EVENTO_CONSENTIMENTO_SALVO` | Navegador |
| [orcamento-schema.ts](../lib/orcamento-schema.ts) | Validação Zod do formulário (ativo) + versão completa comentada | `orcamentoSchema`, `OrcamentoPayload` | Servidor |
| [leads-schema.ts](../lib/leads-schema.ts) | Formato do documento de lead no MongoDB | `LeadDocument`, `montarLeadDocument`, `attributionBundleSchema` | Servidor |
| [orcamento-mailer.ts](../lib/orcamento-mailer.ts) | Envio dos dois e-mails (novo lead, aviso de WhatsApp pós-envio) | `enviarOrcamentoPorEmail`, `enviarAvisoWhatsappAposEnvio` | Servidor (Node) |
| [mongodb.ts](../lib/mongodb.ts) | Cliente MongoDB singleton em `globalThis`, timeout de 5 s | `getDb(nome = "toroid")` | Servidor (Node) |
| [rate-limit.ts](../lib/rate-limit.ts) | Limite de requisições por IP em memória | `obterIpRequisicao`, `permitirRequisicao` | Servidor |
| [indexnow.ts](../lib/indexnow.ts) | Notificação IndexNow (Bing e outros) | `submitIndexNow(paths)` | Servidor |
| [agent-content.ts](../lib/agent-content.ts) | Respostas em Markdown para agentes (usado pelo `proxy.ts`) | `prefersMarkdown`, `handleMarkdownRequest` | Borda |

---

## 2. `components/layout/`: chrome global (montado em `app/layout.tsx`)

| Componente | Tipo | O que faz | Cuidados |
|---|---|---|---|
| `Nav` | C | Header fixo, menu de produtos (vem de `lib/produtos.ts`), menu mobile com foco preso, botão "Solicitar Orçamento" | Lista `heroClaroPath()` de rotas com topo claro; dispara o evento `toroid:abrir-orcamento` |
| `LocaleProvider` / `useLocale` | C | Contexto de idioma (ver [arquitetura.md](./arquitetura.md#7-internacionalização)) | Nunca ler cookie no servidor no lugar dele |
| `Footer` | S | Rodapé com contatos, redes, seletor de idioma, link de cookies | Único uso do amarelo da marca (fios do logo) |
| `FooterText` | C | Textos do rodapé traduzidos via `footerDictionary` | |
| `ConditionalFooter` | C | Esconde o Footer em `/contato` | |
| `LanguageSwitcher` | C | Bandeiras pt/es/en; navega para o espelho se existir, senão troca texto | Depende de `PAGINAS_ESPELHO` |
| `WhatsAppButton` | C | Botão flutuante de WhatsApp | Some enquanto o banner de cookies está aberto |
| `CookieConsentBanner` | C | Banner de consentimento (aceitar, só essenciais, personalizar) | Reabre com o evento `toroid:open-consent-settings` |
| `CookieSettingsLink` | C | Link "Preferências de cookies" do rodapé | |
| `AttributionCapture` | C | Chama `capturarAtribuicao()` a cada navegação | Precisa ficar dentro de `Suspense` (usa `useSearchParams`) |

## 3. `components/analytics/` e `components/seo/`

| Componente | Tipo | O que faz |
|---|---|---|
| `GoogleAnalytics` | S | Carrega `gtag.js` (`afterInteractive`) só se `GA4_MEASUREMENT_ID` existir |
| `ConsentDefaultScript` | S | Script inline `beforeInteractive` que nega todo consentimento por padrão e aplica a escolha salva |
| `WhatsAppLink` | C | **Todo** link de WhatsApp do site passa por aqui: monta o `wa.me`, abre em nova aba e dispara `whatsapp_click`. Prop `mensagem` (string ou objeto por idioma) |
| `OrganizationSchema` | S | JSON-LD `Organization` do site inteiro. Montado só no layout |
| `LocalBusinessSchema` | S | JSON-LD `LocalBusiness`, usado em `/quem-somos` |

## 4. `components/forms/` e `components/i18n/`

| Componente | Tipo | O que faz |
|---|---|---|
| `OrcamentoForm` | C | Formulário de orçamento. Estados `fechado → aberto → enviando → sucesso | erro`. Abre por clique, por `#orcamento` na URL ou pelo evento `toroid:abrir-orcamento`. Máscara de telefone. Tela de sucesso com CTA de WhatsApp que chama `/api/orcamento/whatsapp`. Textos em pt/es/en num dicionário local. Detalhes em [integracoes.md](./integracoes.md#5-fluxo-do-formulário-de-orçamento) |
| `T` | C | `<T pt="" es="" en="" />`, texto por idioma |

## 5. `components/sections/`: blocos da home (`/` e `/es`)

| Componente | Tipo | O que faz |
|---|---|---|
| `HeroStack` | S | Wrapper que limita o `position: sticky` do Hero ao trecho Hero + ProvaInstitucional |
| `Hero` | S | Hero da home com o logo animado em 3D (`HeroToroidLogo3D`) e `HeroHeadline` |
| `HeroHeadline` | C | Frases de dor/valor que rotacionam no hero |
| `ProvaInstitucional` | S | Faixa de prova (anos, projetos, certificações) que desliza sobre o hero |
| `Produtos` | S | Grade das linhas de produto (de `lib/produtos.ts`) |
| `Segmentos` | S | Cards dos segmentos (de `lib/segmentos.ts`) |
| `Performance` | S | Seção de desempenho com a senoide `CurrentWave` |
| `Fabrica` | S | Fábrica e carrossel de produtos |
| `CTA` | S | Bloco final `id="orcamento"` com `OrcamentoForm` e WhatsApp. **Presente no fim de quase toda página** (exceto `/contato`) |
| `ProvaGoogle` | S | Nota do Google (4,6, 78 avaliações). **Hoje desligado** (import comentado em `app/page.tsx`) |

## 6. `components/produtos/`: template "Pillar" das páginas de produto

Todos em [Pillar.tsx](../components/produtos/Pillar.tsx), estilos em `Pillar.module.css`. Usado por TC, TP, Indutores, Isobox, toroidais e seus espelhos.

| Bloco | Props principais | Papel |
|---|---|---|
| `PillarHero` | `icone`, `nomeCategoria`, `eyebrow`, `titulo`, `lead`, `fatos[]`, `arte?` | Faixa azul de abertura com emblema, fatos e CTAs (orçamento + WhatsApp com mensagem citando `nomeCategoria`) |
| `PillarIndex` | `secoes: SecaoPilar[]` (`{id, titulo}`) | Índice de navegação da página. Os `id` precisam bater com os `id` das seções |
| `PillarBody` | `tone?: "light" \| "tint"`, `pattern?` | Container de seção com fundo |
| `Prose` | `id`, `titulo`, `arte?`, `children` | Seção de texto com `h2`, com ilustração/foto opcional ao lado |
| `PillarFoto` | `src`, `alt`, `legenda?`, `largura`, `altura` | Foto real via `next/image` |
| `Pullquote` | `children`, `fonte` | Citação em destaque |
| `PillarAviso` | `id`, `titulo`, `children` | Caixa de aviso |
| `PillarSpecTable` | `id`, `titulo`, `linhas: [rotulo, valor][]`, `nota?` | Tabela de especificação. As mesmas `linhas` costumam alimentar `additionalProperty` do JSON-LD `Product` |
| `PillarChecklist` | `id`, `eyebrow`, `titulo`, `lead`, `itens[]` | "O que a engenharia precisa para cotar" |
| `PillarClosing` | `id`, `titulo`, `children` | Fecho antes do `CTA`. (O bloco de objeções comerciais `OBJECOES`/`PillarObjections` existe no arquivo, mas está comentado) |

Outros arquivos da pasta:

| Componente | Tipo | Uso |
|---|---|---|
| `PillarEmblem` | S | Emblema SVG do hero por família (`tc`, `potencia`, `indutor`, `toroidal`, `isobox`) |
| `ProdutosAccordion` | S | Listagem em accordion (só CSS) de `/produtos` |
| `CampoUniforme`, `SinalAudio` | S | Ilustrações de `/transformadores-toroidais` |

## 7. `components/aplicacoes/`: páginas de segmento

| Componente | Tipo | Uso |
|---|---|---|
| `AplicacaoHero` | S | Hero das páginas de segmento: `trilha`, `eyebrow`, `titulo`, `lead`, `prova[]` (uma linha), `ctaPrimario`, `ctaWhatsapp`, `arte?` |
| `Perguntas` | S | FAQ visível (`h2` + `h3` por pergunta). Tipo `Pergunta {pergunta, resposta}`. **Reaproveitado também nas páginas de produto e em `/quem-somos`**, e o mesmo array alimenta o JSON-LD `FAQPage` |
| `NucleoIsolado`, `BandaRegulacao` | S | Arte de nobreaks |
| `RuidoContido`, `FaixaControle` | S | Arte de automação industrial |
| `LeituraEstavel`, `FaixaEstabilidade` | S | Arte de equipamentos laboratoriais |
| `PulsoProtegido`, `FaixaIsolamento` | S | Arte de equipamentos médicos |
| `EspecificacoesSobMedida`, `FluxoEspecificacao` | S | Arte de integradores de sistemas |

As ilustrações são SVG desenhados à mão e animados só com CSS (`transform`), sem JS. Cada arquivo explica no cabeçalho o que o desenho afirma e o que **não** afirma (não são curvas de ensaio).

## 8. Componentes exclusivos de uma página

| Pasta | Componentes | Observação |
|---|---|---|
| `blog/` | `BlogHero` (S), `PostDestaque` (S), `PostCard` (S), `PostCover` (S, placa azul quando o post não tem imagem), `TemaChip` (S, `<span>` porque fica dentro de card clicável), `Paginacao` (S, links reais `?page=N`), `PostBody` (S, HTML do WP) | |
| `quem-somos/` | `QuemSomosHero`, `HeroStack`, `Historia`, `LinhaDoTempo` (C, rolagem horizontal com lerp próprio), `MissaoDestaque`, `Valores` (também em `/trabalhe-conosco`), `Compromissos`, `FAQSection`, `VideoInstitucional` (C, fachada que só carrega o YouTube nocookie ao clicar) | |
| `contato/` | `ContatoHero`, `ContatoInfo`, `ContatoMapa` | Telefones, e-mails e endereço ficam em `ContatoInfo` |
| `capacidade-fabril/` | `CapacidadeHero` | |

## 9. `components/ui/`: primitivas

| Componente | Tipo | Uso |
|---|---|---|
| `SectionHeading` | S | Par eyebrow → título → lead. Props `eyebrow`, `lead?`, `tone?: "light" \| "dark"`, `as?: "h1" \| "h2"` |
| `InstitutionalPattern` | S | Padrão gráfico de fundo (espiral, circular, onda). Props `opacity`, `stroke`, `spiral`, `wave` |
| `ProductIcons` | S | Ícones por família (`TcIcon`, `PotenciaIcon`, `IndutorIcon`, `IsoboxIcon`, `ToroidalIcon`) e `ProdutoIconeSvg({icone})` |
| `ProductPlaceholder`, `ImagePlaceholder` | S | Espaço de imagem enquanto não há foto real |
| `ZigZagSecao` | S | Seção texto/imagem alternada (`/capacidade-fabril`, toroidais) |
| `SocialIcons` | S | Glifos de LinkedIn, Instagram, YouTube, WhatsApp, Google (o lucide v1 removeu ícones de marca) |
| `SocialLink` | C | **Todo** link para rede social: URL de `lib/social.ts`, UTM de saída e evento `social_click` |
| `CurrentWave` | C | Senoide animada |
| `HeroToroidLogo3D` | C | Logo animado com relevo, usado no Hero da home |
| `HeroToroid` | C | Núcleo toroidal isométrico, usado em `/transformadores-toroidais` |
| `HeroToroidLogo` | C | Versão 2D anterior do logo animado. **Sem uso hoje** |

---

## 10. Padrões de uso que valem para qualquer componente novo

- **Link de WhatsApp:** sempre `<WhatsAppLink mensagem="...">`, nunca `<a href="https://wa.me/...">`. Senão o evento de conversão não dispara.
- **Link de rede social:** sempre `<SocialLink rede="linkedin" contexto="...">`.
- **Imagem:** sempre `next/image` com `width`/`height` (ou `fill` + container dimensionado). `priority` só na imagem LCP. A exceção aceita é o HTML do corpo de post do WP.
- **Texto traduzível em componente compartilhado com `/es`:** `<T>` ou `Record<Locale, string>`.
- **Número institucional:** anos via `getAnosDeMercado()`; demais números (18.000 projetos, 3.000 clientes, 3 anos de garantia) conforme PRODUCT.md.
- **URL absoluta (JSON-LD, Open Graph):** `absoluteUrl()`, nunca `"https://toroid.com.br"` digitado.
- **Estilo:** CSS Module ao lado do componente, usando tokens de `globals.css`. Não use cor literal se existir token.
- **Animação:** CSS (`transform`/`opacity`), respeitando `prefers-reduced-motion` (o reset global já cobre a maioria dos casos).
