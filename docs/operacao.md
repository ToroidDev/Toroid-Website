# Operação

Como o código chega a produção, como voltar atrás, onde olhar quando algo quebra e como manter as dependências em dia.

---

## 1. Fluxo de trabalho com git

- Branch principal: **`master`**. Todo push em `master` gera um deploy de **produção** automaticamente (`toroid.com.br`).
- Qualquer outra branch gera um deploy de **preview** com URL própria (`toroid-website-git-<branch>-toroid.vercel.app`). Previews exigem login na Vercel para abrir (proteção SSO do projeto).
- Fluxo recomendado: branch (`feat/...`, `fix/...`) → PR no GitHub (`ToroidDev/Toroid-Website`) → conferir o preview → merge em `master`.
- Mensagens de commit no padrão já usado no histórico: `tipo(escopo): descrição em português`, com tipos `feat`, `fix`, `refactor`, `style`, `copy`, `docs`, `chore`. Ex.: `fix(blog): uma chamada ao WP por página`.

## 2. Deploy

| Situação | Como |
|---|---|
| Publicar mudança de código | Merge/push em `master` |
| Publicar mudança só de env var | Redeploy (env var só vale no build seguinte): Vercel → Deployments → último deploy de produção → "..." → **Redeploy**, **sem** "Use existing Build Cache" |
| Deploy manual pela CLI | `vercel --prod` na raiz do projeto (usa o código local, inclusive o que não foi commitado; evite) |
| Conteúdo do blog | Não precisa de deploy (cache de 1h ou webhook de revalidação) |
| Conteúdo de produto/segmento | Precisa de deploy (está no código) |

Depois de todo deploy de produção, confira:

```bash
curl -sI https://toroid.com.br | grep -iE "^HTTP|x-vercel-cache"     # 200
curl -s  https://toroid.com.br/sitemap.xml | head -5                 # sitemap do Next
curl -sI https://toroid.com.br/whatsapp | grep -iE "^HTTP|location"  # 308 → /#orcamento
```

E abra a home, uma página de produto, `/blog` e envie o formulário se a mudança mexeu nele.

## 3. Variáveis de ambiente em produção

- Listar: `vercel env ls` (ou painel → Settings → Environment Variables).
- Alterar: painel ou `vercel env rm NOME production && vercel env add NOME production`.
- **Sempre redeploy depois.** Este é o erro mais comum: a variável aparece certa no painel, mas o deploy em produção foi feito antes da mudança.
- Lista completa e status de cada variável: CLAUDE.md, seção "Variáveis de ambiente".

## 4. Rollback

Para voltar o site rapidamente a um estado anterior:

1. Vercel → Deployments → escolher o último deploy de produção bom → "..." → **Promote to Production** (ou "Instant Rollback"). Leva segundos e não precisa rebuild.
2. Depois, corrija o código com um commit de reversão em `master` (`git revert <sha>`). Sem isso, o próximo push reintroduz o problema.

Rollback de **DNS** (voltar a servir o WordPress antigo em `toroid.com.br`) deixou de ser uma operação simples: desde 2026-10-02 o endereço principal do site na WordPress.com é `toroidcombr.wpcomstaging.com`, e reverter exigiria mexer nisso também, o que quebra o `WP_API_URL` do site novo. Trate como último recurso e leia MIGRATION.md (seções 2.2 e 5) antes.

## 5. Onde olhar

| Pergunta | Onde |
|---|---|
| Erro em API Route ou página dinâmica | Vercel → projeto → **Logs** (runtime logs; filtrar por `/api/orcamento`, status 5xx). CLI: `vercel logs <url-do-deploy>` |
| Build falhou | Vercel → Deployments → deploy com erro → Build Logs. Reproduza local com `npm run build` |
| Tráfego e páginas mais vistas | GA4 (o Web Analytics da Vercel foi removido em 2026-10-19, ver problemas-conhecidos 4.13) |
| Core Web Vitals reais | PageSpeed Insights (dados CrUX do Google); o Speed Insights da Vercel foi removido em 2026-10-19 |
| Indexação, 404 vistos pelo Google | Google Search Console (Páginas / Indexação); Bing Webmaster Tools |
| Leads | MongoDB Atlas → cluster `cluster0-toroidsite` → `toroid.leads`; caixas de `ORCAMENTO_DESTINATARIOS` |
| DNS / e-mail corporativo | Cloudflare (zona `toroid.com.br`), Google Workspace admin |

Mensagens de log que o código emite (procure por elas nos runtime logs):

| Mensagem | Origem | Significado |
|---|---|---|
| `Falha ao salvar lead no MongoDB:` | `app/api/orcamento/route.ts` | Lead não gravou. O e-mail pode ter saído normalmente |
| `Falha ao enviar e-mail de orçamento:` | idem | SMTP falhou; visitante recebeu 502 |
| `Falha ao marcar clique de WhatsApp pós-envio:` | `app/api/orcamento/whatsapp/route.ts` | Não marcou o lead / não mandou o aviso |
| `IndexNow: resposta ...` / `IndexNow: falha ao notificar` | `lib/indexnow.ts` | Buscador recusou ou estava fora; inofensivo |
| `WP_API_URL não configurada` / `WordPress respondeu <status>` | `lib/wordpress.ts` | WP inacessível; blog cai no estado vazio |

## 6. Runbooks de incidente

### O formulário mostra "Não foi possível enviar sua solicitação agora"

Isso é o 502: o e-mail não saiu.

1. Runtime logs → procurar `Falha ao enviar e-mail de orçamento`. A mensagem de erro do Nodemailer diz a causa (`EAUTH` = senha, `ETIMEDOUT`/`ECONNREFUSED` = host/porta, `SMTP não configurado` = env var faltando).
2. Conferir `SMTP_*` e `ORCAMENTO_DESTINATARIOS` em Production. Se alguma senha mudou no provedor de e-mail, atualizar e **redeploy**.
3. Enquanto isso, o lead **pode** ter sido gravado no Mongo (a gravação roda mesmo quando o e-mail falha). Consulte `db.leads.find().sort({criadoEm:-1})` para não perder contatos.

### O formulário funciona, mas o lead não aparece no MongoDB

Ninguém percebe pelo site, porque o visitante vê sucesso. Já aconteceu (setembro de 2026, 4 dias sem gravar).

1. Runtime logs → `Falha ao salvar lead no MongoDB`. `bad auth` = credencial; `Server selection timed out` = cluster inacessível/pausado ou IP bloqueado.
2. `bad auth`: no Atlas → Database Access, conferir o usuário **`toroid-site-app`**; se preciso, gerar senha nova, atualizar `MONGODB_URI` em Production e Preview, redeploy.
3. Timeout: Atlas → Network Access precisa permitir `0.0.0.0/0` (as funções da Vercel não têm IP fixo); conferir se o cluster está ativo.
4. Teste: envie o formulário em produção com seus dados e confirme o documento no Atlas. Apague o lead de teste depois.

### `/blog` aparece vazio ou um post dá 404

1. `curl -sI "$WP_API_URL/posts?per_page=1"` deve dar 200. Se der 301/302, o "endereço principal" do site na WordPress.com mudou (ver MIGRATION.md 2.2). Se der 5xx, o WP está fora.
2. `WP_API_URL` em Production precisa ser `https://toroidcombr.wpcomstaging.com/wp-json/wp/v2`.
3. Post específico em 404: confirme o slug com `curl -s "$WP_API_URL/posts?slug=<slug>&_fields=id,status"`. Rascunho e post privado não aparecem.
4. Corrigido o WP, o site volta sozinho em até 1h, ou na hora via webhook de revalidação.

### Editei um post no WordPress e o site não mudou

Cache de 1 hora. Espere, ou chame `/api/revalidate` com `{"post_type":"post","slug":"<slug>"}` (ver [integracoes.md](./integracoes.md#revalidação-sob-demanda-webhook)). Para a listagem `/blog`, a mesma chamada invalida a tag `posts`. Se responder 401, confira `REVALIDATE_SECRET`.

### Imagens do blog quebradas

Quase sempre domínio da mídia fora de `images.remotePatterns`. Ver [guias.md](./guias.md#mudou-o-domínio-da-mídia-do-wordpress).

### Visitantes recebendo "Muitas solicitações" (429)

O limite é 5 envios por minuto por IP, por instância. Em redes corporativas com IP compartilhado, vários funcionários da mesma empresa podem bater no limite juntos. Se for recorrente, aumente `MAX_REQUISICOES_POR_JANELA` em `app/api/orcamento/route.ts`. Se for ataque, crie uma regra de rate limit no Vercel Firewall (camada correta para isso).

### Site fora do ar ou com erro em todas as páginas

1. Status da Vercel (vercel-status.com) e do último deploy (Deployments).
2. Se começou depois de um deploy: **rollback** (seção 4) primeiro, investigação depois.
3. Se o domínio não resolve: Cloudflare → DNS, conferir `A @ 76.76.21.21` e `CNAME www cname.vercel-dns.com`. Não mexa em MX/TXT.

### O e-mail corporativo (@toroid.com.br) parou

Não é o site, mas o DNS é compartilhado. Cloudflare → DNS: conferir os 5 MX do Google, o SPF e o DMARC contra o inventário em MIGRATION.md (seção 2, item 0). Nunca troque nameservers.

## 7. Atualizar dependências

Não há dependabot nem atualização automática. Sugestão: revisar uma vez por mês.

```bash
nvm use
npm outdated
```

### Patch e minor (ex.: `16.3.5 → 16.3.6`, `zod 4.4 → 4.5`)

1. Branch nova, `npm install <pacote>@<versão>` (atualiza o `package-lock.json`).
2. `npm run build` sem erro e sem warning novo.
3. Teste manual da seção 5 de [ambiente-local.md](./ambiente-local.md#5-verificações-rápidas-no-navegador), com atenção ao formulário se mexeu em `mongodb`, `nodemailer` ou `zod`.
4. PR, conferir preview, merge.

### Next.js e React

Next e React mudam convenções entre versões (o próprio projeto já usa `proxy.ts`, `params` como Promise e `revalidateTag` com perfil, que não existiam em versões anteriores).

1. Leia o guia de upgrade da versão alvo em `node_modules/next/dist/docs/` **depois** de instalar, e as release notes oficiais.
2. Atualize `next`, `react` e `react-dom` juntos, e `@types/react`/`@types/react-dom` na mesma linha.
3. Rode os codemods oficiais se o guia indicar (`npx @next/codemod@latest <transform> .`).
4. `npm run build` e compare a tabela de rotas com a esperada ([ambiente-local.md](./ambiente-local.md#saída-esperada-do-build)). Página que virou `ƒ` sem você querer é regressão de performance.
5. Rode Lighthouse no preview (meta ≥ 90) e compare com produção.
6. O `next dev` reescreve o bloco de [AGENTS.md](../AGENTS.md) automaticamente; commite essa alteração junto.

### Node

Ao mudar a versão do Node, mude junto: `.nvmrc`, `engines` do `package.json` e a versão do Node no projeto da Vercel (Settings → Build and Deployment).

### Adicionar uma dependência nova

Pergunte antes se dá para resolver com CSS ou com o que o Next já oferece (regra do CLAUDE.md). Se for para o navegador, rode `npx next experimental-analyze --output` antes e depois e anexe a diferença no PR.

## 8. Checklist antes do PR

- [ ] `npm run build` sem erro e sem warning de imagem/fonte
- [ ] Tabela de rotas do build: nenhuma página estática virou dinâmica
- [ ] Nenhum `"use client"` desnecessário
- [ ] Imagens via `next/image` com dimensões; nenhuma imagem de `public/` substituída mantendo o nome
- [ ] Página nova: metadata + `metadataOg` + canonical, JSON-LD do tipo certo, `<CTA />` no fim, entrada em `lib/routes.ts` e `public/llms.txt`, decisão sobre `heroClaroPath`
- [ ] Mudou texto de página com espelho: versão `/es` atualizada
- [ ] Links de WhatsApp via `WhatsAppLink`; redes via `SocialLink`
- [ ] Nenhum "40 anos", número de anos escrito à mão ou palavra proibida (CLAUDE.md, "Tom de voz")
- [ ] Env var nova cadastrada nos três ambientes, documentada, com redeploy previsto
- [ ] Mudou evento de conversão: testado no DebugView do GA4
- [ ] Documentação de `docs/` atualizada se o comportamento mudou

## 9. Rotina de saúde (sugestão mensal)

- [ ] Search Console: picos de 404 ou "Página com redirecionamento" inesperados
- [ ] PageSpeed Insights: LCP, CLS e INP dentro da meta nas páginas de produto
- [ ] Atlas: leads do mês batem com os e-mails recebidos (se não batem, a gravação está falhando)
- [ ] `npm outdated` e avisos de segurança do GitHub
- [ ] Revisar [problemas-conhecidos.md](./problemas-conhecidos.md)
