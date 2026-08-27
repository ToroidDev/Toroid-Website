import { InstitutionalPattern } from "./InstitutionalPattern";
import styles from "./ImagePlaceholder.module.css";

/**
 * Placeholder genérico para um espaço de imagem sem foto real ainda.
 * `legenda` é o texto entre colchetes descrevendo qual imagem entra ali
 * (ex.: "[imagem de núcleo toroidal em bancada]"), para orientar quem for
 * fotografar/enviar o material — não é copy final, nunca aparece sem estar
 * entre colchetes.
 */
export function ImagePlaceholder({ legenda }: { legenda: string }) {
  return (
    <div className={styles.placeholder}>
      <InstitutionalPattern opacity={0.4} className={styles.pattern} />
      <span className={styles.label}>{legenda}</span>
    </div>
  );
}
