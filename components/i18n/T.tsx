"use client";

import { useLocale } from "@/components/layout/LocaleProvider";

type TranslatedTextProps = {
  pt: string;
  es: string;
  en: string;
};

// Fase 1 do multi-idioma (só UI fixa, ver lib/i18n.ts): tradução inline, ao
// lado do texto em português, em vez de um dicionário central por página —
// mais fácil de manter quando o volume de strings cresce por vários
// componentes. Client boundary mínimo: o Server Component ao redor (seção,
// página) continua estático, só este fragmento de texto hidrata.
export function T({ pt, es, en }: TranslatedTextProps) {
  const { locale } = useLocale();
  if (locale === "es") return <>{es}</>;
  if (locale === "en") return <>{en}</>;
  return <>{pt}</>;
}
