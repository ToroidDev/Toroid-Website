import { MessageCircle } from "lucide-react";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { OrcamentoForm } from "@/components/forms/OrcamentoForm";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import styles from "./CTA.module.css";

export function CTA() {
  return (
    <section id="orcamento" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.card}>
          <InstitutionalPattern spiral opacity={0.12} stroke="#BBD5F2" className={styles.pattern} />
          <div className={styles.content}>
            <p className={styles.eyebrow}>Orçamento técnico</p>
            <h2 className={styles.heading}>
              Envie a especificação, ou só a restrição do painel. A engenharia responde com o dimensionamento.
            </h2>
            <p className={styles.lead}>
              Tensão, corrente, espaço disponível e norma aplicável. Se algum dado ainda não existe, a equipe ajuda a
              fechar.
            </p>
            <div className={styles.actions}>
              <OrcamentoForm />
              <WhatsAppLink className={styles.secondary}>
                Falar com nosso time
                <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
              </WhatsAppLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
