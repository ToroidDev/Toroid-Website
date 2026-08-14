import Script from "next/script";

// Sem "use client", mesmo motivo do GoogleAnalytics.tsx: GA4_MEASUREMENT_ID é
// lido no servidor, e sem a env var configurada não há gtag.js carregando,
// então não faz sentido setar um estado de consentimento para nada.
//
// beforeInteractive porque o padrão do Consent Mode v2 (tudo negado) precisa
// existir no dataLayer antes do gtag.js do GoogleAnalytics.tsx processar
// qualquer comando 'config' (esse roda em afterInteractive, então a ordem já
// fica garantida pelas duas strategies, sem depender da ordem dos componentes
// no JSX).
export function ConsentDefaultScript() {
  const GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID;
  if (!GA4_MEASUREMENT_ID) return null;

  return (
    <Script id="consent-default" strategy="beforeInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){ window.dataLayer.push(arguments); }
        window.gtag = window.gtag || gtag;

        gtag('consent', 'default', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          wait_for_update: 500
        });

        try {
          var saved = localStorage.getItem('toroid-consent');
          if (saved) {
            var parsed = JSON.parse(saved);
            gtag('consent', 'update', {
              analytics_storage: parsed.analytics ? 'granted' : 'denied'
            });
          }
        } catch (e) {}
      `}
    </Script>
  );
}
