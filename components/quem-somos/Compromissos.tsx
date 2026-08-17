import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Compromissos.module.css";

const SELOS = [
  { src: "/images/cert-rina-iso9001.jpg", alt: "Sistema de gestão certificado RINA ISO 9001", classe: "seloRina" },
  { src: "/images/cert-iso.png", alt: "Certificação ISO 9001", classe: "seloIso" },
  { src: "/images/cert-esg.png", alt: "Certificação ESG", classe: "seloEsg" },
] as const;

const BADGES = ["RoHS Compliant", "Garantia de 3 anos", "Produto 100% brasileiro"];

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
          {BADGES.map((badge) => (
            <span key={badge} className={styles.badge}>
              <BadgeCheck size={16} strokeWidth={1.9} aria-hidden="true" />
              {badge}
            </span>
          ))}
        </div>

        <div className={styles.selos}>
          {SELOS.map(({ src, alt, classe }) => (
            <Image
              key={src}
              src={src}
              alt={alt}
              width={classe === "seloRina" ? 1710 : 269}
              height={classe === "seloRina" ? 1110 : 188}
              className={`${styles.selo} ${styles[classe]}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
