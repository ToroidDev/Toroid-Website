// Número confirmado: (41) 3035-8263. Continua vindo de env var (nunca hardcodado
// além deste fallback), como o resto do projeto exige.
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "554130358263";
const WHATSAPP_MESSAGE =
  "Ola! Vim pelo site da Toroid (origem: site-home | utm_source=site&utm_medium=botao-flutuante&utm_campaign=orcamento) e gostaria de falar com o time.";

export function montarWhatsappLink(mensagem: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
}

export const whatsappLink = montarWhatsappLink(WHATSAPP_MESSAGE);
