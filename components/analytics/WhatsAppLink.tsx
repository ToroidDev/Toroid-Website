"use client";

import { useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from "react";
import { montarWhatsappLink, montarMensagemPadrao } from "@/lib/whatsapp";
import { obterAtribuicaoAtual } from "@/lib/attribution";
import { trackWhatsappClick } from "@/lib/analytics";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> & {
  children: ReactNode;
  // Mensagem pré-preenchida contextual (ex.: cita o nome de quem acabou de
  // enviar o formulário) em vez da mensagem padrão automática. Ver
  // components/forms/OrcamentoForm.tsx.
  mensagem?: string;
};

// Origem real da CTA: path da página + UTM de último toque, se a visita
// carregou algum (lib/attribution.ts). Client-only (lê window/sessionStorage),
// por isso o cálculo mora aqui e não em lib/whatsapp.ts.
function origemAtual(): string {
  const path = window.location.pathname;
  const { lastTouch } = obterAtribuicaoAtual();
  if (lastTouch?.utm_campaign) {
    return `origem: ${path} | utm_campaign=${lastTouch.utm_campaign}`;
  }
  return `origem: ${path}`;
}

// Substitui todo <a href={whatsappLink} target="_blank" rel="noopener">
// direto pelo site: centraliza o link E o evento whatsapp_click (CLAUDE.md,
// "UTM e eventos de conversão") num único lugar, em vez de repetir em cada
// seção que abre WhatsApp. Sem `mensagem` explícita, a origem (path + UTM de
// último toque) é lida depois da montagem no client e injetada no href — por
// isso o fallback inicial (SSR/primeira pintura) usa só "site" até o efeito
// rodar; não há CLS porque é só o destino do link, não conteúdo visível.
export function WhatsAppLink({ children, onClick, mensagem, ...rest }: Props) {
  const [href, setHref] = useState(() =>
    montarWhatsappLink(mensagem ?? montarMensagemPadrao("site")),
  );

  useEffect(() => {
    if (mensagem) return;
    setHref(montarWhatsappLink(montarMensagemPadrao(origemAtual())));
  }, [mensagem]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      onClick={(event) => {
        trackWhatsappClick();
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
