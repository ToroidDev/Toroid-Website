# Toroid do Brasil: site institucional

Site institucional da Toroid do Brasil (transformadores toroidais, transformadores de corrente e indutores/reatores), em Next.js (App Router), consumindo WordPress como CMS headless. Contexto completo do projeto em [`CLAUDE.md`](./CLAUDE.md) (convenções/regras), [`PRODUCT.md`](./PRODUCT.md) (posicionamento) e [`ROADMAP.md`](./ROADMAP.md) (status/pendências). Para entender como o site é construído de fato — mapa de rotas, i18n, fluxo de dados, integrações — ver [`ARQUITETURA.md`](./ARQUITETURA.md).

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
| `WHATSAPP_NUMBER` | Número usado em `lib/whatsapp.ts` para montar o link de contato. Valor confirmado: `554130358258`. |
| `GA4_MEASUREMENT_ID` | ID de medição do GA4, para os eventos de conversão (`whatsapp_click`, `form_submit`). |
| `SMTP_HOST` | Host do SMTP interno usado por `lib/orcamento-mailer.ts` para notificar cada pedido do formulário de orçamento. |
| `SMTP_PORT` | Porta do SMTP (465 usa TLS implícito; outras portas usam STARTTLS). |
| `SMTP_USER` | Usuário de autenticação do SMTP. |
| `SMTP_PASSWORD` | Senha do SMTP. |
| `SMTP_FROM` | Remetente do e-mail de orçamento. Opcional, usa `SMTP_USER` se ausente. |
| `ORCAMENTO_DESTINATARIOS` | Lista de e-mails (separados por vírgula) que recebem cada pedido de orçamento enviado pelo formulário. |

Configurar todas no Vercel em Production, Preview **e** Development.

## Estrutura

- `app/`: rotas (App Router). Chrome global (Nav/Footer/botão de WhatsApp) fica em `app/layout.tsx`, aplicado a toda página. `app/api/orcamento/route.ts` é a rota de back-end do formulário de orçamento.
- `components/`: `layout/` (chrome global), `sections/` (blocos da home), `ui/` (primitivas), `produtos/` (blocos reaproveitados pelas páginas de família de produto em `app/produtos/*`), `contato/` (blocos da página `/contato`), `forms/` (formulários com back-end próprio).
- `lib/`: `wordpress.ts` (tipos + camada de fetch do CMS headless, ver `CLAUDE.md`), `whatsapp.ts`, `produtos.ts`, `institucional.ts`, `orcamento-schema.ts` (validação do formulário de orçamento) e `orcamento-mailer.ts` (envio do e-mail via SMTP).
