import Script from "next/script";

// Sem "use client": GA4_MEASUREMENT_ID é lido no servidor (RootLayout) e
// embutido como string literal no HTML renderizado — o <Script> em si já
// sabe rodar no client sozinho, não precisa de um componente client aqui.
// Sem a env var configurada, não renderiza nada: nenhum script quebrado,
// nenhuma chamada a uma propriedade GA4 que não existe.
export function GoogleAnalytics() {
  const GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID;
  if (!GA4_MEASUREMENT_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
