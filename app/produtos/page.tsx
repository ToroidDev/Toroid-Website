import type { Metadata } from "next";
import { produtos } from "@/lib/produtos";
import { ProdutosAccordion } from "@/components/produtos/ProdutosAccordion";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Transformadores, TCs e Indutores sob Medida | Toroid do Brasil",
  description:
    "Três famílias de produto projetadas a partir da aplicação do cliente: transformadores de corrente, transformadores de potência e indutores e reatores. Especificação conferida antes de produzir.",
  alternates: { canonical: "/produtos" },
};

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://toroid.com.br/" },
      { "@type": "ListItem", position: 2, name: "Produtos", item: "https://toroid.com.br/produtos" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Produtos Toroid do Brasil",
    url: "https://toroid.com.br/produtos",
    hasPart: produtos.map((produto) => ({
      "@type": "Product",
      name: produto.nome,
      url: `https://toroid.com.br${produto.href}`,
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
