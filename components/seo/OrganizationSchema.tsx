import { absoluteUrl, SITE_URL } from "@/lib/seo";

// Componente reutilizável — montado uma única vez no RootLayout (app/layout.tsx),
// não em cada página, para não duplicar o mesmo bloco JSON-LD. Dados
// confirmados: nome legal, endereço e telefones (ver ROADMAP.md).
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Toroid do Brasil",
  legalName: "Indústria e Comércio de Transformadores Toroidais Ltda",
  url: SITE_URL,
  logo: absoluteUrl("/images/logo-toroid-trim.png"),
  description:
    "Fabricante de transformadores toroidais, transformadores de corrente e indutores sob medida. Fabricação nacional, ISO 9001 certificada pela RINA.",
  telephone: "+554130358282",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+554130358263",
      contactType: "sales",
      areaServed: "BR",
    },
  ],
  email: "vendas@toroid.com.br",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Antônio Bianchetti, 541 - Iná",
    addressLocality: "São José dos Pinhais",
    addressRegion: "PR",
    postalCode: "83065-370",
    addressCountry: "BR",
  },
  sameAs: [
    "https://www.linkedin.com/company/toroidbrasil/",
    "https://www.instagram.com/toroidbrasil/",
    "https://www.youtube.com/@toroiddobrasil3985",
  ],
};

export function OrganizationSchema() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />;
}
