import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTA } from "@/components/sections/CTA";
import { BlogHero } from "@/components/blog/BlogHero";
import { Paginacao } from "@/components/blog/Paginacao";
import { PostCard } from "@/components/blog/PostCard";
import { PostDestaque } from "@/components/blog/PostDestaque";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { decodificarEntidades } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";
import { getPostsPagina, type PostResumo } from "@/lib/wordpress";
import styles from "./page.module.css";

// Renderiza por request (searchParams é API de request-time no Next 16, ver
// node_modules/next/dist/docs → file-conventions/page.md), mas sem custo de
// rede por visita: as chamadas ao WP têm revalidate 3600 e tags próprias em
// lib/wordpress.ts. Se o WP cair, buscar() devolve vazio e a página mostra o
// estado sem conteúdo em vez de um 500.

/** 1 destaque + 4 sugestões na coluna lateral. */
const DESTAQUES = 5;
/** 3 colunas × 3 linhas na grade. */
const POR_PAGINA = 9;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}): Promise<Metadata> {
  const pagina = lerPagina((await searchParams).page);
  const sufixo = pagina > 1 ? ` (página ${pagina})` : "";

  return {
    title: `Blog${sufixo} | Toroid do Brasil`,
    description:
      "Conteúdo técnico sobre especificação de transformadores de corrente, de potência e indutores, direto da engenharia da Toroid do Brasil.",
    // Canônica por página, e não sempre /blog: as páginas 2+ têm conteúdo
    // próprio, e apontar todas para a primeira esconderia o acervo do índice.
    alternates: { canonical: pagina > 1 ? `/blog?page=${pagina}` : "/blog" },
  };
}

function lerPagina(valor: string | string[] | undefined): number {
  const numero = Number(Array.isArray(valor) ? valor[0] : valor);
  return Number.isInteger(numero) && numero > 1 ? numero : 1;
}

async function buscar(offset: number, quantidade: number): Promise<{ posts: PostResumo[]; total: number }> {
  try {
    return await getPostsPagina(offset, quantidade);
  } catch {
    return { posts: [], total: 0 };
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const pagina = lerPagina((await searchParams).page);

  // UMA chamada por página, nunca duas. Na primeira, os DESTAQUES e a grade
  // saem da mesma sequência de posts e são fatiados aqui. Duas chamadas em
  // paralelo criavam um estado incoerente: bastava a da grade falhar para a
  // página mostrar o destaque cheio e anunciar que o acervo tinha acabado,
  // com 59 posts ainda por listar. Com uma chamada só, ou a página tem tudo
  // ou não tem nada.
  //
  // A grade sempre pula os DESTAQUES: usar `offset` em vez de `page` no WP é
  // o que impede esse corte de cair no meio das páginas seguintes (ver
  // getPostsPagina em lib/wordpress.ts).
  const { posts, total } =
    pagina === 1
      ? await buscar(0, DESTAQUES + POR_PAGINA)
      : await buscar(DESTAQUES + (pagina - 1) * POR_PAGINA, POR_PAGINA);

  const [destaque, ...sugestoes] = pagina === 1 ? posts.slice(0, DESTAQUES) : [];
  const grade = pagina === 1 ? posts.slice(DESTAQUES) : posts;

  const totalPaginas = Math.max(1, Math.ceil(Math.max(0, total - DESTAQUES) / POR_PAGINA));

  // Página fora da faixa é 404 de verdade, não uma grade vazia: uma URL que
  // responde 200 sem conteúdo é sinal ruim para o índice.
  if (pagina > 1 && grade.length === 0) notFound();

  const JSON_LD = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Blog técnico da Toroid do Brasil",
      url: absoluteUrl("/blog"),
      inLanguage: "pt-BR",
      publisher: { "@type": "Organization", name: "Toroid do Brasil" },
      blogPost: posts.map((post) => ({
        "@type": "BlogPosting",
        headline: decodificarEntidades(post.titulo),
        url: absoluteUrl(`/blog/${post.slug}`),
        datePublished: post.publicadoEm,
        ...(post.imagemDestaque ? { image: post.imagemDestaque.url } : {}),
      })),
    },
  ];

  return (
    <>
      <BlogHero totalPosts={total} />

      {destaque ? <PostDestaque destaque={destaque} sugestoes={sugestoes} /> : null}

      <section id="artigos" className={styles.acervo}>
        <InstitutionalPattern opacity={0.05} className={styles.pattern} />
        <div className={styles.inner}>
          <SectionHeading
            eyebrow={pagina > 1 ? `Acervo · página ${pagina}` : "Acervo"}
            lead="Do detalhe de especificação ao caso de aplicação, na ordem em que foram publicados."
          >
            Todos os artigos.
          </SectionHeading>

          {grade.length > 0 ? (
            <>
              <div className={styles.grid}>
                {grade.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              <Paginacao paginaAtual={pagina} totalPaginas={totalPaginas} />
            </>
          ) : (
            <p className={styles.vazio}>
              {destaque
                ? "Por enquanto o acervo cabe inteiro no destaque acima."
                : "Nenhum conteúdo publicado ainda."}
            </p>
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
