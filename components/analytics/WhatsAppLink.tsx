"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { whatsappLink } from "@/lib/whatsapp";
import { trackWhatsappClick } from "@/lib/analytics";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> & {
  children: ReactNode;
};

// Substitui todo <a href={whatsappLink} target="_blank" rel="noopener">
// direto pelo site: centraliza o link E o evento whatsapp_click (CLAUDE.md,
// "UTM e eventos de conversão") num único lugar, em vez de repetir em cada
// seção que abre WhatsApp.
export function WhatsAppLink({ children, onClick, ...rest }: Props) {
  return (
    <a
      href={whatsappLink}
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
