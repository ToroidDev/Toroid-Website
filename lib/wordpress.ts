// Camada de integração com o WordPress headless (CLAUDE.md → "Estrutura de
// dados do WordPress"). Ainda não é usada por nenhuma página: as 3 páginas
// de produto em app/produtos/*/page.tsx usam conteúdo estático porque
// WP_API_URL ainda não está confirmado. Pronta para plugar quando estiver:
// trocar o conteúdo estático por uma chamada às funções abaixo, sem mudar
// URL nem estrutura das páginas.
//
// Antes de usar em produção: validar cada endpoint novo com
// `curl -s ${WP_API_URL}/produto/123 | jq` (CLAUDE.md) para confirmar que os
// campos ACF abaixo realmente aparecem no JSON. Um campo sem "Show in REST
// API" marcado no WP existe no admin mas não aparece na resposta.

const WP_API_URL = process.env.WP_API_URL;

export interface WPImagem {
  id: number;
  url: string;
  alt: string;
  largura?: number;
  altura?: number;
}

export interface ParametroEspecificacao {
  nome: string;
  valor: string;
}

export const CATEGORIAS_PRODUTO = ["transformador-de-corrente", "transformador-toroidal", "indutor-reator"] as const;
export type CategoriaProduto = (typeof CATEGORIAS_PRODUTO)[number];

export interface Produto {
  id: number;
  slug: string;
  titulo: string;
  categoriaProduto: CategoriaProduto;
  variante: string;
  faixaTecnica: string;
  parametrosEspecificacao: ParametroEspecificacao[];
  aplicacoesRelacionadasIds: number[];
  imagemPrincipal: WPImagem | null;
  galeria: WPImagem[];
}

export type TierIcp = "T1" | "T2" | "T3" | "area_atuacao";
export type StatusAds = "ads_ativo" | "sem_ads";

export interface Aplicacao {
  id: number;
  slug: string;
  titulo: string;
  tierIcp: TierIcp;
  statusAds: StatusAds;
  dorSegmento: string;
  produtosRecomendadosIds: number[];
}

export type CategoriaPost = "especificacao-tecnica" | "engenharia-manutencao" | "aplicacoes-segmento" | "cases";

export interface Post {
  id: number;
  slug: string;
  titulo: string;
  resumoHtml: string;
  conteudoHtml: string;
  publicadoEm: string;
}

// --- Formato bruto retornado pela REST API do WP (wp-json/wp/v2/*) ---------

interface WPRawImagem {
  id: number;
  source_url: string;
  alt_text: string;
  media_details?: { width?: number; height?: number };
}

interface WPRawProduto {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    categoria_produto: CategoriaProduto;
    variante: string;
    faixa_tecnica: string;
    parametros_especificacao: ParametroEspecificacao[] | null;
    aplicacoes_relacionadas: number[] | null;
    imagem_principal: WPRawImagem | null;
    galeria: WPRawImagem[] | null;
  };
}

interface WPRawAplicacao {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    tier_icp: TierIcp;
    status_ads: StatusAds;
    dor_segmento: string;
    produtos_recomendados: number[] | null;
  };
}

interface WPRawPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
}

function mapImagem(raw: WPRawImagem | null): WPImagem | null {
  if (!raw) return null;
  return {
    id: raw.id,
    url: raw.source_url,
    alt: raw.alt_text,
    largura: raw.media_details?.width,
    altura: raw.media_details?.height,
  };
}

function mapProduto(raw: WPRawProduto): Produto {
  return {
    id: raw.id,
    slug: raw.slug,
    titulo: raw.title.rendered,
    categoriaProduto: raw.acf.categoria_produto,
    variante: raw.acf.variante,
    faixaTecnica: raw.acf.faixa_tecnica,
    parametrosEspecificacao: raw.acf.parametros_especificacao ?? [],
    aplicacoesRelacionadasIds: raw.acf.aplicacoes_relacionadas ?? [],
    imagemPrincipal: mapImagem(raw.acf.imagem_principal),
    galeria: (raw.acf.galeria ?? []).map(mapImagem).filter((img): img is WPImagem => img !== null),
  };
}

function mapAplicacao(raw: WPRawAplicacao): Aplicacao {
  return {
    id: raw.id,
    slug: raw.slug,
    titulo: raw.title.rendered,
    tierIcp: raw.acf.tier_icp,
    statusAds: raw.acf.status_ads,
    dorSegmento: raw.acf.dor_segmento,
    produtosRecomendadosIds: raw.acf.produtos_recomendados ?? [],
  };
}

// Posts antigos foram colados do Word direto no editor: sobra <span
// data-contrast>/<span data-ccp-props> sem estilo visual algum (confirmado em
// 13 dos 64 posts reais via curl, 2026-08-12) — só bagunça o HTML, sem afetar
// o layout. Remove o wrapper, mantém o texto de dentro.
function limparResiduoDoWord(html: string): string {
  return html
    .replace(/<span data-ccp-props="[^"]*">([\s\S]*?)<\/span>/g, "$1")
    .replace(/<span data-contrast="[^"]*">([\s\S]*?)<\/span>/g, "$1");
}

function mapPost(raw: WPRawPost): Post {
  return {
    id: raw.id,
    slug: raw.slug,
    titulo: raw.title.rendered,
    resumoHtml: limparResiduoDoWord(raw.excerpt.rendered),
    conteudoHtml: limparResiduoDoWord(raw.content.rendered),
    publicadoEm: raw.date,
  };
}

async function wpFetch<T>(path: string, revalidate: number, tags: string[]): Promise<T> {
  if (!WP_API_URL) {
    throw new Error("WP_API_URL não configurada. Ver CLAUDE.md, seção 'Variáveis de ambiente'.");
  }
  const res = await fetch(`${WP_API_URL}${path}`, { next: { revalidate, tags } });
  if (!res.ok) {
    throw new Error(`WordPress respondeu ${res.status} para ${path}`);
  }
  return res.json() as Promise<T>;
}

export async function getProdutoPorSlug(categoria: CategoriaProduto, slug: string): Promise<Produto | null> {
  const raw = await wpFetch<WPRawProduto[]>(`/produto?slug=${slug}`, 3600, [`produto-${slug}`]);
  const encontrado = raw.find((item) => item.acf.categoria_produto === categoria);
  return encontrado ? mapProduto(encontrado) : null;
}

// Filtra por categoria no cliente (não no query string): a filtragem
// server-side por taxonomia/ACF depende do rest_base exato configurado no WP,
// que ainda não foi confirmado. Catálogo de produto não deve passar de
// algumas dezenas de itens por categoria, então isto é seguro por ora. Dá
// para otimizar com filtro server-side depois que o WP estiver validado.
export async function getProdutosPorCategoria(categoria: CategoriaProduto): Promise<Produto[]> {
  const raw = await wpFetch<WPRawProduto[]>(`/produto?per_page=100`, 3600, [`produtos-${categoria}`]);
  return raw.filter((item) => item.acf.categoria_produto === categoria).map(mapProduto);
}

export async function getProdutosPorIds(ids: number[]): Promise<Produto[]> {
  if (ids.length === 0) return [];
  const raw = await wpFetch<WPRawProduto[]>(`/produto?include=${ids.join(",")}`, 3600, ["produtos"]);
  return raw.map(mapProduto);
}

export async function getAplicacaoPorSlug(slug: string): Promise<Aplicacao | null> {
  const raw = await wpFetch<WPRawAplicacao[]>(`/aplicacao?slug=${slug}`, 3600, [`aplicacao-${slug}`]);
  return raw[0] ? mapAplicacao(raw[0]) : null;
}

export async function getAplicacoesPorIds(ids: number[]): Promise<Aplicacao[]> {
  if (ids.length === 0) return [];
  const raw = await wpFetch<WPRawAplicacao[]>(`/aplicacao?include=${ids.join(",")}`, 3600, ["aplicacoes"]);
  return raw.map(mapAplicacao);
}

export async function getPosts(): Promise<Post[]> {
  const raw = await wpFetch<WPRawPost[]>(`/posts?per_page=20`, 3600, ["posts"]);
  return raw.map(mapPost);
}

export async function getPostPorSlug(slug: string): Promise<Post | null> {
  const raw = await wpFetch<WPRawPost[]>(`/posts?slug=${slug}`, 3600, [`post-${slug}`]);
  return raw[0] ? mapPost(raw[0]) : null;
}
