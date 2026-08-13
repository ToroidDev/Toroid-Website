import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Rotas reais hoje no App Router. Cada uma existe de fato — nada aqui é
// aspiracional, porque uma URL de sitemap que devolve 404 é pior sinal pro
// Google do que simplesmente não listar a URL.
const ROTAS_ESTATICAS = [
  "/",
  "/produtos",
  "/transformador-de-corrente",
  "/transformador-de-potencia",
  "/transformadores-toroidais",
  "/indutores-filtros-e-chokes",
  "/quem-somos",
  "/contato",
  "/transformadores-nobreaks",
  "/blog",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const estaticas: MetadataRoute.Sitemap = ROTAS_ESTATICAS.map((rota) => ({
    url: absoluteUrl(rota),
  }));

  // /blog/[slug] e /aplicacoes/[slug] já existem como rotas (ROADMAP.md, item
  // A.5/A.6, concluído em 2026-08-12). Falta só a segunda condição: WP_API_URL
  // validado (Trilha B, ainda pendente). Até lá o bloco fica comentado —
  // chamar getPosts()/getAplicacoesPorIds() sem a env var configurada lançaria
  // erro no build do sitemap, e habilitar antes do tempo anunciaria URL que
  // ainda volta 404.
  //
  // const { getPosts } = await import("@/lib/wordpress");
  // const posts = await getPosts();
  // const postsSitemap: MetadataRoute.Sitemap = posts.map((post) => ({
  //   url: absoluteUrl(`/blog/${post.slug}`),
  //   lastModified: new Date(post.publicadoEm),
  // }));
  // return [...estaticas, ...postsSitemap];

  return estaticas;
}
