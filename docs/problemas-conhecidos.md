# Problemas conhecidos e dívidas técnicas

Levantamento de 2026-10-02, feito durante a escrita desta documentação. Não substitui as pendências de negócio do ROADMAP.md (aprovações, conteúdo, decisões comerciais); aqui estão só questões de código e de documentação. Ao resolver um item, apague a linha.

Severidade: **Alta** = algo quebrado para o visitante ou risco de perder lead/SEO; **Média** = custo de manutenção ou risco futuro; **Baixa** = limpeza.

---

## 1. Bugs

| # | Severidade | Problema | Onde | Como resolver |
|---|---|---|---|---|
| 1.1 | **Alta** | O link "Baixar especificação técnica (PDF)" de `/isobox` e `/es/isobox` está quebrado. Aponta para `https://toroid.com.br/wp-content/uploads/2023/07/Linha-padrao-TC.pdf`, que desde o corte de DNS cai na Vercel (403). O arquivo também não existe em `toroidcombr.wpcomstaging.com` (404) nem aparece na busca da Media Library. | `app/isobox/page.tsx:231`, `app/es/isobox/page.tsx:229` | Reenviar o PDF para a Media Library do WP (ou para `public/`) e trocar o `href` nos dois arquivos |
| 1.2 | Média | O sitemap busca no máximo 100 posts (`per_page=100`, sem paginação). Hoje são 64; acima de 100, os mais antigos somem do sitemap sem aviso. | `getPosts()` em `lib/wordpress.ts` | Paginar usando o `X-WP-Total`, como `getPostsPagina` já faz |
| 1.3 | Média | O JSON-LD `Organization` descreve a empresa como "Fabricante de transformadores toroidais, transformadores de corrente e indutores" e o slogan fala em "transformadores toroidais", contrariando a taxonomia atual (TC / TP / Indutores, toroidal é tecnologia). | `components/seo/OrganizationSchema.tsx` | Alinhar `slogan`/`description` com `DESCRICAO_PADRAO` de `lib/seo.ts` |
| 1.4 | Baixa | `/aplicacoes/<qualquer-slug-novo>` sempre devolve 404, porque o CPT `aplicacao` não existe no WP. Não afeta as 5 páginas estáticas. | `app/aplicacoes/[slug]/page.tsx` | Resolve-se com o item A.10 do ROADMAP ([guias.md](./guias.md#ligar-páginas-de-produto-ao-wordpress)) |

## 2. Documentação desatualizada fora desta pasta

| # | Severidade | Problema | Onde |
|---|---|---|---|
| 2.1 | **Alta** | O CLAUDE.md ainda mostra `WP_API_URL=https://toroid.com.br/wp-json/wp/v2` no bloco de env vars e o exemplo `curl -s https://toroid.com.br/wp-json/wp/v2/produto/123`. Desde 2026-10-02 o valor real é `https://toroidcombr.wpcomstaging.com/wp-json/wp/v2`; o exemplo com `toroid.com.br` bate na Vercel, não no WP. Quem seguir o CLAUDE.md para validar um endpoint vai concluir errado que ele não existe. | `CLAUDE.md` |
| 2.2 | Média | O README lista só parte das env vars (faltam `MONGODB_URI`, `LEAD_IP_HASH_SECRET`, `REVALIDATE_SECRET`) e descreve páginas de produto em `app/produtos/*`, que não existe mais. | `README.md` (atualizado junto com esta documentação) |
| 2.3 | Baixa | ROADMAP.md 1.1 diz que `remotePatterns` aponta para `toroid.com.br`; hoje aponta para `toroidcombr.wpcomstaging.com`. ROADMAP e MIGRATION falam em 68 redirects; o arquivo tem 66. | `ROADMAP.md`, `MIGRATION.md` |

## 3. Comentários de código desatualizados

Não quebram nada, mas enganam quem lê. Corrigir quando passar pelo arquivo.

| Arquivo | Comentário | Realidade |
|---|---|---|
| `lib/wordpress.ts` (cabeçalho) | "Ainda não é usada por nenhuma página", "app/produtos/*/page.tsx", "WP_API_URL ainda não está confirmado" | Usada pelo blog desde 2026-08-17; páginas de produto são top-level; `WP_API_URL` confirmado |
| `lib/i18n.ts` | "Só a home tem página espelho em espanhol hoje"; cita `middleware.ts` | São 6 espelhos; o arquivo é `proxy.ts` |
| `app/sitemap.ts` | "Só a home tem espelho em espanhol hoje" | São 6 |
| `app/aplicacoes/[slug]/page.tsx`, `app/blog/[slug]/page.tsx` | "WP_API_URL ainda não está confirmado em produção" | Confirmado; o motivo real de `[slug]` de aplicação dar 404 é o CPT inexistente |
| `lib/produtos.ts` | "Quando `WP_API_URL` for confirmado (Fase 2)" | Confirmado; o bloqueio é o CPT |
| `next.config.ts` | "Popular esta lista durante a Semana 3" e "adicionar cada URL antiga ... antes do go-live" | Mapa completo; go-live feito |
| `components/sections/Hero.tsx` | Diz que PRODUCT.md marca telefone/e-mail como placeholder | Já confirmados |

## 4. Dívidas técnicas

| # | Severidade | Problema | Sugestão |
|---|---|---|---|
| 4.1 | Média | **Sem rede de segurança automática**: nenhum teste, lint, formatter ou CI além do build da Vercel. | Começar por `eslint` (config do Next) e um teste mínimo de `/api/orcamento` com payload válido e inválido |
| 4.2 | Média | **Espelhos `/es` registrados em três lugares** (`PAGINAS_ESPELHO` em `lib/i18n.ts`, `ALTERNADAS` e `espelhos` em `app/sitemap.ts`). Esquecer um gera hreflang ou sitemap inconsistente. | Derivar os dois blocos do sitemap a partir de `PAGINAS_ESPELHO` |
| 4.3 | Média | **Conteúdo pt e es duplicado** por arquivo (250 a 580 linhas cada página de produto). Toda edição de copy precisa ser feita duas vezes. | Extrair o conteúdo para objetos por idioma consumidos por um único template, quando houver tempo |
| 4.4 | Média | **Rate limit de `/api/orcamento*` não funciona em produção.** O tráfego passa pelo Cloudflare antes da Vercel, e a função enxerga IPs de saída do Cloudflare, que variam. Teste de 2026-10-19: direto em `toroid-website.vercel.app` o 6º envio por minuto toma 429; por `toroid.com.br`, 10 envios seguidos do mesmo cliente passam todos. O `ipHash` do lead também é de um IP do Cloudflare. O limite é em memória, por instância, e o Vercel Firewall pode ter a mesma limitação por IP. | Opções: segredo de origem (regra de transformação no Cloudflare + env var) para só então confiar em `cf-connecting-ip`, que é forjável no domínio `vercel.app`; ou anti-robô (Turnstile) / rate limit na borda do Cloudflare. Confirmar os headers reais com log temporário |
| 4.5 | Média | **Dados de contato espalhados** em 6+ arquivos (ver [guias.md](./guias.md#mudar-telefone-e-mail-endereço-ou-rede-social)). | Centralizar num `lib/contato.ts`, como já foi feito com `lib/social.ts` |
| 4.6 | Média | `CATEGORIAS_PRODUTO` ainda usa o enum antigo (`transformador-toroidal`). | Corrigir junto com a criação do CPT no WP |
| 4.7 | Média | O webhook de revalidação do WP não foi configurado e o envio inicial em massa ao IndexNow não foi feito (MIGRATION.md seção 4). | Ver [integracoes.md](./integracoes.md#revalidação-sob-demanda-webhook) |
| 4.8 | Baixa | Sem Content Security Policy. | Mapear GA4, Google Fonts (servidas localmente pelo `next/font`), YouTube nocookie, Vercel Analytics antes de ligar |
| 4.9 | Baixa | `engines.node` (`>=20.9.0`) diverge do `.nvmrc` (`24.9.0`). | Alinhar para `>=24` |
| 4.10 | Baixa | Mensagens de erro de validação do formulário só em português, inclusive em `/es`. | Enviar códigos de erro do servidor e traduzir no cliente |
| 4.11 | Baixa | Fora de `/es`, quem tem navegador em espanhol ou inglês vê um instante em português antes da troca. É escolha de design (manter páginas estáticas). | Só muda se o negócio pedir espelhos SSR para mais páginas |
| 4.12 | Baixa | `heroClaroPath()` do Nav é lista manual. | Aceitável enquanto forem poucas páginas de topo claro |
| 4.13 | Baixa | **Incidente resolvido: pausa do time na Vercel (Hobby).** Em 2026-10-16 o time foi pausado por fair use (Web Analytics em 55K de 50K eventos; CDN Requests em 970K de 1M) e o site público saiu do ar. Em 2026-10-19 `unpause_project` religou o site, mas novos deploys seguiram bloqueados (402 `resource_creation_blocked`). O time migrou para o plano Pro, o Web Analytics foi reativado e `<Analytics />` e `<SpeedInsights />` voltaram ao `app/layout.tsx`. | Acompanhar o consumo em Settings → Usage para não repetir. Se o consumo de CDN Requests apertar, cachear `/_next/static/*` e imagens no Cloudflare |

## 5. Código e arquivos sem uso

| Item | Situação |
|---|---|
| `components/sections/ProvaGoogle.tsx` | Desligado de propósito (import comentado em `app/page.tsx`, aguardando confirmar a nota real) |
| `components/ui/HeroToroidLogo.tsx` | Versão 2D anterior do logo animado, substituída por `HeroToroidLogo3D` |
| `PillarObjections`/`PillarProof` em `components/produtos/Pillar.tsx`, campos `empresa`/`categoria` em `OrcamentoForm.tsx`, `orcamentoSchemaCompleto` | Comentados, aguardando decisão comercial |
| Imagens em `public/images` sem referência no código | `SedeFiltro.png`, `cert-esg.png`, `cert-rina-iso9001.jpg`, `cropped-logotoroid.png`, `pattern-2-radial-pontas-arredondadas.png`, `sede-toroid.webp`, `unnamed.jpg`, `unnamed (1).jpg`, `unnamed (2).jpg`. Alguns selos podem voltar (estão comentados em `Compromissos.tsx`); os `unnamed*` parecem lixo. Não apagar sem confirmar |
