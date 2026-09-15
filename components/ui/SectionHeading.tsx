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
  as: Tag = "h2",
}: {
  eyebrow: ReactNode;
  children: ReactNode;
  lead?: ReactNode;
  tone?: "light" | "dark";
  // Só /produtos precisa de "h1" hoje: é a única página cujo primeiro
  // heading visível é este componente, sem hero próprio antes dele.
  as?: "h1" | "h2";
}) {
  return (
    <div className={tone === "dark" ? `${styles.wrap} ${styles.dark}` : styles.wrap}>
      <p className={styles.eyebrow}>
        <span className={styles.rule} aria-hidden="true" />
        {eyebrow}
      </p>
      <Tag className={styles.heading}>{children}</Tag>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </div>
  );
}
