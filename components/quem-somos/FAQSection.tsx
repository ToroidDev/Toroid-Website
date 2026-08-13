import { Perguntas, type Pergunta } from "@/components/aplicacoes/Perguntas";
import styles from "./FAQSection.module.css";

export function FAQSection({ itens }: { itens: Pergunta[] }) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <Perguntas id="perguntas-frequentes" titulo="Perguntas frequentes" itens={itens} />
      </div>
    </section>
  );
}
