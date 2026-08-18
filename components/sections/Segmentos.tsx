import Link from "next/link";
import { ArrowRight, BatteryCharging, Cpu, FlaskConical, HeartPulse, Network } from "lucide-react";
import { InstitutionalPattern } from "@/components/ui/InstitutionalPattern";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { T } from "@/components/i18n/T";
import styles from "./Segmentos.module.css";

const SEGMENTOS = [
  {
    id: "medicos",
    titulo: {
      pt: "Fabricantes de equipamentos médicos",
      es: "Fabricantes de equipos médicos",
      en: "Medical equipment manufacturers",
    },
    texto: {
      pt: "Blindagem entre enrolamentos e baixa corrente de fuga: menos interferência no sinal medido, laudo confiável e aprovação em ensaio sem retrabalho de projeto.",
      es: "Blindaje entre bobinados y baja corriente de fuga: menos interferencia en la señal medida, informe confiable y aprobación en el ensayo sin rehacer el proyecto.",
      en: "Shielding between windings and low leakage current: less interference in the measured signal, a reliable report and test approval without redesign.",
    },
    icon: HeartPulse,
  },
  {
    id: "nobreaks",
    titulo: {
      pt: "Nobreaks e condicionadores de energia",
      es: "UPS y acondicionadores de energía",
      en: "UPS systems and power conditioners",
    },
    texto: {
      pt: "Menor perda a vazio e dispersão magnética contida: menos calor dentro do gabinete, autonomia preservada em campo e menos acionamento de garantia.",
      es: "Menor pérdida en vacío y dispersión magnética contenida: menos calor dentro del gabinete, autonomía preservada en campo y menos activación de garantía.",
      en: "Lower no-load loss and contained magnetic dispersion: less heat inside the enclosure, autonomy preserved in the field and fewer warranty claims.",
    },
    icon: BatteryCharging,
    // Único segmento com página própria hoje (ver ROADMAP.md) — os outros 4
    // ainda não têm dor validada nem conteúdo, então ficam sem link de
    // propósito em vez de apontar pra página que não existe.
    href: "/aplicacoes/nobreaks",
  },
  {
    id: "automacao",
    titulo: {
      pt: "Automação industrial",
      es: "Automatización industrial",
      en: "Industrial automation",
    },
    texto: {
      pt: "Núcleo toroidal sem entreferro e volume reduzido: cabe no painel projetado, temperatura estável no armário e menos parada de linha por falha térmica.",
      es: "Núcleo toroidal sin entrehierro y volumen reducido: cabe en el panel proyectado, temperatura estable en el gabinete y menos paradas de línea por falla térmica.",
      en: "Toroidal core with no air gap and reduced volume: fits the designed panel, stable cabinet temperature and fewer line stops from thermal failure.",
    },
    icon: Cpu,
  },
  {
    id: "laboratorio",
    titulo: {
      pt: "Equipamentos laboratoriais",
      es: "Equipos de laboratorio",
      en: "Laboratory equipment",
    },
    texto: {
      pt: "Ruído acústico e magnético reduzido: leitura estável no instrumento, repetibilidade entre ensaios e menos recalibração fora do plano.",
      es: "Ruido acústico y magnético reducido: lectura estable en el instrumento, repetibilidad entre ensayos y menos recalibración fuera de plan.",
      en: "Reduced acoustic and magnetic noise: stable instrument reading, repeatability between tests and less unplanned recalibration.",
    },
    icon: FlaskConical,
  },
  {
    id: "integradores",
    titulo: {
      pt: "Integradores de sistemas elétricos",
      es: "Integradores de sistemas eléctricos",
      en: "Electrical systems integrators",
    },
    texto: {
      pt: "Dimensionamento sob medida por aplicação: montagem sem adaptação em campo, cronograma de obra mantido e menos hora extra de equipe própria.",
      es: "Dimensionamiento a medida por aplicación: montaje sin adaptación en campo, cronograma de obra mantenido y menos horas extra del equipo propio.",
      en: "Custom sizing per application: field installation with no on-site adaptation, project schedule kept and less overtime for your own team.",
    },
    icon: Network,
  },
];

export function Segmentos() {
  return (
    <section id="segmentos" className={styles.section}>
      <InstitutionalPattern opacity={0.06} className={styles.pattern} />
      <div className={styles.inner}>
        <SectionHeading eyebrow={<T pt="Segmentos atendidos" es="Segmentos atendidos" en="Segments served" />}>
          <T
            pt="Cada aplicação impõe uma restrição diferente. O projeto começa por ela."
            es="Cada aplicación impone una restricción diferente. El proyecto empieza por ella."
            en="Each application imposes a different constraint. The design starts there."
          />
        </SectionHeading>

        <div className={styles.grid}>
          {SEGMENTOS.map(({ id, titulo, texto, icon: Icon, href }) => {
            const conteudo = (
              <>
                <span className={styles.iconWrap} aria-hidden="true">
                  <Icon size={22} strokeWidth={1.7} />
                </span>
                <h3 className={styles.cardTitle}>
                  <T pt={titulo.pt} es={titulo.es} en={titulo.en} />
                </h3>
                <p className={styles.cardText}>
                  <T pt={texto.pt} es={texto.es} en={texto.en} />
                </p>
                {href && (
                  <span className={styles.cardLink}>
                    <T pt="Ver aplicação" es="Ver aplicación" en="View application" />
                    <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
                  </span>
                )}
              </>
            );

            return href ? (
              <Link key={id} href={href} className={styles.card}>
                {conteudo}
              </Link>
            ) : (
              <article key={id} className={styles.card}>
                {conteudo}
              </article>
            );
          })}
          {/* Dentro do grid, não abaixo dele: são 5 segmentos em 3 colunas, e o
              banner ocupa exatamente a célula que sobrava na segunda linha. */}
          <div className={styles.pendingBanner}>
            <p className={styles.pendingLabel}>
              <T pt="Prova social" es="Prueba social" en="Social proof" />
            </p>
            <p className={styles.pendingText}>
              <T pt="Em breve" es="Próximamente" en="Coming soon" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
