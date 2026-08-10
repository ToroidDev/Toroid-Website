import { Hero } from "@/components/sections/Hero";
import { ProvaInstitucional } from "@/components/sections/ProvaInstitucional";
import { Produtos } from "@/components/sections/Produtos";
import { Segmentos } from "@/components/sections/Segmentos";
import { Performance } from "@/components/sections/Performance";
import { Fabrica } from "@/components/sections/Fabrica";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
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
