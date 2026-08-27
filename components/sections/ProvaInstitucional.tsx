import { getAnosDeMercado } from "@/lib/institucional";
import { T } from "@/components/i18n/T";
import styles from "./ProvaInstitucional.module.css";

export function ProvaInstitucional() {
  const STATS = [
    { id: "anos", value: String(getAnosDeMercado()), pt: "anos de mercado", es: "años en el mercado", en: "years in the market" },
    { id: "projetos", value: "+18.000", pt: "projetos entregues", es: "proyectos entregados", en: "projects delivered" },
    { id: "clientes", value: "+3.000", pt: "clientes", es: "clientes", en: "clients" },
    { id: "iso", value: "ISO 9001", selo: true },
    { id: "rohs", value: "RoHS Compliant", selo: true },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.stats}>
          {STATS.map((stat) => (
            <div key={stat.id} className={styles.stat}>
              <span className={`${styles.statValue} ${stat.selo ? styles.selo : ""}`}>{stat.value}</span>
              {stat.pt && (
                <span className={styles.statLabel}>
                  <T pt={stat.pt} es={stat.es} en={stat.en} />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
