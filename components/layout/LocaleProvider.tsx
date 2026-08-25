"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  DEFAULT_LOCALE,
  GEO_LOCALE_COOKIE,
  LOCALE_COOKIE,
  isLocale,
  localeFromLanguageTag,
  type Locale,
} from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

export function useLocale() {
  return useContext(LocaleContext);
}

function readCookie(nome: string): string | undefined {
  return document.cookie.match(new RegExp(`(?:^|; )${nome}=([^;]+)`))?.[1];
}

// /es (e futuramente /en) são páginas com mirror próprio, pensadas pra
// aparecer em busca no idioma — ver app/es/page.tsx. A URL passa a mandar no
// idioma ali: nem cookie de escolha explícita, nem navigator.language, nem
// geo sobrescrevem isso, porque o HTML que o Google indexa nessa rota tem
// que ser sempre o mesmo que um visitante vê.
function localeFromPathname(pathname: string | null): Locale | null {
  if (!pathname) return null;
  if (pathname === "/es" || pathname.startsWith("/es/")) return "es";
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return null;
}

const HTML_LANG: Record<Locale, string> = { pt: "pt-BR", es: "es", en: "en" };

// Sem Server Component lendo cookies()/headers(): isso tiraria a página
// inteira da geração estática (todo Server Component sob RootLayout vira
// dinâmico). Por isso a resolução final acontece só depois da hidratação —
// SSR sempre entrega a página em português, e aqui o texto troca no client.
// Existe sim um proxy.ts leve (ver arquivo na raiz), mas ele só grava um
// cookie de sugestão geográfica antes da requisição chegar aqui; não lê nada
// dentro da árvore React, então a página continua estática.
// usePathname() é client-side e não depende de cookies()/headers() do
// servidor, então usá-lo aqui não tira a rota da geração estática — é o
// mesmo motivo pelo qual o Nav já usa usePathname() sem problema.
// Ordem de prioridade: (1) rota fixa o idioma (/es, /en — ver acima), senão
// (2) escolha explícita salva via LanguageSwitcher, (3) idioma do navegador
// quando é pt/es/en, (4) sugestão geográfica do middleware (útil quando o
// navegador está em outro idioma, ex.: alemão), (5) DEFAULT_LOCALE. Fica no
// RootLayout (não só dentro do Footer) para Nav e Footer compartilharem o
// mesmo estado de idioma.
export function LocaleProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const routeLocale = localeFromPathname(pathname);
  const [locale, setLocaleState] = useState<Locale>(routeLocale ?? DEFAULT_LOCALE);

  useEffect(() => {
    if (routeLocale) {
      setLocaleState(routeLocale);
      return;
    }

    const escolhido = readCookie(LOCALE_COOKIE);
    if (isLocale(escolhido)) {
      setLocaleState(escolhido);
      return;
    }

    const doNavegador = localeFromLanguageTag(navigator.language);
    if (doNavegador) {
      setLocaleState(doNavegador);
      return;
    }

    const porGeo = readCookie(GEO_LOCALE_COOKIE);
    if (isLocale(porGeo)) {
      setLocaleState(porGeo);
      return;
    }

    setLocaleState(DEFAULT_LOCALE);
  }, [routeLocale]);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[locale];
  }, [locale]);

  const setLocale = (next: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000`;
    setLocaleState(next);
  };

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}
