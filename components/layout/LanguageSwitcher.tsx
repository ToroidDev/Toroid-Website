"use client";

import { useLocale } from "@/components/layout/LocaleProvider";
import { LOCALES, LOCALE_FLAGS } from "@/lib/i18n";
import styles from "./LanguageSwitcher.module.css";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className={styles.switcher} role="group" aria-label="Português / Español / English">
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          className={styles.flag}
          aria-pressed={locale === code}
          aria-label={LOCALE_FLAGS[code].label}
          title={LOCALE_FLAGS[code].label}
          onClick={() => setLocale(code)}
        >
          <span aria-hidden="true">{LOCALE_FLAGS[code].flag}</span>
        </button>
      ))}
    </div>
  );
}
