import { NextResponse, type NextRequest } from "next/server";
import { absoluteUrl, TITULO_PADRAO, DESCRICAO_PADRAO } from "@/lib/seo";
import { produtos } from "@/lib/produtos";
import { SEGMENTOS } from "@/lib/segmentos";
import { ROTAS_ESTATICAS, isRotaConhecida } from "@/lib/routes";

interface MediaRange {
  type: string;
  q: number;
}

function parseAccept(accept: string): MediaRange[] {
  return accept.split(",").map((entrada) => {
    const partes = entrada.split(";").map((p) => p.trim());
    const type = partes[0].toLowerCase();
    let q = 1;
    for (const parametro of partes.slice(1)) {
      const [chave, valor] = parametro.split("=").map((s) => s.trim());
      if (chave === "q") {
        const numero = Number(valor);
        if (!Number.isNaN(numero)) q = numero;
      }
    }
    return { type, q };
  });
}

/**
 * Regra simples de negociação: presença de `text/markdown` no header
 * `Accept`, com preferência (q) igual ou maior que `text/html`/`*\/*` quando
 * presentes. Suficiente pro teste de agente (`Accept: text/markdown` puro) e
 * seguro contra falso positivo em navegador real, que nunca envia esse tipo
 * no próprio Accept.
 */
export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  const ranges = parseAccept(accept);
  const markdown = ranges.find((r) => r.type === "text/markdown");
  if (!markdown) return false;
  const html = ranges.find((r) => r.type === "text/html" || r.type === "*/*");
  return !html || markdown.q >= html.q;
}

const MARKDOWN_HEADERS_OK = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
  "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
};

const MARKDOWN_HEADERS_404 = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
  "Cache-Control": "no-store",
};

function corpoMarkdownHome(): string {
  const secaoProdutos = produtos
    .map((p) => `## ${p.nome}\n\n${p.descricaoCurta}\n\n${absoluteUrl(p.href)}`)
    .join("\n\n");

  const secaoSegmentos = SEGMENTOS.map(
    (s) => `## ${s.titulo.pt}\n\n${s.texto.pt}\n\n${absoluteUrl(s.href)}`,
  ).join("\n\n");

  const outrasPaginas = ROTAS_ESTATICAS.filter((rota) => rota !== "/")
    .map((rota) => `- ${absoluteUrl(rota)}`)
    .join("\n");

  return `# ${TITULO_PADRAO}

${DESCRICAO_PADRAO}

## Produtos

${secaoProdutos}

## Segmentos atendidos

${secaoSegmentos}

## Outras páginas

${outrasPaginas}

## Recursos para agentes

- Mapa do site: ${absoluteUrl("/sitemap.xml")}
- Resumo para agentes: ${absoluteUrl("/llms.txt")}
`;
}

function corpoMarkdown404(pathname: string): string {
  return `# Página não encontrada

A URL "${pathname}" não existe no site da Toroid do Brasil.

Conteúdo disponível:

- Mapa do site: ${absoluteUrl("/sitemap.xml")}
- Resumo para agentes: ${absoluteUrl("/llms.txt")}
- Página inicial: ${absoluteUrl("/")}
`;
}

/**
 * Só chamada quando `prefersMarkdown` já deu verdadeiro. Síncrona: tanto a
 * home quanto o 404 genérico são montados a partir de dado já em memória,
 * sem chamada ao WordPress. Rotas dinâmicas conhecidas por prefixo
 * (`/aplicacoes/*`, `/blog/*`, `/es/*`) não são validadas aqui — seguem pro
 * fluxo normal do Next, que resolve com HTML (ver limitação documentada no
 * plano: só o 404 de caminho de topo desconhecido precisa ser Markdown pro
 * audit que motivou esta função).
 */
export function handleMarkdownRequest(request: NextRequest): Response {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return new Response(corpoMarkdownHome(), { status: 200, headers: MARKDOWN_HEADERS_OK });
  }

  if (!isRotaConhecida(pathname)) {
    return new Response(corpoMarkdown404(pathname), { status: 404, headers: MARKDOWN_HEADERS_404 });
  }

  return NextResponse.next();
}
