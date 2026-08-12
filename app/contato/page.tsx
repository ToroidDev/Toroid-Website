import type { Metadata } from "next";
import { ContatoHero } from "@/components/contato/ContatoHero";
import { ContatoInfo } from "@/components/contato/ContatoInfo";
import { ContatoMapa } from "@/components/contato/ContatoMapa";

export const metadata: Metadata = {
  title: "Fale conosco | Toroid do Brasil",
  description:
    "Contato da Toroid do Brasil: vendas, engenharia, telefone, WhatsApp e endereço da fábrica em São José dos Pinhais, PR.",
  alternates: { canonical: "/contato" },
};

// Schema.org Organization vem do RootLayout (components/seo/OrganizationSchema.tsx),
// aplicado em todas as páginas — não duplicar aqui.
export default function ContatoPage() {
  return (
    <>
      <ContatoHero />
      <ContatoInfo />
      <ContatoMapa />
    </>
  );
}
