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
// por isso o cálculo mora aqui e não em lib/whatsapp.ts. utm_source/utm_medium
// entram aqui porque são o dado que de fato identifica o canal (LinkedIn,
// Instagram, Google Ads...) — só utm_campaign, como estava antes, não diz de
// onde veio o clique nem sobrevive a um link sem campanha nomeada.
function origemAtual(): string {
  const path = window.location.pathname;
  const { lastTouch } = obterAtribuicaoAtual();
  const utms = [
    lastTouch?.utm_source ? `utm_source=${lastTouch.utm_source}` : null,
    lastTouch?.utm_medium ? `utm_medium=${lastTouch.utm_medium}` : null,
    lastTouch?.utm_campaign ? `utm_campaign=${lastTouch.utm_campaign}` : null,
  ].filter((valor): valor is string => valor !== null);
  if (utms.length === 0) return `origem: ${path}`;
  return `origem: ${path} | ${utms.join(" ")}`;
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
