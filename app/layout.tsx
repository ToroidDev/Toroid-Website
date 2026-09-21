import type { Metadata } from "next";
import { Montserrat, Karla } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { LocaleProvider } from "@/components/layout/LocaleProvider";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { AttributionCapture } from "@/components/layout/AttributionCapture";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ConsentDefaultScript } from "@/components/analytics/ConsentDefaultScript";
import { CookieConsentBanner } from "@/components/layout/CookieConsentBanner";
import { SITE_URL, TITULO_PADRAO, DESCRICAO_PADRAO, metadataOg } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

// Montserrat só nos títulos (600/700). O peso 400 saiu porque corpo de texto,
// label, botão e nav passaram para a Karla, e isso paga boa parte do custo da
// segunda família em bytes baixados.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

// Fonte variável: um arquivo cobre de 200 a 800, então não declaramos lista de weight.
const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITULO_PADRAO,
  description: DESCRICAO_PADRAO,
  ...metadataOg({ title: TITULO_PADRAO, description: DESCRICAO_PADRAO, path: "/" }),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${karla.variable}`}>
      <body>
        <a href="#conteudo-principal" className="pular-para-conteudo">
          Pular para o conteúdo
        </a>
        <ConsentDefaultScript />
        <GoogleAnalytics />
        <OrganizationSchema />
        <div style={{ position: "relative" }}>
          <AttributionCapture />
          <LocaleProvider>
            <Nav />
            <main id="conteudo-principal">{children}</main>
            <ConditionalFooter>
              <Footer />
            </ConditionalFooter>
            <WhatsAppButton />
          </LocaleProvider>
        </div>
        <CookieConsentBanner />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
