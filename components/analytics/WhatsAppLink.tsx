"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { montarWhatsappLink, resolverMensagem, type MensagemWhatsapp } from "@/lib/whatsapp";
import { useLocale } from "@/components/layout/LocaleProvider";
import { trackWhatsappClick } from "@/lib/analytics";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> & {
  children: ReactNode;
  // Mensagem pré-preenchida da situação em que o clique aconteceu: a família
  // de produto da página, o segmento, o pedido que a CTA ao lado faz, o nome
  // de quem acabou de enviar o formulário. Sem ela, cai na MENSAGEM_PADRAO,
  // que é o certo só nos pontos sem contexto nenhum (botão flutuante, rodapé,
  // linha de contato). String quando a página existe só em português, objeto
  // por idioma quando o componente também é renderizado em /es.
  mensagem?: MensagemWhatsapp;
};

// Substitui todo <a href={whatsappLink} target="_blank" rel="noopener">
// direto pelo site: centraliza o link E o evento whatsapp_click (CLAUDE.md,
// "UTM e eventos de conversão") num único lugar, em vez de repetir em cada
// seção que abre WhatsApp.
export function WhatsAppLink({ children, onClick, mensagem, ...rest }: Props) {
  const { locale } = useLocale();
  const href = montarWhatsappLink(resolverMensagem(mensagem, locale));

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
