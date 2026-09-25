"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { linkSocial, type RedeSocial } from "@/lib/social";
import { trackSocialClick } from "@/lib/analytics";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> & {
  rede: RedeSocial;
  contexto: string;
  children: ReactNode;
};

// Substitui todo <a href="https://www.linkedin.com/..."> direto pelo site:
// centraliza a URL de cada rede, o UTM (lib/social.ts) e o evento GA4
// social_click num único lugar, em vez de repetir em cada seção que linka
// pro LinkedIn/Instagram/YouTube.
export function SocialLink({ rede, contexto, children, onClick, ...rest }: Props) {
  return (
    <a
      href={linkSocial(rede, contexto)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        trackSocialClick(rede, contexto);
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
