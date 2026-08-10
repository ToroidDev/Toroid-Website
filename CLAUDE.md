@AGENTS.md

# CLAUDE.md · Toroid do Brasil · Site institucional

Contexto persistente para qualquer trabalho neste repositório. Leia isto antes de criar, editar ou revisar qualquer arquivo.

## O que é este projeto

Site institucional da Toroid do Brasil (fabricante de transformadores toroidais, TCs e indutores), reconstruído em Next.js consumindo WordPress como CMS headless. O WordPress atual (Elementor/Jetpack) deixa de ser renderizado publicamente, mas continua existindo só como fonte de conteúdo via REST API.

**Prioridade número um deste projeto: performance.** 94% do tráfego orgânico é de marca; a alavanca real é capturar busca de produto, e isso depende de Core Web Vitals bons, não só de conteúdo bom. Toda decisão técnica abaixo existe para proteger isso.

---

## Stack

- **Frontend:** Next.js (App Router), TypeScript, Server Components por padrão
- **Deploy:** Vercel
- **CMS:** WordPress headless via REST API (`wp-json/wp/v2/`), custom post types via ACF + Custom Post Type UI
- **Analytics:** GA4
- **Formulários:** API Routes do Next.js (nunca client-side puro)
- **Repo:** GitHub, `ToroidDev/Toroid-Website`

## Variáveis de ambiente

Nunca hardcodar estes valores em nenhum arquivo. Sempre `process.env.X`, configurado no Vercel em Production + Preview + **Development** (as três, mesmo que hoje só as duas primeiras estejam marcadas).

```
WP_API_URL=https://toroid.com.br/wp-json/wp/v2
WHATSAPP_NUMBER=554130358263
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## Estrutura de dados do WordPress

Dois Custom Post Types além do post nativo. **Todo campo ACF precisa ter "Show in REST API" marcado**. Sem isso o campo existe no WP mas não aparece no JSON, e qualquer template que dependa dele vai renderizar vazio sem erro visível. Sempre validar um endpoint novo assim antes de escrever o template:

```bash
curl -s https://toroid.com.br/wp-json/wp/v2/produto/123 | jq
```

### CPT `produto`
| Campo (slug ACF) | Tipo | Notas |
|---|---|---|
| `categoria_produto` | Taxonomia | `transformador-de-corrente` \| `transformador-toroidal` \| `indutor-reator` |
| `variante` | Texto/Taxonomia | CX01, resinado, médico, etc. |
| `faixa_tecnica` | Texto | Ex.: "5 VA a 15 kVA" |
| `parametros_especificacao` | Repeater (`nome` + `valor`) | Varia por categoria, ver playbook de especificação |
| `aplicacoes_relacionadas` | Relationship → CPT `aplicacao` | Base do link cruzado produto↔segmento |
| `imagem_principal`, `galeria` | Imagem/galeria | Produto real, nunca sobre fundo branco flutuando |

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
- **Revalidação sob demanda:** configurar um webhook no WordPress (dispara ao publicar/editar) chamando uma API Route que roda `revalidateTag`. Isso evita dois extremos ruins: página estática desatualizada por horas, ou renderização dinâmica a cada request só pra ter conteúdo fresco.
- **Rotas por tipo de conteúdo:** `/produtos/[categoria]/[slug]`, `/aplicacoes/[slug]`, `/blog/[slug]`. Cada uma resolve os relacionamentos (produto↔aplicação) numa única chamada quando possível, nunca em cascata de requests sequenciais.
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

## Identidade visual (não é opcional, é a versão oficial vigente)

| Token | Valor |
|---|---|
| Azul institucional (primária) | `#1A4B8C` |
| Verde (detalhe) | `#5EA75E` |
| Amarelo | `#FBF23D`, **exclusivo dos três fios do logo, nunca usar em UI** |
| Cinza texto | `#393738` |
| Gradiente institucional | `azul → branco`, só em capas/faixas de rodapé/separadores, nunca atrás de texto |
| Tipografia | Montserrat, 700 títulos, 600 subtítulos, 400 corpo, line-height 1.6 |

Nunca: gradiente verde→azul (versão antiga), azul e verde com peso visual igual (azul é base, verde é detalhe), logo recolorido/distorcido/com sombra.

---

## UTM e eventos de conversão

- Capturar UTM da URL no client ao entrar no site, guardar em `sessionStorage` (sobrevive à navegação interna).
- Dois eventos GA4 distintos, nunca um só: `whatsapp_click` (intenção) e `form_submit` (lead real), os dois com os parâmetros de UTM originais anexados, disparados via `next/script`/`gtag` **antes** do redirect (usar `sendBeacon` ou pequeno delay, redirect pode cortar a chamada).
- Link de WhatsApp: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`. A mensagem já inclui produto/especificação e origem de campanha quando disponível.

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
