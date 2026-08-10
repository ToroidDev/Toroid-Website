import type { Metadata } from "next";
import { Montserrat, Karla } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
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
  metadataBase: new URL("https://toroid.com.br"),
  title: "Toroid do Brasil | Transformadores Toroidais, TCs e Indutores",
  description:
    "Transformadores toroidais, transformadores de corrente e indutores projetados a partir da sua aplicação. Especificação conferida antes de produzir, fabricação nacional com ISO 9001.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${karla.variable}`}>
      <body>
        <div style={{ position: "relative" }}>
          <Nav />
          {children}
          <Footer />
          <WhatsAppButton />
        </div>
      </body>
    </html>
  );
}
