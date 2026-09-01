import type { Locale } from "./i18n";

// Número confirmado: (41) 3035-8258. Continua vindo de env var (nunca hardcodado
// além deste fallback), como o resto do projeto exige.
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "554130358258";

export function montarWhatsappLink(mensagem: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
}

// Mensagem em um idioma só (páginas que existem apenas em português, como as
// de aplicação) ou nos três, quando a CTA vive num componente compartilhado
// que o /es também renderiza.
export type MensagemWhatsapp = string | Record<Locale, string>;

// A mensagem pré-preenchida é o único contexto que viaja junto do contato:
// wa.me aceita só o parâmetro `text`. Por isso ela diz, em linguagem de
// negócio, de onde a pessoa veio e o que ela quer (família de produto,
// segmento, prazo, homologação), e não mais o path da página com o UTM
// colado no fim. Dois motivos: quem clica lê esse texto antes de enviar, e
// "origem: /transformador-de-corrente | utm_source=..." era ruído para o
// visitante e não dizia nada ao comercial sobre o pedido. A medição de canal
// não depende disso: o evento whatsapp_click do GA4 continua levando o UTM de
// último toque (lib/analytics.ts).
export const MENSAGEM_PADRAO: Record<Locale, string> = {
  pt: "Olá! Vim pelo site da Toroid e gostaria de falar com o time.",
  es: "¡Hola! Vine por el sitio de Toroid y me gustaría hablar con el equipo.",
  en: "Hi! I came from the Toroid website and I would like to talk to your team.",
};

export function resolverMensagem(mensagem: MensagemWhatsapp | undefined, locale: Locale): string {
  if (!mensagem) return MENSAGEM_PADRAO[locale];
  return typeof mensagem === "string" ? mensagem : mensagem[locale];
}
