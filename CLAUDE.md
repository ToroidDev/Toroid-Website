@AGENTS.md

# CLAUDE.md · Toroid do Brasil · Site institucional

Contexto persistente para qualquer trabalho neste repositório. Leia isto antes de criar, editar ou revisar qualquer arquivo.

## O que é este projeto

Site institucional da Toroid do Brasil (fabricante de transformadores de corrente, transformadores de potência e indutores, com núcleo toroidal ou convencional conforme o projeto), reconstruído em Next.js consumindo WordPress como CMS headless. O WordPress atual (Elementor/Jetpack) deixa de ser renderizado publicamente, mas continua existindo só como fonte de conteúdo via REST API.

**Prioridade número um deste projeto: performance.** 94% do tráfego orgânico é de marca; a alavanca real é capturar busca de produto, e isso depende de Core Web Vitals bons, não só de conteúdo bom. Toda decisão técnica abaixo existe para proteger isso.

---

## Stack

- **Frontend:** Next.js (App Router), TypeScript, Server Components por padrão
- **Deploy:** Vercel
- **CMS:** WordPress headless via REST API (`wp-json/wp/v2/`), custom post types via ACF + [Pods](https://pods.io/) (confirmado em 2026-08-17 via `wpcom-mcp-plugin-management`; documentação anterior deste arquivo citava "Custom Post Type UI", que não está instalado no site real — corrigido, ver ROADMAP.md)
- **Analytics:** GA4
- **Formulários:** API Routes do Next.js (nunca client-side puro)
- **Repo:** GitHub, `ToroidDev/Toroid-Website`

## Variáveis de ambiente

Nunca hardcodar estes valores em nenhum arquivo. Sempre `process.env.X`, configurado no Vercel em Production + Preview + **Development**. Confirmado nas três em 2026-08-13 via `vercel env ls` — `WP_API_URL`, `WHATSAPP_NUMBER`, `GA4_MEASUREMENT_ID`, `REVALIDATE_SECRET` e `LEAD_IP_HASH_SECRET` presentes nas três (os dois últimos como Sensitive em Preview/Production, Non-sensitive em Development — a Vercel não permite variável Sensitive em Development). `MONGODB_URI` é a única que ainda falta em todas. **Achado nessa confirmação**: `WP_API_URL` estava configurada só em Development e com valor errado (`https://toroid.com.br/wp-json`, faltando `/wp/v2`) — corrigido para `https://toroid.com.br/wp-json/wp/v2` nas três.

```
WP_API_URL=https://toroid.com.br/wp-json/wp/v2
WHATSAPP_NUMBER=554130358258
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/toroid?retryWrites=true&w=majority
LEAD_IP_HASH_SECRET=<string aleatória, ex.: `openssl rand -hex 32`>
REVALIDATE_SECRET=<string aleatória, ex.: `openssl rand -hex 32`>
```

`REVALIDATE_SECRET` autentica o webhook do WordPress contra `/api/revalidate` (ver "Revalidação sob demanda" abaixo) — sem ela, a rota rejeita toda chamada com 401, por design (evita que qualquer request externo force `revalidateTag` de graça).

`MONGODB_URI` é obrigatória para a persistência de leads (ver "Formulário de orçamento e captura de lead" abaixo) — sem ela, a gravação no MongoDB falha silenciosamente (loga no servidor) mas o formulário continua funcionando via e-mail. `LEAD_IP_HASH_SECRET` é opcional e recomendada: sem ela, o hash de IP do lead usa SHA-256 simples, mais fraco que o HMAC salgado.

---

## Estrutura de dados do WordPress

Dois Custom Post Types além do post nativo. **Todo campo ACF precisa ter "Show in REST API" marcado**. Sem isso o campo existe no WP mas não aparece no JSON, e qualquer template que dependa dele vai renderizar vazio sem erro visível. Sempre validar um endpoint novo assim antes de escrever o template:

```bash
curl -s https://toroid.com.br/wp-json/wp/v2/produto/123 | jq
```

### CPT `produto`
| Campo (slug ACF) | Tipo | Notas |
|---|---|---|
| `categoria_produto` | Taxonomia | `transformador-de-corrente` \| `transformador-toroidal` \| `indutor-reator` — **desatualizado, ver nota abaixo** |
| `variante` | Texto/Taxonomia | resinado, médico, etc. (não usar como nome de linha comercial inexistente — ver ROADMAP.md) |
| `faixa_tecnica` | Texto | Ex.: "5 VA a 15 kVA" |
| `parametros_especificacao` | Repeater (`nome` + `valor`) | Varia por categoria, ver playbook de especificação |
| `aplicacoes_relacionadas` | Relationship → CPT `aplicacao` | Base do link cruzado produto↔segmento |
| `imagem_principal`, `galeria` | Imagem/galeria | Produto real, nunca sobre fundo branco flutuando |

> **Nota (2026-08-12):** a taxonomia de família de produto no front-end mudou para Transformador de Corrente / Transformador de Potência / Indutores — núcleo toroidal deixou de ser uma família e passou a ser tecnologia de núcleo cross-line (ver PRODUCT.md). O enum `categoria_produto` acima ainda reflete o esquema antigo do WordPress e precisa ser atualizado no admin do WP (`transformador-toroidal` → `transformador-de-potencia`, decidindo se toroidal continua como tag secundária); isso é mudança de dado fora do repositório, ver ROADMAP.md/Trilha B.

### CPT `aplicacao`
| Campo (slug ACF) | Tipo | Notas |
|---|---|---|
| `tier_icp` | Select | `T1` \| `T2` \| `T3` \| `area_atuacao` |
| `status_ads` | Select | `ads_ativo` \| `sem_ads`. Sinaliza casos como Refrigeração/Elevadores (Ads ativo, fora do T1 oficial) |
| `dor_segmento` | Texto longo | Base do framework característica→benefício |
| `produtos_recomendados` | Relationship → CPT `produto` | (sem nota) |

### Post nativo (blog)
Taxonomia de categoria: `especificacao-tecnica`, `engenharia-manutencao`, `aplicacoes-segmento`, `cases`.

---

## Convenções de código

- **Server Component por padrão.** Só marcar `"use client"` em componentes com interação real (formulário, toggle, tracking de clique). Cada `"use client"` extra é JS a mais no bundle do usuário.
- **Fetch de conteúdo do WP sempre com cache/revalidate explícito**, nunca `no-store` sem justificativa:
  ```ts
  fetch(`${process.env.WP_API_URL}/produto?slug=${slug}`, {
    next: { revalidate: 3600, tags: [`produto-${slug}`] }
  })
  ```
- **Revalidação sob demanda:** `app/api/revalidate/route.ts` (POST, `{ post_type: "produto"|"aplicacao"|"post", slug }`, autenticado por `REVALIDATE_SECRET` via header `X-Revalidate-Secret` ou `?secret=`) chama `revalidateTag` com as mesmas tags de `lib/wordpress.ts`. Falta configurar, no WordPress, o webhook que dispara essa rota ao publicar/editar (Trilha B/ROADMAP.md) — a rota já está pronta e esperando. Isso evita dois extremos ruins: página estática desatualizada por horas, ou renderização dinâmica a cada request só pra ter conteúdo fresco.
- **Rotas por tipo de conteúdo:** as URLs de produto são exigidas por tráfego orgânico e campanhas de Ads já ativas — não seguem um padrão genérico `/produtos/[categoria]/[slug]`. São top-level e uma delas tem slug totalmente diferente do nome interno do produto:
  - Transformadores de Corrente: `/transformador-de-corrente`
  - Transformadores de Potência: `/transformador-de-potencia`
  - Indutores & Reatores: `/indutores-filtros-e-chokes` (slug diferente de propósito — é a URL que já rankeia no WordPress antigo, não um erro de digitação)
  - `/produtos` existe como página própria de listagem das três famílias, não é fundida ao padrão acima.
  - `/transformadores-toroidais` **não é uma das três famílias** — é uma página própria sobre a tecnologia de núcleo toroidal (comparação com núcleo convencional, cross-link para as três famílias reais). Mantém essa URL porque já é indexada; não reaproveitar esse slug/nome como sinônimo de família de produto em nenhum lugar novo do código.
  - `/aplicacoes/[slug]` e `/blog/[slug]` seguem o padrão dinâmico genérico normalmente, pois não têm URL legada a preservar. Cada uma resolve os relacionamentos (produto↔aplicação) numa única chamada quando possível, nunca em cascata de requests sequenciais.
  - Se um padrão dinâmico dirigido pelo WP for construído no futuro para produtos, não usar `/produtos/[categoria]/[slug]` sem reconciliar com as URLs acima — reintroduziria a mesma perda de SEO que essa estrutura corrige.
- **Redirects 301 do WordPress antigo** (`next.config.ts`, `redirects()`): cada URL indexada confirmada (Search Console/Notion) vira uma entrada literal `source`/`destination`, nunca descartada silenciosamente. Para famílias de URL previsíveis (ex.: arquivos de data do WP, `/AAAA/MM/DD/`), preferir um único redirect por path pattern (`source: '/:ano(\\d{4})/:mes(\\d{2})/:dia(\\d{2})'`) em vez de uma entrada por URL — cobre casos não listados explicitamente no export do GSC. `permanent: true` no Next.js retorna HTTP 308, não 301 — é o comportamento padrão do framework (preserva o método HTTP) e Google trata como equivalente a 301 para SEO, não é bug a corrigir. URLs sem destino confirmado (conteúdo não identificado, decisão de negócio pendente) ficam de fora do mapa e viram pendência explícita no ROADMAP — nunca um redirect adivinhado.
- **`app/sitemap.ts` e `app/robots.ts`** usam a convenção nativa do Next.js (`MetadataRoute.Sitemap`/`MetadataRoute.Robots`), nunca um XML/txt estático em `public/`. O sitemap só lista rotas que existem de verdade hoje — uma URL de sitemap que devolve 404 é pior sinal que não listar. O bloco de posts do WordPress fica comentado em `sitemap.ts` até `/blog/[slug]` existir como rota e `WP_API_URL` estar validado; habilitar antes disso anunciaria conteúdo que ainda não existe.
- **Política de crawler de IA** (decisão da diretoria, em `app/robots.ts`): permitir bot de busca/resposta que cita a fonte (`OAI-SearchBot`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`, `Google-Extended`); bloquear bot de treinamento sem link de volta (`GPTBot`, `ClaudeBot`). Não reverter para um bloqueio genérico de bot de IA — é decisão deliberada, consistente com o foco em AEO/FAQPage do projeto.
- **TypeScript estrito.** Tipar o retorno da API do WP (interface `Produto`, `Aplicacao`, `Post`), nunca `any` no que vem da REST API.
- **Validação de formulário sempre no back-end** (API Route), com schema por tipo de produto (TC / TP / Indutor). O front-end valida por UX, back-end valida porque é o que importa.

---

## Performance: não são sugestões, são requisito do projeto

Meta: Lighthouse Performance ≥ 90, LCP < 2.5s, CLS < 0.1, INP < 200ms.

- **Imagens:** sempre `next/image`, nunca `<img>`. Configurar `remotePatterns` no `next.config.js` para o domínio de mídia do WordPress. Imagem do hero/LCP leva `priority`; as demais, lazy por padrão (comportamento nativo do componente).
- **Fontes:** Montserrat via `next/font/google`, nunca via `<link>` no `<head>`, o que evita request bloqueante e layout shift.
  ```ts
  import { Montserrat } from 'next/font/google'
  const montserrat = Montserrat({ subsets: ['latin'], weight: ['400','600','700'] })
  ```
- **Scripts de terceiro (GA4, WhatsApp widget se houver) sempre via `next/script`** com `strategy="afterInteractive"`, nunca `beforeInteractive` para analytics, isso bloqueia LCP sem necessidade.
- **Nada de bibliotecas pesadas para coisa simples.** Antes de importar uma lib nova, perguntar se dá pra resolver com CSS ou com o que o Next.js já oferece.
- **Bundle:** rodar `@next/bundle-analyzer` antes de qualquer PR que adicione dependência nova visível ao cliente.
- **Nenhuma chamada à API do WordPress no client.** Toda leitura de conteúdo acontece em Server Component ou API Route. O browser do usuário nunca fala direto com `wp-json`.

---

## Dados estruturados (schema.org / JSON-LD)

Cada tipo de página tem um schema obrigatório, seguindo o padrão já usado nas páginas de produto (array `JSON_LD`, renderizado como `<script type="application/ld+json">` ao fim da página):

- **Páginas de produto/pilar:** `Product` + `BreadcrumbList` + `FAQPage` (quando a página tem seção de objeções/perguntas).
- **Pilar 7 (autoridade técnica) e qualquer página com perguntas frequentes:** `FAQPage` — é o formato mais citável por IA/AEO.
- **Todo o site:** `Organization` — componente único (`components/seo/OrganizationSchema.tsx`), montado uma única vez no `RootLayout` (`app/layout.tsx`), nunca repetido por página. Dados confirmados: nome legal, endereço, telefones (ver PRODUCT.md).
- **`/quem-somos` e página local (Curitiba):** `LocalBusiness`, adicional ao `Organization` sitewide. Só falta a página existir — o telefone que bloqueava isso já foi confirmado.
- **Página de listagem (`/produtos`):** `BreadcrumbList` + `CollectionPage`, sem `Product`/`FAQPage` — esses ficam nas páginas de família individuais.
- **Domínio/URL absoluta em JSON-LD**: sempre via `absoluteUrl()`/`SITE_URL` de `lib/seo.ts`, nunca a string `https://toroid.com.br` repetida à mão — mesmo motivo do `metadataBase` centralizado em `app/layout.tsx`.

---

## Formulário de orçamento e captura de lead

- Captura de UTM (`utm_source/medium/campaign/term/content`, `gclid`, `fbclid`) no client, em todas as páginas: primeiro toque (`localStorage`, gravado uma única vez) e último toque (`sessionStorage`, sobrescrito a cada nova visita com parâmetro de campanha). Ver `lib/attribution.ts` e `components/layout/AttributionCapture.tsx`, montado no `RootLayout`.
- Submit do formulário faz POST para `/api/orcamento` (API Route), nunca só exibe "sucesso" sem confirmação do servidor.
- A API Route persiste o lead no MongoDB (coleção `leads`, banco `toroid`, schema com `lead`/`attribution`/`context`/`consent`/`status` em `lib/leads-schema.ts`) **em paralelo** ao e-mail de notificação já existente (`lib/orcamento-mailer.ts`) — nenhum dos dois substitui o outro. A gravação no Mongo roda depois da resposta HTTP (`after()`), nunca segura nem derruba a resposta ao visitante; só o envio de e-mail decide o `{ok:true}`/`{ok:false}` retornado.
- Campo `status` do lead (`novo → qualificado → proposta → ganho | perdido`) para medir qualidade de lead por canal depois, não só volume.
- **Checkbox de consentimento LGPD no formulário de orçamento não existe, por decisão, não por bloqueio pendente** (decisão de 2026-08-25): o site mantém só o consentimento básico já implementado (`CookieConsentBanner.tsx`, Google Consent Mode v2, categorias essenciais/analíticos), sem desenvolver uma política de privacidade completa nem o checkbox linkado a ela. `consent.lgpd` continua sempre `false` no documento persistido em `lib/leads-schema.ts`, por design permanente, não é bug nem pendência.
- O conjunto de campos visíveis do formulário (`nome`/`email`/`telefone`/`observação`) é intencionalmente mínimo, aguardando validação comercial para expandir (`empresa`, `categoria`/segmento) — ver comentário em `components/forms/OrcamentoForm.tsx` e `lib/orcamento-schema.ts`.
- **CTA de WhatsApp pós-envio e duplicidade de lead:** no site antigo, a tela de confirmação do formulário oferecia contato direto via WhatsApp, e muitos usuários usavam os dois canais (formulário + WhatsApp) para a mesma solicitação — o comercial contava isso como dois leads, distorcendo a métrica de ICP fit. A tela de sucesso replica essa CTA (`OrcamentoForm.tsx`, estado `"sucesso"`), mas resolve a duplicidade em vez de repeti-la: `POST /api/orcamento` gera o `_id` do lead de forma síncrona (`ObjectId`, antes de responder — não dá pra esperar o `insertOne` do `after()`) e devolve `leadId` na resposta; a mensagem pré-preenchida da CTA é contextual (cita o nome de quem enviou), não a mensagem estática de `lib/whatsapp.ts`; o clique dispara `POST /api/orcamento/whatsapp` com esse `leadId`, que marca `whatsappAposEnvio: {clicado, em}` no **mesmo** documento (nunca cria um segundo lead) e envia um e-mail curto de acompanhamento avisando o comercial que é o mesmo contato (`lib/orcamento-mailer.ts`, `enviarAvisoWhatsappAposEnvio`). Tudo best-effort/fire-and-forget, mesma filosofia do resto do fluxo de lead — nunca bloqueia a navegação pro WhatsApp.

---

## Identidade visual (não é opcional, é a versão oficial vigente)

| Token | Valor |
|---|---|
| Azul institucional (primária) | `#1A4B8C` |
| Verde (detalhe) | `#5EA75E` |
| Amarelo | `#FBF23D`, **exclusivo dos três fios do logo, nunca usar em UI** |
| Cinza texto | `#393738` |
| Gradiente institucional | `azul → branco`, só em capas/faixas de rodapé/separadores, nunca atrás de texto |
| Tipografia | Montserrat Bold 700 (títulos) / SemiBold 600 (subtítulos e CTAs) — Karla Regular 400 (corpo, line-height 1,6) |

Nunca: gradiente verde→azul (versão antiga), azul e verde com peso visual igual (azul é base, verde é detalhe), logo recolorido/distorcido/com sombra.

---

## UTM e eventos de conversão

- Capturar UTM da URL no client ao entrar no site — ver detalhe de primeiro/último toque em "Formulário de orçamento e captura de lead" acima.
- **GA4 implementado** (`components/analytics/GoogleAnalytics.tsx`, montado uma vez no `RootLayout`): carrega `gtag.js` via `next/script` (`strategy="afterInteractive"`) só quando `GA4_MEASUREMENT_ID` está configurado — sem a env var, não renderiza nada, sem quebrar a página. Dois eventos GA4 distintos, nunca um só: `whatsapp_click` e `form_submit` (`lib/analytics.ts`), os dois com o UTM de último toque anexado (mesma fonte de `lib/attribution.ts`).
  - `whatsapp_click` dispara em todo link de WhatsApp do site via `components/analytics/WhatsAppLink.tsx` (substitui qualquer `<a href={whatsappLink}>` direto — centraliza o link e o evento num único lugar, não repetir por seção). Todos abrem em nova aba (`target="_blank"`), por isso um `gtag('event', ...)` síncrono já é seguro — não há risco de redirect cortar a chamada nessas rotas, então `sendBeacon`/delay não é necessário aqui.
  - `form_submit` dispara em `OrcamentoForm.tsx` só após confirmação `{ok:true}` do `/api/orcamento` (lead real, não intenção) — mudança de estado na própria página, sem navegação, mesmo motivo acima.
- Link de WhatsApp: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`. **A mensagem pré-preenchida é contextual da CTA clicada e não carrega mais path nem UTM** (decisão de 2026-09-01): cada `WhatsAppLink` recebe a `mensagem` da situação em que o clique aconteceu (família de produto da página, segmento, pedido de orçamento, nome de quem acabou de enviar o formulário), em `string` para página só em português ou `Record<Locale, string>` quando o componente também roda em `/es` (`lib/whatsapp.ts`). Sem `mensagem`, cai na `MENSAGEM_PADRAO` do idioma, que é o certo só onde não existe contexto nenhum: botão flutuante, rodapé, linha de contato. O texto antigo colava `origem: /rota | utm_source=...` no fim da mensagem, que o visitante lia antes de enviar e que não dizia ao comercial o que ele queria. Medição de canal não depende disso: o evento `whatsapp_click` continua levando o UTM de último toque.

---

## Tom de voz (se este projeto gerar copy, não só código)

"Engenheiro experiente que explica bem." Começa pelo problema, frases curtas, prova técnica antes de adjetivo. Vocabulário: especificação, desempenho, durabilidade, confiabilidade, homologação, retrabalho, engenharia, customização.

**Nunca usar:** "40 anos" (são 32), "líder de mercado", "soluções inovadoras", "disruptivo", "parceiro estratégico", "o toroidal é superior" (sempre: "cada tecnologia atende necessidades diferentes").

---

## Antes de abrir um PR

- [ ] Rodou `next build` local sem warning de imagem/fonte não otimizada?
- [ ] Algum componente novo tem `"use client"` que não precisava ter?
- [ ] Campo novo do WP tem "Show in REST API" marcado e testado via curl?
- [ ] Evento de conversão (se aplicável) dispara com UTM no DebugView do GA4?
- [ ] Página nova tem o schema.org correto para o tipo de conteúdo?
