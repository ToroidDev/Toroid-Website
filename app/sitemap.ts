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

// Só a home tem espelho em espanhol hoje (ver app/es/page.tsx e
// lib/i18n.ts). Alternates aqui é o mesmo hreflang das páginas, só que no
// formato que o sitemap espera.
const ALTERNADAS: Record<string, Record<string, string>> = {
  "/": { "pt-BR": absoluteUrl("/"), es: absoluteUrl("/es") },
  "/transformador-de-corrente": {
    "pt-BR": absoluteUrl("/transformador-de-corrente"),
    es: absoluteUrl("/es/transformador-de-corrente"),
  },
  "/transformador-de-potencia": {
    "pt-BR": absoluteUrl("/transformador-de-potencia"),
    es: absoluteUrl("/es/transformador-de-potencia"),
  },
  "/transformadores-toroidais": {
    "pt-BR": absoluteUrl("/transformadores-toroidais"),
    es: absoluteUrl("/es/transformadores-toroidais"),
  },
  "/indutores-filtros-e-chokes": {
    "pt-BR": absoluteUrl("/indutores-filtros-e-chokes"),
    es: absoluteUrl("/es/indutores-filtros-e-chokes"),
  },
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const estaticas: MetadataRoute.Sitemap = ROTAS_ESTATICAS.map((rota) => ({
    url: absoluteUrl(rota),
    ...(ALTERNADAS[rota] ? { alternates: { languages: ALTERNADAS[rota] } } : {}),
  }));

  const espelhos: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/es"), alternates: { languages: { "pt-BR": absoluteUrl("/"), es: absoluteUrl("/es") } } },
    {
      url: absoluteUrl("/es/transformador-de-corrente"),
      alternates: {
        languages: {
          "pt-BR": absoluteUrl("/transformador-de-corrente"),
          es: absoluteUrl("/es/transformador-de-corrente"),
        },
      },
    },
    {
      url: absoluteUrl("/es/transformador-de-potencia"),
      alternates: {
        languages: {
          "pt-BR": absoluteUrl("/transformador-de-potencia"),
          es: absoluteUrl("/es/transformador-de-potencia"),
        },
      },
    },
    {
      url: absoluteUrl("/es/transformadores-toroidais"),
      alternates: {
        languages: {
          "pt-BR": absoluteUrl("/transformadores-toroidais"),
          es: absoluteUrl("/es/transformadores-toroidais"),
        },
      },
    },
    {
      url: absoluteUrl("/es/indutores-filtros-e-chokes"),
      alternates: {
        languages: {
          "pt-BR": absoluteUrl("/indutores-filtros-e-chokes"),
          es: absoluteUrl("/es/indutores-filtros-e-chokes"),
        },
      },
    },
  ];

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

  return [...estaticas, ...espelhos, ...postsSitemap];
}
