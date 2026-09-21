// Rotas reais hoje no App Router. Cada uma existe de fato — nada aqui é
// aspiracional, porque uma URL de sitemap que devolve 404 é pior sinal pro
// Google do que simplesmente não listar a URL. Ponto único de verdade:
// app/sitemap.ts e a negociação de Markdown (lib/agent-content.ts) importam
// daqui em vez de manter cópias separadas que podem divergir.
export const ROTAS_ESTATICAS = [
  "/",
  "/produtos",
  "/transformador-de-corrente",
  "/transformador-de-potencia",
  "/transformadores-toroidais",
  "/indutores-filtros-e-chokes",
  "/isobox",
  "/capacidade-fabril",
  "/quem-somos",
  "/contato",
  "/aplicacoes/nobreaks",
  "/aplicacoes/automacao-industrial",
  "/aplicacoes/equipamentos-laboratoriais",
  "/aplicacoes/integradores-de-sistemas",
  // /aplicacoes/equipamentos-medicos fica de fora de propósito: ainda com
  // `robots: noindex` (conteúdo normativo de equipamento regulado sem
  // validação da engenharia, ver aviso no próprio arquivo).
  "/blog",
  "/trabalhe-conosco",
];

// Prefixos com rota dinâmica cujo slug vem do WordPress. Um caminho aqui não
// tem a existência confirmada (isso exigiria consultar o WP), só o formato
// reconhecido — suficiente pra distinguir de um caminho de topo inventado.
export const PREFIXOS_DINAMICOS = ["/aplicacoes/", "/blog/", "/es/"];

export function isRotaConhecida(pathname: string): boolean {
  if (ROTAS_ESTATICAS.includes(pathname)) return true;
  return PREFIXOS_DINAMICOS.some((prefixo) => pathname.startsWith(prefixo));
}
