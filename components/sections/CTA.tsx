import { MessageCircle } from "lucide-react";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { OrcamentoForm } from "@/components/forms/OrcamentoForm";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import { T } from "@/components/i18n/T";
import styles from "./CTA.module.css";

export function CTA() {
  return (
    <section id="orcamento" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.card}>
          <InstitutionalPattern spiral opacity={0.12} stroke="#BBD5F2" className={styles.pattern} />
          <div className={styles.content}>
            <p className={styles.eyebrow}>
              <T pt="Orçamento técnico" es="Presupuesto técnico" en="Technical quote" />
            </p>
            <h2 className={styles.heading}>
              <T
                pt="Envie a especificação, ou só a restrição do painel. A engenharia responde com o dimensionamento."
                es="Envía la especificación, o solo la restricción del panel. La ingeniería responde con el dimensionamiento."
                en="Send the specification, or just the panel's constraint. Our engineering team replies with the sizing."
              />
            </h2>
            <p className={styles.lead}>
              <T
                pt="Tensão, corrente, espaço disponível e norma aplicável. Se algum dado ainda não existe, a equipe ajuda a fechar."
                es="Tensión, corriente, espacio disponible y norma aplicable. Si algún dato aún no existe, el equipo ayuda a definirlo."
                en="Voltage, current, available space and applicable standard. If any data point is still missing, our team helps you pin it down."
              />
            </p>
            <div className={styles.actions}>
              <OrcamentoForm />
              {/* Mesma promessa do bloco ao lado (enviar especificação, receber
                  dimensionamento), já escrita na primeira mensagem. */}
              <WhatsAppLink
                className={styles.secondary}
                mensagem={{
                  pt: "Olá! Quero enviar uma especificação e receber o dimensionamento da engenharia.",
                  es: "¡Hola! Quiero enviar una especificación y recibir el dimensionamiento de la ingeniería.",
                  en: "Hi! I would like to send a specification and get the sizing from your engineering team.",
                }}
              >
                <T pt="Falar com nosso time" es="Hablar con nuestro equipo" en="Talk to our team" />
                <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
              </WhatsAppLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
