"use client";

import { EVENTO_ABRIR_CONSENTIMENTO } from "@/lib/consent";
import { useLocale } from "@/components/layout/LocaleProvider";
import { footerDictionary } from "@/lib/i18n";

// Único motivo de "use client" aqui: reabrir o banner de cookies dispara um
// evento no window. O resto do Footer continua Server Component.
export function CookieSettingsLink({ className }: { className?: string }) {
  const { locale } = useLocale();

  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(EVENTO_ABRIR_CONSENTIMENTO))}
    >
      {footerDictionary[locale].cookiePrefs}
    </button>
  );
}
