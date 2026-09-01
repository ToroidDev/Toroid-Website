import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Compromissos.module.css";

// const SELOS = [{ src: "/images/cert-iso.png", alt: "Certificação ISO 9001", classe: "seloIso" }] as const;

const BADGES = ["Garantia de 3 anos"];

export function Compromissos() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="Política da qualidade"
          lead="A Toroid do Brasil tem por objetivo oferecer transformadores elétricos e indutores e promover a melhoria contínua de seu sistema de gestão de qualidade, baseando-se no seu planejamento estratégico e sua gestão de risco, buscando a satisfação dos clientes e colaboradores e garantindo uma posição competitiva de mercado."
        >
          Compromissos que sustentam a operação
        </SectionHeading>

        <div className={styles.badges}>
          <span className={`${styles.badge} ${styles.badgeDestaque}`}>
            <BadgeCheck size={18} strokeWidth={2} aria-hidden="true" />
            RoHS Compliant
          </span>
          {BADGES.map((badge) => (
            <span key={badge} className={styles.badge}>
              <BadgeCheck size={16} strokeWidth={1.9} aria-hidden="true" />
              {badge}
            </span>
          ))}
        </div>

        {/* <div className={styles.selos}>
          {SELOS.map(({ src, alt, classe }) => (
            <Image key={src} src={src} alt={alt} width={269} height={188} className={`${styles.selo} ${styles[classe]}`} />
          ))}
        </div> */}
      </div>
    </section>
  );
}
