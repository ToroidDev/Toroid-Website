# Arquitetura técnica · site institucional Toroid do Brasil

Documentação de referência do estado real do código, para dar manutenção sem precisar reconstruir o entendimento do zero. Descreve **como o site é construído hoje** (rotas, componentes, fluxo de dados, integrações, infraestrutura) — levantado diretamente do código-fonte em 2026-08-26, não de memória nem de intenção de projeto.

**Como este documento se relaciona com os outros três:**

| Documento | Responde |
|---|---|
| [CLAUDE.md](./CLAUDE.md) | Quais são as regras e convenções a seguir ao editar código (autoridade normativa) |
| [PRODUCT.md](./PRODUCT.md) | Por que o site existe, quem é o usuário, o que é sucesso (autoridade de posicionamento) |
| [ROADMAP.md](./ROADMAP.md) | O que já foi feito, o que falta, quem bloqueia o quê (autoridade de status/histórico) |
| **ARQUITETURA.md** (este arquivo) | Como o sistema é construído de fato hoje — mapa técnico para localizar e entender código (autoridade de arquitetura) |

Onde este documento e o ROADMAP.md divergirem sobre um detalhe de implementação, o código-fonte é sempre a fonte de verdade final — releia o arquivo citado antes de confiar numa afirmação daqui se ela parecer desatualizada.

---

## 1. Visão geral

```
WordPress (admin de conteúdo)          Next.js (App Router, Vercel)           Visitante
────────────────────────────           ─────────────────────────────         ─────────
wp-json/wp/v2/produto     ─┐
wp-json/wp/v2/aplicacao    ├─ REST API ─►  lib/wordpress.ts  ──►  Server Components ──► HTML/CSS
wp-json/wp/v2/posts       ─┘               (fetch + cache/     (nunca client-side)
                                             revalidate/tags)

MongoDB Atlas (coleção "leads")  ◄── after() best-effort ──  app/api/orcamento
SMTP (e-mail comercial)          ◄── bloqueante, crítico  ──  app/api/orcamento
GA4                              ◄── eventos client-side   ──  lib/analytics.ts
```

Pontos estruturais que qualquer mudança precisa respeitar:

- **O browser nunca fala direto com `wp-json`.** Toda leitura de conteúdo do WordPress acontece em Server Component ou API Route (regra em CLAUDE.md, aplicada em [lib/wordpress.ts](./lib/wordpress.ts)).
- **A camada de integração com o WordPress já existe e está pronta, mas só uma fatia dela está em uso em produção.** Posts de blog (CPT nativo `post`) já vêm do WP real. Produto e Aplicação (CPTs custom via Pods) continuam com conteúdo estático hardcoded no repositório, porque os dois CPTs ainda não têm REST API habilitada no WordPress (ver seção 6 e ROADMAP.md, Trilha B).
- **Performance é requisito, não preferência.** Isso molda decisões que parecem estranhas isoladas — por que `/aplicacoes/[slug]` não usa `generateStaticParams`, por que a fonte carrega sem peso 400, por que o filete do hero não anima o `h1`. Cada uma tem motivo documentado no próprio código-fonte.
- **Duas gerações de i18n coexistem de propósito** — ver seção 5. Não é inconsistência a corrigir sem entender o porquê primeiro.

---

## 2. Stack e ambiente de execução

| Item | Valor |
|---|---|
| Framework | Next.js **16.3.0**, App Router, Server Components por padrão |
| Runtime de API Routes | `nodejs` explícito (`export const runtime = "nodejs"`) em [app/api/orcamento/route.ts](./app/api/orcamento/route.ts) e [app/api/orcamento/whatsapp/route.ts](./app/api/orcamento/whatsapp/route.ts) — `nodemailer` e o driver `mongodb` dependem de módulos nativos incompatíveis com Edge |
| React | 19.2.8 |
| Linguagem | TypeScript estrito (`strict: true` em [tsconfig.json](./tsconfig.json)) |
| Validação | Zod v4 |
| CMS | WordPress headless (REST API `wp-json/wp/v2/`), CPTs via plugin **Pods** |
| Banco de leads | MongoDB Atlas (driver `mongodb` v7) |
| E-mail | Nodemailer via SMTP |
| Deploy | Vercel |
| Node exigido | **24.9.0**, fixado em [.nvmrc](./.nvmrc) — rodar `nvm use 24.9.0` antes de qualquer `node`/`npm`/`npx` neste repo. Nota: [package.json](./package.json) declara `engines.node: ">=20.9.0"`, mais permissivo que o `.nvmrc`; o `.nvmrc` é a exigência real de desenvolvimento local. |
| Gerenciador de pacotes | Há tanto `package-lock.json` quanto `pnpm-lock.yaml` no repositório — confirme com quem mantém o projeto qual dos dois é o vigente antes de instalar dependências novas, para não gerar os dois lockfiles divergentes. |

**Convenção "Proxy" (Next.js 16):** este projeto usa a versão mais recente do Next.js, que renomeou `middleware.ts` para `proxy.ts` (mesma função, nome novo — ver [node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md](./node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md)). **Não existe `middleware.ts` neste projeto** — a lógica equivalente está em [proxy.ts](./proxy.ts) na raiz (ver seção 5). [AGENTS.md](./AGENTS.md) já avisa: esta versão do Next.js pode ter convenções fora do treinamento de qualquer LLM — antes de assumir um padrão "clássico" do framework, checar `node_modules/next/dist/docs/`.

---

## 3. Estrutura de pastas

```
app/                    Rotas (App Router). Um page.tsx por rota, metadata + JSON-LD inline em cada arquivo.
  api/                   API Routes (orcamento, orcamento/whatsapp, revalidate)
  es/                    Espelhos reais em espanhol (SSR, indexáveis) de 5 das ~16 rotas
  aplicacoes/            Rota dinâmica [slug] + 5 rotas estáticas irmãs (segmentos/aplicações)
  layout.tsx             Chrome global: fontes, analytics, consent, nav, footer, WhatsApp button
  sitemap.ts / robots.ts Convenção nativa MetadataRoute do Next.js

components/
  layout/                Chrome global: Nav, Footer, LocaleProvider, CookieConsentBanner, AttributionCapture...
  sections/               Blocos da home (Hero, Produtos, Segmentos, Performance, Fabrica, CTA...)
  ui/                     Primitivas e ilustrações SVG próprias (HeroToroid, CurrentWave, ProductPlaceholder...)
  produtos/               Template compartilhado das páginas de família de produto (Pillar.tsx e afins)
  aplicacoes/             Template + ilustrações SVG das páginas de segmento/aplicação
  quem-somos/             Componentes exclusivos de /quem-somos
  capacidade-fabril/      Componentes exclusivos de /capacidade-fabril
  contato/                Componentes exclusivos de /contato
  blog/                   Componentes exclusivos de /blog/[slug]
  forms/                  OrcamentoForm.tsx (form + back-end próprio)
  analytics/              GoogleAnalytics, ConsentDefaultScript, WhatsAppLink (evento de conversão)
  seo/                    OrganizationSchema (global), LocalBusinessSchema (/quem-somos)
  i18n/                   T.tsx (troca de texto client-side)

lib/                     Camada de domínio/integração — ver seção 7, referência completa
public/images/           Assets estáticos (fotos reais de fábrica/certificação, ícones de produto, logo)
proxy.ts                 Equivalente a middleware.ts nesta versão do Next.js — ver seção 5
next.config.ts           images/remotePatterns, headers de cache, redirects 301/308 (~66 entradas)
```

---

## 4. Mapa de rotas

Todas as rotas em português, com arquivo, natureza (estática vs. dependente de dado externo) e se entram no `sitemap.ts`. "Schema JSON-LD" segue a convenção documentada em CLAUDE.md ("Dados estruturados") — confira o arquivo da página antes de assumir que o schema não mudou.

| Rota | Arquivo | Conteúdo | Sitemap | `/es` |
|---|---|---|---|---|
| `/` | [app/page.tsx](./app/page.tsx) | Estático (componentes de `components/sections/`) | Sim | Sim |
| `/produtos` | [app/produtos/page.tsx](./app/produtos/page.tsx) | Estático, a partir de `lib/produtos.ts`. JSON-LD: `BreadcrumbList` + `CollectionPage` | Sim | Não |
| `/transformador-de-corrente` | [app/transformador-de-corrente/page.tsx](./app/transformador-de-corrente/page.tsx) | Estático, template `Pillar` | Sim | Sim |
| `/transformador-de-potencia` | [app/transformador-de-potencia/page.tsx](./app/transformador-de-potencia/page.tsx) | Estático, template `Pillar` | Sim | Sim |
| `/indutores-filtros-e-chokes` | [app/indutores-filtros-e-chokes/page.tsx](./app/indutores-filtros-e-chokes/page.tsx) | Estático, parcial (sem tabela de especificação — falta brief de engenharia) | Sim | Sim |
| `/transformadores-toroidais` | [app/transformadores-toroidais/page.tsx](./app/transformadores-toroidais/page.tsx) | Estático. **Não é uma família de produto** — é a página que explica a tecnologia de núcleo toroidal. JSON-LD: `BreadcrumbList` + `FAQPage` (sem `Product`) | Sim | Sim |
| `/capacidade-fabril` | [app/capacidade-fabril/page.tsx](./app/capacidade-fabril/page.tsx) | Estático, 5 seções sobre o processo fabril. JSON-LD: `BreadcrumbList` | Sim | Não |
| `/quem-somos` | [app/quem-somos/page.tsx](./app/quem-somos/page.tsx) | Estático, conteúdo do brand book. JSON-LD: `LocalBusiness` + `FAQPage` | Sim | Não |
| `/contato` | [app/contato/page.tsx](./app/contato/page.tsx) | Estático. Único layout sem `Footer` (ver `ConditionalFooter`, seção 4.1) | Sim | Não |
| `/trabalhe-conosco` | [app/trabalhe-conosco/page.tsx](./app/trabalhe-conosco/page.tsx) | Estático (e-mail de RH + Instagram, sem vaga formal) | Sim | Não |
| `/aplicacoes/[slug]` | [app/aplicacoes/[slug]/page.tsx](./app/aplicacoes/[slug]/page.tsx) | **100% dependente do CPT `aplicacao` no WP** (`getAplicacaoPorSlug`+`getProdutosPorIds`). Sem `generateStaticParams` — renderiza por request. Sem `WP_API_URL`/CPT exposto, devolve 404 controlado, nunca 500 | Não (dinâmico, sem slugs conhecidos) | Não |
| `/aplicacoes/nobreaks` | [app/aplicacoes/nobreaks/page.tsx](./app/aplicacoes/nobreaks/page.tsx) | Estático, rota irmã de `[slug]` (Next.js prioriza a estática) | Sim | Não |
| `/aplicacoes/automacao-industrial` | [app/aplicacoes/automacao-industrial/page.tsx](./app/aplicacoes/automacao-industrial/page.tsx) | Estático | Sim | Não |
| `/aplicacoes/equipamentos-laboratoriais` | [app/aplicacoes/equipamentos-laboratoriais/page.tsx](./app/aplicacoes/equipamentos-laboratoriais/page.tsx) | Estático | Sim | Não |
| `/aplicacoes/integradores-de-sistemas` | [app/aplicacoes/integradores-de-sistemas/page.tsx](./app/aplicacoes/integradores-de-sistemas/page.tsx) | Estático | Sim | Não |
| `/aplicacoes/equipamentos-medicos` | [app/aplicacoes/equipamentos-medicos/page.tsx](./app/aplicacoes/equipamentos-medicos/page.tsx) | Estático, mas **`robots: noindex` deliberado** — conteúdo normativo (IEC 60601) sem validação de engenharia | **Não** (fora do sitemap de propósito) | Não |
| `/blog` | [app/blog/page.tsx](./app/blog/page.tsx) | `getPosts()` real do WP (20 mais recentes). Sem `WP_API_URL`: estado vazio controlado | Sim | Não |
| `/blog/[slug]` | [app/blog/[slug]/page.tsx](./app/blog/[slug]/page.tsx) | `getPostPorSlug()` real do WP. Sem `WP_API_URL`/post inexistente: 404 controlado | Sim, uma entrada por post (`getPosts()` dentro de `sitemap.ts`, com fallback `.catch(() => [])`) | Não |
| `/es` | [app/es/page.tsx](./app/es/page.tsx) | Espelho SSR real da home, em espanhol (não troca de texto client-side) | Sim | — |
| `/es/transformador-de-corrente` | [app/es/transformador-de-corrente/page.tsx](./app/es/transformador-de-corrente/page.tsx) | Espelho SSR, conteúdo hardcoded em espanhol | Sim | — |
| `/es/transformador-de-potencia` | [app/es/transformador-de-potencia/page.tsx](./app/es/transformador-de-potencia/page.tsx) | Idem | Sim | — |
| `/es/transformadores-toroidais` | [app/es/transformadores-toroidais/page.tsx](./app/es/transformadores-toroidais/page.tsx) | Idem | Sim | — |
| `/es/indutores-filtros-e-chokes` | [app/es/indutores-filtros-e-chokes/page.tsx](./app/es/indutores-filtros-e-chokes/page.tsx) | Idem, sem tabela de especificação (mesma ressalva da versão pt) | Sim | — |
| `/not-found` (404) | [app/not-found.tsx](./app/not-found.tsx) | `robots: {index:false, follow:true}` | — | — |

**Lacuna confirmada:** `/produtos`, `/capacidade-fabril`, `/quem-somos`, `/contato`, `/trabalhe-conosco`, todas as `/aplicacoes/*` e `/blog*` **não têm espelho em espanhol** — ver seção 5.

---

## 5. Internacionalização (i18n)

Duas camadas coexistindo por decisão ("Fase 1", comentário em [lib/i18n.ts](./lib/i18n.ts)), não uma migração incompleta:

### 5.1 Camada A — páginas espelho reais (`/es/*`)

Arquivos `page.tsx` próprios (não a mesma rota com locale dinâmico), SSR de verdade, indexáveis pelo Google porque o servidor já entrega o HTML em espanhol — diferente da Camada B abaixo. Cobrem só 5 rotas hoje: home + as 3 famílias de produto + a página de tecnologia toroidal (ver tabela da seção 4). Cada uma define seu próprio `metadata.alternates.languages` (`pt-BR`/`es`/`x-default` → sempre a versão em português) e seu próprio bloco JSON-LD com URLs absolutas `/es/...`.

### 5.2 Camada B — troca de texto client-side (`<T>`, resto do site)

- [lib/i18n.ts](./lib/i18n.ts): `LOCALES = ["pt","es","en"]`, `DEFAULT_LOCALE = "pt"`. Dois cookies: `toroid_locale` (escolha explícita do visitante) e `toroid_geo_locale` (sugestão geográfica, gravada pelo `proxy.ts`). Exporta `navDictionary`/`footerDictionary` — dicionário centralizado, mas **só para Nav e Footer**; o resto do conteúdo (Hero, ProvaInstitucional etc.) é traduzido inline, componente a componente, via `<T pt="..." es="..." en="..." />`.
- [components/i18n/T.tsx](./components/i18n/T.tsx): client component mínimo — lê `locale` de `useLocale()` e devolve a string correspondente.
- [components/layout/LocaleProvider.tsx](./components/layout/LocaleProvider.tsx): Context Provider client-side, montado no `RootLayout` envolvendo `Nav` + `children` + `Footer`. **Ordem de resolução de idioma** (crítico entender antes de mexer):
  1. Rota fixa (`/es*` → sempre `"es"`, ignora tudo abaixo)
  2. Cookie de escolha explícita (`toroid_locale`)
  3. `navigator.language` do browser, se prefixo for pt/es/en
  4. Cookie geográfico (`toroid_geo_locale`, gravado pelo `proxy.ts`)
  5. `DEFAULT_LOCALE` ("pt")

  SSR sempre entrega em português (exceto quando a rota já é `/es*`); a resolução real roda em `useEffect`, pós-hidratação — ou seja, há um flash de conteúdo em pt antes de trocar pra es/en em quem não está em rota fixa. Isso é uma característica de design (evita tirar a página da geração estática), não um bug de hidratação a "corrigir".
- [components/layout/LanguageSwitcher.tsx](./components/layout/LanguageSwitcher.tsx): usa `localizedPath()` (mapa hardcoded `PAGINAS_ESPELHO` em `lib/i18n.ts`) para decidir se navega de verdade (`<Link>`, quando existe espelho SSR real) ou só troca o texto no client (`<button>`, quando não existe).
- [proxy.ts](./proxy.ts): roda no edge, matcher exclui `_next/static`, `_next/image`, `api/` e paths com extensão. Só grava `toroid_geo_locale` a partir do header `x-vercel-ip-country` (via `localeFromCountry()`), uma vez por visitante. **Nunca decide o idioma exibido nem toca no cookie de escolha explícita** — nunca lê `cookies()/headers()` dentro de Server Component, então nenhuma página sai da geração estática por causa disto.

### 5.3 Lacunas confirmadas

Nenhuma rota `/en/*` existe fisicamente — inglês só funciona via troca client-side (`<T>`). `/es/produtos`, `/es/aplicacoes/*`, `/es/blog*`, `/es/quem-somos`, `/es/contato`, `/es/trabalhe-conosco`, `/es/capacidade-fabril` não existem — nem no diretório `app/es/`, nem no mapa `PAGINAS_ESPELHO`, nem no `sitemap.ts`. Isso não está registrado em nenhum outro documento do projeto hoje; ao planejar expansão de i18n, comece daqui.

---

## 6. Camada de dados — WordPress headless

[lib/wordpress.ts](./lib/wordpress.ts) implementa a integração completa, **mas seu comentário de cabeçalho já avisa: ainda não está em uso em produção para produto/aplicação.**

| CPT/tipo | Função de fetch | Cache | Status real |
|---|---|---|---|
| `produto` | `getProdutoPorSlug`, `getProdutosPorCategoria`, `getProdutosPorIds` | `revalidate: 3600`, tags `produto-${slug}` / `produtos-${categoria}` / `produtos` | **Bloqueado**: `wp/v2/produto` devolve 404 — CPT sem REST API habilitada no Pods (ver ROADMAP.md, Trilha B) |
| `aplicacao` | `getAplicacaoPorSlug`, `getAplicacoesPorIds` | idem, tags `aplicacao-${slug}` / `aplicacoes` | **Bloqueado**, mesma causa |
| `post` (nativo) | `getPosts`, `getPostPorSlug` | idem, tags `post-${slug}` / `posts` | **Em produção desde 2026-08-17** — `/blog` já renderiza posts reais |

Base de fetch (`wpFetch<T>`, não exportada): lança erro se `WP_API_URL` não estiver configurada, ou se `!res.ok` — **sem fallback silencioso**, quem chama trata o erro (as páginas `/aplicacoes/[slug]` e `/blog*` tratam com `notFound()` controlado).

Mapeamento raw→interno: os campos ACF chegam em snake_case (`categoria_produto`, `faixa_tecnica`, `tier_icp`, `dor_segmento` etc., ver schema completo em CLAUDE.md); `mapProduto`/`mapAplicacao`/`mapPost` traduzem para camelCase com fallback `?? []`/`?? null`.

`limparResiduoDoWord()` (privada, usada só por `mapPost`): remove via regex os wrappers `<span data-ccp-props>`/`<span data-contrast>` que sobram quando um post foi colado do Word direto no editor do WP — confirmado em 13 dos 64 posts reais.

`CATEGORIAS_PRODUTO` no código ainda reflete o enum antigo do WordPress (`transformador-de-corrente` | `transformador-toroidal` | `indutor-reator`) — **desatualizado frente à taxonomia real do front-end** (que é TC / TP / Indutores, com toroidal como tecnologia cross-line, não família). Ver ROADMAP.md sobre a pendência de corrigir isso no admin do WP antes de ligar o item 10 da Trilha A (trocar conteúdo estático por dado real).

---

## 7. Referência de `lib/`

| Arquivo | Responsabilidade | Exports principais |
|---|---|---|
| [lib/wordpress.ts](./lib/wordpress.ts) | Tipos + fetch do CMS headless | `Produto`, `Aplicacao`, `Post`, `getProdutoPorSlug`, `getProdutosPorCategoria`, `getProdutosPorIds`, `getAplicacaoPorSlug`, `getAplicacoesPorIds`, `getPosts`, `getPostPorSlug` |
| [lib/produtos.ts](./lib/produtos.ts) | Dado estático das 3 famílias de produto (usado hoje por Nav, home, `/produtos`) | `produtos: Produto[]` (id, nome, href, ícone, imagem local) |
| [lib/institucional.ts](./lib/institucional.ts) | Cálculo de tempo de mercado | `getAnosDeMercado()` — calcula a partir de 1º/mai/1994, nunca hardcoded |
| [lib/seo.ts](./lib/seo.ts) | URL absoluta canônica | `SITE_URL`, `absoluteUrl(path)` |
| [lib/attribution.ts](./lib/attribution.ts) | Captura UTM first/last-touch | `capturarAtribuicao()` (grava), `obterAtribuicaoAtual()` (lê) — ver seção 8 |
| [lib/analytics.ts](./lib/analytics.ts) | Eventos GA4 | `trackWhatsappClick()`, `trackFormSubmit()` — ambos anexam UTM de último toque |
| [lib/whatsapp.ts](./lib/whatsapp.ts) | Link de WhatsApp | `WHATSAPP_NUMBER`, `montarWhatsappLink()`, `montarMensagemPadrao()` |
| [lib/consent.ts](./lib/consent.ts) | Google Consent Mode v2 | `getSavedConsent()`, `saveConsent()`, eventos `toroid:open-consent-settings`/`toroid:consent-saved` |
| [lib/mongodb.ts](./lib/mongodb.ts) | Client singleton MongoDB | `getDb(nomeBanco = "toroid")` — cacheado em `globalThis`, timeout 5s |
| [lib/leads-schema.ts](./lib/leads-schema.ts) | Schema do documento de lead | `LeadDocument`, `montarLeadDocument()`, `attributionBundleSchema` (Zod, com fallback) |
| [lib/orcamento-schema.ts](./lib/orcamento-schema.ts) | Validação do formulário | `orcamentoSchema` (ativo: nome/email/telefone/observação), `orcamentoSchemaCompleto` **comentado** (por categoria TC/TP/Indutor, aguardando decisão comercial) |
| [lib/orcamento-mailer.ts](./lib/orcamento-mailer.ts) | E-mail via SMTP | `enviarOrcamentoPorEmail()`, `enviarAvisoWhatsappAposEnvio()` |
| [lib/i18n.ts](./lib/i18n.ts) | Sistema de i18n | Ver seção 5 |

---

## 8. Formulário de orçamento e captura de lead — fluxo completo

```
OrcamentoForm.tsx (client)
  │  estado: fechado → aberto → enviando → sucesso | erro
  │  aberto via: clique no CTA do Nav (evento "toroid:abrir-orcamento") OU #orcamento na URL
  ▼
POST /api/orcamento  { nome, email, telefone, observacao, attribution }
  │
  ├─ 1. orcamentoSchema.safeParse → 400 se inválido (erros por campo)
  ├─ 2. attributionBundleSchema.parse (com fallback, nunca derruba a request)
  ├─ 3. leadId = new ObjectId()  ← gerado ANTES de responder, síncrono
  ├─ 4. montarLeadDocument(...)  ← inclui contexto: userAgent, ipHash (HMAC-SHA256 se
  │      LEAD_IP_HASH_SECRET existir, senão SHA-256 puro), device (regex de user-agent)
  ├─ 5. after(() => mongo.insertOne(leadDocument))  ← BEST-EFFORT, roda depois da resposta,
  │      falha só loga no servidor, nunca afeta o visitante
  ├─ 6. await enviarOrcamentoPorEmail(...)  ← BLOQUEANTE E CRÍTICO. Falha = 502 pro visitante
  └─ 7. 200 { ok:true, leadId }
  ▼
OrcamentoForm.tsx exibe tela de sucesso com CTA de WhatsApp contextual
  (mensagem cita o nome de quem enviou, não a mensagem estática de lib/whatsapp.ts)
  │  clique dispara, fire-and-forget:
  ▼
POST /api/orcamento/whatsapp  { leadId }
  │  findOneAndUpdate filtrando "whatsappAposEnvio.clicado: false" → idempotente,
  │  clique repetido não reenvia e-mail nem sobrescreve o timestamp
  └─ marca o MESMO documento (nunca cria um segundo lead) + enviarAvisoWhatsappAposEnvio()
```

**Por que essa complexidade existe:** no site antigo, a tela de confirmação do formulário também oferecia WhatsApp, e muita gente usava os dois canais para o mesmo pedido — o comercial contava como dois leads, distorcendo métrica de ICP fit. O `leadId` síncrono + `whatsappAposEnvio` resolvem isso sem impedir o visitante de usar os dois canais.

**Campos ativos hoje:** `nome`, `email`, `telefone` (com máscara automática de celular/fixo), `observacao` (opcional). Campos `empresa`/`categoria` existem no JSX comentados, aguardando validação comercial — mesmo status do `orcamentoSchemaCompleto` (discriminado por categoria TC/TP/Indutor) comentado em `lib/orcamento-schema.ts`. Ambos precisam ser reativados juntos (schema + form) quando a decisão vier.

**`consent.lgpd` do documento salvo é sempre `false`**, por decisão permanente de 2026-08-25 (sem checkbox de consentimento LGPD no form) — não é bug, ver CLAUDE.md.

---

## 9. Analytics, atribuição de campanha e consentimento

### 9.1 Atribuição UTM

[lib/attribution.ts](./lib/attribution.ts): captura `utm_source/medium/campaign/term/content`, `gclid`, `fbclid` da URL. **First-touch** grava em `localStorage` só se ainda não existir (nunca sobrescrito). **Last-touch** sobrescreve em `sessionStorage` a cada nova visita com parâmetro de campanha na URL (navegação interna sem UTM não sobrescreve). `capturarAtribuicao()` roda uma vez por carregamento, montada globalmente via [components/layout/AttributionCapture.tsx](./components/layout/AttributionCapture.tsx) no `RootLayout`.

### 9.2 Eventos GA4

[lib/analytics.ts](./lib/analytics.ts) expõe exatamente dois eventos, ambos anexando o UTM de **último toque** (não `gclid`/`fbclid` — esses ficam só na atribuição salva, não vão pro GA4):

- `whatsapp_click` — disparado por todo link de WhatsApp do site, centralizado em [components/analytics/WhatsAppLink.tsx](./components/analytics/WhatsAppLink.tsx) (substitui `<a href={whatsappLink}>` direto em qualquer lugar novo).
- `form_submit` — disparado em `OrcamentoForm.tsx` só após `{ok:true}` real do back-end (lead confirmado, não intenção).

Ambos no-op silencioso se `GA4_MEASUREMENT_ID` não estiver configurado (checagem em [components/analytics/GoogleAnalytics.tsx](./components/analytics/GoogleAnalytics.tsx), que só monta `window.gtag` quando a env var existe).

### 9.3 Consent Mode v2

[lib/consent.ts](./lib/consent.ts) gerencia só a categoria `analytics` (persistida em `localStorage`, chave `toroid-consent`, expira em 365 dias). Fluxo:

1. [components/analytics/ConsentDefaultScript.tsx](./components/analytics/ConsentDefaultScript.tsx) — script `beforeInteractive` (roda antes do `gtag.js`), seta **tudo negado por padrão** (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`), depois lê o `localStorage` diretamente (string literal, não importa de `lib/consent.ts` por ser script inline) e atualiza se já houver escolha salva.
2. [components/layout/CookieConsentBanner.tsx](./components/layout/CookieConsentBanner.tsx) — banner com "Aceitar todos" / "Somente essenciais" / "Salvar preferências", chama `saveConsent()`, que grava local e chama `gtag('consent', 'update', ...)`.
3. Reabertura via evento global `toroid:open-consent-settings` (link "Preferências de cookies" no rodapé) — [components/layout/WhatsAppButton.tsx](./components/layout/WhatsAppButton.tsx) escuta o mesmo evento pra se esconder enquanto o banner cobre o canto inferior direito, e reaparece em `toroid:consent-saved`.

`ad_*` sempre fica negado — só `analytics_storage` é gerenciável pelo visitante hoje (não há remarketing/Ads pixel neste site).

---

## 10. SEO e dados estruturados

Convenção normativa completa em CLAUDE.md ("Dados estruturados"); aqui vai só o estado real, verificado:

- `Organization`: [components/seo/OrganizationSchema.tsx](./components/seo/OrganizationSchema.tsx), montado **uma única vez** no `RootLayout`, aplicado a todo o site.
- `LocalBusiness`: [components/seo/LocalBusinessSchema.tsx](./components/seo/LocalBusinessSchema.tsx), só em `/quem-somos`.
- `FAQPage`: reaproveita o mesmo componente [components/aplicacoes/Perguntas.tsx](./components/aplicacoes/Perguntas.tsx) tanto nas páginas de aplicação/segmento quanto em `/quem-somos` (via `FAQSection.tsx`) — um único componente de UI+schema, não duplicado por página.
- `Product`+`BreadcrumbList`+`FAQPage`: páginas de família de produto (TC, TP), via template `Pillar` (seção 11).
- `BreadcrumbList`+`FAQPage` sem `Product`: `/transformadores-toroidais` (não é produto vendável isolado).
- `BreadcrumbList`+`CollectionPage`: `/produtos` (listagem).
- `BreadcrumbList` isolado: `/capacidade-fabril`.

**`app/sitemap.ts`**: array `ROTAS_ESTATICAS` (15 rotas reais) + `espelhos` (as 5 rotas `/es/*`) + `getPosts()` importado dinamicamente com `.catch(() => [])` pra não derrubar o sitemap inteiro numa instabilidade do WP. `/aplicacoes/equipamentos-medicos` fica fora de propósito (ver seção 4). `ALTERNADAS` adiciona `hreflang` pt-BR/es só nas 5 rotas com espelho real.

**`app/robots.ts`**: permite `Googlebot`, `OAI-SearchBot`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`, `Google-Extended`; bloqueia `GPTBot` e `ClaudeBot` — decisão deliberada da diretoria (bot de busca/resposta que cita fonte passa, bot de treinamento sem link de volta não passa). Catch-all `*` permite `/`, bloqueia `/wp-admin` e `/wp-json`.

---

## 11. Sistema de design de página (template `Pillar`)

As páginas de família de produto (TC, TP) e a página de tecnologia toroidal compartilham um único conjunto de blocos de [components/produtos/Pillar.tsx](./components/produtos/Pillar.tsx): `PillarHero`, `PillarIndex`, `PillarBody`, `Prose`, `PillarChecklist`, `PillarSpecTable`, `PillarClosing`, `Pullquote`, e o emblema SVG em [components/produtos/PillarEmblem.tsx](./components/produtos/PillarEmblem.tsx). As páginas de aplicação/segmento seguem um template análogo próprio (`AplicacaoHero` + `Prose` + `PillarChecklist` + `Perguntas`/FAQ + `CTA`, ver [components/aplicacoes/](./components/aplicacoes/)), com uma ilustração SVG determinística e sem estado por segmento (`NucleoIsolado`, `PulsoProtegido`, `RuidoContido`, `LeituraEstavel`, `EspecificacoesSobMedida` etc.) — animação só via CSS, sempre com `prefers-reduced-motion` respeitado globalmente em [app/globals.css](./app/globals.css).

Ao criar uma nova página de família de produto ou de segmento, reaproveitar esses templates é o padrão esperado — não recriar layout do zero.

---

## 12. Identidade visual — tokens (`app/globals.css`)

```css
--color-blue: #1a4b8c;        /* primária institucional */
--color-blue-deep: #123c74;
--color-blue-ink: #0e2e5a;
--color-blue-abyss: #091c38;
--color-green: #5ea75e;       /* detalhe, nunca peso igual ao azul */
--color-yellow: #fbf23d;      /* exclusivo dos 3 fios do logo — nunca em UI */
--color-text: #393738;
--font-title: var(--font-montserrat)...   /* só h1/h2/h3, peso 700 */
--font-body: var(--font-karla)...         /* corpo, line-height 1.6 */
```

`--color-on-blue*` são as variantes de texto calibradas para contraste AA sobre `--color-blue` (comentário no CSS: nunca clarear um gradiente além do azul base sem recalibrar esses tokens, quebra acessibilidade). Fontes carregadas via `next/font/google` em [app/layout.tsx](./app/layout.tsx) — Montserrat só nos pesos 600/700 (peso 400 removido de propósito, corpo/label/botão usam Karla). Regras completas de marca (o que nunca fazer) estão em CLAUDE.md, seção "Identidade visual" — esse arquivo é a autoridade vigente.

---

## 13. Redirects e URLs legadas

[next.config.ts](./next.config.ts): **~66 entradas** em `redirects()`, todas `permanent: true` (HTTP 308, equivalente a 301 para SEO — comportamento padrão do Next.js, não bug). Categorias:

- Migração interna de rota (`/transformadores-nobreaks` → `/aplicacoes/nobreaks`)
- Posts de blog antigos → `/blog/[slug]` (mesmo slug)
- Padrão de path para arquivos de data do WP: `{ source: '/:ano(\d{4})/:mes(\d{2})/:dia(\d{2})', destination: '/blog' }` — um redirect cobre qualquer URL não listada explicitamente
- `/whatsapp` → `/#orcamento`
- Casos **sem redirect por decisão** (404 aceito): `/lp` (descontinuada), artefatos de rastreio de campanha antigos, PDFs técnicos (seguem na Media Library do WP, fora do domínio do front-end novo), `/isobox` (slug reservado, página nova ainda não construída)

`images.remotePatterns` cobre só `toroid.com.br/wp-content/uploads/**` — se a mídia migrar para CDN/subdomínio próprio, precisa de uma entrada nova (comentário no próprio arquivo já avisa disso).

---

## 14. Variáveis de ambiente

Referência operacional — a autoridade normativa completa (o que cada uma faz, onde configurar) está em CLAUDE.md, seção "Variáveis de ambiente". Lista rápida do que existe hoje:

| Variável | Consumida por | Efeito se ausente |
|---|---|---|
| `WP_API_URL` | [lib/wordpress.ts](./lib/wordpress.ts) | `wpFetch` lança erro explícito |
| `WHATSAPP_NUMBER` | [lib/whatsapp.ts](./lib/whatsapp.ts) | Cai no fallback hardcoded `554130358258` |
| `GA4_MEASUREMENT_ID` | [components/analytics/GoogleAnalytics.tsx](./components/analytics/GoogleAnalytics.tsx) | Script GA4 não renderiza, eventos viram no-op |
| `MONGODB_URI` | [lib/mongodb.ts](./lib/mongodb.ts) | `getDb()` lança erro — captado pelo `try/catch` do `after()`, só loga, não derruba o form |
| `LEAD_IP_HASH_SECRET` | [app/api/orcamento/route.ts](./app/api/orcamento/route.ts) | Hash de IP cai para SHA-256 simples (mais fraco que HMAC) |
| `REVALIDATE_SECRET` | [app/api/revalidate/route.ts](./app/api/revalidate/route.ts) | Rota nunca autoriza (retorna sempre 401) |
| `SMTP_HOST`/`PORT`/`USER`/`PASSWORD`/`FROM` | [lib/orcamento-mailer.ts](./lib/orcamento-mailer.ts) | `getTransport()` lança erro — formulário retorna 502 ao visitante |
| `ORCAMENTO_DESTINATARIOS` | [lib/orcamento-mailer.ts](./lib/orcamento-mailer.ts) | `enviarOrcamentoPorEmail` lança erro — mesmo efeito acima |

---

## 15. Deploy e infraestrutura

- **Vercel**, três ambientes (Production/Preview/Development), env vars replicadas nos três (ver CLAUDE.md para status de confirmação de cada uma).
- `next.config.ts` → `serverExternalPackages: ['mongodb']`: evita o bundler do servidor tentar empacotar dependências nativas opcionais do driver (`kerberos`, `snappy`, `aws4`) que não estão instaladas.
- Headers de cache: assets `/_next/static/:path*` e imagens estáticas de `/public` recebem `Cache-Control: public, max-age=31536000, immutable`.
- `revalidateTag` sob demanda: webhook do WordPress (a configurar, ver ROADMAP.md) → `POST /api/revalidate` → `revalidateTag(tag, { expire: 0 })` (expira imediatamente, não usa o `profile: "max"` recomendado por padrão pela doc do Next, porque isso só invalidaria no próximo acesso, deixando conteúdo desatualizado até alguém visitar).
- `@vercel/analytics` e `@vercel/speed-insights` montados no `RootLayout`, fora do `LocaleProvider`.

---

## 16. Estado atual e lacunas conhecidas

Este documento descreve **como o sistema é construído**; **o que falta fazer e quem bloqueia cada item** é responsabilidade do ROADMAP.md — não duplicar aqui. Pontos de arquitetura que vale ter em mente ao planejar o próximo trabalho:

1. **`lib/wordpress.ts` está pronto e esperando** para produto/aplicação — o trabalho de código já foi feito, falta o WP admin expor os dois CPTs via REST (Pods → Advanced Options → REST API, ver passo a passo em ROADMAP.md, Trilha B).
2. **i18n em espanhol cobre só 5 de ~23 rotas** (seção 5.3) — se o negócio decidir expandir `/es`, o padrão de página-espelho SSR (Camada A) é o que garante indexação; a troca client-side (Camada B) não indexa.
3. **`CATEGORIAS_PRODUTO` em `lib/wordpress.ts` reflete taxonomia desatualizada** frente ao front-end real — precisa de correção coordenada com o WP admin antes do item 10 da Trilha A do ROADMAP ligar de fato.
4. **Formulário técnico por categoria** (TC/TP/Indutor) já está escrito e comentado em `lib/orcamento-schema.ts` — reativação é decisão comercial, não trabalho de engenharia pendente.
5. **`package.json` engines (`>=20.9.0`) diverge do `.nvmrc` (`24.9.0`)** — nenhum dos dois está "errado" per se, mas vale alinhar antes que alguém instale com uma versão de Node fora do que o `.nvmrc` pede.
6. **Dois lockfiles coexistem** (`package-lock.json` e `pnpm-lock.yaml`) — confirmar com quem mantém o projeto qual é o gerenciador de pacotes vigente.

Para status vivo (o que foi concluído quando, o que está bloqueado por quem), sempre ir ao ROADMAP.md — ele é atualizado a cada sessão de trabalho, este documento não.
