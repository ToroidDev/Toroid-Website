import { obterAtribuicaoAtual } from "./attribution";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Mesmos parâmetros de UTM capturados em lib/attribution.ts (último toque),
// anexados a todo evento de conversão — é o que permite comparar Google Ads
// e GA4 sem furo de dado depois da migração.
function utmDoUltimoToque(): Record<string, string> {
  const { lastTouch } = obterAtribuicaoAtual();
  if (!lastTouch) return {};
  const params: Record<string, string> = {};
  if (lastTouch.utm_source) params.utm_source = lastTouch.utm_source;
  if (lastTouch.utm_medium) params.utm_medium = lastTouch.utm_medium;
  if (lastTouch.utm_campaign) params.utm_campaign = lastTouch.utm_campaign;
  if (lastTouch.utm_term) params.utm_term = lastTouch.utm_term;
  if (lastTouch.utm_content) params.utm_content = lastTouch.utm_content;
  return params;
}

// Sem GA4_MEASUREMENT_ID configurado, components/analytics/GoogleAnalytics.tsx
// não carrega o gtag.js e window.gtag nunca existe — as duas funções abaixo
// então não fazem nada, silenciosamente, em vez de quebrar o clique/submit
// real do visitante.
export function trackWhatsappClick(): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "whatsapp_click", utmDoUltimoToque());
}

export function trackFormSubmit(): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "form_submit", utmDoUltimoToque());
}
