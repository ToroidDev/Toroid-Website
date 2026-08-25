// Fase 1 do multi-idioma: só strings de UI fixas (não conteúdo do WordPress).
// Sem rota por locale de propósito — ver CLAUDE.md/i18n. Isso significa que
// nenhuma página fica dinâmica por causa disso: a resolução final de idioma
// acontece inteira no client (cookie + navigator.language), nunca lendo
// cookies()/headers() num Server Component, o que tiraria a página da
// geração estática. O único componente de borda é proxy.ts, na raiz do
// projeto (convenção "proxy", ex-"middleware", a partir do Next.js 16): ele
// só grava um cookie de sugestão geográfica (GEO_LOCALE_COOKIE) quando o
// navegador está num idioma fora de pt/es/en — não lê nada dentro da árvore
// React, então isso não afeta a geração estática.

export const LOCALES = ["pt", "es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt";
export const LOCALE_COOKIE = "toroid_locale";
// Cookie separado, gravado pelo middleware a partir do país do visitante
// (x-vercel-ip-country) — nunca a escolha explícita do LanguageSwitcher, que
// sempre vive só em LOCALE_COOKIE. Serve de fallback quando o idioma do
// navegador não é pt/es/en (ver localeFromLanguageTag e LocaleProvider).
export const GEO_LOCALE_COOKIE = "toroid_geo_locale";

// Países de língua espanhola cobertos pelo fallback geográfico — fora desses
// e de BR/PT, o inglês é o idioma de maior alcance (ver middleware.ts).
const PAISES_ESPANHOL = new Set([
  "ES", "MX", "AR", "CO", "PE", "VE", "CL", "EC", "GT", "CU", "BO", "DO", "HN",
  "PY", "SV", "NI", "CR", "PA", "UY", "GQ",
]);

export function localeFromCountry(country: string | undefined | null): Locale {
  if (!country) return "en";
  const codigo = country.toUpperCase();
  if (codigo === "BR" || codigo === "PT") return "pt";
  if (PAISES_ESPANHOL.has(codigo)) return "es";
  return "en";
}

// Só a home tem página espelho em espanhol hoje (ver app/es/page.tsx) — SSR
// real, não troca de texto no client, pra aparecer em busca no idioma. Cada
// entrada nova aqui é uma página espelho nova. Sem entrada pra "en" ainda:
// nenhuma rota em inglês existe de fato.
const PAGINAS_ESPELHO: Record<string, Partial<Record<Locale, string>>> = {
  "/": { pt: "/", es: "/es" },
  "/es": { pt: "/", es: "/es" },
  "/transformador-de-corrente": { pt: "/transformador-de-corrente", es: "/es/transformador-de-corrente" },
  "/es/transformador-de-corrente": { pt: "/transformador-de-corrente", es: "/es/transformador-de-corrente" },
  "/transformador-de-potencia": { pt: "/transformador-de-potencia", es: "/es/transformador-de-potencia" },
  "/es/transformador-de-potencia": { pt: "/transformador-de-potencia", es: "/es/transformador-de-potencia" },
  "/transformadores-toroidais": { pt: "/transformadores-toroidais", es: "/es/transformadores-toroidais" },
  "/es/transformadores-toroidais": { pt: "/transformadores-toroidais", es: "/es/transformadores-toroidais" },
  "/indutores-filtros-e-chokes": { pt: "/indutores-filtros-e-chokes", es: "/es/indutores-filtros-e-chokes" },
  "/es/indutores-filtros-e-chokes": { pt: "/indutores-filtros-e-chokes", es: "/es/indutores-filtros-e-chokes" },
};

// Devolve a URL real da página nesse idioma, ou null se não existe espelho
// pra essa rota — nesse caso o LanguageSwitcher cai para troca de texto no
// client em vez de navegar pra uma URL que não existe.
export function localizedPath(pathname: string, target: Locale): string | null {
  return PAGINAS_ESPELHO[pathname]?.[target] ?? null;
}

export const LOCALE_FLAGS: Record<Locale, { flag: string; label: string }> = {
  pt: { flag: "🇧🇷", label: "Português" },
  es: { flag: "🇪🇸", label: "Español" },
  en: { flag: "🇺🇸", label: "English" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

// navigator.language vem como "es-AR", "en-US" etc. — usamos só o prefixo.
// Devolve null (em vez de cair no DEFAULT_LOCALE) quando o navegador está num
// idioma fora de pt/es/en, para o LocaleProvider poder tentar o fallback
// geográfico antes de desistir e usar o padrão.
export function localeFromLanguageTag(tag: string | undefined | null): Locale | null {
  const prefix = tag?.split("-")[0];
  return isLocale(prefix) ? prefix : null;
}

type FooterDictionary = {
  about: string;
  contato: string;
  redes: string;
  tagline: string;
  direitos: string;
  cookiePrefs: string;
  idioma: string;
};

type NavDictionary = {
  irParaHome: string;
  produtos: string;
  sobre: string;
  blog: string;
  contato: string;
  orcamento: string;
  abrirMenu: string;
  fecharMenu: string;
  principal: string;
};

export const navDictionary: Record<Locale, NavDictionary> = {
  pt: {
    irParaHome: "Toroid do Brasil, ir para a página inicial",
    produtos: "Produtos",
    sobre: "Sobre",
    blog: "Conteúdo Técnico",
    contato: "Contato",
    orcamento: "Solicitar Orçamento",
    abrirMenu: "Abrir menu",
    fecharMenu: "Fechar menu",
    principal: "Principal",
  },
  es: {
    irParaHome: "Toroid do Brasil, ir a la página de inicio",
    produtos: "Productos",
    sobre: "Nosotros",
    blog: "Contenido técnico",
    contato: "Contacto",
    orcamento: "Solicitar Presupuesto",
    abrirMenu: "Abrir menú",
    fecharMenu: "Cerrar menú",
    principal: "Principal",
  },
  en: {
    irParaHome: "Toroid do Brasil, go to homepage",
    produtos: "Products",
    sobre: "About",
    blog: "Technical Content",
    contato: "Contact",
    orcamento: "Request a Quote",
    abrirMenu: "Open menu",
    fecharMenu: "Close menu",
    principal: "Main",
  },
};

export const footerDictionary: Record<Locale, FooterDictionary> = {
  pt: {
    about:
      "Transformadores de corrente, transformadores de potência e indutores sob medida. Fabricação nacional, ISO 9001.",
    contato: "Contato",
    redes: "Redes",
    tagline: "Transformando energia e vidas.",
    direitos: "Todos os direitos reservados",
    cookiePrefs: "Preferências de cookies",
    idioma: "Idioma",
  },
  es: {
    about:
      "Transformadores de corriente, transformadores de potencia e inductores a medida. Fabricación nacional, ISO 9001.",
    contato: "Contacto",
    redes: "Redes",
    tagline: "Transformando energía y vidas.",
    direitos: "Todos los derechos reservados",
    cookiePrefs: "Preferencias de cookies",
    idioma: "Idioma",
  },
  en: {
    about:
      "Current transformers, power transformers and custom inductors. Made in Brazil, ISO 9001 certified.",
    contato: "Contact",
    redes: "Social",
    tagline: "Transforming energy and lives.",
    direitos: "All rights reserved",
    cookiePrefs: "Cookie preferences",
    idioma: "Language",
  },
};
