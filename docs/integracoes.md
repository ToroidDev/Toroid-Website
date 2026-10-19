# Integrações externas

Contratos com cada sistema fora do repositório: o que o site espera, onde está configurado, como testar e o que acontece quando falha. Valores de segredo nunca aparecem aqui; eles vivem só nas env vars da Vercel.

## Visão rápida

| Sistema | Para quê | Env vars | Se cair |
|---|---|---|---|
| WordPress.com (headless) | Posts do blog; mídia dos posts | `WP_API_URL` | Blog vazio / 404 controlado; resto do site intacto |
| Relay SMTP | E-mail de cada lead para o comercial | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `ORCAMENTO_DESTINATARIOS` | **Formulário responde erro 502** ao visitante (sugere WhatsApp) |
| MongoDB Atlas | Registro de leads com atribuição | `MONGODB_URI`, `LEAD_IP_HASH_SECRET` | Lead não é gravado; e-mail e resposta continuam normais (falha silenciosa, só nos logs) |
| GA4 | Eventos de conversão | `GA4_MEASUREMENT_ID` | Eventos viram no-op |
| IndexNow | Avisar Bing e outros buscadores de URL alterada | nenhuma (chave pública no código) | Só log de erro |
| WhatsApp (`wa.me`) | Contato direto | `WHATSAPP_NUMBER` | Fallback para o número real |
| Vercel | Hospedagem, CDN, logs, analytics | gerenciadas pela plataforma | Site fora do ar |
| Cloudflare | DNS de `toroid.com.br` | n/a | Site e e-mail fora do ar |

---

## 1. WordPress (CMS headless)

### Onde fica

- Site na WordPress.com (hospedagem Atomic), endereço principal **`toroidcombr.wpcomstaging.com`** desde 2026-10-02.
- `WP_API_URL = https://toroidcombr.wpcomstaging.com/wp-json/wp/v2` nos três ambientes da Vercel.
- `toroid.com.br` aponta para a Vercel. Qualquer `toroid.com.br/wp-json` ou `toroid.com.br/wp-content` **não chega mais ao WordPress**. Não use esse domínio para conteúdo ou mídia do WP.
- O wp-admin continua acessível pela WordPress.com. O acesso ao cPanel antigo da hospedagem foi perdido (ver MIGRATION.md, não bloqueia o CMS).

### Endpoints consumidos

| Chamada | Usada em | Campos |
|---|---|---|
| `GET /posts?per_page={n}&offset={o}&_embed=wp:featuredmedia&_fields=id,slug,title,excerpt,date,_links.wp:featuredmedia,_embedded` | `/blog` | Total de posts vem do header `X-WP-Total` |
| `GET /posts?per_page=100&_fields=id,slug,title,excerpt,date` | `/sitemap.xml` | Limite de 100 posts. **Se o acervo passar de 100, o sitemap passa a omitir os mais antigos** |
| `GET /posts?slug={slug}&_embed=wp:featuredmedia` | `/blog/[slug]` | Conteúdo completo |
| `GET /aplicacao?slug={slug}` e `/produto?...` | `/aplicacoes/[slug]` | **Os CPTs não existem hoje** (ver abaixo) |

O `_links.wp:featuredmedia` dentro de `_fields` não é decorativo: sem ele o WP descarta `_embedded` e a imagem destacada some.

### Testar à mão

```bash
WP=https://toroidcombr.wpcomstaging.com/wp-json/wp/v2
curl -sI "$WP/posts?per_page=1" | grep -i x-wp-total          # total de posts
curl -s "$WP/posts?slug=toroidais-x-convencionais&_fields=id,slug,title" | jq
curl -s "$WP/types" | jq 'keys'                                 # post types expostos na REST API
```

### Estado dos CPTs `produto` e `aplicacao`

Verificado via WP-CLI em 2026-10-02: **nenhum dos dois post types está registrado** (`post_type_exists` retorna `false`; o Pods só tem um pod, "Páginas"). Não é só um toggle de "Show in REST API": a modelagem precisa ser criada do zero no Pods, com os campos documentados no CLAUDE.md ("Estrutura de dados do WordPress"). Até lá, o conteúdo de produto e segmento continua no código. Passo a passo em [guias.md](./guias.md#ligar-páginas-de-produto-ao-wordpress).

### Mídia

- Imagens destacadas e imagens dentro do corpo dos posts usam `https://toroidcombr.wpcomstaging.com/wp-content/uploads/...` (conferido nos 64 posts).
- `next/image` só aceita esse domínio (`images.remotePatterns` em `next.config.ts`). As imagens dentro do corpo do post são `<img>` comuns do HTML do WP, não passam por `next/image`.
- PDFs técnicos são servidos direto da Media Library do WP. Links para eles no código precisam usar o domínio `wpcomstaging` (ver [problemas-conhecidos.md](./problemas-conhecidos.md), há um link quebrado em `/isobox`).

### Revalidação sob demanda (webhook)

Rota pronta: [app/api/revalidate/route.ts](../app/api/revalidate/route.ts). **O webhook do lado do WordPress ainda não foi configurado** (pendência pós-corte, MIGRATION.md seção 4). Enquanto isso, um post editado aparece no site em até 1 hora.

Contrato:

```
POST https://toroid.com.br/api/revalidate
Header:  X-Revalidate-Secret: <REVALIDATE_SECRET>      (ou ?secret=<REVALIDATE_SECRET> na URL)
Body:    { "post_type": "post" | "produto" | "aplicacao", "slug": "<slug>" }
```

| Resposta | Quando |
|---|---|
| `200 { ok: true, revalidated: [tags] }` | Sucesso |
| `400` | Body sem `post_type`/`slug`, ou `post_type` desconhecido |
| `401` | Segredo ausente, errado, ou `REVALIDATE_SECRET` não configurada na Vercel |

Tags invalidadas: `post` → `posts`, `post-{slug}`; `aplicacao` → `aplicacoes`, `aplicacao-{slug}`; `produto` → `produtos`, `produto-{slug}` e `produtos-{categoria}` de todas as categorias. Depois de responder, a rota notifica o IndexNow com as URLs afetadas (`/blog/{slug}`, `/aplicacoes/{slug}`, ou listagem + três famílias para produto).

Teste manual:

```bash
curl -X POST "https://toroid.com.br/api/revalidate" \
  -H "Content-Type: application/json" \
  -H "X-Revalidate-Secret: $REVALIDATE_SECRET" \
  -d '{"post_type":"post","slug":"toroidais-x-convencionais"}'
```

Configuração sugerida no WP: um plugin de webhook (ex.: WP Webhooks) disparando em publicar/atualizar post, com o body acima. Se o plugin não permitir header customizado, use `?secret=` na URL.

---

## 2. MongoDB Atlas (leads)

### Onde fica

- Cluster `cluster0-toroidsite` (M0, gratuito), banco **`toroid`**, coleção **`leads`** (criada no primeiro insert).
- Usuário de serviço da aplicação: **`toroid-site-app`** (`readWriteAnyDatabase`). A `MONGODB_URI` de Production e Preview deve usar sempre esse usuário, **nunca uma credencial pessoal de administrador**. Em setembro de 2026 a URI estava presa a uma credencial pessoal, a senha mudou e os leads pararam de gravar por 4 dias sem ninguém perceber.
- Cluster M0 pode aparecer como "Paused" no Atlas por inatividade; a primeira conexão o reativa.

### Formato do documento (`LeadDocument`, [lib/leads-schema.ts](../lib/leads-schema.ts))

```ts
{
  _id: ObjectId,                    // gerado no servidor ANTES de responder; volta ao navegador como leadId
  lead: {
    nome, email, telefone,          // do formulário
    mensagem: string | null,        // campo "observação"
    empresa: null, segmento: null   // sem campo no formulário ativo
  },
  attribution: {
    firstTouch: Snapshot | null,    // primeira visita com UTM (localStorage)
    lastTouch:  Snapshot | null     // última visita com UTM nesta sessão (sessionStorage)
  },                                // Snapshot = utm_source/medium/campaign/term/content, gclid, fbclid, timestamp
  context: { userAgent, ipHash, device: "mobile" | "tablet" | "desktop" | null },
  consent: { lgpd: false },         // sempre false, por decisão (sem checkbox LGPD no formulário)
  status: "novo",                   // novo → qualificado → proposta → ganho | perdido (atualizado à mão pelo comercial)
  whatsappAposEnvio: { clicado: boolean, em: Date | null },
  criadoEm: Date
}
```

### Consultas úteis (Atlas "Browse Collections" ou `mongosh`)

```js
use toroid
db.leads.find().sort({ criadoEm: -1 }).limit(20)                          // últimos leads
db.leads.countDocuments({ criadoEm: { $gte: ISODate("2026-10-01") } })    // volume desde uma data
db.leads.aggregate([{ $group: { _id: "$attribution.lastTouch.utm_source", n: { $sum: 1 } } }])  // por canal
db.leads.countDocuments({ "whatsappAposEnvio.clicado": true })            // quem também chamou no WhatsApp
db.leads.updateOne({ _id: ObjectId("...") }, { $set: { status: "qualificado" } })
```

A conexão usa `serverSelectionTimeoutMS: 5000` e é reaproveitada entre invocações via `globalThis` ([lib/mongodb.ts](../lib/mongodb.ts)).

---

## 3. SMTP (e-mail de lead)

- [lib/orcamento-mailer.ts](../lib/orcamento-mailer.ts), Nodemailer. Porta 465 usa TLS implícito; qualquer outra usa STARTTLS.
- Remetente: `"Formulário Site" <SMTP_FROM ou SMTP_USER>`. `Reply-To` é o e-mail do visitante, então "Responder" no cliente de e-mail responde direto ao lead.
- Destinatários: `ORCAMENTO_DESTINATARIOS`, separados por vírgula.
- Dois e-mails:
  - **Novo pedido de orçamento: {nome}** (a cada envio do formulário).
  - **Mesmo lead, não é novo: {nome} também chamou no WhatsApp** (quando o mesmo visitante clica na CTA de WhatsApp da tela de sucesso). Existe para o comercial não contar o mesmo contato duas vezes.
- O HTML do e-mail usa as cores da marca e escapa todo texto digitado pelo visitante.
- O envio do primeiro e-mail é **a etapa que decide** se o visitante vê sucesso ou erro. Ver seção 5.

---

## 4. GA4, consentimento e atribuição

### Eventos

| Evento | Dispara em | Parâmetros |
|---|---|---|
| `whatsapp_click` | Todo `WhatsAppLink` | UTM de último toque (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, quando existirem) |
| `form_submit` | `OrcamentoForm`, só depois de `{ ok: true }` do servidor | UTM de último toque |
| `social_click` | Todo `SocialLink` | `rede`, `contexto` + UTM de último toque |

`gclid`/`fbclid` não vão para o GA4; ficam só no lead do MongoDB. Os eventos não fazem nada se `window.gtag` não existir (sem env var ou script bloqueado).

### Consent Mode v2

1. `ConsentDefaultScript` (inline, antes de tudo) nega `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` e aplica a escolha salva em `localStorage["toroid-consent"]`.
2. `CookieConsentBanner` grava a escolha (`saveConsent`), chama `gtag('consent','update')` e dispara `toroid:consent-saved`.
3. Só `analytics_storage` é controlável pelo visitante. Os `ad_*` ficam sempre negados (o site não tem pixel de Ads/remarketing).
4. A escolha expira em 365 dias e o banner volta.

### Atribuição de campanha

[lib/attribution.ts](../lib/attribution.ts), chamada em toda navegação por `AttributionCapture`:

- Só grava algo quando a URL tem ao menos um de `utm_source/medium/campaign/term/content`, `gclid`, `fbclid`.
- **Primeiro toque**: `localStorage["toroid:atribuicao:primeiro-toque"]`, gravado uma única vez por navegador.
- **Último toque**: `sessionStorage["toroid:atribuicao:ultimo-toque"]`, sobrescrito a cada nova URL de campanha.
- Enviado junto com o formulário e validado no servidor de forma tolerante: se vier malformado, vira `null` em vez de rejeitar o lead.

### UTM de saída para redes sociais

[lib/social.ts](../lib/social.ts) acrescenta `utm_source=toroid.com.br&utm_medium=referral&utm_campaign=social_follow&utm_content={contexto}` aos links de LinkedIn, Instagram e YouTube, para o tráfego vindo do site aparecer nos insights de cada rede.

### Testar no DebugView

Extensão "Google Analytics Debugger" ligada → abrir o site com `?utm_source=teste&utm_medium=teste&utm_campaign=teste` → aceitar cookies → clicar num link de WhatsApp e enviar o formulário → GA4 → Admin → DebugView. Procedimento completo em MIGRATION.md, seção 1.2.

---

## 5. Fluxo do formulário de orçamento

```
OrcamentoForm (navegador)
  │ POST /api/orcamento  { nome, email, telefone, observacao, attribution }
  ▼
app/api/orcamento/route.ts  (runtime Node.js)
  1. Rate limit: 5 req/min por IP ─────────────────────────► 429
  2. JSON inválido ────────────────────────────────────────► 400
  3. orcamentoSchema.safeParse (erros por campo) ─────────► 400 { errors }
  4. attributionBundleSchema.parse (nunca falha, cai em null)
  5. leadId = new ObjectId()     (síncrono, sem ir ao banco)
  6. after(() => leads.insertOne(...))   ← roda DEPOIS da resposta; erro só vai para o log
  7. await enviarOrcamentoPorEmail(...)  ← falhou? ───────► 502 "Tente pelo WhatsApp"
  8. 200 { ok: true, leadId }
  ▼
OrcamentoForm: dispara form_submit, mostra sucesso + CTA de WhatsApp com o nome do visitante
  │ clique → abre wa.me em nova aba e, em paralelo (keepalive):
  │ POST /api/orcamento/whatsapp { leadId }
  ▼
app/api/orcamento/whatsapp/route.ts
  - Rate limit 10 req/min por IP
  - findOneAndUpdate({ _id, "whatsappAposEnvio.clicado": false }) → idempotente
  - se marcou agora: e-mail "Mesmo lead, não é novo"
  - responde 200 mesmo se algo falhar (o visitante já está no WhatsApp)
```

Pontos que surpreendem quem chega:

- **E-mail é crítico, Mongo é best-effort.** Se o SMTP falhar, o lead fica gravado no Mongo (o `after()` roda de qualquer forma) mas o visitante vê erro. Se o Mongo falhar, ninguém vê nada além do log.
- Se o lead não gravou (Mongo fora), o clique no WhatsApp pós-envio não acha o documento e não manda o aviso.
- O rate limit é por instância serverless. Não protege contra ataque distribuído (ver [problemas-conhecidos.md](./problemas-conhecidos.md)).
- Mensagens de erro de validação vêm do servidor e estão sempre em português, mesmo em `/es`.

---

## 6. IndexNow

- [lib/indexnow.ts](../lib/indexnow.ts) faz `POST https://api.indexnow.org/indexnow` com `host`, `key`, `keyLocation` e `urlList`.
- Chave `c165dbaf002ee0026d2050be06dd83a8`, publicada em [public/c165dbaf002ee0026d2050be06dd83a8.txt](../public/c165dbaf002ee0026d2050be06dd83a8.txt). Não é segredo. Se trocar a chave, renomeie o arquivo **e** a constante juntos.
- Hoje só é chamada pela rota de revalidação. O envio inicial em massa de todas as URLs (MIGRATION.md seção 4) ainda não foi feito. Para fazer manualmente:

```bash
curl -X POST https://api.indexnow.org/indexnow -H 'Content-Type: application/json' -d '{
  "host":"toroid.com.br",
  "key":"c165dbaf002ee0026d2050be06dd83a8",
  "keyLocation":"https://toroid.com.br/c165dbaf002ee0026d2050be06dd83a8.txt",
  "urlList":["https://toroid.com.br/","https://toroid.com.br/produtos"]
}'
```

---

## 7. Vercel

| Item | Valor |
|---|---|
| Time / projeto | `toroid` / `toroid-website` (`prj_CsHAQjnwLUsUw6vDZ9lU4LUGfVDb`) |
| Domínios | `toroid.com.br` (produção), `www.toroid.com.br` (redirect 308 para o apex), `toroid-website.vercel.app` |
| Branch de produção | `master` |
| Node | 24.x |
| Proteção | Deploys de preview exigem login na Vercel (SSO em tudo, exceto domínios customizados) |
| Firewall | Regras de bypass para caminhos `/wp-*` criadas na época do corte; não há regra de rate limit para `/api/*` |
| Env vars | Production, Preview e Development. Lista completa no CLAUDE.md. Mudança só vale a partir do próximo deploy |
| Observabilidade | Runtime logs. Web Analytics e Speed Insights removidos em 2026-10-19 (estouraram o limite do plano Hobby) |

## 8. DNS e e-mail corporativo

- Zona de `toroid.com.br` na **Cloudflare** (conta `toroidev@toroid.com.br`, nameservers `adaline`/`cosmin`).
- Site: `A @ → 76.76.21.21` e `CNAME www → cname.vercel-dns.com`.
- E-mail corporativo é **Google Workspace** (5 MX do Google, SPF, DMARC, DKIM do Mailchimp). **Nunca** delegar os nameservers para a Vercel nem recriar a zona: qualquer registro esquecido derruba o e-mail da empresa. Mudança de site é sempre edição de registro A/CNAME. Histórico completo em MIGRATION.md.
