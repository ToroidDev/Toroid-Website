# Arquitetura

Como o site é construído hoje. Para contratos com sistemas externos (WordPress, MongoDB, SMTP, GA4) ver [integracoes.md](./integracoes.md); para o catálogo de componentes, [componentes.md](./componentes.md).

Levantado do código em 2026-10-02 (substitui o antigo `ARQUITETURA.md` da raiz, de 2026-08-26).

---

## 1. Visão geral

```
                     ┌──────────────────────── Vercel (projeto toroid-website) ────────────────────────┐
Visitante ──HTTPS──► │ proxy.ts (borda)  ──►  Páginas estáticas (○)  /  Páginas dinâmicas (ƒ)          │
toroid.com.br        │   • cookie geo         Server Components         /blog, /blog/[slug],           │
(DNS: Cloudflare,    │   • Markdown p/ agente  HTML pronto no build     /aplicacoes/[slug]             │
 A → 76.76.21.21)    │                                                   │                              │
                     │ API Routes (Node.js): /api/orcamento, /api/orcamento/whatsapp, /api/revalidate  │
                     └───────────┬───────────────────────┬──────────────────────┬──────────────────────┘
                                 │ fetch c/ cache 1h      │ SMTP (bloqueante)    │ insertOne (after())
                                 ▼                       ▼                      ▼
                WordPress.com (headless)          Relay SMTP            MongoDB Atlas
                toroidcombr.wpcomstaging.com      → e-mail comercial    banco toroid, coleção leads
                wp-json/wp/v2/posts + mídia

No navegador: GA4 (gtag.js, só com consentimento),
              atribuição UTM em localStorage/sessionStorage.
```

Princípios que toda mudança precisa respeitar:

1. **O navegador nunca fala com o WordPress.** Toda leitura de conteúdo é feita no servidor ([lib/wordpress.ts](../lib/wordpress.ts)). As únicas requisições do browser para fora são GA4, `wa.me` e as imagens.
2. **Estático por padrão.** Nenhum Server Component lê `cookies()` ou `headers()`. O idioma é resolvido no cliente justamente para não tirar páginas da geração estática.
3. **Conteúdo de produto e segmento é código**, não CMS (por enquanto). Só o blog vem do WordPress. Ver seção 6.
4. **Falha parcial nunca derruba a página.** WordPress fora do ar: blog mostra estado vazio, sitemap sai sem posts. MongoDB fora: formulário continua respondendo. Cada degradação está comentada no código.
5. **Performance é requisito**, o que explica várias decisões que parecem estranhas isoladas (fonte sem peso 400, `Suspense` em volta da captura de UTM, ilustrações em SVG em vez de imagem).

---

## 2. Stack

| Item | Valor |
|---|---|
| Framework | Next.js **16.3.5**, App Router, Turbopack, Server Components por padrão |
| React | 19.2.8 |
| Linguagem | TypeScript `strict: true`; alias `@/*` aponta para a raiz ([tsconfig.json](../tsconfig.json)) |
| Estilo | CSS Modules por componente (`*.module.css`) + tokens globais em [app/globals.css](../app/globals.css). Sem Tailwind, sem biblioteca de UI |
| Ícones | `lucide-react` (tree-shaken, importação por ícone) |
| Validação | Zod 4 |
| E-mail | Nodemailer 9 |
| Banco | Driver `mongodb` 7 (declarado em `serverExternalPackages`) |
| Observabilidade | Logs de runtime da Vercel (`@vercel/analytics` e `@vercel/speed-insights` seguem no `package.json`, sem uso, desde 2026-10-19) |
| Deploy | Vercel, Node 24.x, time `toroid`, projeto `toroid-website` |
| Node local | 24.9.0 ([.nvmrc](../.nvmrc)) |

As únicas 9 dependências de runtime estão em [package.json](../package.json). Adicionar uma nova exige justificativa (CLAUDE.md, "Nada de bibliotecas pesadas").

### Convenções do Next.js 16 que pegam desprevenido

- **`proxy.ts`, não `middleware.ts`.** O arquivo de borda foi renomeado no Next 16. A função exportada se chama `proxy`.
- **`params` e `searchParams` são Promises.** Sempre `const { slug } = await params`.
- **`after()`** (de `next/server`) agenda trabalho para depois da resposta. Usado para gravar lead e notificar IndexNow.
- **`revalidateTag(tag, { expire: 0 })`** recebe um segundo argumento obrigatório de perfil.
- **`LayoutProps<"/">`** é um tipo global gerado pelo Next (usado em `app/layout.tsx`).
- A documentação da versão instalada está em `node_modules/next/dist/docs/`. Consulte lá antes de confiar em tutorial ou em resposta de IA (ver [AGENTS.md](../AGENTS.md)).

---

## 3. Estrutura de pastas

```
app/                         Rotas (App Router). Cada page.tsx carrega seu próprio metadata e JSON-LD.
  layout.tsx                 Chrome global: fontes, consentimento, GA4, Organization schema, Nav, Footer, WhatsApp
  globals.css                Tokens de cor/tipografia/espaçamento, reset, prefers-reduced-motion global
  page.tsx                   Home
  not-found.tsx              404 (noindex)
  sitemap.ts / robots.ts     Convenção MetadataRoute nativa
  api/                       orcamento/, orcamento/whatsapp/, revalidate/
  aplicacoes/                [slug] dinâmico (WP) + 5 páginas estáticas de segmento
  blog/                      Listagem paginada e [slug], ambos do WordPress
  es/                        Espelhos em espanhol (6 páginas, conteúdo próprio)
  <rota>/page.tsx            Demais páginas institucionais e de produto

components/
  layout/                    Chrome global (Nav, Footer, LocaleProvider, banner de cookies, botão WhatsApp...)
  sections/                  Blocos da home (Hero, Produtos, Segmentos, Performance, Fabrica, CTA...)
  produtos/                  Template "Pillar" das páginas de produto
  aplicacoes/                Hero, FAQ e ilustrações das páginas de segmento
  blog/, quem-somos/, contato/, capacidade-fabril/   Blocos exclusivos de cada página
  forms/                     OrcamentoForm (único formulário do site)
  analytics/                 GoogleAnalytics, ConsentDefaultScript, WhatsAppLink
  seo/                       OrganizationSchema (global), LocalBusinessSchema (/quem-somos)
  i18n/                      <T>, troca de texto por idioma
  ui/                        Primitivas e ilustrações SVG (HeroToroid, padrões, ícones de produto...)

lib/                         Lógica sem UI: dados estáticos, integração, validação, i18n. Ver componentes.md
public/                      Imagens estáticas, llms.txt, og-image.jpg, chave do IndexNow
proxy.ts                     Borda: cookie de sugestão de idioma + negociação de Markdown
next.config.ts               Imagens remotas, headers de segurança/cache, 66 redirects legados
```

`docs/` é esta documentação. `fotos-originais/` (ignorada pelo git) guarda as fotos em alta resolução que deram origem aos `.webp` de `public/images/produtos`.

---

## 4. Mapa de rotas

Legenda: **○** pré-renderizada no build (estática), **ƒ** renderizada por requisição. Confirmado com `next build` em 2026-10-02.

| Rota | Arquivo | Render | Origem do conteúdo | Sitemap | Espelho `/es` | JSON-LD (além de `Organization`) |
|---|---|---|---|---|---|---|
| `/` | [app/page.tsx](../app/page.tsx) | ○ | Código (`components/sections`) | Sim | Sim | Nenhum próprio |
| `/produtos` | [app/produtos/page.tsx](../app/produtos/page.tsx) | ○ | `lib/produtos.ts` | Sim | Não | `BreadcrumbList`, `CollectionPage` (com `WebPage` aninhado) |
| `/transformador-de-corrente` | [app/transformador-de-corrente/page.tsx](../app/transformador-de-corrente/page.tsx) | ○ | Código, template Pillar | Sim | Sim | `Product`, `BreadcrumbList`, `FAQPage` |
| `/transformador-de-potencia` | [app/transformador-de-potencia/page.tsx](../app/transformador-de-potencia/page.tsx) | ○ | Código, template Pillar | Sim | Sim | `Product`, `BreadcrumbList`, `FAQPage` |
| `/indutores-filtros-e-chokes` | [app/indutores-filtros-e-chokes/page.tsx](../app/indutores-filtros-e-chokes/page.tsx) | ○ | Código, sem tabela de especificação (falta faixa técnica da engenharia) | Sim | Sim | `Product`, `BreadcrumbList`, `FAQPage` |
| `/isobox` | [app/isobox/page.tsx](../app/isobox/page.tsx) | ○ | Código, template Pillar | Sim | Sim | `Product`, `BreadcrumbList`, `FAQPage` |
| `/transformadores-toroidais` | [app/transformadores-toroidais/page.tsx](../app/transformadores-toroidais/page.tsx) | ○ | Código. **Tecnologia de núcleo, não família de produto** | Sim | Sim | `BreadcrumbList`, `FAQPage` |
| `/capacidade-fabril` | [app/capacidade-fabril/page.tsx](../app/capacidade-fabril/page.tsx) | ○ | Código | Sim | Não | `BreadcrumbList` |
| `/quem-somos` | [app/quem-somos/page.tsx](../app/quem-somos/page.tsx) | ○ | Código | Sim | Não | `BreadcrumbList`, `LocalBusiness`, `FAQPage`, `VideoObject` |
| `/contato` | [app/contato/page.tsx](../app/contato/page.tsx) | ○ | Código. Única página sem Footer e sem bloco `#orcamento` | Sim | Não | Nenhum próprio |
| `/trabalhe-conosco` | [app/trabalhe-conosco/page.tsx](../app/trabalhe-conosco/page.tsx) | ○ | Código | Sim | Não | `BreadcrumbList` |
| `/aplicacoes/nobreaks` | [app/aplicacoes/nobreaks/page.tsx](../app/aplicacoes/nobreaks/page.tsx) | ○ | Código | Sim | Não | `Product`, `BreadcrumbList`, `FAQPage` |
| `/aplicacoes/automacao-industrial` | idem `automacao-industrial/` | ○ | Código | Sim | Não | idem |
| `/aplicacoes/equipamentos-laboratoriais` | idem | ○ | Código | Sim | Não | idem |
| `/aplicacoes/integradores-de-sistemas` | idem | ○ | Código | Sim | Não | idem |
| `/aplicacoes/equipamentos-medicos` | idem | ○ | Código, **`noindex` deliberado** (conteúdo normativo sem validação da engenharia) | **Não** | Não | idem |
| `/aplicacoes/[slug]` | [app/aplicacoes/[slug]/page.tsx](../app/aplicacoes/[slug]/page.tsx) | ƒ | CPT `aplicacao` do WP. **O CPT não existe no WP hoje, então todo slug não listado acima dá 404** | Não | Não | `BreadcrumbList` |
| `/blog` | [app/blog/page.tsx](../app/blog/page.tsx) | ƒ | Posts do WP, paginado por `?page=N` | Sim | Não | `BreadcrumbList`, `Blog` |
| `/blog/[slug]` | [app/blog/[slug]/page.tsx](../app/blog/[slug]/page.tsx) | ƒ | Post do WP | Sim, um por post | Não | `BreadcrumbList` |
| `/es`, `/es/transformador-de-corrente`, `/es/transformador-de-potencia`, `/es/indutores-filtros-e-chokes`, `/es/isobox`, `/es/transformadores-toroidais` | `app/es/**/page.tsx` | ○ | Código, texto em espanhol escrito no próprio arquivo | Sim | n/a | Mesmo da versão pt, com URLs `/es/...` |
| `/sitemap.xml` | [app/sitemap.ts](../app/sitemap.ts) | ○ (revalida com o fetch de posts, 1h) | `lib/routes.ts` + posts do WP | n/a | n/a | n/a |
| `/robots.txt` | [app/robots.ts](../app/robots.ts) | ○ | Código | n/a | n/a | n/a |
| `/llms.txt` | [public/llms.txt](../public/llms.txt) | arquivo estático | Escrito à mão | n/a | n/a | n/a |
| `/api/orcamento` | [app/api/orcamento/route.ts](../app/api/orcamento/route.ts) | ƒ (Node) | Formulário | n/a | n/a | n/a |
| `/api/orcamento/whatsapp` | [app/api/orcamento/whatsapp/route.ts](../app/api/orcamento/whatsapp/route.ts) | ƒ (Node) | Clique na CTA pós-envio | n/a | n/a | n/a |
| `/api/revalidate` | [app/api/revalidate/route.ts](../app/api/revalidate/route.ts) | ƒ | Webhook do WP | n/a | n/a | n/a |

Rotas estáticas irmãs de `[slug]` (como `/aplicacoes/nobreaks`) têm prioridade sobre a dinâmica no App Router, por isso convivem na mesma pasta.

### Fonte única da lista de rotas

[lib/routes.ts](../lib/routes.ts) (`ROTAS_ESTATICAS`) é a lista de páginas reais. Ela alimenta o sitemap e a resposta em Markdown para agentes. Página nova que deve ser indexada precisa entrar lá. As listas de espelhos `/es` **não** estão centralizadas: existem em três lugares (ver [guias.md](./guias.md#criar-um-espelho-em-espanhol) e [problemas-conhecidos.md](./problemas-conhecidos.md)).

### URLs legadas

As URLs de produto vieram do WordPress antigo e têm tráfego orgânico e campanhas de Google Ads apontando para elas. Por isso são top-level e não seguem `/produtos/[categoria]/[slug]`. `/indutores-filtros-e-chokes` tem esse slug de propósito. Todo o resto das URLs antigas está mapeado em `redirects()` de [next.config.ts](../next.config.ts) (ver seção 9).

---

## 5. Renderização e cache

| Camada | Comportamento |
|---|---|
| Páginas ○ | HTML gerado no build e servido pela CDN da Vercel. Mudar o conteúdo exige novo deploy. |
| Páginas ƒ do blog | Renderizadas por requisição, mas os `fetch` ao WP têm `revalidate: 3600` e tags. Na prática o WP é consultado no máximo uma vez por hora por URL/consulta, ou quando a tag é invalidada. |
| `/sitemap.xml` | Estático com o mesmo revalidate de 1h do fetch de posts. Post novo entra no sitemap em até 1h. |
| Imagens (`next/image`) | Otimizadas pela Vercel (AVIF/WebP), `minimumCacheTTL` de 30 dias. |
| Arquivos de `public/` com extensão de imagem | `Cache-Control: public, max-age=31536000, immutable` (header em `next.config.ts`). **Trocar uma imagem mantendo o mesmo nome pode servir a versão antiga por muito tempo; use um nome novo.** |
| Markdown para agentes | `Cache-Control: public, max-age=300, stale-while-revalidate=86400`, `Vary: Accept` |

### Tags de cache do WordPress

Definidas em [lib/wordpress.ts](../lib/wordpress.ts) e invalidadas por [app/api/revalidate/route.ts](../app/api/revalidate/route.ts):

| Tag | Usada por |
|---|---|
| `posts` | Toda listagem de posts (`getPostsPagina`, `getPosts`) |
| `posts-{offset}-{porPagina}` | Uma página específica da listagem |
| `post-{slug}` | Um post (`getPostPorSlug`) |
| `produtos`, `produtos-{categoria}`, `produto-{slug}` | Funções de produto (sem uso em página hoje) |
| `aplicacoes`, `aplicacao-{slug}` | Funções de aplicação (`/aplicacoes/[slug]`) |

Se você criar uma função de fetch nova, use uma tag existente ou adicione a nova também em `tagsParaPostType` da rota de revalidação. Tag que a rota não conhece nunca é invalidada sob demanda.

---

## 6. Camada de dados

Há duas fontes de conteúdo, e é importante saber qual alimenta cada página antes de editar:

### 6.1 Conteúdo no código (a maior parte do site)

| Dado | Onde fica | Quem consome |
|---|---|---|
| As 4 linhas de produto (nome, descrição curta, imagem, URL, ícone) | [lib/produtos.ts](../lib/produtos.ts) | Nav (menu Produtos), home, `/produtos`, Markdown da home |
| Os 5 segmentos atendidos (título e texto em pt/es/en, ícone, URL) | [lib/segmentos.ts](../lib/segmentos.ts) | Seção Segmentos da home, Markdown da home |
| Texto completo de cada página de produto/segmento (seções, tabela de especificação, checklist, FAQ, JSON-LD) | Constantes no topo de cada `page.tsx` (`SECOES`, `ESPECIFICACOES`, `CHECKLIST`, `PERGUNTAS`, `JSON_LD`) | A própria página |
| Anos de mercado | [lib/institucional.ts](../lib/institucional.ts) `getAnosDeMercado()` calcula a partir de 1º/05/1994. **Nunca escreva o número à mão.** | Pillar, Fabrica, ProvaInstitucional, quem-somos, segmentos... |
| Contatos, endereço, redes | `Footer.tsx`, `ContatoInfo.tsx`, `OrganizationSchema.tsx`, `LocalBusinessSchema.tsx`, [lib/social.ts](../lib/social.ts), [lib/whatsapp.ts](../lib/whatsapp.ts) | Ver [guias.md](./guias.md#mudar-telefone-e-mail-endereço-ou-rede-social) (estão espalhados) |
| Título e descrição padrão do site, URL canônica | [lib/seo.ts](../lib/seo.ts) | `layout.tsx`, todas as páginas, JSON-LD |

### 6.2 Conteúdo do WordPress

[lib/wordpress.ts](../lib/wordpress.ts) define tipos (`Produto`, `Aplicacao`, `Post`, `PostResumo`), o formato bruto da REST API, funções de mapeamento (snake_case do ACF para camelCase) e as funções de fetch.

| Tipo | Funções | Situação real |
|---|---|---|
| `post` (nativo) | `getPostsPagina`, `getPosts`, `getPostPorSlug` | **Em produção.** 64 posts. |
| `produto` (CPT) | `getProdutoPorSlug`, `getProdutosPorCategoria`, `getProdutosPorIds` | **Sem uso.** O CPT não está registrado no WordPress (confirmado via WP-CLI em 2026-10-02). |
| `aplicacao` (CPT) | `getAplicacaoPorSlug`, `getAplicacoesPorIds` | Usada por `/aplicacoes/[slug]`, mas sempre cai em 404 pelo mesmo motivo. |

Comportamento de erro: `wpFetch` **lança exceção** se `WP_API_URL` não existir ou o WP responder não-2xx. Quem chama trata: as páginas envolvem a chamada em `try/catch` e devolvem estado vazio ou `notFound()`, nunca 500.

Limpezas automáticas aplicadas ao HTML dos posts: `limparResiduoDoWord()` remove `<span data-ccp-props>`/`<span data-contrast>` (sobra de texto colado do Word) e `limparResumo()` remove o link "Continuar lendo" do excerpt.

[lib/blog.ts](../lib/blog.ts) deriva o "tema" de cada post pelo título (regex), porque todos os posts estão em "Sem categoria" no WP. Também formata datas sem passar por `new Date()` (evita diferença de fuso entre build e dev) e decodifica entidades HTML.

Ligar produto/aplicação ao WP é o item A.10 do ROADMAP. O caminho está em [guias.md](./guias.md#ligar-páginas-de-produto-ao-wordpress).

---

## 7. Internacionalização

Duas camadas coexistem de propósito.

### 7.1 Páginas espelho (`/es/*`), indexáveis

Arquivos `page.tsx` próprios dentro de `app/es/`, com texto em espanhol escrito no arquivo. O HTML já sai do servidor em espanhol, então o Google indexa. Cada espelho declara `alternates.languages` (`pt-BR`, `es`, `x-default` apontando para a versão pt) e seu próprio JSON-LD com URLs `/es/...`.

**Consequência de manutenção:** mudou o texto da página em português? A versão `/es` **não** muda sozinha. As páginas de produto pt e es têm 250 a 580 linhas cada e precisam ser editadas em par.

### 7.2 Troca de texto no navegador (resto do site)

- [lib/i18n.ts](../lib/i18n.ts): `LOCALES = ["pt", "es", "en"]`, cookies `toroid_locale` (escolha explícita) e `toroid_geo_locale` (sugestão por país), dicionários do Nav e do Footer, mapa `PAGINAS_ESPELHO`.
- [components/i18n/T.tsx](../components/i18n/T.tsx): `<T pt="..." es="..." en="..." />`, o componente usado em todo texto traduzível fora dos espelhos.
- [components/layout/LocaleProvider.tsx](../components/layout/LocaleProvider.tsx): contexto de idioma. Ordem de decisão:
  1. Rota (`/es*` é sempre espanhol; nada abaixo sobrescreve)
  2. Cookie `toroid_locale`
  3. `navigator.language`, se for pt/es/en
  4. Cookie `toroid_geo_locale` (gravado pelo `proxy.ts`)
  5. Português
- O servidor sempre entrega português fora de `/es`. A troca acontece depois da hidratação, então quem tem navegador em inglês vê um instante em português. É o preço de manter as páginas estáticas, não um bug.
- [components/layout/LanguageSwitcher.tsx](../components/layout/LanguageSwitcher.tsx) (no rodapé): se `localizedPath()` conhece um espelho, navega com `<Link>`; senão, só troca o texto.

Texto dentro das páginas espelho e das páginas só em português pode ser string simples. Texto em componente compartilhado que também aparece em `/es` (seções da home, CTA, Pillar) precisa de `<T>` ou de um `Record<Locale, string>`.

Não existe nenhuma rota `/en`. As mensagens de erro de validação do formulário vêm do servidor e estão sempre em português.

---

## 8. `proxy.ts` (borda)

[proxy.ts](../proxy.ts) roda antes de toda requisição de página (o matcher exclui `_next/static`, `_next/image`, `api/` e qualquer caminho com extensão). Faz duas coisas:

1. **Negociação de Markdown para agentes.** Se o header `Accept` prefere `text/markdown` sobre `text/html`, [lib/agent-content.ts](../lib/agent-content.ts) responde: a home vira um Markdown montado de `lib/produtos.ts`, `lib/segmentos.ts` e `lib/routes.ts`; um caminho de topo desconhecido devolve 404 em Markdown. Rotas conhecidas (e qualquer coisa sob `/aplicacoes/`, `/blog/`, `/es/`) seguem o fluxo normal em HTML.
2. **Cookie de sugestão de idioma.** Na primeira visita, grava `toroid_geo_locale` a partir de `x-vercel-ip-country` (BR/PT → pt, países hispânicos → es, resto → en). Nunca toca no cookie de escolha explícita.

Não coloque lógica pesada aqui: roda em toda navegação.

---

## 9. `next.config.ts`

| Bloco | Conteúdo |
|---|---|
| `serverExternalPackages: ['mongodb']` | Evita que o bundler tente empacotar dependências nativas opcionais do driver |
| `images.remotePatterns` | Só `https://toroidcombr.wpcomstaging.com/wp-content/uploads/**` (domínio da mídia do WP desde 2026-10-02) |
| `images.formats` / `minimumCacheTTL` | AVIF/WebP, 30 dias |
| `headers()` | Cache imutável para imagens de `public/`; em toda rota: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, HSTS de 2 anos com preload. **Sem CSP.** |
| `redirects()` | 66 redirects `permanent: true` (HTTP 308, equivalente a 301 para o Google): posts antigos da raiz para `/blog/<slug>`, caminhos antigos de produto, padrão de data `/:ano/:mes/:dia` → `/blog`, `/whatsapp` → `/#orcamento`, `/tranformadores-de-tensao` (typo legado) → `/transformador-de-potencia`. O fim do bloco lista as URLs que ficaram **sem** redirect por decisão. |
| `poweredByHeader: false`, `compress: true`, `reactStrictMode: true` | Padrão |

---

## 10. Layout global e chrome

[app/layout.tsx](../app/layout.tsx), na ordem do JSX:

1. Link "Pular para o conteúdo" (acessibilidade)
2. `ConsentDefaultScript` (Consent Mode v2 negado por padrão, `beforeInteractive`) e `GoogleAnalytics` (`afterInteractive`), ambos só se `GA4_MEASUREMENT_ID` existir
3. `OrganizationSchema` (JSON-LD do site inteiro, montado só aqui)
4. `AttributionCapture` (UTM, dentro de `Suspense`)
5. `LocaleProvider` envolvendo `Nav`, `<main id="conteudo-principal">`, `ConditionalFooter` + `Footer` e `WhatsAppButton`
6. `CookieConsentBanner`

Fontes: Montserrat 600/700 (títulos) e Karla variável (corpo), via `next/font/google`, expostas como `--font-montserrat` e `--font-karla`.

Comportamentos por rota que são **listas mantidas à mão**:

| Onde | Regra | Ao criar página nova |
|---|---|---|
| `heroClaroPath()` em [Nav.tsx](../components/layout/Nav.tsx) | Rotas com topo claro (hoje `/produtos` e `/blog/*`) fazem o header nascer escuro | Se o topo da página for claro, inclua a rota. Senão logo e menu ficam brancos sobre branco. |
| [ConditionalFooter.tsx](../components/layout/ConditionalFooter.tsx) | `/contato` não tem Footer | Nada, a menos que outra página precise do mesmo |
| `orcamentoHref` em Nav.tsx | Em `/contato` o botão de orçamento vai para `/#orcamento`; nas demais, âncora local `#orcamento` | Toda página nova precisa terminar com `<CTA />` (que tem `id="orcamento"`), senão o botão do menu não faz nada |

---

## 11. Sistema visual

Tokens em [app/globals.css](../app/globals.css) (`:root`):

| Grupo | Tokens |
|---|---|
| Azul (base da marca) | `--color-blue` `#1a4b8c`, `--color-blue-deep`, `--color-blue-ink`, `--color-blue-abyss`, `--color-blue-soft` |
| Verde (só detalhe) | `--color-green` `#5ea75e`, `--color-green-light` |
| Amarelo | `--color-yellow` `#fbf23d`. **Só nos três fios do logo**; único uso em CSS é `Footer.module.css` |
| Texto | `--color-text` `#393738`, `-secondary`, `-muted`, `-faint` |
| Sobre azul | `--color-on-blue`, `-muted`, `-faint`, `--color-rule-on-blue` (calibrados para contraste AA; recalibre se mudar o azul de fundo) |
| Bordas e fundos | `--color-border*`, `--color-bg-tint`, `--color-bg-tint-2`, `--color-copper` |
| Layout | `--section-pad`, `--shell` (1200px), `--gutter` |
| Tipografia | `--font-title` (Montserrat), `--font-body` (Karla) |
| Movimento | `--ease-out`; bloco global `@media (prefers-reduced-motion: reduce)` desliga animações |

Regras de marca (o que nunca fazer) estão no CLAUDE.md, seção "Identidade visual". Ilustrações são SVG próprios e determinísticos (`components/ui`, `components/aplicacoes`), animados só com CSS.

---

## 12. Segurança

| Ponto | Onde |
|---|---|
| Validação de toda entrada no servidor (Zod) | `lib/orcamento-schema.ts`, `lib/leads-schema.ts`, rotas de API |
| Rate limit por IP, em memória por instância (5/min no orçamento, 10/min no WhatsApp) | [lib/rate-limit.ts](../lib/rate-limit.ts). Não é global entre instâncias; a camada durável seria uma regra no Vercel Firewall |
| Escape de HTML no e-mail | `escapeHtml()` em `lib/orcamento-mailer.ts` |
| IP do lead guardado só como hash (HMAC com `LEAD_IP_HASH_SECRET`) | `app/api/orcamento/route.ts` |
| Segredo do webhook comparado em tempo constante | `timingSafeEqual` em `app/api/revalidate/route.ts` |
| HTML de post do WP renderizado com `dangerouslySetInnerHTML` | `components/blog/PostBody.tsx`. Aceito porque o WP é administrado pela própria empresa. Quem tem acesso de editor no WP consegue injetar HTML no site |
| Headers de segurança | `next.config.ts` (sem CSP) |
| Deploys de preview protegidos por login da Vercel | Configuração do projeto (SSO em tudo, exceto domínios customizados) |
