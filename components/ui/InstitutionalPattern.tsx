const SIZE = 1000;
const CENTER = SIZE / 2;
const LINE_COUNT = 76;

interface InstitutionalPatternProps {
  /** Variante espiral (hero) vs. circular (demais seções). */
  spiral?: boolean;
  opacity?: number;
  className?: string;
  /** Cor do traço. O cinza padrão desaparece sobre azul profundo: nas seções
   *  invertidas passar um tom claro (ex.: "#9FC2EA"). */
  stroke?: string;
}

/**
 * Núcleo toroidal irradiando, pattern institucional de fundo.
 * Determinístico (sem estado/tempo), por isso roda inteiro no servidor.
 */
export function InstitutionalPattern({
  spiral = false,
  opacity = 0.06,
  className,
  stroke = "#E0E0E0",
}: InstitutionalPatternProps) {
  const radius = spiral ? 168 : 132;

  const lines = Array.from({ length: LINE_COUNT }, (_, i) => {
    const angle = (i / LINE_COUNT) * Math.PI * 2;
    const length = 210 + 90 * Math.abs(Math.sin(i * 1.9)) + (i % 3 === 0 ? 60 : 0);
    const endAngle = angle + (spiral ? 0.3 : 0);
    return {
      key: i,
      x1: CENTER + radius * Math.cos(angle),
      y1: CENTER + radius * Math.sin(angle),
      x2: CENTER + (radius + length) * Math.cos(endAngle),
      y2: CENTER + (radius + length) * Math.sin(endAngle),
    };
  });

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width="100%"
      aria-hidden="true"
      className={className}
      style={{ display: "block", opacity }}
    >
      {lines.map((l) => (
        <g key={l.key}>
          <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={stroke} strokeWidth={7} strokeLinecap="round" />
          <circle cx={l.x1} cy={l.y1} r={9} fill={stroke} />
          <circle cx={l.x2} cy={l.y2} r={15} fill={stroke} />
        </g>
      ))}
    </svg>
  );
}
