import { BadgeCheck, ShieldCheck } from "lucide-react";
import { getAnosDeMercado } from "@/lib/institucional";
import styles from "./ProvaInstitucional.module.css";

const BADGES = ["ISO 9001", "ESG", "RoHS Compliant"];

export function ProvaInstitucional() {
  const STATS = [
    { value: String(getAnosDeMercado()), label: "anos de mercado" },
    { value: "+18.000", label: "projetos entregues" },
    { value: "+3.000", label: "clientes" },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.stats}>
          {STATS.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
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
