// TODO: confirmar número real e texto padrão da mensagem (UTM de origem já embutido).
// Placeholder de exemplo mantido de propósito. Ver AGENTS/CLAUDE.md.
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "5541999999999";
const WHATSAPP_MESSAGE =
  "Ola! Vim pelo site da Toroid (origem: site-home | utm_source=site&utm_medium=botao-flutuante&utm_campaign=orcamento) e gostaria de falar com um engenheiro.";

export const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
