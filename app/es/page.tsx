import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { ProvaInstitucional } from "@/components/sections/ProvaInstitucional";
import { Produtos } from "@/components/sections/Produtos";
import { Segmentos } from "@/components/sections/Segmentos";
import { Performance } from "@/components/sections/Performance";
import { Fabrica } from "@/components/sections/Fabrica";
import { CTA } from "@/components/sections/CTA";
import { absoluteUrl } from "@/lib/seo";

// Espelho em espanhol da home (app/page.tsx), pensado pra aparecer em busca
// no idioma — ver conversa em CLAUDE.md/i18n. Mesmas seções, mesmos
// componentes: o texto em espanhol já existe em cada um via <T pt es en />
// (fase 1 do multi-idioma). O que muda aqui é que o servidor renderiza em
// espanhol de fato (LocaleProvider detecta /es pela URL, ver
// components/layout/LocaleProvider.tsx), não troca de texto no client — por
// isso essa página é indexável, diferente do resto do site hoje.
export const metadata: Metadata = {
  title: "Toroid do Brasil | Transformadores de Corriente, de Potencia e Inductores",
  description:
    "Transformadores de corriente, transformadores de potencia e inductores diseñados a partir de tu aplicación, no de un catálogo. Especificación verificada antes de producir, fabricación nacional con certificación ISO 9001.",
  alternates: {
    canonical: absoluteUrl("/es"),
    languages: {
      "pt-BR": absoluteUrl("/"),
      es: absoluteUrl("/es"),
      "x-default": absoluteUrl("/"),
    },
  },
};

export default function HomeEs() {
  return (
    <>
      <Hero />
      <ProvaInstitucional />
      <Produtos />
      <Segmentos />
      <Performance />
      <Fabrica />
      <CTA />
    </>
  );
}
