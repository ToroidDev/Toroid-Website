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
  "/aplicacoes/nobreaks",
  "/blog",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const estaticas: MetadataRoute.Sitemap = ROTAS_ESTATICAS.map((rota) => ({
    url: absoluteUrl(rota),
  }));

  // WP_API_URL confirmado em produção (2026-08-17, ver ROADMAP.md) — os posts
  // já aparecem de fato em /blog. Antes disso este bloco ficava comentado
  // porque chamar getPosts() sem a env var configurada quebraria o build do
  // sitemap, e habilitar antes do tempo anunciaria URL que ainda voltava 404.
  // Try/catch pelo mesmo motivo de app/blog/page.tsx: uma instabilidade
  // pontual do WP não pode derrubar o sitemap inteiro, só o bloco de posts.
  const { getPosts } = await import("@/lib/wordpress");
  const posts = await getPosts().catch(() => []);
  const postsSitemap: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.publicadoEm),
  }));

  return [...estaticas, ...postsSitemap];
}
