import type { Metadata } from "next";
import { produtos } from "@/lib/produtos";
import { ProdutosAccordion } from "@/components/produtos/ProdutosAccordion";
import { CTA } from "@/components/sections/CTA";
import { absoluteUrl, metadataOg } from "@/lib/seo";

const TITULO = "Transformadores, TCs e Indutores sob Medida | Toroid do Brasil";
const DESCRICAO =
  "Três famílias de produto projetadas a partir da aplicação do cliente: transformadores de corrente, transformadores de potência e indutores e reatores. Especificação conferida antes de produzir.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/produtos" },
  ...metadataOg({ title: TITULO, description: DESCRICAO, path: "/produtos" }),
};

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Produtos", item: absoluteUrl("/produtos") },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Produtos Toroid do Brasil",
    url: absoluteUrl("/produtos"),
    // WebPage, não Product: a regra do CLAUDE.md reserva o schema Product
    // para as páginas de família individuais, não pra listagem.
    hasPart: produtos.map((produto) => ({
      "@type": "WebPage",
      name: produto.nome,
      url: absoluteUrl(produto.href),
    })),
  },
];

export default function ProdutosPage() {
  return (
    <>
      <ProdutosAccordion />
      <CTA />

      {JSON_LD.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}
