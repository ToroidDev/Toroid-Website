import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CTA } from "@/components/sections/CTA";
import { PostBody } from "@/components/blog/PostBody";
import { getPostPorSlug } from "@/lib/wordpress";
import styles from "./page.module.css";

// Mesmo motivo do app/blog/page.tsx e de app/aplicacoes/[slug]/page.tsx: sem
// generateStaticParams, renderiza por request, sem depender de WP_API_URL no
// build. Os 58+ redirects 301/308 de post de blog em next.config.ts passam a
// ter uma rota real pra aterrissar aqui — mas só param de voltar 404 de fato
// quando WP_API_URL estiver confirmado E o post existir no WP com o mesmo
// slug (ROADMAP.md, Trilha B). Rota existir não é o mesmo que conteúdo existir.

async function buscarPost(slug: string) {
  try {
    return await getPostPorSlug(slug);
  } catch {
    return null;
  }
}

function textoSemHtml(html: string, limite: number) {
  return html.replace(/<[^>]+>/g, "").trim().slice(0, limite);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await buscarPost(slug);
  if (!post) return {};

  return {
    title: `${post.titulo} | Toroid do Brasil`,
    description: textoSemHtml(post.resumoHtml, 160),
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await buscarPost(slug);
  if (!post) notFound();

  const JSON_LD = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "https://toroid.com.br/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://toroid.com.br/blog" },
        { "@type": "ListItem", position: 3, name: post.titulo, item: `https://toroid.com.br/blog/${post.slug}` },
      ],
    },
  ];

  return (
    <>
      <article className={styles.section}>
        <div className={styles.inner}>
          <ol className={styles.breadcrumb}>
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
          </ol>
          <h1 className={styles.titulo}>{post.titulo}</h1>
          <PostBody html={post.conteudoHtml} />
        </div>
      </article>

      <CTA />

      {JSON_LD.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}
