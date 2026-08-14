"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { whatsappLink, montarWhatsappLink } from "@/lib/whatsapp";
import { trackWhatsappClick } from "@/lib/analytics";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> & {
  children: ReactNode;
  // Mensagem pré-preenchida contextual (ex.: cita o nome de quem acabou de
  // enviar o formulário) em vez da mensagem estática padrão. Ver
  // components/forms/OrcamentoForm.tsx.
  mensagem?: string;
};

// Substitui todo <a href={whatsappLink} target="_blank" rel="noopener">
// direto pelo site: centraliza o link E o evento whatsapp_click (CLAUDE.md,
// "UTM e eventos de conversão") num único lugar, em vez de repetir em cada
// seção que abre WhatsApp.
export function WhatsAppLink({ children, onClick, mensagem, ...rest }: Props) {
  return (
    <a
      href={mensagem ? montarWhatsappLink(mensagem) : whatsappLink}
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
