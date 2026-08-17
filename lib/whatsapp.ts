// Número confirmado: (41) 3035-8258. Continua vindo de env var (nunca hardcodado
// além deste fallback), como o resto do projeto exige.
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "554130358258";

export function montarWhatsappLink(mensagem: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
}

// wa.me só aceita o parâmetro `text` — não existe UTM real de URL nesse link,
// por isso a origem de campanha vai embutida como texto na própria mensagem
// (CLAUDE.md, "UTM e eventos de conversão"). `origem` é montado por
// components/analytics/WhatsAppLink.tsx a partir do path da página atual e do
// UTM de último toque real (lib/attribution.ts) — nunca um texto fixo, senão
// toda CTA do site manda a mesma origem falsa independente de onde o clique
// aconteceu.
export function montarMensagemPadrao(origem: string): string {
  return `Olá! Vim pelo site da Toroid (${origem}) e gostaria de falar com o time.`;
}
