# Roadmap: site institucional Toroid do Brasil

Atualizado em 2026-08-10, a partir do estado real do repositório (`git log`, árvore de arquivos, `lib/wordpress.ts`, TODOs no código e a auditoria de design de 2026-08-05 em `.impeccable/critique/`). Ponto de partida para realinhar com `CLAUDE.md` e `PRODUCT.md` quando o projeto avançar de fase; não substitui esses dois arquivos, que continuam sendo a autoridade de convenção e posicionamento.

---

## 1. Onde estamos agora

### 1.1 Fundação técnica (concluída)

- Next.js App Router, TypeScript, Server Components por padrão.
- `next.config.ts`: `remotePatterns` de imagem para `toroid.com.br` (ainda não validado contra uma URL real de mídia), headers de cache para assets estáticos, 64 redirects 301 (na prática 308, ver nota abaixo) mapeados a partir do export completo do Search Console (`paginasGSC.md`, 83 URLs): as 3 URLs de produto que viveram em `/produtos/...`, o `__trashed` do WordPress antigo, 58 posts de blog (incluindo o typo `/tranformadores-de-tensao` e a versão com escrita correta, redirecionadas para o mesmo destino), um padrão de path para arquivos de data (`/:ano/:mes/:dia` → `/blog`), e `/whatsapp` → `/#orcamento`. Essencialmente completo — o que resta fora do mapa é por decisão explícita (`/lp` descontinuada, `/isobox` mantém slug sem prioridade, PDFs seguem na Media Library do WP) ou pendência externa (política de privacidade), não por falta de dado.
- Nota técnica: `permanent: true` no Next.js retorna HTTP 308, não 301 — é o substituto moderno que preserva o método HTTP; Search Console/Google tratam como equivalente a 301 para sinal de ranking. Não é bug, é o comportamento padrão do framework desde os primeiros 2 redirects do projeto.
- Fontes via `next/font/google` (Montserrat nos títulos, Karla no corpo), sem `<link>` bloqueante.
- Sistema de design: tokens de cor em `globals.css`, ilustrações SVG próprias e determinísticas (`HeroToroid`, `CurrentWave`), zero bibliotecas pesadas.
- Regras de marca sendo aplicadas de fato, não só documentadas: "32 anos" correto em três componentes independentes, amarelo institucional usado uma única vez (Footer), com comentário no código marcando isso como intencional.

### 1.2 Páginas e conteúdo

| Página | Status | Observação |
|---|---|---|
| Home (`/`) | Construída | Hero, ProvaInstitucional, Produtos, Segmentos, Performance, Fabrica, CTA |
| `/transformador-de-corrente` | Construída | Conteúdo estático, com tabela de especificação. URL top-level, exigida por tráfego/Ads já ativos (não é mais `/produtos/...`). |
| `/transformador-de-potencia` | Construída (2026-08-12) | Nova família de produto (ver Trilha A, item 12), substitui Transformadores Toroidais na listagem de 3 famílias. Conteúdo estático, com tabela de especificação — valores herdados da antiga página de Transformadores Toroidais, ainda sem validação formal da engenharia. |
| `/transformadores-toroidais` | Construída, reframe (2026-08-12) | Deixou de ser uma das 3 famílias — agora é a página que explica a tecnologia de núcleo toroidal e compara com o convencional. Conteúdo estático, sem tabela de especificação própria (ver Trilha A, item 12). |
| `/indutores-filtros-e-chokes` | Parcial, de propósito | Sem tabela de especificação: falta brief de engenharia (dados de busca, dor de abertura, faixa técnica confirmada). Marcado no próprio código, não é esquecimento. Slug diferente do nome interno de propósito — é a URL que já rankeia no WordPress antigo (37 cliques). |
| `/produtos` | Construída | Página de listagem das três famílias, reaproveitando `components/sections/Produtos.tsx` e `lib/produtos.ts`. |
| `/transformadores-nobreaks` | Construída, com ressalva | Primeira página de aplicação/segmento. Valores técnicos (faixa de tensão, eficiência, regulação) vêm do brand book e **ainda não têm validação formal da engenharia** nem aprovação comercial da mensagem-chave. Está marcada `[PROPOSTA: VALIDAR COM COMERCIAL]` no próprio arquivo. |
| `/aplicacoes/[slug]` (padrão dinâmico do CLAUDE.md) | Construída (2026-08-12) | Consome `lib/wordpress.ts` (`getAplicacaoPorSlug`+`getProdutosPorIds`, uma única chamada batched). Sem `generateStaticParams`: renderiza por request, pra não depender de `WP_API_URL` no build. Sem `WP_API_URL`, devolve 404 controlado (`notFound()`), não erro 500. `/transformadores-nobreaks` continua estática, fora deste padrão (decisão separada, ver aviso no próprio arquivo). |
| `/blog/[slug]` + listagem `/blog` | Construída (2026-08-12) | Mesmo padrão acima, consumindo `getPosts`/`getPostPorSlug`. Sem `WP_API_URL`, a listagem mostra estado vazio ("Nenhum conteúdo publicado ainda") e o slug individual devolve 404 controlado — nenhum dos dois quebra o build nem retorna 500. |
| Formulário de orçamento | Construído | `components/forms/OrcamentoForm.tsx` + `/api/orcamento`, com persistência em MongoDB e e-mail de notificação em paralelo, captura de UTM first/last-touch. Ver seção "Formulário de orçamento e captura de lead" em CLAUDE.md. Esta linha estava desatualizada. |

### 1.3 Integração com WordPress: construída, mas não conectada a nenhuma página

`lib/wordpress.ts` já tem tipos completos (`Produto`, `Aplicacao`, `Post`), mapeamento do formato bruto da REST API para o formato interno, e funções de fetch com `revalidate`/`tags` seguindo exatamente a convenção do CLAUDE.md. **Nenhuma página usa essas funções hoje.** As três páginas de produto e a página de nobreaks têm conteúdo estático, por decisão explícita: `WP_API_URL` nunca foi validado contra o WordPress real. Isso é o maior ponto de alavancagem do projeto: a camada está pronta, falta só a confirmação do outro lado.

### 1.4 O que a auditoria de design já encontrou (2026-08-05)

Rodada única de `/impeccable` sobre a home. Cruzando com o estado atual do código:

| Item | Status agora |
|---|---|
| Páginas de produto retornavam 404 | **Resolvido** (as 3 páginas existem hoje) |
| Dropdown "Produtos" do Nav não abria em telas touch | **Resolvido** (hoje é um `<button onClick>`, não mais só `:hover`) |
| Gradiente institucional atrás de texto no card de CTA | **Resolvido** (comentário no CSS confirma o ajuste: "nenhuma faixa clara passa atrás do texto") |
| Nenhum mecanismo real de captura de lead (P0) | **Ainda aberto** |
| Três instâncias de texto branco sobre fundo branco (contraste 1:1) e tokens de texto abaixo de AA | **Não verificado nesta passagem**, provavelmente ainda aberto |
| Seção Performance lida como argumento de "toroidal é superior" | **Não verificado nesta passagem**, provavelmente ainda aberto |
| Placeholder `[CASE PENDENTE: aguardando aprovação comercial]` renderiza literal para o visitante | **Ainda aberto** (é um placeholder deliberado, mas com redação de ticket, não de visitante) |

---

## 2. As duas trilhas de trabalho que faltam

### Trilha A: desenvolvimento (não depende de ninguém fora do repositório)

1. ~~Formulário de orçamento técnico + API Route de back-end~~ **Concluído.** Validação por tipo de produto (TC / TP / Indutor) continua pendente de decisão comercial para reativar os campos completos já escritos (comentados) em `lib/orcamento-schema.ts`.
2. ~~Corrigir os itens de acessibilidade/contraste ainda abertos da auditoria~~ **Concluído** (2026-08-12). Achado real, confirmado com o detector do `/impeccable` contra o servidor de dev: a legenda das fotos do mosaico em `Fabrica.tsx` (`tileCaption`) podia cair para contraste quase invisível, porque o degradê de proteção (`tileOverlay`) já estava quase transparente antes do topo de uma legenda de 3 linhas, e o placeholder por trás (`.tile`, antes de a foto carregar ou se ela falhar) era um tom claro. Corrigido em `Fabrica.module.css`: degradê mantém opacidade alta por mais tempo e o placeholder passou a ser azul escuro, não claro. O outro achado do detector (branco sobre verde claro nos links do Nav) foi investigado e é falso positivo confirmado no próprio código do detector: ele lê o `background-image` do sublinhado animado de `.navLink` (dimensionado a 2px, 0% em repouso) como se cobrisse o link inteiro. Sem bug real ali, nenhuma mudança de código.
3. ~~Reescrever o placeholder de case (`Segmentos.tsx`)~~ **Concluído** (2026-08-12). `[CASE PENDENTE: aguardando aprovação comercial]` virou "Estamos reunindo os primeiros cases de cliente. Em breve, aqui." Mesmo estado de fundo (ainda sem case liberado, ver `PRODUCT.md`), só a redação passou a ser voltada ao visitante.
4. ~~Revisar a seção Performance para não posicionar a tecnologia toroidal como superior às demais~~ **Concluído** (2026-08-12). `Performance.tsx`: eyebrow trocado de "Performance técnica" para "Performance do núcleo toroidal", e novo texto de apoio deixa explícito que as características vêm da geometria toroidal especificamente, e que transformadores de corrente e indutores seguem princípios próprios. Nenhum dado técnico dos 4 itens de benefício foi alterado, só o enquadramento da seção.
5. ~~Construir o padrão dinâmico `/aplicacoes/[slug]`~~ **Concluído** (2026-08-12). `app/aplicacoes/[slug]/page.tsx`, consumindo `getAplicacaoPorSlug`+`getProdutosPorIds` de `lib/wordpress.ts` (relacionamento produto↔aplicação resolvido numa única chamada batched, regra do CLAUDE.md). Sem `generateStaticParams` de propósito — gerar params no build chamaria a API com `WP_API_URL` ainda não confirmado e quebraria `next build`; cada slug renderiza por request. `AplicacaoHero.arte` virou prop opcional (o CPT `aplicacao` não tem campo de arte customizado). `/transformadores-nobreaks` não foi migrada pra esse padrão — continua estática, decisão futura separada.
6. ~~Construir `/blog/[slug]` e a listagem de blog~~ **Concluído** (2026-08-12). `app/blog/page.tsx` (listagem, `getPosts()`) e `app/blog/[slug]/page.tsx` (`getPostPorSlug`), mesmo padrão sem `generateStaticParams` do item acima. **Isso não faz os 58+ redirects 301/308 do mapa de URLs pararem de 404 sozinho**: a rota agora existe e responde com `notFound()` controlado (não 500) quando `WP_API_URL` está ausente ou o post não existe — mas o 404 só desaparece de fato pro visitante quando `WP_API_URL` for confirmado E os posts existirem no WP com os mesmos slugs (Trilha B). Rota existir ≠ conteúdo publicado.
7. ~~`sitemap.ts` e `robots.ts`~~ **Concluído** (Parte 5): `app/sitemap.ts` gera dinamicamente as 7 rotas reais hoje (bloco de posts do WP comentado, pronto para ativar quando `/blog/[slug]` existir e `WP_API_URL` estiver validado — não antes, pra não anunciar URL que ainda dá 404). `app/robots.ts` bloqueia `/wp-admin` e `/wp-json`, aponta pro sitemap, e já aplica a política de crawler de IA da diretoria (permitir bot de busca/resposta, bloquear bot de treinamento).
8. ~~Integração de GA4~~ **Concluído** (Parte 6): `components/analytics/GoogleAnalytics.tsx` carrega `gtag.js` condicionado a `GA4_MEASUREMENT_ID` existir (sem a env var real, não renderiza nada — mesmo padrão de degradação do MongoDB/SMTP). Dois eventos implementados em `lib/analytics.ts`: `whatsapp_click` (dispara em todo link de WhatsApp do site, centralizado em `components/analytics/WhatsAppLink.tsx`, que substituiu 6 ocorrências de `<a href={whatsappLink}>` espalhadas em `CTA.tsx`, `WhatsAppButton.tsx`, `AplicacaoHero.tsx`, `Hero.tsx`, `Pillar.tsx` e `transformadores-nobreaks/page.tsx`) e `form_submit` (dispara em `OrcamentoForm.tsx` só após confirmação real do servidor). Os dois anexam o UTM de último toque de `lib/attribution.ts` — mesma fonte que já alimenta o lead no MongoDB, então Ads/GA4/CRM comparam o mesmo dado de atribuição. **Verificação real no DebugView ainda depende de `GA4_MEASUREMENT_ID` real (Trilha B) — só testei a estrutura do código (script carrega/não carrega conforme a env var, eventos disparam com o parâmetro certo), não uma sessão de GA4 de verdade.**
9. API Route de revalidação sob demanda (`revalidateTag`) para o webhook do WordPress.
10. Trocar o conteúdo estático das páginas de produto/aplicação por `lib/wordpress.ts` assim que a Trilha B confirmar o endpoint.
11. Dados estruturados (JSON-LD): `Product`/`BreadcrumbList`/`FAQPage` em todas as páginas de produto e `BreadcrumbList`/`CollectionPage` na listagem `/produtos` (já existiam antes da Parte 5, usando specs técnicas reais de cada página — nada novo precisou ser escrito aqui). **Novo na Parte 5**: `Organization` (`components/seo/OrganizationSchema.tsx`) montado uma única vez no `RootLayout`, aplicado em todo o site — extraído do que já existia isolado em `/contato` (que tinha um bloco quase idêntico e duplicado, removido). Falta ainda: `LocalBusiness` — não é mais bloqueado por telefone (dado já confirmado, ver Trilha B), só falta a página `/quem-somos` existir pra ter onde colocar; `FAQPage` no Pilar 7 quando essa página existir. Convenção documentada em CLAUDE.md.
12. ~~Corrigir a taxonomia de produto: "Transformadores Toroidais" não é uma família, é tecnologia de núcleo cross-line~~ **Concluído** (2026-08-12). Duas correções: (a) a página de TC citava "linha CX01, CX02 e CX03" em 4 lugares como se fosse uma linha real da Toroid — não é, reescrito de forma genérica ("TC compacto para painel", sem nome de linha inventado). (b) a listagem de 3 famílias (`lib/produtos.ts`, que alimenta Nav/home/`/produtos`) tinha Transformadores de Corrente / **Transformadores Toroidais** / Indutores como se fossem coordenadas — mas núcleo toroidal é tecnologia aplicável a qualquer uma das três, não uma família própria (as próprias páginas de TC e Indutores já reconhecem isso com seções "núcleo toroidal ou convencional"). Corrigido: a família que faltava era **Transformador de Potência** (slug já reservado no ROADMAP desde antes, `/transformador-de-potencia`), agora construída como página completa (hero/specs/checklist, mesmo nível de profundidade de TC/Indutores) substituindo Toroidal na listagem. `/transformadores-toroidais` manteve a URL (já indexada) mas mudou de papel: virou a página que explica a tecnologia toroidal e compara com o convencional, sem tabela de especificação própria (essa tabela migrou pra TP) e sem schema `Product` isolado (mantém `BreadcrumbList`+`FAQPage`). Arquivos tocados: `lib/produtos.ts`, `components/ui/ProductIcons.tsx`, `components/produtos/PillarEmblem.tsx` (novo ícone/emblema "potencia"), `app/transformador-de-potencia/page.tsx` (novo), `app/transformadores-toroidais/page.tsx` (reframe), `app/transformador-de-corrente/page.tsx` (CX0x), `Footer.tsx`, `app/sitemap.ts`, `PRODUCT.md`, `CLAUDE.md`. Pendência gerada por essa mudança: taxonomia `categoria_produto` do CPT `produto` no WordPress ainda tem o enum antigo (`transformador-toroidal` em vez de `transformador-de-potencia`) — ver Trilha B.

### Trilha B: confirmações e configurações externas (dependem de outras pessoas ou sistemas)

| Pendência | Quem resolve | Bloqueia o quê |
|---|---|---|
| Validar `WP_API_URL` real e confirmar "Show in REST API" em cada campo ACF (`curl -s .../produto/123 \| jq`) | Quem tem acesso ao WP admin | Toda a integração de conteúdo dinâmico (item A.10) |
| Configurar webhook no WordPress para chamar a rota de revalidação ao publicar/editar | Quem tem acesso ao WP admin | Conteúdo fresco sem depender de rebuild manual |
| ~~Confirmar telefones e e-mail oficiais~~ **Já resolvido, esta linha estava desatualizada** — `Footer.tsx`/`ContatoInfo.tsx` já têm dado real (não placeholder) há algum tempo; re-confirmado diretamente na Parte 5 (telefones (41) 3035-8282/8263, endereço com bairro Iná, agora também no schema `Organization`). | — | — |
| ~~Confirmar número real de WhatsApp~~ **Já resolvido, esta linha estava desatualizada** — `lib/whatsapp.ts` já marca "Número confirmado" no próprio comentário, mesmo número reconfirmado na Parte 5. | — | — |
| ~~Confirmar URLs dos perfis oficiais~~ **Já resolvido, esta linha estava desatualizada** — `Footer.tsx`/`ContatoInfo.tsx` já linkam LinkedIn/Instagram/YouTube reais, não `href="#"`. | — | — |
| ~~Política de crawler de IA~~ **Resolvido**: `app/robots.ts` permite bot de busca/resposta que cita fonte (`OAI-SearchBot`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`, `Google-Extended`) e bloqueia bot de treinamento sem link de volta (`GPTBot`, `ClaudeBot`). Decisão da diretoria. | — | — |
| Criar propriedade GA4 e confirmar `GA4_MEASUREMENT_ID` | Marketing | Toda a medição de conversão (item A.8) |
| Configurar as variáveis de ambiente no Vercel (Production, Preview **e** Development), incluindo `MONGODB_URI` e `LEAD_IP_HASH_SECRET` | Quem administra o projeto no Vercel | Build e preview funcionarem com dados reais; persistência de leads no MongoDB |
| ~~Exportar do Search Console o mapa completo de URLs indexadas do WP antigo~~ **Resolvido** — export completo recebido (`paginasGSC.md`, 83 URLs). Mapa de redirects 301/308 em `next.config.ts` agora tem 64 entradas cobrindo tudo que tinha destino claro. | — | — |
| **Construir as páginas institucionais que ainda não existem no Next.js, mantendo o mesmo slug** (nenhuma delas precisa de redirect): `/quem-somos`, `/trabalhe-conosco`, `/suporte-especializado-toroid`, `/politica-de-privacidade` (bloqueada por decisão jurídica separada, ver linha abaixo). `/transformador-de-potencia` saiu desta lista: não é mais página institucional genérica, virou a 3ª família de produto (Trilha A, item 12) e já foi construída. `/blog` (listagem) saiu desta lista pelo mesmo motivo, ver item A.6. | Quem definir o conteúdo dessas páginas (Comercial/Marketing) | Preservação total de SEO/Ads no go-live |
| **Nova pendência (2026-08-12):** taxonomia `categoria_produto` do CPT `produto` no WordPress ainda usa o enum antigo (`transformador-de-corrente` \| `transformador-toroidal` \| `indutor-reator`, ver CLAUDE.md) — desde a correção de taxonomia do front-end (Trilha A, item 12), a família real é `transformador-de-potencia`, não `transformador-toroidal`. Decidir no WP admin: renomear o termo da taxonomia, ou criar `transformador-de-potencia` e decidir se `transformador-toroidal` continua existindo como tag secundária/cross-line (não como categoria). Sem isso, quando `WP_API_URL` for confirmado e o conteúdo estático for trocado por dados reais do WP (item A.10), o campo `categoria_produto` que chega da API vai contradizer a estrutura de 3 famílias do código. | Quem tem acesso ao WP admin | Consistência de dado quando a integração WP for ligada (item A.10) |
| `/isobox`: mantém o slug (Grupo A), página nova a construir. Confirmado pela diretoria que não é prioridade agora. | Comercial/Marketing, sem prazo definido | Nada bloqueado — é backlog |
| ~~`/lp`~~ **Resolvido**: página descontinuada, confirmado que não será reconstruída. Sem página, sem redirect, 404 natural aceito. | — | — |
| ~~`/tranformadores-de-tensao/` (typo)~~ **Resolvido**: é uma URL real e correta (apesar do typo), redireciona para `/blog/tranformadores-de-tensao`. A versão com escrita correta (`/transformadores-de-tensao/`), que hoje aponta por engano pra um arquivo de mídia do WP, também foi redirecionada defensivamente pro mesmo destino. | — | — |
| ~~PDFs técnicos indexados~~ **Resolvido**: seguem servidos direto da Media Library do WordPress (`Transf-corrente.pdf`, `Transf-Transistorizados.pdf`), sem migração nem redirect — o host de mídia do WP não sai do ar, só o front-end de páginas. | — | — |
| **Reestruturação de UTM da Toroid** (mencionada ao decidir sobre `/whatsapp-linkedin/`, `/whatsapp-google/`, `/fabrica-de-transformadores-linkedin/`) — esses links de campanha ficam de fora do mapa de redirect por ora (404 aceitável), mas a reestruturação em si é um projeto separado, ainda sem escopo definido. | Marketing/Comercial | Convenção de UTM em `matriz-utm.md` (Notion) pode mudar depois do go-live |
| `/blog/[slug]` e a listagem `/blog` já existem como rota (item A.6, concluído 2026-08-12), mas os 58+ redirects de posts de blog do mapa da Parte 4 e o padrão de arquivo de data só param de 404 pro visitante real quando **`WP_API_URL` estiver confirmado E os posts existirem no WP com os mesmos slugs**. Rota existir não é o mesmo que conteúdo existir — sem a env var, `/blog/[slug]` devolve 404 controlado (não erro), mas ainda 404. A própria URL `/blog/` já tinha 287 impressões no WP antigo — reforça que não é item de baixa prioridade. | Quem tem acesso ao WP admin (`WP_API_URL`) + quem reescrever/migrar o conteúdo de blog | Experiência real do visitante que seguir um link antigo |
| Dois posts de blog redirecionados têm "30 anos" no título/slug (`/30-anos-toroid-do-brasil`, `/mais-de-30-anos-de-lideranca-na-fabricacao-de-transformadores-e-indutores`) — dado desatualizado (são 32, nunca 40, ver CLAUDE.md). O redirect preserva só a URL; corrigir o texto é tarefa de quem reescrever o conteúdo na Fase 3. | Quem reescrever o conteúdo de blog na Fase 3 | Consistência do dado institucional quando esses posts forem republicados |
| Um par de posts de blog no mapa (`/como-os-transformadores-toroidais-otimizam-espaco-em-projetos-eletricos` e `/compactacao-inteligente-como-os-transformadores-toroidais-otimizam-espaco-em-projetos-eletricos`) pode ser o mesmo artigo republicado com slug diferente — mantidos como redirects separados por falta de confirmação. Conferir ao reescrever o conteúdo na Fase 3. | Quem reescrever o conteúdo de blog na Fase 3 | Possível duplicidade de conteúdo, não de redirect |
| **Política de privacidade** | Diretoria/Tecnologia | Bloqueia a publicação do checkbox de consentimento LGPD no formulário de orçamento (item A.1) |
| **Conflito de tipografia**: código e CLAUDE.md usam Montserrat (títulos) + Karla (corpo), decisão já implementada por peso de bytes (ver comentário em `app/layout.tsx`). O brand book oficial mais recente do Notion (`brand-book/03-identidade-visual.md`, 3 jul) diz "Montserrat em todas as aplicações" e não menciona Karla; uma cópia mais antiga do brand book descreve Raleway + Open Sans. Nenhuma fonte do Notion confirma Karla. | Quem for dono do brand book | Decidir se o código muda para Montserrat único, se o brand book precisa de atualização, ou se as duas fontes coexistem oficialmente |
| Validação formal da engenharia sobre os dados técnicos da página de nobreaks e a faixa técnica de indutores | Engenharia | Página de nobreaks ir ao ar com segurança jurídica/técnica; página de indutores ganhar tabela de especificação |
| Aprovação comercial da mensagem-chave da página de nobreaks (dor de campo vs. dor inferida da NBR5356-5) | Comercial | Mesmo item acima |
| Liberação de cases/depoimentos de cliente | Comercial | Substituir o placeholder de prova social por conteúdo real |
| Plano de corte (DNS/domínio) do WordPress atual para o Next.js na Vercel | Quem administra infraestrutura | Data de go-live |

---

## 3. Resposta direta: continuo nas páginas ou dou atenção às configurações externas?

**As duas, em paralelo, mas cada trilha tem uma prioridade clara dentro de si.**

Elas não competem pelo mesmo tempo: a Trilha B é, na maior parte, "esperar resposta de alguém" (comercial, quem tem acesso ao WP, quem administra o Vercel), não trabalho contínuo seu. Represar essas perguntas para depois de terminar todas as páginas só atrasa o projeto sem necessidade, porque `WP_API_URL` e a validação da engenharia têm prazo de resposta de terceiros, não de teclado.

Prioridade prática, considerando o que já foi construído:

1. **Disparar a Trilha B inteira agora**, mesmo em paralelo com código: as perguntas de comercial/engenharia/WP/Vercel/GA4 acima. Nenhuma delas depende de mais páginas prontas para ser perguntada.
2. **Dentro da Trilha A, o formulário de orçamento é o item de maior alavancagem imediata** (A.1). O site já tem prova institucional, copy tecnicamente literata, ilustração própria; hoje ele captura zero lead de fato porque não existe um lugar para o visitante submeter uma especificação. É o P0 que sobrevive de 2026-08-05 até hoje.
3. ~~Os itens A.2 a A.7~~ (acessibilidade, placeholder de case, seção Performance, `/aplicacoes/[slug]`, `/blog/[slug]`, sitemap/robots) e o item A.12 (correção de taxonomia de produto) **concluídos** (2026-08-12) — eram desenvolvimento puro, sem dependência externa.
4. A.8 (GA4) e A.10 (trocar conteúdo estático por WordPress real) ficam **paradas até a Trilha B confirmar**, respectivamente, `GA4_MEASUREMENT_ID` e `WP_API_URL`. Não adianta escrever o código de integração antes disso além do que já existe em `lib/wordpress.ts` (que já está pronto e esperando).

---

## 4. Fases sugeridas

**Fase 1, agora:** disparar toda a Trilha B (tabela da seção 2) + construir o formulário de orçamento (A.1) + fechar os itens de acessibilidade/copy que não dependem de ninguém (A.2, A.3, A.4).

**Fase 2, quando `WP_API_URL` for confirmado:** validar cada endpoint com `curl | jq` conforme CLAUDE.md, trocar o conteúdo estático das 3 páginas de produto por `lib/wordpress.ts`. `/aplicacoes/[slug]` e `/blog/[slug]` já foram construídos antes desta fase (item A.5/A.6, 2026-08-12) consumindo `lib/wordpress.ts` diretamente — não sobra código de integração pra escrever aqui, só a confirmação da env var (e a correção da taxonomia `categoria_produto` no WP admin, ver Trilha B) pra esse conteúdo parar de devolver 404/vazio.

**Fase 3, quando GA4 e WhatsApp/telefones forem confirmados:** integrar `next/script`/`gtag`, os dois eventos de conversão com UTM, atualizar Footer e `lib/whatsapp.ts` com dados reais.

**Fase 4, pré-go-live:** `sitemap.ts`/`robots.ts`, mapa completo de redirects 301 a partir do Search Console, webhook de revalidação configurado no WP, checklist de "Antes de abrir um PR" do CLAUDE.md rodado em todas as páginas, nova rodada de `/impeccable` sobre a home e as páginas de produto para confirmar que os P0/P1 de 2026-08-05 seguem resolvidos.

**Fase 5, pós-lançamento:** liberação de cases reais (troca do placeholder de Segmentos), expansão da página de indutores quando o brief de engenharia chegar, iteração de conteúdo de blog.

---

## 5. Bloqueios que impedem o go-live (resumo)

- Nenhum lead-capture funcional existe (form + API Route).
- `WP_API_URL` não confirmado: o site não tem hoje nenhuma página de fato "headless".
- Telefone, e-mail, WhatsApp e redes sociais são placeholders explícitos, não dados reais.
- `GA4_MEASUREMENT_ID` não existe: o pipeline de telemetria já está pronto (Parte 6) mas não envia dado real até a propriedade GA4 existir.
- Mapa de redirects 301 incompleto: risco real de perda de SEO/Ads na migração.
- Dados técnicos da página de nobreaks sem validação formal da engenharia.

Nenhum desses six é bloqueado por falta de código pronto para escrever, todos dependem de uma resposta de alguém ou de uma decisão de negócio. Isso é o argumento para disparar a Trilha B junto com o desenvolvimento, não depois dele.
