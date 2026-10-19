# Guias de tarefas comuns

Receitas passo a passo. Cada uma termina com a verificação mínima. Antes de abrir PR, rode também o checklist de [operacao.md](./operacao.md#8-checklist-antes-do-pr).

Índice:

- Conteúdo: [editar texto de página](#editar-o-texto-de-uma-página-existente) · [publicar post no blog](#publicar-ou-editar-um-post-do-blog) · [dados institucionais](#mudar-um-dado-institucional-anos-projetos-clientes-garantia) · [contato](#mudar-telefone-e-mail-endereço-ou-rede-social)
- Páginas: [página institucional nova](#criar-uma-página-institucional-nova) · [página de produto nova](#criar-uma-página-de-produto-nova) · [página de segmento nova](#criar-uma-página-de-segmento-aplicação-nova) · [espelho em espanhol](#criar-um-espelho-em-espanhol) · [tirar página do índice](#tirar-uma-página-do-google-sem-apagar)
- Idioma: [traduzir texto de componente](#traduzir-um-texto-de-componente-compartilhado)
- SEO: [redirect](#adicionar-um-redirect-de-url-antiga) · [robots](#mudar-a-política-de-robôs)
- Imagens: [imagem nova](#adicionar-ou-trocar-uma-imagem) · [domínio da mídia do WP](#mudou-o-domínio-da-mídia-do-wordpress)
- Formulário e analytics: [campo novo no formulário](#adicionar-campos-ao-formulário-de-orçamento) · [destinatários do e-mail](#mudar-quem-recebe-o-e-mail-de-lead) · [evento GA4 novo](#criar-um-evento-ga4-novo)
- Infra: [env var nova](#adicionar-uma-variável-de-ambiente) · [ligar produtos ao WordPress](#ligar-páginas-de-produto-ao-wordpress)

---

## Conteúdo

### Editar o texto de uma página existente

1. Ache o arquivo na tabela de rotas de [arquitetura.md](./arquitetura.md#4-mapa-de-rotas). Nas páginas de produto e segmento, o texto fica em constantes no topo do `page.tsx` (`SECOES`, `ESPECIFICACOES`, `CHECKLIST`, `PERGUNTAS`) e no JSX abaixo.
2. **Se a página tem espelho `/es`, edite o arquivo `app/es/<rota>/page.tsx` também.** Não há sincronização automática.
3. Mudou o título ou a descrição? Atualize as constantes `TITULO`/`DESCRICAO`, que alimentam `metadata` e Open Graph.
4. As `PERGUNTAS` alimentam a seção visível **e** o JSON-LD `FAQPage`. As `ESPECIFICACOES` alimentam a tabela **e** o `additionalProperty` do `Product`. Mude a constante, não o JSX, e as duas saídas continuam iguais.
5. Mudou o nome de uma seção listada em `SECOES`? Mantenha o `id` (ele é âncora de URL e do índice lateral), ou atualize o `id` nos dois lugares.
6. Siga o tom de voz e a lista de palavras proibidas do CLAUDE.md. Nunca escreva "40 anos" nem o número de anos à mão (use `getAnosDeMercado()`).

Verificação: `npm run dev`, abra a página pt e a es; `npm run build` sem erro.

### Publicar ou editar um post do blog

Feito no wp-admin, sem mexer em código.

1. Publique o post no WordPress. O **slug** vira a URL `toroid.com.br/blog/<slug>`.
2. Imagem destacada é opcional (sem ela o card ganha uma capa azul de marca).
3. O "tema" do card é deduzido do título (TC, TP, Indutores, Núcleo Toroidal, Engenharia), não da categoria do WP. Ver `REGRAS` em [lib/blog.ts](../lib/blog.ts).
4. O post aparece em `/blog`, em `/blog/<slug>` e no sitemap **em até 1 hora** (cache). Para aparecer na hora, chame o webhook de revalidação (ver [integracoes.md](./integracoes.md#revalidação-sob-demanda-webhook)).
5. Nunca mude o slug de um post antigo: há redirects em `next.config.ts` apontando para `/blog/<slug>` exato. Se precisar, adicione um redirect do slug velho para o novo.

### Mudar um dado institucional (anos, projetos, clientes, garantia)

- **Anos de mercado**: nunca editar. `getAnosDeMercado()` calcula sozinho a cada 1º de maio.
- **Outros números** (+18.000 projetos, +3.000 clientes, 3 anos de garantia): estão escritos em vários componentes. Ache todos antes de trocar:

  ```bash
  grep -rn "18.000\|3.000\|garantia de 3\|3 anos" app components lib public/llms.txt
  ```

- Atualize também o PRODUCT.md ("Brand Commitments"), que é a fonte oficial desses números.

### Mudar telefone, e-mail, endereço ou rede social

Os dados de contato não estão centralizados. Arquivos que contêm algum deles:

| Dado | Arquivos |
|---|---|
| Telefone fixo (41) 3035-8282 | `components/layout/Footer.tsx`, `components/contato/ContatoInfo.tsx`, `components/seo/OrganizationSchema.tsx`, `components/seo/LocalBusinessSchema.tsx` |
| WhatsApp (41) 3035-8258 | Env var `WHATSAPP_NUMBER` na Vercel **e** o fallback em `lib/whatsapp.ts`; texto exibido em Footer/ContatoInfo; `contactPoint` do OrganizationSchema |
| E-mails (`vendas@`, `engenharia@`, `rh@`) | Footer, ContatoInfo, OrganizationSchema, `app/trabalhe-conosco/page.tsx`, `app/quem-somos/page.tsx` |
| Endereço | Footer, ContatoInfo, `ContatoMapa.tsx` (mapa), OrganizationSchema, LocalBusinessSchema |
| LinkedIn / Instagram / YouTube | Só em `lib/social.ts` (todo link passa por `SocialLink`) |

Procure antes de editar, para não esquecer nenhum:

```bash
grep -rn "3035\|vendas@\|engenharia@\|rh@\|Bianchetti\|83065" app components lib public
```

Atualize também o PRODUCT.md ("Evidence on Hand").

---

## Páginas

### Criar uma página institucional nova

1. Crie `app/<slug>/page.tsx` como **Server Component** (sem `"use client"`).
2. Exporte `metadata` com `title`, `description`, `alternates: { canonical: "/<slug>" }` e `...metadataOg({ title, description, path: "/<slug>" })`. O `metadataOg` sempre inclui imagem; sem ele o preview de compartilhamento some.
3. Adicione o JSON-LD do tipo de página (CLAUDE.md, "Dados estruturados"): no mínimo `BreadcrumbList`, com URLs via `absoluteUrl()`. Renderize no fim do JSX com o mesmo padrão das outras páginas:

   ```tsx
   {JSON_LD.map((schema, i) => (
     <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
   ))}
   ```

4. Termine a página com `<CTA />`. Ele contém `id="orcamento"`, e o botão "Solicitar Orçamento" do menu depende disso.
5. **Topo da página é claro (sem hero azul)?** Inclua a rota em `heroClaroPath()` de [components/layout/Nav.tsx](../components/layout/Nav.tsx). Senão logo e menu ficam brancos sobre branco até o primeiro scroll.
6. Adicione a rota em `ROTAS_ESTATICAS` de [lib/routes.ts](../lib/routes.ts) (sitemap e Markdown para agentes) e um link em [public/llms.txt](../public/llms.txt).
7. Se a página precisa estar no menu, edite `Nav.tsx` (desktop e mobile) e os dicionários de [lib/i18n.ts](../lib/i18n.ts).
8. Se a URL já existiu no WordPress antigo, confira se não há um redirect para ela em `next.config.ts` (redirect tem prioridade sobre a página).

Verificação: `npm run build` mostra a rota como `○`; `curl -s localhost:3000/sitemap.xml | grep <slug>` depois de `npm run start`.

### Criar uma página de produto nova

Siga a página institucional acima e, além disso:

1. Use [app/isobox/page.tsx](../app/isobox/page.tsx) como modelo (é a mais enxuta do template Pillar): `PillarHero` → `PillarIndex` → `PillarBody`/`Prose` → `PillarChecklist` → `PillarSpecTable` → `Perguntas` → `PillarClosing` → `CTA`.
2. JSON-LD: `Product` (com `additionalProperty` vindo de `ESPECIFICACOES`) + `BreadcrumbList` + `FAQPage`. Não invente `offers` nem `aggregateRating`.
3. Adicione a linha em [lib/produtos.ts](../lib/produtos.ts). Isso coloca o produto no menu Produtos, na grade da home, em `/produtos` e no Markdown da home de uma vez.
4. Ícone novo? Acrescente o valor ao tipo `ProdutoIcone` em `lib/produtos.ts`, o SVG em [components/ui/ProductIcons.tsx](../components/ui/ProductIcons.tsx) (`ProdutoIconeSvg`) e a variante em [components/produtos/PillarEmblem.tsx](../components/produtos/PillarEmblem.tsx). O TypeScript aponta onde falta.
5. Se for uma família nova (não uma linha dentro de uma família), confira o enum `CATEGORIAS_PRODUTO` de `lib/wordpress.ts` e o `HREF_POR_CATEGORIA` de `app/aplicacoes/[slug]/page.tsx`. Hoje só têm as 3 famílias.
6. Lembre que "transformadores toroidais" **não é família**: é tecnologia de núcleo (ver CLAUDE.md).

### Criar uma página de segmento (aplicação) nova

1. Crie `app/aplicacoes/<slug>/page.tsx` (rota estática irmã de `[slug]`, tem prioridade sobre ela). Modelo: [app/aplicacoes/automacao-industrial/page.tsx](../app/aplicacoes/automacao-industrial/page.tsx).
2. Estrutura: `AplicacaoHero` (prova em **uma linha**, ex.: `["ISO 9001", \`${getAnosDeMercado()} anos de mercado\`, "garantia de 3 anos"]`) → `PillarBody`/`Prose` → `PillarChecklist` → `Perguntas` → `CTA`. A arte é opcional (ver as ilustrações em `components/aplicacoes/`).
3. JSON-LD: `BreadcrumbList` + `FAQPage`.
4. Adicione o segmento em [lib/segmentos.ts](../lib/segmentos.ts) (com textos em pt, es e en, porque a seção Segmentos também aparece em `/es`) para ele aparecer na home.
5. Adicione em `lib/routes.ts` e `public/llms.txt`.
6. Conteúdo técnico ou normativo ainda não validado pela engenharia: publique com `robots: { index: false, follow: false }` no `metadata` e **fora** de `lib/routes.ts`, como `/aplicacoes/equipamentos-medicos`.

### Criar um espelho em espanhol

Para uma rota `/<rota>` que já existe em português:

1. Crie `app/es/<rota>/page.tsx`. Copie a página pt e traduza todo o texto do arquivo (constantes e JSX). Componentes compartilhados (CTA, PillarHero, Perguntas, seções da home) já trocam sozinhos para espanhol porque o `LocaleProvider` detecta `/es` pela URL.
2. No `metadata` do espelho: `alternates.canonical` para `/es/<rota>`, `languages` com `pt-BR`, `es` e `x-default` (este apontando para a versão pt), e `metadataOg({ ..., path: "/es/<rota>", locale: "es_ES" })`.
3. No `metadata` da página pt: acrescente o mesmo bloco `languages`.
4. JSON-LD do espelho com URLs `/es/...` e textos em espanhol.
5. Mensagens de WhatsApp passadas como string literal precisam ser traduzidas no arquivo do espelho.
6. **Registre o espelho em três lugares** (não há fonte única ainda):
   - `PAGINAS_ESPELHO` em [lib/i18n.ts](../lib/i18n.ts): duas entradas, `"/<rota>"` e `"/es/<rota>"`, ambas com `{ pt, es }`.
   - `ALTERNADAS` em [app/sitemap.ts](../app/sitemap.ts): entrada para `"/<rota>"`.
   - Array `espelhos` em `app/sitemap.ts`: entrada para `"/es/<rota>"`.
7. Daqui em diante, toda edição na página pt precisa ser repetida na es.

Verificação: no rodapé da página pt, a bandeira da Espanha agora navega para `/es/<rota>` (em vez de só trocar o texto). `curl -s localhost:3000/es/<rota>` já vem em espanhol no HTML.

### Tirar uma página do Google sem apagar

1. `metadata.robots = { index: false, follow: false }` (ou `follow: true` se os links dela devem continuar sendo seguidos).
2. Remova a rota de `lib/routes.ts` (sitemap) e de `public/llms.txt`.
3. Para remover de vez do índice rapidamente, use a ferramenta de remoção do Google Search Console.

Para **apagar** uma página que já foi indexada, crie um redirect para a página mais próxima em vez de deixá-la virar 404.

---

## Idioma

### Traduzir um texto de componente compartilhado

Componentes usados também em `/es` (seções da home, CTA, Pillar, AplicacaoHero quando renderizado em espelho) precisam ter o texto nos três idiomas:

```tsx
import { T } from "@/components/i18n/T";

<h2><T pt="Orçamento técnico" es="Presupuesto técnico" en="Technical quote" /></h2>
```

- `<T>` é um Client Component mínimo. O componente ao redor continua Server Component.
- Para atributos (`aria-label`, `alt`) ou lógica, use `useLocale()` num Client Component, ou receba um `Record<Locale, string>`.
- Textos do Nav e Footer ficam nos dicionários `navDictionary`/`footerDictionary` de `lib/i18n.ts`.
- Para WhatsApp, passe `mensagem={{ pt: "...", es: "...", en: "..." }}` ao `WhatsAppLink`.

---

## SEO

### Adicionar um redirect de URL antiga

1. Em `redirects()` de [next.config.ts](../next.config.ts), uma linha por URL, com comentário curto explicando a origem:

   ```ts
   { source: '/url-antiga', destination: '/url-nova', permanent: true },
   ```

2. `source` sem barra final (o Next normaliza). Para famílias de URL previsíveis, use padrão (`'/:ano(\\d{4})/:mes(\\d{2})/:dia(\\d{2})'`) em vez de dezenas de linhas.
3. Só adicione redirect com destino confirmado. URL sem destino claro vira pendência no ROADMAP, não redirect adivinhado.
4. `permanent: true` devolve 308. É o correto (equivalente a 301 para o Google).

Verificação: `npm run build && npm run start`, depois `curl -sI localhost:3000/url-antiga | grep -i -E "^HTTP|location"`.

### Mudar a política de robôs

[app/robots.ts](../app/robots.ts). A política de bots de IA é decisão da diretoria (permitir os que citam a fonte, bloquear `GPTBot` e `ClaudeBot`). Não mude sem aprovação registrada no ROADMAP.

---

## Imagens

### Adicionar ou trocar uma imagem

1. Converta para `.webp` (ou `.avif`) com tamanho razoável (até ~1600 px no lado maior para fotos de seção). Originais em alta resolução ficam em `fotos-originais/` (fora do git).
2. Salve em `public/images/` (fotos de produto em `public/images/produtos/`).
3. **Trocando uma imagem existente, use um nome de arquivo novo.** Imagens de `public/` são servidas com cache `immutable` de 1 ano; com o mesmo nome, visitantes recorrentes e a CDN continuam vendo a versão antiga.
4. Use `next/image` com `width` e `height` reais (evita CLS) e `alt` descritivo. `priority` só se for a imagem principal visível sem rolar.
5. Diretriz de marca: produto real, nunca recortado sobre fundo branco "flutuando".

### Mudou o domínio da mídia do WordPress

1. Descubra o domínio novo: `curl -s "$WP_API_URL/media?per_page=1&_fields=source_url"`.
2. Adicione (ou troque) a entrada em `images.remotePatterns` de [next.config.ts](../next.config.ts).
3. Procure links fixos para o domínio antigo: `grep -rn "wp-content" app components lib`.
4. Deploy. Sem isso, toda imagem destacada do blog quebra com erro do `next/image`.

---

## Formulário e analytics

### Adicionar campos ao formulário de orçamento

A versão completa (empresa + campos técnicos por categoria TC/TP/Indutor) já está escrita e comentada. Reativar é decisão comercial. Mudanças precisam andar juntas em cinco arquivos:

1. [lib/orcamento-schema.ts](../lib/orcamento-schema.ts): campo no `orcamentoSchema` (ou troque pelo `orcamentoSchemaCompleto` comentado). É aqui que a validação real acontece.
2. [components/forms/OrcamentoForm.tsx](../components/forms/OrcamentoForm.tsx): o `<input>` (há um bloco comentado com `empresa` e `categoria`), a leitura no `payload` do `onSubmit`, os rótulos no `dict` dos três idiomas e a exibição de `erros.<campo>`.
3. [lib/leads-schema.ts](../lib/leads-schema.ts): `montarLeadDocument` hoje grava `empresa: null` e `segmento: null` fixos. Passe o valor real. Se for campo novo, acrescente ao tipo `LeadDocument`.
4. [lib/orcamento-mailer.ts](../lib/orcamento-mailer.ts): inclua o campo no texto e nas `linhas` do HTML de `enviarOrcamentoPorEmail`.
5. CLAUDE.md, seção do formulário, que descreve o conjunto de campos como intencionalmente mínimo.

Verificação: envie pelo navegador com SMTP apontando para você (ver [ambiente-local.md](./ambiente-local.md#3-variáveis-de-ambiente)); teste também um envio inválido e confira a mensagem de erro por campo.

### Mudar quem recebe o e-mail de lead

Só env var, sem código: altere `ORCAMENTO_DESTINATARIOS` (e-mails separados por vírgula) em Production na Vercel e faça **redeploy** (ver [operacao.md](./operacao.md#3-variáveis-de-ambiente-em-produção)).

### Criar um evento GA4 novo

1. Adicione uma função em [lib/analytics.ts](../lib/analytics.ts) seguindo o padrão de `trackSocialClick` (checa `window.gtag`, anexa `utmDoUltimoToque()`).
2. Chame no `onClick` do Client Component (ou crie um wrapper como `WhatsAppLink`/`SocialLink`, se o evento for de um tipo de link que se repete).
3. Se o clique navega na mesma aba, um `gtag` síncrono pode ser cortado pela navegação: use `transport_type: "beacon"` nos parâmetros.
4. Marque o evento como conversão no GA4 (Admin → Eventos), se for o caso.
5. Documente em [integracoes.md](./integracoes.md#eventos) e no CLAUDE.md.

---

## Infra

### Adicionar uma variável de ambiente

1. Leia sempre com `process.env.NOME`. Nunca escreva o valor no código.
2. Faça o código degradar sem ela (no-op, fallback ou erro tratado), como as outras integrações.
3. Variável usada no navegador precisa do prefixo `NEXT_PUBLIC_` e fica **pública** no bundle. As atuais são todas lidas no servidor.
4. Cadastre na Vercel em Production, Preview **e** Development (`vercel env add NOME`). Segredos como "Sensitive" em Production/Preview (a Vercel não permite Sensitive em Development).
5. Documente no CLAUDE.md ("Variáveis de ambiente") e em [ambiente-local.md](./ambiente-local.md#3-variáveis-de-ambiente).
6. Faça redeploy: variável nova só vale no próximo build.

### Ligar páginas de produto ao WordPress

É o item A.10 do ROADMAP. A camada de código existe; o que falta é do lado do WP. Ordem:

1. **No WordPress (Pods Admin → Add New):** criar os CPTs `produto` e `aplicacao` com os campos do CLAUDE.md ("Estrutura de dados do WordPress"), REST API habilitada no pod **e** em cada campo.
2. Decidir a taxonomia `categoria_produto`: o código ainda espera `transformador-de-corrente | transformador-toroidal | indutor-reator`, mas as famílias reais são TC, TP e Indutores (com toroidal como tecnologia). Criar no WP já com `transformador-de-potencia` e atualizar `CATEGORIAS_PRODUTO` em `lib/wordpress.ts`, o `HREF_POR_CATEGORIA` de `app/aplicacoes/[slug]/page.tsx` e o comentário do CLAUDE.md juntos.
3. Validar o JSON antes de escrever template: `curl -s "$WP_API_URL/produto?per_page=1" | jq '.[0].acf'`. Campo sem "Show in REST API" simplesmente não aparece.
4. Ajustar os tipos `WPRawProduto`/`WPRawAplicacao` em `lib/wordpress.ts` ao formato real (o Pods pode entregar campos fora de `acf`).
5. Trocar as constantes estáticas de uma página por vez (comece por uma família), mantendo URL e estrutura. Use `generateStaticParams`/revalidate conforme a página; não leia cookies/headers.
6. Configurar o webhook de revalidação no WP.
7. Conferir que `next build` continua passando **sem** `WP_API_URL` (build não pode depender do WP estar no ar), ou decidir conscientemente o contrário.
