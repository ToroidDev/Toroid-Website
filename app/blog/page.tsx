import type { Metadata } from "next";
import Link from "next/link";
import { CTA } from "@/components/sections/CTA";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPosts } from "@/lib/wordpress";
import styles from "./page.module.css";

// Sem generateStaticParams/força dinâmica explícita: a listagem chama
// getPosts() por request, com o cache/revalidate/tags de lib/wordpress.ts.
// WP_API_URL ainda não está confirmado em produção (ROADMAP.md, Trilha B) —
// nesse estado a chamada lança, capturada abaixo, e a página mostra estado
// vazio em vez de erro 500.

export const metadata: Metadata = {
  title: "Blog | Toroid do Brasil",
  description:
    "Conteúdo técnico sobre especificação de transformadores de corrente, de potência e indutores, direto da engenharia da Toroid do Brasil.",
  alternates: { canonical: "/blog" },
};

async function buscarPosts() {
  try {
    return await getPosts();
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await buscarPosts();

  const JSON_LD = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "https://toroid.com.br/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://toroid.com.br/blog" },
      ],
    },
  ];

  return (
    <>
      <section className={styles.section}>
        <InstitutionalPattern opacity={0.06} className={styles.pattern} />
        <div className={styles.inner}>
          <SectionHeading eyebrow="Blog">Conteúdo técnico direto da engenharia.</SectionHeading>

          {posts.length > 0 ? (
            <div className={styles.grid}>
              {posts.map((post) => (
                <article key={post.id} className={styles.card}>
                  <h2 className={styles.cardTitle}>
                    <Link href={`/blog/${post.slug}`}>{post.titulo}</Link>
                  </h2>
                  <div className={styles.cardResumo} dangerouslySetInnerHTML={{ __html: post.resumoHtml }} />
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.vazio}>Nenhum conteúdo publicado ainda.</p>
          )}
        </div>
      </section>

      <CTA />

      {JSON_LD.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}
