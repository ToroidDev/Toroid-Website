import { BatteryCharging, Cpu, FlaskConical, HeartPulse, Network } from "lucide-react";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Segmentos.module.css";

const SEGMENTOS = [
  {
    titulo: "Fabricantes de equipamentos médicos",
    texto:
      "Blindagem entre enrolamentos e baixa corrente de fuga: menos interferência no sinal medido, laudo confiável e aprovação em ensaio sem retrabalho de projeto.",
    icon: HeartPulse,
  },
  {
    titulo: "Nobreaks e condicionadores de energia",
    texto:
      "Menor perda a vazio e dispersão magnética contida: menos calor dentro do gabinete, autonomia preservada em campo e menos acionamento de garantia.",
    icon: BatteryCharging,
  },
  {
    titulo: "Automação industrial",
    texto:
      "Núcleo toroidal sem entreferro e volume reduzido: cabe no painel projetado, temperatura estável no armário e menos parada de linha por falha térmica.",
    icon: Cpu,
  },
  {
    titulo: "Equipamentos laboratoriais",
    texto:
      "Ruído acústico e magnético reduzido: leitura estável no instrumento, repetibilidade entre ensaios e menos recalibração fora do plano.",
    icon: FlaskConical,
  },
  {
    titulo: "Integradores de sistemas elétricos",
    texto:
      "Dimensionamento sob medida por aplicação: montagem sem adaptação em campo, cronograma de obra mantido e menos hora extra de equipe própria.",
    icon: Network,
  },
];

export function Segmentos() {
  return (
    <section id="segmentos" className={styles.section}>
      <InstitutionalPattern opacity={0.06} className={styles.pattern} />
      <div className={styles.inner}>
        <SectionHeading eyebrow="Segmentos atendidos">
          Cada aplicação impõe uma restrição diferente. O projeto começa por ela.
        </SectionHeading>

        <div className={styles.grid}>
          {SEGMENTOS.map(({ titulo, texto, icon: Icon }) => (
            <article key={titulo} className={styles.card}>
              <span className={styles.iconWrap} aria-hidden="true">
                <Icon size={22} strokeWidth={1.7} />
              </span>
              <h3 className={styles.cardTitle}>{titulo}</h3>
              <p className={styles.cardText}>{texto}</p>
            </article>
          ))}
          {/* Dentro do grid, não abaixo dele: são 5 segmentos em 3 colunas, e o
              banner ocupa exatamente a célula que sobrava na segunda linha. */}
          <div className={styles.pendingBanner}>
            <p className={styles.pendingLabel}>Prova social</p>
            <p className={styles.pendingText}>Em breve</p>
          </div>
        </div>
      </div>
    </section>
  );
}
