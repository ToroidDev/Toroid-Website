import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import styles from "./MissaoDestaque.module.css";

export function MissaoDestaque() {
  return (
    <section className={styles.section}>
      <InstitutionalPattern spiral opacity={0.05} stroke="#9FC2EA" className={styles.pattern} />

      <div className={styles.inner}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowRule} aria-hidden="true" />
          Missão
        </p>

        <p className={styles.missao}>Transformando energia e vidas.</p>

        <div className={styles.visao}>
          <p className={styles.visaoLabel}>Visão</p>
          <p className={styles.visaoTexto}>
            Somos uma empresa de desenvolvimento e crescimento contínuo, com um ambiente onde o respeito e o
            comprometimento se transformam em energia para produzir mais.
          </p>
        </div>
      </div>
    </section>
  );
}
