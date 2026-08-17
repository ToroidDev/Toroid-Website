import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CTA } from "@/components/sections/CTA";
import { AplicacaoHero } from "@/components/aplicacoes/AplicacaoHero";
import { PillarBody, Prose } from "@/components/produtos/Pillar";
import { getAplicacaoPorSlug, getProdutosPorIds, type CategoriaProduto } from "@/lib/wordpress";

// Padrão dinâmico genérico do CLAUDE.md, alimentado pelo CPT `aplicacao` do
// WordPress. Sem generateStaticParams de propósito: o conteúdo é 100% do WP e
// WP_API_URL ainda não está confirmado em produção (ver ROADMAP.md, Trilha
// B) — gerar params no build chamaria a API nesse momento e quebraria
// `next build` até a env var existir. Cada slug renderiza por request, com o
// cache/revalidate/tags normais de lib/wordpress.ts.
//
// `/aplicacoes/nobreaks` (migrada de `/transformadores-nobreaks` em
// 2026-08-17, ver next.config.ts) é uma rota irmã estática dentro desta mesma
// pasta, fora deste padrão dinâmico — conteúdo próprio, não vem do CPT
// `aplicacao` (ver aviso no arquivo dela). O Next.js prioriza a rota estática
// sobre `[slug]` no mesmo nível, então as duas convivem sem conflito.

const HREF_POR_CATEGORIA: Record<CategoriaProduto, string> = {
  "transformador-de-corrente": "/transformador-de-corrente",
  // A taxonomia do WP ainda usa o termo antigo (ver ROADMAP.md/Trilha B, item
  // sobre categoria_produto): a 3ª família real hoje é Transformador de
  // Potência, não mais Toroidal. Até o WP admin corrigir o termo, o valor
  // antigo aponta pro destino real.
  "transformador-toroidal": "/transformador-de-potencia",
  "indutor-reator": "/indutores-filtros-e-chokes",
};

async function buscarAplicacao(slug: string) {
  try {
    return await getAplicacaoPorSlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const aplicacao = await buscarAplicacao(slug);
  if (!aplicacao) return {};

  return {
    title: `${aplicacao.titulo} | Toroid do Brasil`,
    description: aplicacao.dorSegmento,
    alternates: { canonical: `/aplicacoes/${aplicacao.slug}` },
  };
}

export default async function AplicacaoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const aplicacao = await buscarAplicacao(slug);
  if (!aplicacao) notFound();

  const produtosRecomendados = await getProdutosPorIds(aplicacao.produtosRecomendadosIds).catch(() => []);

  const JSON_LD = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "https://toroid.com.br/" },
        {
          "@type": "ListItem",
          position: 2,
          name: aplicacao.titulo,
          item: `https://toroid.com.br/aplicacoes/${aplicacao.slug}`,
        },
      ],
    },
  ];

  return (
    <>
      <AplicacaoHero
        trilha={aplicacao.titulo}
        eyebrow="Aplicação"
        titulo={aplicacao.titulo}
        lead={aplicacao.dorSegmento}
        prova={["São José dos Pinhais · PR", "ISO 9001", "Fabricação nacional"]}
        ctaPrimario="Solicitar Orçamento Técnico"
        ctaWhatsapp="Falar com nosso time"
      />

      <PillarBody pattern>
        <Prose id="o-que-muda" titulo={`O que muda para ${aplicacao.titulo}`}>
          <p>{aplicacao.dorSegmento}</p>
        </Prose>
      </PillarBody>

      {produtosRecomendados.length > 0 && (
        <PillarBody tone="tint">
          <Prose id="produtos-recomendados" titulo="Produtos recomendados para esta aplicação">
            <ul>
              {produtosRecomendados.map((produto) => (
                <li key={produto.id}>
                  <Link href={HREF_POR_CATEGORIA[produto.categoriaProduto]}>{produto.titulo}</Link>
                </li>
              ))}
            </ul>
          </Prose>
        </PillarBody>
      )}

      <CTA />

      {JSON_LD.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}
