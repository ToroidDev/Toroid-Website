// Fase 1 do multi-idioma: só strings de UI fixas (não conteúdo do WordPress).
// Sem rota por locale de propósito — ver CLAUDE.md/i18n. Isso significa que
// nenhuma página fica dinâmica por causa disso: a resolução de idioma acontece
// inteira no client (cookie + navigator.language), nunca lendo cookies()/
// headers() num Server Component, o que tiraria a página da geração estática.

export const LOCALES = ["pt", "es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt";
export const LOCALE_COOKIE = "toroid_locale";

export const LOCALE_FLAGS: Record<Locale, { flag: string; label: string }> = {
  pt: { flag: "🇧🇷", label: "Português" },
  es: { flag: "🇪🇸", label: "Español" },
  en: { flag: "🇺🇸", label: "English" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

// navigator.language vem como "es-AR", "en-US" etc. — usamos só o prefixo.
export function localeFromLanguageTag(tag: string | undefined | null): Locale {
  const prefix = tag?.split("-")[0];
  return isLocale(prefix) ? prefix : DEFAULT_LOCALE;
}

type FooterDictionary = {
  about: string;
  contato: string;
  redes: string;
  selos: string;
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
    blog: "Blog",
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
    blog: "Blog",
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
    blog: "Blog",
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
    selos: "Selos",
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
    selos: "Certificaciones",
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
    selos: "Certifications",
    tagline: "Transforming energy and lives.",
    direitos: "All rights reserved",
    cookiePrefs: "Cookie preferences",
    idioma: "Language",
  },
};
