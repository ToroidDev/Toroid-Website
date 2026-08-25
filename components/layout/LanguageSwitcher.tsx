"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/layout/LocaleProvider";
import { LOCALES, LOCALE_FLAGS, localizedPath } from "@/lib/i18n";
import styles from "./LanguageSwitcher.module.css";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();

  return (
    <div className={styles.switcher} role="group" aria-label="Português / Español / English">
      {LOCALES.map((code) => {
        const isActive = locale === code;
        // Existe página espelho de verdade pra esse idioma nessa rota (ex.:
        // / → /es): navega, o que também deixa um link interno pro Google
        // achar a página traduzida. Sem espelho: cai pra troca de texto no
        // client, igual antes.
        const href = pathname ? localizedPath(pathname, code) : null;

        if (href) {
          return (
            <Link
              key={code}
              href={href}
              className={styles.flag}
              aria-current={isActive ? "page" : undefined}
              aria-label={LOCALE_FLAGS[code].label}
              title={LOCALE_FLAGS[code].label}
              // Precisa sincronizar cookie/estado aqui mesmo indo navegar:
              // (1) se href já é a rota atual (ex.: em "/" mostrando espanhol
              // por cookie salvo, clicar "pt" aponta pra "/" de novo), o
              // Next não navega, e sem isso o clique não fazia nada; (2) ao
              // navegar de /es pra /, sem isto o cookie antigo (es) ficava
              // valendo e a página de destino voltava a mostrar espanhol
              // depois de hidratar.
              onClick={() => setLocale(code)}
            >
              <span aria-hidden="true">{LOCALE_FLAGS[code].flag}</span>
            </Link>
          );
        }

        return (
          <button
            key={code}
            type="button"
            className={styles.flag}
            aria-pressed={isActive}
            aria-label={LOCALE_FLAGS[code].label}
            title={LOCALE_FLAGS[code].label}
            onClick={() => setLocale(code)}
          >
            <span aria-hidden="true">{LOCALE_FLAGS[code].flag}</span>
          </button>
        );
      })}
    </div>
  );
}
