import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

// O par eyebrow → título → lead estava duplicado com valores quase idênticos em
// cinco módulos CSS. Centralizado aqui, e com `tone` para a seção invertida em
// azul profundo poder reusar exatamente a mesma composição.
export function SectionHeading({
  eyebrow,
  children,
  lead,
  tone = "light",
}: {
  eyebrow: ReactNode;
  children: ReactNode;
  lead?: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div className={tone === "dark" ? `${styles.wrap} ${styles.dark}` : styles.wrap}>
      <p className={styles.eyebrow}>
        <span className={styles.rule} aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className={styles.heading}>{children}</h2>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </div>
  );
}
