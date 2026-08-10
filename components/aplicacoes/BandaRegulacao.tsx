import styles from "./BandaRegulacao.module.css";

/**
 * Momento gráfico da página: a corrente de carga varia, a tensão de saída não
 * sai da banda. É a leitura visual do parâmetro de regulação, que é justamente o
 * que o projetista de nobreak quer saber sobre carga variável.
 *
 * Honestidade do desenho, que aqui não é detalhe: NÃO é curva de ensaio e não
 * afirma resultado medido. É representação de um parâmetro de especificação, e a
 * legenda diz isso na página. Um transformador também não "limpa" forma de onda:
 * por isso o desenho mostra regulação e não filtragem de ruído.
 *
 * As duas curvas são periódicas em 720 unidades e o traçado tem 1440, então
 * deslocar o grupo em -720 emenda sem costura. Só transform: animação
 * compositada, sem repintura por quadro e sem JS. A grade fica parada de
 * propósito: o eixo do tempo é o que anda, a banda é o que não se move.
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

// Comprimentos que dividem 720: mantêm o período do conjunto em 720 e a emenda
// invisível. A soma de três harmônicos é o que dá à carga um contorno irregular,
// orgânico, em vez de senoide de livro.
const CARGA = curva(62, [
  [720, 18],
  [240, 11],
  [144, 6],
]);

const SAIDA = curva(SAIDA_Y, [
  [720, 2.1],
  [240, 1.3],
]);

const GRADE_H = [38, 76, 114, 171];
const GRADE_V = Array.from({ length: 7 }, (_, i) => (W / 8) * (i + 1));

export function BandaRegulacao() {
  return (
    <div className={styles.quadro}>
      {/* xMidYMid slice: no mobile a caixa fica mais alta e o desenho é recortado
          na horizontal em vez de achatado na vertical. Achatar transformava a
          banda de regulação num fio e destruía justamente a leitura que o
          gráfico existe para dar. Recortar tempo não custa nada: a curva é
          periódica e está em deriva. */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className={styles.svg}
      >
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

        {/* banda de regulação: o que não se move quando a carga muda */}
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

        {/* corrente de carga: traço subordinado, é o distúrbio */}
        <g className={styles.deriva}>
          <path d={CARGA} fill="none" stroke="rgba(26, 75, 140, 0.34)" strokeWidth={2.2} strokeLinecap="round" />
        </g>

        {/* tensão de saída: traço principal, mais pesado, dentro da banda */}
        <g className={styles.deriva}>
          <path d={SAIDA} fill="none" stroke="var(--color-blue)" strokeWidth={2.8} strokeLinecap="round" />
        </g>
      </svg>

      <ul className={styles.legenda}>
        <li className={styles.item}>
          <span className={`${styles.chip} ${styles.chipCarga}`} aria-hidden="true" />
          Corrente de carga: varia com o regime do nobreak
        </li>
        <li className={styles.item}>
          <span className={`${styles.chip} ${styles.chipSaida}`} aria-hidden="true" />
          Tensão de saída: permanece dentro da banda de regulação
        </li>
      </ul>
    </div>
  );
}
