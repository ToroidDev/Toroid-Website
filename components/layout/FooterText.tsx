"use client";

import { useLocale } from "@/components/layout/LocaleProvider";
import { footerDictionary } from "@/lib/i18n";

export function FooterText({ k }: { k: keyof (typeof footerDictionary)["pt"] }) {
  const { locale } = useLocale();
  return <>{footerDictionary[locale][k]}</>;
}
