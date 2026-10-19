# Documentação técnica · site Toroid do Brasil

Documentação de manutenção do site institucional (`toroid.com.br`): como o código é organizado, como rodar, como mudar com segurança e o que fazer quando algo quebra. Levantada diretamente do código-fonte e da infraestrutura em produção em **2026-10-02** (Next.js 16.3.5, deploy de produção na Vercel após o corte de DNS de 2026-09-25).

Se você vai mexer no site pela primeira vez, leia nesta ordem: [ambiente local](./ambiente-local.md), [arquitetura](./arquitetura.md), depois o [guia de tarefas](./guias.md) da mudança que você precisa fazer.

## Documentos desta pasta

| Documento | Responde | Quando abrir |
|---|---|---|
| [ambiente-local.md](./ambiente-local.md) | Como instalar, rodar, compilar e verificar o projeto na sua máquina | Primeiro dia; sempre que o ambiente der erro |
| [arquitetura.md](./arquitetura.md) | Como o sistema é montado: rotas, renderização, cache, i18n, camada de dados, `proxy.ts` | Antes de qualquer mudança estrutural |
| [componentes.md](./componentes.md) | Catálogo de componentes e módulos de `lib/`: o que faz, se é client ou server, onde é usado | Para achar o componente certo antes de criar outro |
| [integracoes.md](./integracoes.md) | Contratos com sistemas externos: WordPress, MongoDB, SMTP, GA4, IndexNow, Vercel | Ao mexer em formulário, CMS, analytics ou env vars |
| [guias.md](./guias.md) | Receitas passo a passo das mudanças mais comuns (página nova, redirect, tradução, campo de formulário...) | No dia a dia |
| [operacao.md](./operacao.md) | Deploy, rollback, logs, runbooks de incidente, atualização de dependências, checklist de PR | Antes de publicar; quando algo quebra em produção |
| [problemas-conhecidos.md](./problemas-conhecidos.md) | Bugs abertos, dívidas técnicas e comentários desatualizados encontrados no levantamento | Ao planejar o próximo ciclo de trabalho |

## Documentos da raiz do repositório

Esta pasta não substitui os documentos da raiz. Cada um tem uma autoridade própria:

| Documento | Autoridade sobre |
|---|---|
| [CLAUDE.md](../CLAUDE.md) | **Regras e convenções** (normativo). Em caso de conflito com esta pasta, vale o CLAUDE.md. |
| [PRODUCT.md](../PRODUCT.md) | Posicionamento, público, dados institucionais confirmados (32 anos, telefones, certificações) |
| [ROADMAP.md](../ROADMAP.md) | Status vivo: o que foi feito quando, o que falta, quem bloqueia o quê |
| [MIGRATION.md](../MIGRATION.md) | Runbook do corte de DNS (concluído) e checklist pós-corte |
| [AGENTS.md](../AGENTS.md) | Aviso de que esta versão do Next.js tem APIs diferentes do que modelos/tutoriais antigos conhecem |

**Regra de ouro:** o código-fonte é sempre a verdade final. Se algo aqui parecer desatualizado, confira o arquivo citado e corrija o documento no mesmo PR da mudança de código.

## Resumo em 30 segundos

- **Next.js 16 (App Router) + TypeScript estrito**, deploy na **Vercel** (projeto `toroid-website`). Push em `master` publica em produção.
- **WordPress headless** (`toroidcombr.wpcomstaging.com`) é só fonte de conteúdo via REST API. Hoje alimenta **apenas o blog**. Páginas de produto e de segmento têm conteúdo escrito direto no código.
- **Formulário de orçamento**: `POST /api/orcamento` envia e-mail via SMTP (crítico, decide a resposta) e grava o lead no **MongoDB Atlas** depois da resposta (best-effort).
- **Performance é requisito de produto** (Lighthouse ≥ 90, LCP < 2,5 s, CLS < 0,1, INP < 200 ms). Server Component por padrão; `"use client"` só com interação real.
- **Dois idiomas de verdade**: português e espanhol (`/es/*`, 6 páginas espelho). Inglês e o resto do espanhol são troca de texto no navegador, não indexável.
- **URLs de produto são legadas e intocáveis** (`/transformador-de-corrente`, `/transformador-de-potencia`, `/indutores-filtros-e-chokes`, `/isobox`). Não reorganize sem ler a seção de rotas do CLAUDE.md.

## Como manter esta documentação

- Mudou comportamento, rota, env var ou integração? Atualize o documento correspondente **no mesmo PR**.
- Status e histórico ("feito em tal data", "bloqueado por fulano") vão no ROADMAP.md, não aqui. Aqui fica o que é verdade sobre o sistema hoje.
- Ao resolver um item de [problemas-conhecidos.md](./problemas-conhecidos.md), remova a linha (o histórico fica no git).
- Escrita: português, frases curtas, sem travessão.
