import type { Metadata } from "next";
import { CTA } from "@/components/sections/CTA";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { HeroStack } from "@/components/quem-somos/HeroStack";
import { LinhaDoTempo } from "@/components/quem-somos/LinhaDoTempo";
import { MissaoDestaque } from "@/components/quem-somos/MissaoDestaque";
import { Valores } from "@/components/quem-somos/Valores";
import { Compromissos } from "@/components/quem-somos/Compromissos";
import { VideoInstitucional } from "@/components/quem-somos/VideoInstitucional";
import { FAQSection } from "@/components/quem-somos/FAQSection";
import { getAnosDeMercado } from "@/lib/institucional";
import { absoluteUrl } from "@/lib/seo";

// Layout desta página é deliberadamente diferente das demais (ver CLAUDE.md/
// ROADMAP.md): hero azul cheio com `position: sticky`, e a seção seguinte
// (Historia) sobe por cima dele no fluxo normal do documento — cartão
// deslizando sobre o azul, sem JS de scroll. Ver QuemSomosHero.module.css
// para o mecanismo. Schema.org Organization já vem do RootLayout; esta
// página adiciona LocalBusiness (endereço/telefone/horário) e FAQPage, que
// só fazem sentido por página.

export const metadata: Metadata = {
  title: "Quem Somos | Toroid do Brasil",
  description:
    "Toroid do Brasil: fabricante de transformadores de corrente, de potência e indutores desde 1994, em São José dos Pinhais, PR. Conheça nossa história, missão, visão e valores.",
  alternates: { canonical: "/quem-somos" },
};

const PERGUNTAS = [
  {
    pergunta: "Quantos anos a Toroid do Brasil tem?",
    resposta: `Fundada em 1994, em São José dos Pinhais, PR, a Toroid do Brasil está no mercado há ${getAnosDeMercado()} anos.`,
  },
  {
    pergunta: "Onde fica a fábrica da Toroid do Brasil?",
    resposta:
      "Em São José dos Pinhais, PR, na Rua Antônio Bianchetti, 541 - Iná. Bobinagem, encapsulamento e ensaio elétrico acontecem sob o mesmo teto, com rastreabilidade de lote.",
  },
  {
    pergunta: "Quais certificações a Toroid do Brasil possui?",
    resposta:
      "ISO 9001, certificada pela RINA. Os produtos também atendem RoHS Compliant e têm garantia de 3 anos.",
  },
  {
    pergunta: "A Toroid do Brasil fabrica produtos sob medida?",
    resposta:
      "Sim. Transformadores de corrente, transformadores de potência e indutores são projetados a partir da aplicação de cada cliente, com especificação conferida antes da produção.",
  },
];

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://toroid.com.br/" },
      { "@type": "ListItem", position: 2, name: "Quem somos", item: "https://toroid.com.br/quem-somos" },
    ],
  },
  {
    // Dados do vídeo conferidos na própria API do YouTube (oEmbed e página do
    // vídeo) em 2026-09-01: publicado em 22/11/2022, 67 segundos. `thumbnailUrl`
    // aponta para o poster local, não para o i.ytimg, para o Google ler a mesma
    // imagem que a página serve.
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Vídeo institucional da Toroid do Brasil",
    // description:
    //   "Visita à fábrica da Toroid do Brasil em São José dos Pinhais, PR: as pessoas, as máquinas e as etapas de fabricação de transformadores de corrente, transformadores de potência e indutores.",
    thumbnailUrl: [absoluteUrl("/images/video-institucional-poster.webp")],
    uploadDate: "2022-11-22T03:58:21-08:00",
    duration: "PT1M7S",
    embedUrl: "https://www.youtube.com/embed/mgUk-NY4QDo",
    contentUrl: "https://www.youtube.com/watch?v=mgUk-NY4QDo",
    publisher: { "@type": "Organization", name: "Toroid do Brasil" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PERGUNTAS.map(({ pergunta, resposta }) => ({
      "@type": "Question",
      name: pergunta,
      acceptedAnswer: { "@type": "Answer", text: resposta },
    })),
  },
];

export default function QuemSomosPage() {
  return (
    <>
      <HeroStack />
      <LinhaDoTempo />
      <MissaoDestaque />
      <Valores />
      <Compromissos />
      <VideoInstitucional />
      <FAQSection itens={PERGUNTAS} />

      <CTA />

      <LocalBusinessSchema />
      {JSON_LD.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}
