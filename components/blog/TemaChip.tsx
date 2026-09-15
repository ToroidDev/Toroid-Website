import type { Tema } from "@/lib/blog";
import styles from "./TemaChip.module.css";

/**
 * Etiqueta de família do post. `<span>`, nunca `<a>`: mora dentro de um card
 * que já é um link inteiro (ver lib/blog.ts, comentário do TEMAS).
 * `tone="dark"` é a variante para quando o chip cai sobre a foto do post, com
 * fundo sólido em vez de tinta translúcida. `tone="texto"` tira a pílula
 * inteira (fundo, borda, padding) e deixa só a escrita na cor da família,
 * usado na lateral "Leia também", onde o badge competia com o título.
 */
export function TemaChip({ tema, tone = "light" }: { tema: Tema; tone?: "light" | "dark" | "texto" }) {
  return (
    <span className={`${styles.chip} ${styles[tema.id]} ${tone === "dark" ? styles.dark : ""} ${tone === "texto" ? styles.texto : ""}`}>
      {tema.rotulo}
    </span>
  );
}
