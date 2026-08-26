import styles from "./FaixaControle.module.css";

/**
 * Mesma técnica de BandaRegulacao.tsx (nobreaks): duas curvas periódicas de
 * 720 unidades, traçado de 1440, deslocamento de -720 para emenda sem
 * costura. Só transform, sem JS, sem repintura por quadro.
 *
 * O que muda aqui é o que as curvas representam: não é regulação de tensão
 * sob carga, é ruído elétrico de painel (motor, drive, contator) por fora de
 * uma banda de blindagem, contra o sinal de controle que permanece dentro
 * dela. Amplitude e harmônicos do ruído são deliberadamente mais altos e
 * irregulares que os de BandaRegulacao, para ler como "ruído de painel", não
 * como a mesma curva reaproveitada.
 */

const W = 720;
const H = 190;
const PASSO = 6;

const BANDA_Y = 128;
const BANDA_ALTURA = 24;
const SAIDA_Y = BANDA_Y + BANDA_ALTURA / 2;

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

// Ruído do painel: mais harmônicos curtos e amplitude maior que o "distúrbio"
// de BandaRegulacao, pra ler como interferência elétrica, não como carga que
// varia suavemente.
const RUIDO = curva(46, [
  [720, 14],
  [90, 9],
  [37, 5],
  [17, 3.5],
]);

// Sinal de controle: quase reto, dentro da banda de blindagem.
const CONTROLE = curva(SAIDA_Y, [
  [720, 1.6],
  [180, 0.9],
]);

const GRADE_H = [38, 76, 114, 171];
const GRADE_V = Array.from({ length: 7 }, (_, i) => (W / 8) * (i + 1));

export function FaixaControle() {
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

        {/* banda de blindagem: o que o ruído do painel não atravessa */}
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
          <path d={RUIDO} fill="none" stroke="rgba(230, 150, 70, 0.55)" strokeWidth={1.8} strokeLinecap="round" />
        </g>

        <g className={styles.deriva}>
          <path d={CONTROLE} fill="none" stroke="var(--color-blue)" strokeWidth={2.8} strokeLinecap="round" />
        </g>
      </svg>

      <ul className={styles.legenda}>
        <li className={styles.item}>
          <span className={`${styles.chip} ${styles.chipRuido}`} aria-hidden="true" />
          Ruído do painel: motor, drive e contator no mesmo espaço
        </li>
        <li className={styles.item}>
          <span className={`${styles.chip} ${styles.chipControle}`} aria-hidden="true" />
          Sinal de controle: permanece dentro da banda de blindagem
        </li>
      </ul>
    </div>
  );
}
