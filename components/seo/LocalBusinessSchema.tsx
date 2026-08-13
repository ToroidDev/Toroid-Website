import { absoluteUrl, SITE_URL } from "@/lib/seo";

// Só montado em /quem-somos (não no RootLayout): distinto do Organization
// sitewide (components/seo/OrganizationSchema.tsx), que continua único e
// global. Horário de funcionamento confirmado no conteúdo público da Toroid
// do Brasil (seg. a sex., 7h30 às 17h30).
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": absoluteUrl("/quem-somos#local-business"),
  name: "Toroid do Brasil",
  legalName: "Indústria e Comércio de Transformadores Toroidais Ltda",
  url: SITE_URL,
  image: absoluteUrl("/images/fachada-placa.webp"),
  telephone: "+554130358282",
  email: "vendas@toroid.com.br",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Antônio Bianchetti, 541 - Iná",
    addressLocality: "São José dos Pinhais",
    addressRegion: "PR",
    postalCode: "83065-370",
    addressCountry: "BR",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:30",
      closes: "17:30",
    },
  ],
  sameAs: [
    "https://www.linkedin.com/company/toroidbrasil/",
    "https://www.instagram.com/toroidbrasil/",
    "https://www.youtube.com/@toroiddobrasil3985",
  ],
};

export function LocalBusinessSchema() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />;
}
