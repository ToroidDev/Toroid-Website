import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { WhatsAppLink } from "@/components/analytics/WhatsAppLink";
import styles from "./CapacidadeHero.module.css";

export function CapacidadeHero() {
  return (
    <section className={styles.hero}>
      <InstitutionalPattern spiral opacity={0.06} stroke="#9FC2EA" className={styles.pattern} />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <ol className={styles.breadcrumb}>
            <li>
              <Link href="/">Início</Link>
              <span className={styles.breadcrumbSep} aria-hidden="true">
                /
              </span>
            </li>
            <li>
              <span aria-current="page">Capacidade fabril</span>
            </li>
          </ol>

          <p className={styles.eyebrow}>
            <span className={styles.eyebrowRule} aria-hidden="true" />
            Capacidade fabril
          </p>

          <h1 className={styles.headline}>
            Da matéria-prima ao teste elétrico, <span className={styles.headlineAccent}>sob o mesmo teto</span>
          </h1>

          <p className={styles.lead}>
            Aço silício, cobre esmaltado, núcleo, isolamento, resina e teste elétrico: cada etapa da fabricação de
            um transformador ou indutor Toroid acontece dentro da própria planta, em São José dos Pinhais, com
            rastreabilidade de lote do início ao fim.
          </p>

          <div className={styles.actions}>
            <a href="#orcamento" className={styles.primary}>
              Solicitar Orçamento Técnico
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </a>
            <WhatsAppLink className={styles.secondary}>
              Falar com nosso time
              <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
            </WhatsAppLink>
          </div>
        </div>

        <div className={styles.media}>
          <Image
            src="/images/fabrica-interna-tratada.webp"
            alt="Vista do chão de fábrica da Toroid, com postos de bobinagem e montagem em operação"
            fill
            sizes="(min-width: 900px) 44vw, 100vw"
            priority
            className={styles.mediaImg}
          />
        </div>
      </div>
    </section>
  );
}
