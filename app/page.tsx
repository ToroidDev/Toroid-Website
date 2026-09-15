import type { Metadata } from "next";
import { HeroStack } from "@/components/sections/HeroStack";
import { Produtos } from "@/components/sections/Produtos";
import { Segmentos } from "@/components/sections/Segmentos";
// import { ProvaGoogle } from "@/components/sections/ProvaGoogle"; // ver aviso no arquivo: falta confirmar nota/total de avaliações reais antes de ligar
import { Performance } from "@/components/sections/Performance";
import { Fabrica } from "@/components/sections/Fabrica";
import { CTA } from "@/components/sections/CTA";
import { absoluteUrl } from "@/lib/seo";

// Só declara `alternates`: título e descrição continuam vindo do RootLayout
// (app/layout.tsx), o Metadata API mescla por campo, não substitui o objeto
// inteiro. hreflang aponta pro espelho em espanhol (ver app/es/page.tsx).
export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl("/"),
    languages: {
      "pt-BR": absoluteUrl("/"),
      es: absoluteUrl("/es"),
      "x-default": absoluteUrl("/"),
    },
  },
};

export default function Home() {
  return (
    <>
      <HeroStack />
      <Produtos />
      <Segmentos />
      {/* <ProvaGoogle /> */}
      <Performance />
      <Fabrica />
      <CTA />
    </>
  );
}
