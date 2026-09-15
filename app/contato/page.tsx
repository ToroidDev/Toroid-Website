import type { Metadata } from "next";
import { ContatoHero } from "@/components/contato/ContatoHero";
import { ContatoInfo } from "@/components/contato/ContatoInfo";
import { ContatoMapa } from "@/components/contato/ContatoMapa";
import { metadataOg } from "@/lib/seo";

const TITULO = "Fale conosco | Toroid do Brasil";
const DESCRICAO =
  "Contato da Toroid do Brasil: vendas, engenharia, telefone, WhatsApp e endereço da fábrica em São José dos Pinhais, PR.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/contato" },
  ...metadataOg({ title: TITULO, description: DESCRICAO, path: "/contato" }),
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
