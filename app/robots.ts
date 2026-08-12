import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Política de crawler de IA definida pela diretoria (ver ROADMAP.md):
// permitir bot de busca/resposta que cita a fonte (OAI-SearchBot,
// Claude-SearchBot, Claude-User, PerplexityBot, Google-Extended), bloquear
// bot de treinamento sem link de volta (GPTBot, ClaudeBot). Consistente com
// o foco em AEO/FAQPage já documentado em CLAUDE.md.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "*", allow: "/", disallow: ["/wp-admin", "/wp-json"] },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
