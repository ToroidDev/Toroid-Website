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

/**
 * O que a listagem de /blog precisa de cada post. Separado de `Post` de
 * propósito: `content.rendered` é o campo mais pesado da resposta do WP e a
 * listagem nunca o usa, então nem chega a ser pedido (ver CAMPOS_RESUMO).
 */
export interface PostResumo {
  id: number;
  slug: string;
  titulo: string;
  resumoHtml: string;
  publicadoEm: string;
  imagemDestaque: WPImagem | null;
}

export interface Post extends PostResumo {
  conteudoHtml: string;
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

interface WPRawPostResumo {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  /** Só presente com `_embed=wp:featuredmedia` E post com imagem destacada:
   *  quando `featured_media` é 0 o WP omite a chave inteira (confirmado via
   *  curl em 2026-08-28, post 4624). Quando a mídia existe mas está
   *  inacessível, o array vem com um objeto de erro sem `source_url`. */
  _embedded?: { "wp:featuredmedia"?: Array<Partial<WPRawImagem>> };
}

interface WPRawPost extends WPRawPostResumo {
  content: { rendered: string };
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

// O excerpt automático do WP termina com um link "Continuar lendo …" apontando
// para a URL do WordPress antigo, fora do Next. No card ele seria um segundo
// link dentro de um card que já é inteiro clicável, e ainda levaria o visitante
// para fora do site novo. Fica só o texto, com as reticências que o WP já pôs.
function limparResumo(html: string): string {
  return limparResiduoDoWord(html).replace(/<a class="more-link"[\s\S]*?<\/a>/g, "");
}

function imagemDestacada(raw: WPRawPostResumo): WPImagem | null {
  const media = raw._embedded?.["wp:featuredmedia"]?.[0];
  if (!media?.id || !media.source_url) return null;
  return {
    id: media.id,
    url: media.source_url,
    alt: media.alt_text ?? "",
    largura: media.media_details?.width,
    altura: media.media_details?.height,
  };
}

function mapPostResumo(raw: WPRawPostResumo): PostResumo {
  return {
    id: raw.id,
    slug: raw.slug,
    titulo: raw.title.rendered,
    resumoHtml: limparResumo(raw.excerpt.rendered),
    publicadoEm: raw.date,
    imagemDestaque: imagemDestacada(raw),
  };
}

function mapPost(raw: WPRawPost): Post {
  return {
    ...mapPostResumo(raw),
    conteudoHtml: limparResiduoDoWord(raw.content.rendered),
  };
}

// `total` sai do header X-WP-Total, que o WP devolve em toda resposta de
// coleção (e mantém a contagem completa mesmo com `offset` aplicado —
// confirmado via curl em 2026-08-28). É o que permite paginar /blog sem uma
// segunda chamada só para contar.
async function wpFetchColecao<T>(
  path: string,
  revalidate: number,
  tags: string[],
): Promise<{ dados: T; total: number }> {
  if (!WP_API_URL) {
    throw new Error("WP_API_URL não configurada. Ver CLAUDE.md, seção 'Variáveis de ambiente'.");
  }
  const res = await fetch(`${WP_API_URL}${path}`, { next: { revalidate, tags } });
  if (!res.ok) {
    throw new Error(`WordPress respondeu ${res.status} para ${path}`);
  }
  return { dados: (await res.json()) as T, total: Number(res.headers.get("x-wp-total") ?? 0) };
}

async function wpFetch<T>(path: string, revalidate: number, tags: string[]): Promise<T> {
  const { dados } = await wpFetchColecao<T>(path, revalidate, tags);
  return dados;
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

// `_embed=wp:featuredmedia` traz a imagem destacada junto da listagem, em vez
// de uma chamada por post. O `_links.wp:featuredmedia` dentro de `_fields` não
// é decorativo: sem ele o WP descarta `_embedded` da resposta filtrada e a
// imagem some (comportamento conhecido do WP REST, confirmado via curl).
const CAMPOS_RESUMO = "id,slug,title,excerpt,date,_links.wp:featuredmedia,_embedded";

/**
 * Uma página da listagem de /blog. `offset` (e não `page`) porque os posts em
 * destaque no topo saem da mesma sequência e precisam ser pulados na grade:
 * com `page` o corte de 4 posts cairia no meio das páginas seguintes.
 */
export async function getPostsPagina(
  offset: number,
  porPagina: number,
): Promise<{ posts: PostResumo[]; total: number }> {
  const { dados, total } = await wpFetchColecao<WPRawPostResumo[]>(
    `/posts?per_page=${porPagina}&offset=${offset}&_embed=wp:featuredmedia&_fields=${CAMPOS_RESUMO}`,
    3600,
    ["posts", `posts-${offset}-${porPagina}`],
  );
  return { posts: dados.map(mapPostResumo), total };
}

/** Listagem enxuta para o sitemap: sem conteúdo e sem imagem, só o que o
 *  `MetadataRoute.Sitemap` consome (slug + data). */
export async function getPosts(): Promise<PostResumo[]> {
  const raw = await wpFetch<WPRawPostResumo[]>(`/posts?per_page=100&_fields=id,slug,title,excerpt,date`, 3600, [
    "posts",
  ]);
  return raw.map(mapPostResumo);
}

export async function getPostPorSlug(slug: string): Promise<Post | null> {
  const raw = await wpFetch<WPRawPost[]>(`/posts?slug=${slug}&_embed=wp:featuredmedia`, 3600, [`post-${slug}`]);
  return raw[0] ? mapPost(raw[0]) : null;
}
