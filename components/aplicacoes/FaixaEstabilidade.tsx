import styles from "./FaixaEstabilidade.module.css";

/**
 * Mesma técnica de BandaRegulacao.tsx: duas curvas periódicas de 720
 * unidades, traçado de 1440, deslocamento de -720 sem costura. O que muda é
 * o que as curvas significam: aqui não é carga de nobreak, é a carga do
 * próprio instrumento variando com o aquecimento, contra a leitura que
 * permanece dentro da banda de regulação. Honestidade do desenho, igual à
 * fonte: representa o parâmetro de especificação, não um ensaio real.
 */

const W = 720;
const H = 190;
const PASSO = 6;

const BANDA_Y = 128;
const BANDA_ALTURA = 20;
const LEITURA_Y = BANDA_Y + BANDA_ALTURA / 2;

type Harmonico = [comprimento: number, amplitude: number];

function curva(base: number, harmonicos: Harmonico[]) {
  let d = "";
  for (let x = 0; x <= W * 2; x += PASSO) {
    let y = base;
    for (const [comprimento, amplitude] of harmonicos) {
      y += amplitude * Math.sin((x / comprimento) * Math.PI * 2);
    }
    d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(2)}`;
  }
  return d;
}

// Carga do instrumento: deriva lenta e suave (aquecimento), não o distúrbio
// irregular de FaixaControle.tsx nem o de BandaRegulacao. É outro fenômeno.
const CARGA = curva(64, [
  [720, 16],
  [360, 6],
]);

const LEITURA = curva(LEITURA_Y, [
  [720, 1.4],
  [240, 0.8],
]);

const GRADE_H = [38, 76, 114, 171];
const GRADE_V = Array.from({ length: 7 }, (_, i) => (W / 8) * (i + 1));

export function FaixaEstabilidade() {
  return (
    <div className={styles.quadro}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={styles.svg}>
        <g stroke="rgba(26, 75, 140, 0.09)" strokeWidth={1}>
          {GRADE_H.map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />
          ))}
        </g>
        <g stroke="rgba(26, 75, 140, 0.06)" strokeWidth={1}>
          {GRADE_V.map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />
          ))}
        </g>

        <rect x={0} y={BANDA_Y} width={W} height={BANDA_ALTURA} fill="rgba(94, 167, 94, 0.13)" />
        <line x1={0} y1={BANDA_Y} x2={W} y2={BANDA_Y} stroke="rgba(94, 167, 94, 0.5)" strokeWidth={1} />
        <line
          x1={0}
          y1={BANDA_Y + BANDA_ALTURA}
          x2={W}
          y2={BANDA_Y + BANDA_ALTURA}
          stroke="rgba(94, 167, 94, 0.5)"
          strokeWidth={1}
        />

        <g className={styles.deriva}>
          <path d={CARGA} fill="none" stroke="rgba(26, 75, 140, 0.34)" strokeWidth={2.2} strokeLinecap="round" />
        </g>

        <g className={styles.deriva}>
          <path d={LEITURA} fill="none" stroke="var(--color-blue)" strokeWidth={2.8} strokeLinecap="round" />
        </g>
      </svg>

      <ul className={styles.legenda}>
        <li className={styles.item}>
          <span className={`${styles.chip} ${styles.chipCarga}`} aria-hidden="true" />
          Carga do instrumento: varia com o aquecimento em uso prolongado
        </li>
        <li className={styles.item}>
          <span className={`${styles.chip} ${styles.chipLeitura}`} aria-hidden="true" />
          Leitura: permanece dentro da banda de regulação
        </li>
      </ul>
    </div>
  );
}
