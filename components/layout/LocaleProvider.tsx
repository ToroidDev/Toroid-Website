"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, localeFromLanguageTag, type Locale } from "@/lib/i18n";

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

function readCookieLocale(): string | undefined {
  return document.cookie.match(/(?:^|; )toroid_locale=([^;]+)/)?.[1];
}

// Sem proxy/middleware: ler cookies()/headers() num Server Component tiraria
// a página inteira da geração estática (todo Server Component sob RootLayout
// vira dinâmico). Por isso a resolução acontece só depois da hidratação —
// SSR sempre entrega a página em português, e aqui, se o visitante já tem
// idioma salvo ou o navegador está em es/en, o texto troca no client.
// Fica no RootLayout (não só dentro do Footer) para Nav e Footer
// compartilharem o mesmo estado de idioma.
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = readCookieLocale();
    if (isLocale(saved)) {
      setLocaleState(saved);
      return;
    }
    setLocaleState(localeFromLanguageTag(navigator.language));
  }, []);

  const setLocale = (next: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000`;
    setLocaleState(next);
  };

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}
