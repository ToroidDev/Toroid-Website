import type { Metadata } from "next";

export const SITE_URL = "https://toroid.com.br";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

// Foto real do chão de fábrica (não um card desenhado) — stopgap: melhor que
// nenhum preview ao compartilhar link, mas um card com logo/título é upgrade
// futuro, não bloqueante.
const OG_IMAGEM_PADRAO = { url: absoluteUrl("/og-image.jpg"), width: 1200, height: 630, alt: "Toroid do Brasil" };

/**
 * Open Graph + Twitter Card, espelhando o title/description já declarado no
 * `metadata` de cada página. Sempre inclui `images` explicitamente porque o
 * Next faz merge raso de `openGraph` entre segmentos — se a página define
 * `openGraph` sem `images`, o valor do layout raiz é perdido, não herdado.
 */
export function metadataOg(opts: {
  title: string;
  description: string;
  path: string;
  locale?: "pt_BR" | "es_ES";
  imagem?: typeof OG_IMAGEM_PADRAO;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const imagens = [opts.imagem ?? OG_IMAGEM_PADRAO];
  return {
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: absoluteUrl(opts.path),
      siteName: "Toroid do Brasil",
      locale: opts.locale ?? "pt_BR",
      type: "website",
      images: imagens,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: imagens.map((img) => img.url),
    },
  };
}
