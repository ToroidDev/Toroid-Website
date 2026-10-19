# Toroid do Brasil: site institucional

Site institucional da Toroid do Brasil (transformadores de corrente, transformadores de potência e indutores, com núcleo toroidal ou convencional conforme o projeto), em Next.js 16 (App Router) na Vercel, consumindo WordPress como CMS headless. Em produção em [toroid.com.br](https://toroid.com.br).

## Começando

```bash
nvm use            # Node 24.9.0, ver .nvmrc
npm ci
vercel env pull .env.local   # opcional: env vars do ambiente Development
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). O site roda sem nenhuma env var (cada integração degrada sozinha); detalhes em [docs/ambiente-local.md](./docs/ambiente-local.md).

| Comando | Para quê |
|---|---|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build de produção (principal verificação do projeto) |
| `npm run start` | Servir o build localmente |

## Documentação

| Documento | Conteúdo |
|---|---|
| [docs/](./docs/README.md) | **Documentação técnica**: ambiente local, arquitetura, componentes, integrações, guias de tarefas, operação e problemas conhecidos |
| [CLAUDE.md](./CLAUDE.md) | Regras e convenções do projeto (normativo) |
| [PRODUCT.md](./PRODUCT.md) | Posicionamento, público e dados institucionais confirmados |
| [ROADMAP.md](./ROADMAP.md) | Status vivo e pendências |
| [MIGRATION.md](./MIGRATION.md) | Runbook do corte de DNS (concluído em 2026-09-25) |

Deploy: push em `master` publica em produção na Vercel (projeto `toroid-website`). Ver [docs/operacao.md](./docs/operacao.md).
