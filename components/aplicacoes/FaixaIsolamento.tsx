import styles from "./FaixaIsolamento.module.css";

/**
 * Corte esquemático da isolação: primário (azul) e secundário (verde) com uma
 * folga real entre eles, e uma seta de corrente de fuga barrada no meio. É a
 * mesma afirmação do texto ao lado (isolação galvânica real, distância
 * definida pela classificação do equipamento), não uma curva de ensaio: por
 * isso não há eixo nem unidade, só a folga desenhada e o rótulo dela.
 *
 * Estático de propósito. A página já tem duas outras peças animadas (o hero
 * `PulsoProtegido` e a fita de monitor); um terceiro elemento em movimento no
 * mesmo scroll começava a competir por atenção em vez de ilustrar.
 */

export function FaixaIsolamento({ className }: { className?: string }) {
  return (
    <div className={`${styles.quadro} ${className ?? ""}`}>
      <svg viewBox="0 0 480 160" aria-hidden="true" className={styles.svg}>
        {/* primário */}
        <rect x={16} y={40} width={150} height={80} rx={10} fill="rgba(26, 75, 140, 0.08)" stroke="var(--color-blue)" strokeWidth={1.6} />
        <text x={91} y={85} textAnchor="middle" className={styles.rotuloBloco} fill="var(--color-blue)">
          Primário
        </text>

        {/* folga de isolamento */}
        <rect x={166} y={30} width={148} height={100} fill="rgba(94, 167, 94, 0.07)" />
        <line x1={166} y1={30} x2={166} y2={130} stroke="rgba(94, 167, 94, 0.5)" strokeWidth={1} strokeDasharray="4 4" />
        <line x1={314} y1={30} x2={314} y2={130} stroke="rgba(94, 167, 94, 0.5)" strokeWidth={1} strokeDasharray="4 4" />

        {/* corrente de fuga, barrada na folga */}
        <line x1={180} y1={80} x2={300} y2={80} stroke="rgba(179, 58, 58, 0.55)" strokeWidth={1.6} strokeDasharray="5 5" />
        <line x1={228} y1={68} x2={252} y2={92} stroke="rgba(179, 58, 58, 0.6)" strokeWidth={2} strokeLinecap="round" />
        <line x1={252} y1={68} x2={228} y2={92} stroke="rgba(179, 58, 58, 0.6)" strokeWidth={2} strokeLinecap="round" />

        <text x={240} y={22} textAnchor="middle" className={styles.rotuloFolga}>
          distância de isolamento
        </text>

        {/* secundário */}
        <rect x={314} y={40} width={150} height={80} rx={10} fill="rgba(94, 167, 94, 0.08)" stroke="#3f7d3f" strokeWidth={1.6} />
        <text x={389} y={85} textAnchor="middle" className={styles.rotuloBloco} fill="#3f7d3f">
          Secundário
        </text>
      </svg>

      <ul className={styles.legenda}>
        <li className={styles.item}>
          <span className={`${styles.chip} ${styles.chipFolga}`} aria-hidden="true" />
          Folga real entre os dois lados, dimensionada pela classificação do equipamento
        </li>
        <li className={styles.item}>
          <span className={`${styles.chip} ${styles.chipFuga}`} aria-hidden="true" />
          Corrente de fuga: o que a isolação existe para barrar
        </li>
      </ul>
    </div>
  );
}
