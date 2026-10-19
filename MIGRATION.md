# Guia de migração: corte de DNS do WordPress antigo para o Next.js

Runbook operacional para o dia do corte e os dias ao redor dele. Não substitui `ROADMAP.md` (estado vivo do projeto) nem `CLAUDE.md` (convenção técnica): este arquivo assume os dois como verdade e organiza só a sequência de execução da migração em si. Escrito em 2026-09-21, a partir do estado real registrado em `ROADMAP.md` (última verificação ao vivo: 2026-09-08, domínio ainda 100% no WordPress antigo).

Trate os itens marcados **[BLOQUEADO]** como impeditivos reais hoje, não como formalidade. Os demais são checklist de execução.

---

## 0. Antes de tudo: isto é decisão, não código

**[RESOLVIDO em 2026-09-23]** Validação formal da diretoria: OK dado para trocar o DNS, subir o site novo e desativar o antigo. Isso resolve o único bloqueio de negócio (ver histórico: conteúdo aprovado em 2026-08, reunião de confirmação final ainda pendente em 2026-09-21). Não confundir com "pronto pra executar hoje": a seção 1 abaixo ainda tem itens técnicos não marcados, e a seção 0.1 (nova) documenta um bloqueio novo e não-antecipado, descoberto só ao investigar e-mail: perda de acesso à conta Cloudflare original.

O lado técnico do site está pronto e íntegro (`toroid-website.vercel.app`, deploy `4e6adf1` verificado ao vivo). O atraso remanescente é de checklist (seção 1) e do item 0.1, não mais de aprovação.

### 0.1 Bloqueio novo: acesso perdido à conta Cloudflare original **[RESOLVIDO em 2026-09-25]**

Descoberto em 2026-09-23 ao investigar como trocar o DNS sem derrubar e-mail: ninguém do time tem login da conta Cloudflare que já é autoritativa pra `toroid.com.br` (NS `isla.ns.cloudflare.com`/`joel.ns.cloudflare.com`). Em vez de recuperar essa conta, o caminho em execução foi adicionar o domínio como site novo numa conta própria (`toroidev@toroid.com.br`, zona `ca553d2bba0bdd8a3b21b75ef7bbb`, plano Free) e deixar a Cloudflare escanear os registros existentes.

Na mesma investigação apareceu um segundo acesso perdido, **de urgência bem menor**: o cPanel da hospedagem (usuário conhecido, senha e e-mail de recuperação não). **Confirmado que não bloqueia nada:** o wp-admin do WordPress continua acessível normalmente — CPTs `produto`/`aplicacao`, ACF/Pods, mídia, tudo editável. O que falta é só a camada de servidor (PHP, backup, cron, FTP, certificado no host) que o cPanel controla, não o CMS em si. Tratar como pendência de higiene, não como bloqueio do corte: recuperar via fatura de hospedagem (financeiro da empresa, provedor ainda não identificado) + suporte do provedor, provando posse do domínio via WHOIS/registro.br, sem prazo apertado.

Validação feita antes de prosseguir (todos os passos por `dig` externo, sem depender do login perdido):
- **Reconciliação total:** os 53 registros que o scan trouxe (24 A / 8 AAAA / 10 CAA / 2 CNAME / 5 MX / 4 TXT) batem, um por um, com o que `dig` externo confirma pra cada hostname (raiz, `www`, os 10 subdomínios de cPanel — `cpanel`/`whm`/`webmail`/`imap`/`pop`/`smtp`/`ftp`/`webdisk`/`cpcalendars`/`cpcontacts` —, e os 2 CNAME de DKIM do Mailchimp `k2`/`k3._domainkey` → `dkim2`/`dkim3.mcsv.net`). Nada disso tinha aparecido na primeira investigação (que só checou raiz/`www`/`_dmarc`); é a Cloudflare importando o estado real da zona (o domínio já está nela hoje), não um chute.
- **DNSSEC: confirmado ausente** (`dig DS toroid.com.br` e `dig DNSKEY toroid.com.br` vazios) — elimina o risco clássico de troca de NS quebrar a validação DNSSEC do domínio inteiro por DS/DNSKEY desencontrado. A recomendação da própria Cloudflare de "desligar DNSSEC" não se aplica porque nunca esteve ligado.
- **Status de proxy (nuvem laranja/cinza) em cada registro importado reflete a produção atual**, não um default de wizard — não "corrigir" isso durante a reclamação, só depois, separado, se fizer sentido.
- **Risco aceito, não verificável (2026-09-23):** Page Rules / Redirect Rules / regras de WAF da conta original não têm como ser conferidas — quem configurou (ou saberia dizer) já saiu da empresa há muito tempo, e isso não aparece em nenhum scan de DNS. Não é bloqueio (não tem o que investigar a mais), é risco residual monitorado: depois da troca de NS, prestar atenção a sintoma que só uma Page Rule perdida causaria — loop de redirect, HTTP não forçando HTTPS quando forçava antes, ou bloqueio/desafio que sumiu (ex.: país ou bot que antes era barrado e agora não é). Nenhum desses apareceria num teste de DNS, só no comportamento real do site depois de ativo.

**[QUASE RESOLVIDO em 2026-09-25]** Nameserver trocado no registro.br (substituição direta de `isla`/`joel` por `adaline`/`cosmin`, não adição — misturar as duas zonas simultaneamente reintroduziria o mesmo problema de forma imprevisível: NS não tem prioridade, um resolvedor qualquer no mundo poderia responder pela zona antiga indefinidamente, inclusive depois do corte do site). Propagação confirmada em ~24h (mais perto do limite superior que do "1-2h típico" que a própria Cloudflare estima) via `dig` em três resolvedores (padrão, 1.1.1.1, 8.8.8.8): todos já respondem `adaline`/`cosmin`. Reconciliação pós-troca rodada e limpa: MX, SPF, DMARC, os 10 CAA, os 2 CNAME de DKIM do Mailchimp e os 10 hosts de cPanel batem exatamente com o inventário pré-troca. DNSSEC continua ausente, como esperado.

**Confirmado em 2026-09-25:** e-mail de teste real enviado e recebido normalmente numa caixa `@toroid.com.br`. Bloqueio encerrado — a conta Cloudflare original deixou de ser relevante (não é mais autoritativa pra nada), e o domínio está sob controle total do time, sem depender de acesso perdido. Cuidado remanescente, não bloqueio: manter o hábito de nunca aceitar delegação de nameserver pra fora da Cloudflare (nem pra Vercel, ver item 0 abaixo) sem repetir esse mesmo processo de reconciliação.

---

## 1. Checklist pré-corte

### 1.1 Paridade de URL e conteúdo

- [x] **Feito (2026-09-21):** mapa de redirects em `next.config.ts` (68 entradas) testado contra o servidor local (`next start`) com uma amostra de 10 URLs (incluindo o padrão de data `/:ano/:mes/:dia`, o `__trashed`, os dois slugs de `/transformadores-de-tensao`, `/whatsapp` e os 3 caminhos antigos de `/produtos/...`): todos devolveram 308 para o destino certo. Não achei `paginasGSC.md` no Notion (busca sem resultado) para conferir contra os 83 URLs originais do export, então isso segue sem confirmação cruzada — só o já documentado em `ROADMAP.md` ("essencialmente completo, o que falta é por decisão explícita ou pendência externa").
- [x] **Decisão de negócio (2026-09-25):** manter os ~5 posts de blog com dado desatualizado como estão — são posts antigos, removidos depois se necessário. Deixou de ser **[BLOQUEADO]**; não é mais impeditivo pro corte.
- [x] **Feito:** validação formal da engenharia sobre os números de `/aplicacoes/nobreaks` concluída (2026-09-25).
- [x] **Decisão de negócio (2026-09-25):** manter `/indutores-filtros-e-chokes` sem faixa técnica/tabela de especificação — ninguém solicitou a inserção. Pendência pós-lançamento, não bloqueio.
- [ ] QA cross-browser/cross-device ponta a ponta. `ROADMAP.md` não tem registro de que essa rodada aconteceu. **Como fazer, dado que não há ferramenta de QA dedicada no projeto:** testar manualmente a URL de preview da Vercel (não esperar o corte) nas combinações que existem de verdade no escritório — no mínimo desktop Chrome + um Android (Chrome) + um iPhone (Safari, é onde mais aparece bug de CSS/scroll que Chrome não pega). Sem Mac/iPhone à mão, um trial gratuito de BrowserStack Live ou LambdaTest cobre Safari iOS/macOS sem precisar comprar aparelho. Checklist por combinação, focado nas páginas de maior tráfego (`/`, as 3 famílias de produto, `/produtos`, `/orcamento` ou onde o formulário vive): sem layout shift no hero, sticky nav comportando (já teve bug de "espiar por cima dos botões", ver commit `28de9b3`), formulário preenche e envia, CTA de WhatsApp abre o app/`wa.me` corretamente no celular, sem scroll horizontal, sem erro no console do navegador.
- [x] **Feito (2026-09-25):** teste manual ponta a ponta do formulário de orçamento — envio real, e-mail chegou, lead gravou no MongoDB, CTA de WhatsApp pós-envio marcou o mesmo `leadId`.

### 1.2 Ambiente e integrações

- [x] **Feito (2026-09-25):** as 7 env vars conferidas em Production. Correção da auditoria anterior: `WP_API_URL`, `WHATSAPP_NUMBER`, `GA4_MEASUREMENT_ID`, `REVALIDATE_SECRET` e `LEAD_IP_HASH_SECRET` já estavam presentes desde 2026-08-13 (a nota antiga estava certa, só não tinha sido re-verificada nesta rodada). `BING_SITE_VERIFICATION` decidido não usar (propriedade do Bing já verificada via import do Search Console, não por meta tag). `MONGODB_URI` (Production e Preview, também desde 13/08) estava com o cluster Atlas mostrando "Paused" no monitoramento — testado via "Browse Collections" no Atlas e depois com envio real do formulário de orçamento: cluster ativo, `MONGODB_URI` válida, coleção `leads` recebendo os documentos normalmente. **Achado à parte:** o código (`lib/orcamento-mailer.ts`) também usa `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASSWORD`/`SMTP_FROM`/`ORCAMENTO_DESTINATARIOS`, todas já presentes em Production desde 14/08 mas nunca documentadas no `CLAUDE.md` — corrigido lá.
- [ ] Fazer um redeploy de Production logo antes do corte. Env var nova só passa a valer no próximo build, então confirmar a variável no painel não basta se o deploy atual é anterior a ela. **Como fazer:** ou (a) dar `git push` de um commit qualquer na branch de produção (dispara deploy automático), ou (b) no painel Vercel → aba **Deployments** → no deployment mais recente → menu "..." → **Redeploy** (sem "Use existing Build Cache", pra garantir que build lê as env vars novas), ou (c) via CLI, `vercel --prod` de dentro do projeto. Fazer isso de novo, uma última vez, bem antes do corte de DNS em si — é o deploy que efetivamente vai ao ar quando o DNS apontar pra cá.
- [ ] Sessão real de GA4 DebugView confirmando `whatsapp_click` e `form_submit` disparando com UTM de último toque anexado, não só a verificação estrutural do código já feita. **Como fazer:** instalar a extensão "Google Analytics Debugger" no Chrome e deixá-la ativada (ícone aceso) na aba onde o site vai ser testado — isso marca os hits daquela aba como `debug_mode`, sem afetar dado real de outros visitantes. Abrir GA4 → Admin → **DebugView** (fica em "Exibição de dados"). Com a aba de teste aberta: visitar o site com parâmetros de UTM na URL (ex.: `?utm_source=teste&utm_medium=teste&utm_campaign=teste`) pra simular last-touch, clicar num link de WhatsApp (deve aparecer `whatsapp_click` no DebugView em poucos segundos) e enviar o formulário de orçamento de teste (deve aparecer `form_submit` só depois do `{ok:true}` do servidor). Clicar em cada evento no DebugView pra expandir os parâmetros e confirmar que o UTM de último toque está anexado, não só o nome do evento.
- [x] **Decidido (2026-09-25):** webhook do WordPress para `/api/revalidate` configurado **depois** do corte, não antes. Não bloqueia o corte em si (a rota já responde 401 com segurança se chamada sem `REVALIDATE_SECRET`), mas até alguém configurar o webhook, o conteúdo do WP fica preso ao cache de até 1h declarado em cada fetch (`CLAUDE.md`) — item já registrado na seção 4 (primeiras 48-72h) deste guia.

### 1.3 Validação técnica (no domínio de preview da Vercel, antes do corte)

- [x] **Feito (2026-09-21):** `next build` limpo, sem warning de imagem/fonte não otimizada.
- [ ] Lighthouse ≥ 90 / LCP < 2.5s / CLS < 0.1 / INP < 200ms. Já validado em produção em 2026-08-17 segundo `ROADMAP.md`; reconfirmar se algo relevante mudou desde então (não reconfirmado nesta rodada, precisa rodar contra ambiente real, não só `next start` local).
- [x] **Feito (2026-09-21), com ressalva:** JSON-LD de `/`, `/transformador-de-corrente`, `/transformador-de-potencia`, `/indutores-filtros-e-chokes`, `/produtos`, `/quem-somos` e `/isobox` extraído e parseado: todos os blocos são JSON válido, com a combinação de `@type` esperada por página (`Organization` sempre; `Product`+`BreadcrumbList`+`FAQPage` nas 4 páginas de família/pilar; `LocalBusiness`+`VideoObject` a mais em `/quem-somos`; `BreadcrumbList`+`CollectionPage` em `/produtos`, sem `Product`/`FAQPage`, como o CLAUDE.md pede). Isso valida estrutura, não elegibilidade de rich snippet: rodar o Rich Results Test de verdade (ferramenta do Google, precisa de URL pública) continua pendente, e o `Product` não tem `offers`/`aggregateRating` (não é bug: não há preço público nem avaliação por produto, e inventar um dos dois violaria a regra de não fabricar dado — só reduz a chance de aparecer como rich result visual, sem afetar SEO/AEO textual).
- [x] **Feito (2026-09-21):** amostra de 10 redirects 301/308 testada contra `next start` local, todos corretos (ver item 1.1 acima para a lista).

---

## 2. Dia do corte

Janela de baixo tráfego (terça ou quarta, como o cronograma original já previa).

0. **E-mail não pode fazer parte da troca.** Confirmado ao vivo em 2026-09-23 via `dig` direto (não é suposição):
   - `toroid.com.br` está com NS **direto na Cloudflare** (`joel.ns.cloudflare.com` / `isla.ns.cloudflare.com`), não delegado pro WordPress.com nem pra Vercel. A zona inteira mora no painel DNS da Cloudflare.
   - E-mail é **Google Workspace** (MX: `aspmx.l.google.com` + 4 `altN.aspmx.l.google.com`, prioridades 1/5/5/10/10).
   - SPF do root: `v=spf1 include:b.atomicsites.net include:_spf.google.com ~all` — o include do Google é o Workspace; `b.atomicsites.net` é infraestrutura da Automattic (WordPress.com) e provavelmente serve e-mail transacional do próprio WP (notificação de comentário, etc.), que continua vivo como CMS headless. Não mexer nisso também, mesmo motivo do item 2.4 abaixo.
   - DMARC: `v=DMARC1;p=none;` (monitoramento, sem enforcement — reduz o risco de bounce por qualquer instabilidade, mas não é desculpa pra mexer no SPF/DKIM sem necessidade).
   - Registro A do root e do `www` aponta pro proxy da Cloudflare (`172.67.194.175` / `104.21.34.10`, orange cloud) — é só esse par de registros que precisa mudar pra apontar pro Vercel.
   - **A troca de DNS do site é edição de registro A/CNAME dentro da Cloudflare, nunca delegação de nameserver.** Ao conectar o domínio no painel da Vercel, escolher explicitamente o método "adicionar estes registros" (A no apex + CNAME no `www`, o que a tela da Vercel mostrar) e criar/editar só esses dentro da Cloudflare. **Nunca** aceitar a opção de trocar os nameservers do domínio pros da Vercel — isso moveria a zona inteira (MX, SPF, DMARC, CAA, tudo) pra fora da Cloudflare, e qualquer registro esquecido na recriação manual derruba e-mail. Como a Vercel não precisa nem quer rotear e-mail, o método por registro é estritamente mais seguro e não perde nada.
   - Antes de tocar em qualquer registro: exportar a zona (Cloudflare → DNS → Records → "Export DNS records", gera BIND zone file) como backup, mesmo sendo edição pontual.
   - Registros que **não** entram na troca, sob nenhuma hipótese: os 5 MX do Google, o TXT de SPF, o TXT de `_dmarc`, o TXT `google-site-verification`, e os CAA (`pki.goog`, `letsencrypt.org`, `digicert.com`, `comodoca.com`, `ssl.com` — já cobrem a CA que a Vercel usa, não precisa adicionar nada aí).
   - **Feito (2026-09-25):** `toroid.com.br` e `www.toroid.com.br` adicionados ao projeto `toroid-website` na Vercel (via API, não pela tela de "buy domain" do dashboard — essa tela só compra domínio novo e rejeita `.com.br`, não serve pra conectar domínio existente). `www` configurado como redirect 308 pra `toroid.com.br` (decisão de manter uma única URL canônica; se a equipe preferir `www` servindo direto, é só reconfigurar). Isso não muda nada em produção por si só — só reserva o domínio no projeto e confirma os valores de DNS a usar:
     - Apex (`toroid.com.br`): registro **A** → `76.76.21.21`
     - `www.toroid.com.br`: registro **CNAME** → `cname.vercel-dns.com`
1. **Reduzir o TTL do registro DNS atual**, se ainda não estiver baixo, com antecedência suficiente para propagar antes do corte. Isso acelera tanto a virada quanto um eventual rollback. Só nos registros do site (A do apex/`www`) — TTL de MX/TXT de e-mail não precisa mudar, já que eles não vão ser tocados.
2. **[Feito 2026-09-25]** Redeploy final de Production na Vercel — disparado via API (`dpl_2P6LVB4u9FgSR7z5BH5Enb9KwqhR`, mesmo commit `f901614`).
3. **[Feito 2026-09-25]** Trocar o DNS/domínio de `toroid.com.br` do host do WordPress para o projeto na Vercel — A do apex → `76.76.21.21`, CNAME do `www` → `cname.vercel-dns.com`, dentro da Cloudflare.
4. **Manter o host do WordPress no ar e acessível**, só deixando de ser renderizado publicamente. `WP_API_URL` continua apontando pra lá (é a fonte de conteúdo via REST API), e os PDFs técnicos continuam servidos direto da Media Library do WP, sem migração (decisão já registrada em `ROADMAP.md`). Desligar o WordPress no dia do corte quebra o site novo também.

### 2.2 Efeito colateral descoberto depois do corte: `WP_API_URL` parou de funcionar

Com `toroid.com.br` servindo a Vercel, qualquer chamada a `wp-json` passou a cair no app novo (sem rota, 404) ou ser bloqueada pela proteção padrão da Vercel contra caminhos de WordPress (`/wp-admin`, `/wp-json`, resolvido com regras de **Bypass** no Firewall do projeto). Depois disso, a WordPress.com continuava redirecionando (301) qualquer tentativa pelo domínio padrão `toroidcombr.wpcomstaging.com` de volta pro `toroid.com.br` — comportamento documentado e definitivo pra sites com hosting features ativadas, sem bypass possível. **Resolvido em 2026-10-02**: trocado o "endereço principal do site" na WordPress.com de `toroid.com.br` pra `toroidcombr.wpcomstaging.com` — `toroid.com.br` continua intocado, e o domínio padrão passou a responder a `wp-json` direto, sem redirecionar. `WP_API_URL` atualizado no Vercel (Development/Preview/Production) pra `https://toroidcombr.wpcomstaging.com/wp-json/wp/v2`, redeploy de produção feito (`dpl_6UkoNQmapHprFutrUPYYdqRvBVAT`) e confirmado ao vivo: `toroid.com.br` segue HTTP 200 normal, `wp-json/wp/v2` e `wp-json/wp/v2/posts` respondem HTTP 200 direto, sem redirect. **Fechado.** Detalhe completo e o achado seguinte (os CPTs `produto`/`aplicacao` não existem de verdade no WP ainda) em `ROADMAP.md`, Trilha B.

### 2.1 Incidente do corte: Cloudflare Error 1000 "DNS points to prohibited IP"

O corte não saiu limpo de primeira — o site ficou fora do ar (403, página de erro da própria Cloudflare) antes mesmo de qualquer edição nossa nos registros. **Causa raiz:** o scan de importação da zona nova (seção 0.1) só consegue enxergar, de fora, a resposta proxiada de um registro (sempre um IP da própria Cloudflare, nunca a origem real, que fica escondida atrás do proxy) — e gravou esse IP da Cloudflare como se fosse o valor de origem do registro A/AAAA do próprio site (`toroid.com.br` e `www`). Ficou invisível enquanto a zona antiga ainda respondia; virou erro ao vivo assim que a zona nova assumiu de vez (2026-09-25). **Isso é uma lacuna real da reconciliação registro-a-registro feita na seção 0.1: ela prova que o conteúdo bate, mas não consegue provar que o valor de origem de um registro proxiado está correto, porque esse valor nunca é visível de fora.** Toda vez que uma zona Cloudflare for reconstruída por scan (não por export/import direto), tratar o(s) registro(s) A/AAAA do próprio domínio como suspeitos até serem apontados de propósito pra um destino de verdade — nesse caso, resolvido apontando pra Vercel, que era o próprio passo já planejado, não um extra.

**Resolvido (2026-09-25):** apex (`toroid.com.br A → 76.76.21.21`) e `www` (deletados os A/AAAA antigos, criado `www CNAME → cname.vercel-dns.com`) corrigidos manualmente na Cloudflare. Confirmado com navegador real: `https://toroid.com.br` HTTP 200 (conteúdo correto, `x-vercel-cache: HIT`), `https://www.toroid.com.br` HTTP 308 pro apex. **Corte concluído.**

---

## 3. Checklist imediato pós-corte (primeiras horas)

- [x] **Feito (2026-09-25):** `curl -I https://toroid.com.br` devolve HTTP 200 com cabeçalhos da Vercel (`x-vercel-cache`, `x-nextjs-prerender`), conteúdo real da home. Esse foi exatamente o teste que confirmou, em 2026-09-08, que o corte *não* tinha acontecido, então é o primeiro teste real de que aconteceu.
- [x] **Feito (2026-09-25):** certificado SSL válido no domínio apex servido pela Vercel (HTTPS respondeu normalmente, sem aviso de certificado).
- [ ] `/sitemap.xml` e `/robots.txt` servindo a versão do Next.js (`app/sitemap.ts`/`app/robots.ts`), não mais a do WordPress.
- [ ] Amostra dos redirects 301/308 testada direto em produção (`curl -I` em 5 a 10 URLs do mapa, incluindo o padrão de data `/:ano/:mes/:dia`).
- [ ] Meta tag `msvalidate.01` (Bing) presente no HTML servido em produção. Como ela vem de `BING_SITE_VERIFICATION` no `app/layout.tsx`, independe do corte, mas vale conferir que o redeploy do item 2.2 não perdeu a env var.
- [ ] Verificação do Google Search Console continua válida para o domínio (confirmar, não assumir).
- [ ] **E-mail: prova de que nada mudou.** `dig MX toroid.com.br` e `dig TXT toroid.com.br` (+ `dig TXT _dmarc.toroid.com.br`) batendo exatamente com os valores registrados no item 2.0 (5 MX do Google, SPF e DMARC idênticos). Não é suficiente por si só — `dig` prova que o registro não mudou, não que o e-mail está fluindo. Complementar com um teste real: enviar e receber um e-mail de/para uma caixa `@toroid.com.br` logo depois do corte.

---

## 4. Primeiras 48 a 72 horas

Monitoramento intensivo, como o cronograma original já previa:

- [ ] GA4: sem queda anormal de tráfego orgânico (lembrando que 94% é de marca, então uma queda ali é sinal forte de problema, não ruído), eventos de conversão disparando de verdade.
- [ ] Search Console: aba Coverage/Page Indexing sem pico de 404/soft-404 (sinal de redirect faltando no mapa).
- [ ] Qualidade de landing page das campanhas Ads ativas, depois de trocar a final URL delas pela tabela já mapeada em `ROADMAP.md` ("Mapeamento de URLs das campanhas Ads ativas").
- [ ] Reenviar o sitemap ao Google Search Console.
- [ ] Voltar ao Bing Webmaster Tools → Sitemaps e remover os 6 sitemaps do WordPress antigo (`post-sitemap.xml`, `category-sitemap.xml`, `sitemap.rss`, `news-sitemap.xml`, `page-sitemap.xml`, `video-sitemap.xml`), deixando só `/sitemap.xml`, e resubmeter esse para forçar recrawl do conteúdo novo.
- [ ] Fazer o submit inicial em massa de todas as URLs reais via IndexNow (`lib/indexnow.ts` já está pronto para isso, só não foi disparado antes do corte porque as URLs ainda resolviam pro site antigo).
- [ ] Configurar (se ainda não tiver sido feito no item 1.2) o webhook do WordPress para `/api/revalidate`.
- [ ] Aplicar a matriz de UTM (`plano-de-utm.md`, Notion) nos 3 perfis sociais reais.

---

## 5. Plano de rollback

Defina o critério de rollback **antes** do corte, não durante um incidente:

- Taxa de erro 5xx acima do normal, sustentada por mais que alguns minutos.
- Queda de tráfego orgânico muito além do ruído normal (dado que 94% é de marca, uma queda ali não deveria acontecer só por causa da troca de motor).
- Formulário de orçamento parando de gravar lead (Mongo ou e-mail).

Enquanto não passar por um período de estabilidade (sugestão: 2 a 4 semanas sem incidente), **não desativar nem desinstalar** o tema/plugin de renderização pública do WordPress antigo. Reverter o DNS de volta pro host antigo só funciona como rede de segurança real se o site antigo continuar capaz de renderizar. Os CPTs (`produto`, `aplicacao`) e os posts continuam existindo no WP de qualquer forma, já que ele segue como CMS headless depois da migração, então manter o tema instalado por mais algumas semanas não tem custo real.

---

## 6. Janela de estabilização e limpeza (2 a 4 semanas depois)

- [ ] Comparar volume e qualidade de lead (campo `status`, `novo → qualificado → proposta`) do novo formulário com o baseline do site antigo, não só volume bruto.
- [ ] Só então desativar o tema/plugin de renderização pública do WordPress antigo, mantendo os CPTs e o ACF intactos (continuam sendo a fonte de conteúdo via REST API).
- [ ] Atualizar `ROADMAP.md` marcando a seção 5 ("Bloqueios que impedem o go-live") como resolvida, com data real do corte.
- [ ] Reavaliar a pendência de CPT `produto`/`aplicacao` na REST API (Trilha B): a decisão de adiar essa configuração até depois do corte, registrada em `ROADMAP.md`, deixa de fazer sentido uma vez que o site novo é o que está ao vivo. É o momento de desbloquear o item A.10 (trocar conteúdo estático por dado real do WP).
