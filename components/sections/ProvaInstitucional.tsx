import { BadgeCheck, ShieldCheck } from "lucide-react";
import { getAnosDeMercado } from "@/lib/institucional";
import { T } from "@/components/i18n/T";
import styles from "./ProvaInstitucional.module.css";

const BADGES = ["ISO 9001", "ESG", "RoHS Compliant"];

export function ProvaInstitucional() {
  const STATS = [
    { id: "anos", value: String(getAnosDeMercado()), pt: "anos de mercado", es: "años en el mercado", en: "years in the market" },
    { id: "projetos", value: "+18.000", pt: "projetos entregues", es: "proyectos entregados", en: "projects delivered" },
    { id: "clientes", value: "+3.000", pt: "clientes", es: "clientes", en: "clients" },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.stats}>
          {STATS.map((stat) => (
            <div key={stat.id} className={styles.stat}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>
                <T pt={stat.pt} es={stat.es} en={stat.en} />
              </span>
            </div>
          ))}
        </div>

        <div className={styles.badges}>
          {BADGES.map((badge) => (
            <span key={badge} className={styles.badge}>
              <BadgeCheck size={15} strokeWidth={1.9} aria-hidden="true" />
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
