import styles from "./InstitutionalPattern.module.css";

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
  /** Cada ponta sobe e desce em fase escalonada (efeito de onda), miolo
   *  parado. Troca a renderização em 3 `<path>` por um `<g>` por raio — só
   *  vale o custo de nó a mais em página isolada e de baixo tráfego como a
   *  404, nunca como padrão em seção que se repete pelo site. */
  wave?: boolean;
}

// Sub-pixel não muda nada visível num traço a 0.05-0.12 de opacidade, mas
// corta o tamanho de cada coordenada no `d` do path em ~70%.
function arredonda(n: number): number {
  return Math.round(n * 10) / 10;
}

// Um círculo como dois arcos de 180°, pra poder concatenar muitos círculos
// num único `<path>` em vez de um `<circle>` por item.
function pathDeCirculo(cx: number, cy: number, r: number): string {
  const xMax = arredonda(cx + r);
  const xMin = arredonda(cx - r);
  const y = arredonda(cy);
  return `M${xMax},${y}A${r},${r} 0 1 1 ${xMin},${y}A${r},${r} 0 1 1 ${xMax},${y}Z`;
}

/**
 * Núcleo toroidal irradiando, pattern institucional de fundo.
 * Determinístico (sem estado/tempo), por isso roda inteiro no servidor.
 *
 * Geometricamente idêntico a desenhar LINE_COUNT `<line>`/`<circle>`
 * separadas (era a versão original), mas concatenado em 3 `<path>` — uma
 * textura de fundo com 228 nós SVG por instância pesava sozinha a maior
 * parte do HTML bruto da home, prejudicando o content ratio que agentes de
 * IA usam pra avaliar a página sem JS.
 */
export function InstitutionalPattern({
  spiral = false,
  opacity = 0.06,
  className,
  stroke = "#E0E0E0",
  wave = false,
}: InstitutionalPatternProps) {
  const radius = spiral ? 168 : 132;

  let linhas = "";
  let circulosPequenos = "";
  let circulosGrandes = "";
  const raios: { x1: number; y1: number; x2: number; y2: number; delay: number }[] = [];

  for (let i = 0; i < LINE_COUNT; i++) {
    const angle = (i / LINE_COUNT) * Math.PI * 2;
    const length = 210 + 90 * Math.abs(Math.sin(i * 1.9)) + (i % 3 === 0 ? 60 : 0);
    const endAngle = angle + (spiral ? 0.3 : 0);

    const x1 = arredonda(CENTER + radius * Math.cos(angle));
    const y1 = arredonda(CENTER + radius * Math.sin(angle));
    const x2 = arredonda(CENTER + (radius + length) * Math.cos(endAngle));
    const y2 = arredonda(CENTER + (radius + length) * Math.sin(endAngle));

    circulosPequenos += pathDeCirculo(x1, y1, 9);

    if (wave) {
      raios.push({ x1, y1, x2, y2, delay: -(i / LINE_COUNT) * 3.6 });
    } else {
      linhas += `M${x1},${y1}L${x2},${y2} `;
      circulosGrandes += pathDeCirculo(x2, y2, 15);
    }
  }

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width="100%"
      aria-hidden="true"
      className={className}
      style={{ display: "block", opacity }}
    >
      <path d={circulosPequenos} fill={stroke} />
      {wave ? (
        raios.map((raio, i) => (
          <g
            key={i}
            className={styles.raio}
            style={{ transformOrigin: `${raio.x1}px ${raio.y1}px`, animationDelay: `${raio.delay}s` }}
          >
            <line x1={raio.x1} y1={raio.y1} x2={raio.x2} y2={raio.y2} stroke={stroke} strokeWidth={7} strokeLinecap="round" />
            <circle cx={raio.x2} cy={raio.y2} r={15} fill={stroke} />
          </g>
        ))
      ) : (
        <>
          <path d={linhas} stroke={stroke} strokeWidth={7} strokeLinecap="round" fill="none" />
          <path d={circulosGrandes} fill={stroke} />
        </>
      )}
    </svg>
  );
}
