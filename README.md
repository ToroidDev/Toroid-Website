# Toroid do Brasil: site institucional

Site institucional da Toroid do Brasil (transformadores toroidais, transformadores de corrente e indutores/reatores), em Next.js (App Router), consumindo WordPress como CMS headless. Contexto completo do projeto em [`CLAUDE.md`](./CLAUDE.md) e [`PRODUCT.md`](./PRODUCT.md).

## Getting Started

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

Nunca hardcodar estes valores em código: sempre `process.env.X`. Criar um `.env.local` na raiz (ignorado pelo git) com:

| Variável | Para quê serve |
|---|---|
| `WP_API_URL` | Base da REST API do WordPress (`https://toroid.com.br/wp-json/wp/v2`). Usada por `lib/wordpress.ts` para buscar produtos, aplicações e posts. Sem ela, as funções de fetch lançam erro explícito. |
| `WHATSAPP_NUMBER` | Número usado em `lib/whatsapp.ts` para montar o link de contato. Enquanto não confirmado, o código usa um placeholder explícito. Ver `PRODUCT.md`. |
| `GA4_MEASUREMENT_ID` | ID de medição do GA4, para os eventos de conversão (`whatsapp_click`, `form_submit`). |

Configurar as três no Vercel em Production, Preview **e** Development.

## Estrutura

- `app/`: rotas (App Router). Chrome global (Nav/Footer/botão de WhatsApp) fica em `app/layout.tsx`, aplicado a toda página.
- `components/`: `layout/` (chrome global), `sections/` (blocos da home), `ui/` (primitivas), `produtos/` (blocos reaproveitados pelas páginas de família de produto em `app/produtos/*`).
- `lib/`: `wordpress.ts` (tipos + camada de fetch do CMS headless, ver `CLAUDE.md`), `whatsapp.ts`, `produtos.ts`, `institucional.ts`.
