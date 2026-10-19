# Ambiente local

Como deixar o projeto rodando na sua máquina e como verificar uma mudança antes de abrir PR.

## 1. Pré-requisitos

| Item | Versão / observação |
|---|---|
| Node.js | **24.9.0**, fixado em [`.nvmrc`](../.nvmrc). A Vercel compila com Node 24.x. |
| npm | O que vem com o Node 24. O lockfile oficial é `package-lock.json` (não há `pnpm-lock.yaml` nem `yarn.lock`). |
| nvm | Recomendado. Em algumas máquinas da empresa o Node do sistema é v12, que não roda o projeto. |
| Vercel CLI | Opcional, mas é o jeito mais simples de baixar as env vars (`npm i -g vercel`). |
| Git | Repositório `ToroidDev/Toroid-Website`, branch principal `master`. |

> `package.json` declara `engines.node: ">=20.9.0"`, mais permissivo que o `.nvmrc`. Use sempre o `.nvmrc`.

## 2. Instalação

```bash
git clone https://github.com/ToroidDev/Toroid-Website.git toroid
cd toroid
nvm install        # lê o .nvmrc
nvm use            # sempre, em todo terminal novo, antes de node/npm/npx
npm ci             # instala exatamente o que está no package-lock.json
```

Use `npm ci` (e não `npm install`) para não alterar o lockfile sem querer. Só use `npm install <pacote>` quando for de fato adicionar ou atualizar uma dependência (ver [operacao.md](./operacao.md#7-atualizar-dependências)).

## 3. Variáveis de ambiente

O site **roda sem nenhuma env var**: cada integração degrada sozinha (ver tabela abaixo). Para trabalhar com dado real, baixe as variáveis do ambiente Development da Vercel:

```bash
vercel link        # uma vez: escolher o time "toroid" e o projeto "toroid-website"
vercel env pull .env.local
```

`.env*` está no `.gitignore`. Nunca commite esse arquivo, nem `atlas-credentials.env`.

| Variável | Sem ela, localmente | Precisa para |
|---|---|---|
| `WP_API_URL` | `/blog` mostra "Nenhum conteúdo publicado ainda", `/blog/[slug]` dá 404, sitemap sai sem posts | Trabalhar no blog |
| `WHATSAPP_NUMBER` | Usa o fallback `554130358258` (o número real) | Nada, o fallback já é o correto |
| `GA4_MEASUREMENT_ID` | Nenhum script do Google carrega; eventos viram no-op | Testar analytics/consentimento |
| `SMTP_*`, `ORCAMENTO_DESTINATARIOS` | Formulário responde 502 ("Tente pelo WhatsApp") | Testar o envio do formulário |
| `MONGODB_URI` | O lead não é gravado (só loga erro no terminal); o formulário em si não é afetado | Testar persistência de lead |
| `LEAD_IP_HASH_SECRET` | Hash de IP com SHA-256 simples | Nada em dev |
| `REVALIDATE_SECRET` | `/api/revalidate` responde 401 a tudo | Testar o webhook de revalidação |
| `BING_SITE_VERIFICATION` | Meta tag do Bing não é renderizada (decisão: não é usada em produção) | Nada |

Detalhe de cada uma em [integracoes.md](./integracoes.md) e na seção "Variáveis de ambiente" do CLAUDE.md.

**Cuidado com o formulário em dev:** com as credenciais de SMTP e `ORCAMENTO_DESTINATARIOS` reais, um envio de teste local **manda e-mail de verdade para o comercial**, e com `MONGODB_URI` real grava um lead de verdade na coleção `leads`. Para testar sem ruído, troque `ORCAMENTO_DESTINATARIOS` no seu `.env.local` pelo seu próprio e-mail e apague o lead de teste no Atlas depois (ou avise o comercial).

## 4. Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento em http://localhost:3000 (Turbopack, hot reload) |
| `npm run build` | Build de produção. É a principal verificação do projeto: compila, roda o TypeScript e pré-renderiza as páginas estáticas |
| `npm run start` | Serve o build de produção localmente (rode `build` antes). Use para testar redirects, headers e cache como em produção |
| `npx tsc --noEmit` | Só a checagem de tipos, mais rápida que o build |
| `npx next experimental-analyze --output` | Relatório de bundle em `.next/diagnostics/analyze/`. Obrigatório antes de PR que adiciona dependência usada no cliente |

O projeto **não tem** script de lint, testes automatizados nem formatter configurado. A rede de segurança hoje é: TypeScript estrito + `next build` limpo + verificação manual no navegador. Ver [problemas-conhecidos.md](./problemas-conhecidos.md).

### Saída esperada do build

O build termina com a tabela de rotas. O estado correto hoje é:

- `○` (estática) em todas as páginas institucionais, de produto, de segmento e nos espelhos `/es/*`, além de `/sitemap.xml` e `/robots.txt`.
- `ƒ` (dinâmica) só em `/blog`, `/blog/[slug]`, `/aplicacoes/[slug]` e nas três rotas de `/api`.

Se uma página que deveria ser `○` aparecer como `ƒ`, alguma mudança passou a ler `cookies()`, `headers()` ou `searchParams` dentro dela (ou do layout). Isso tira a página da geração estática e piora performance. Investigue antes de seguir.

## 5. Verificações rápidas no navegador

Com `npm run dev` ou `npm run start`:

1. **Home** (`/`): hero sem salto de layout, formulário abre ao clicar em "Solicitar Orçamento" no menu.
2. **Uma página de produto** (`/transformador-de-corrente`): índice lateral, tabela de especificação, perguntas frequentes.
3. **Espanhol** (`/es`): conteúdo já vem em espanhol no HTML (ver código-fonte da página, não só a tela).
4. **Troca de idioma** no rodapé, numa página sem espelho (`/quem-somos`): o texto troca sem navegar.
5. **Blog** (`/blog`, com `WP_API_URL`): destaque, grade, paginação (`/blog?page=2`).
6. **404** (`/qualquer-coisa`): página de não encontrado.
7. **Negociação de Markdown**: `curl -H 'Accept: text/markdown' http://localhost:3000/` devolve a home em Markdown.
8. **Redirect** (só com `npm run start`): `curl -I http://localhost:3000/whatsapp` devolve 308 para `/#orcamento`.

## 6. Problemas comuns de ambiente

| Sintoma | Causa provável | Solução |
|---|---|---|
| `SyntaxError` estranho ou "Unsupported engine" ao rodar qualquer comando | Node errado (v12 do sistema) | `nvm use` |
| Blog vazio em dev | `WP_API_URL` ausente | `vercel env pull .env.local` |
| Formulário sempre dá erro em dev | SMTP não configurado localmente | Esperado sem env vars; ver seção 3 |
| Mudança em env var não tem efeito | O servidor lê `.env.local` só ao iniciar | Reinicie `npm run dev` |
| Imagem do WordPress não aparece (erro de `next/image`) | Domínio da mídia fora de `images.remotePatterns` | Ver [guias.md](./guias.md#mudou-o-domínio-da-mídia-do-wordpress) |
| `vercel env pull` pede login ou não acha o projeto | CLI sem login ou não vinculada | `vercel login` e `vercel link` (time `toroid`) |
