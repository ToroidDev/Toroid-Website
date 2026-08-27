import styles from "./SinalAudio.module.css";

/**
 * Arte da seção "Áudio profissional": só o sinal de áudio, limpo e fluindo,
 * sem elemento de núcleo/ruído — a leitura visual fica no próprio parágrafo,
 * essa peça é só o sinal "correndo" continuamente.
 *
 * A onda é desenhada bem mais larga que o viewBox (um comprimento de onda
 * de sobra de cada lado) e recortada por um clipPath; a animação translada
 * exatamente um comprimento de onda (80px) e volta ao início, então o loop
 * não tem salto visível. Determinístico, sem Math.random, 100% servidor
 * (zero JS no bundle). `prefers-reduced-motion` desliga a translação
 * globalmente (app/globals.css); a onda continua legível parada.
 */

const VIEW_W = 480;
const VIEW_H = 190;
const CY = VIEW_H / 2;

const AMPLITUDE = 42;
const COMPRIMENTO = 80;
const MARGEM = COMPRIMENTO; // sobra de um comprimento de onda de cada lado

const SINAL = "#8FCB8F";

function caminhoOnda() {
  const inicio = -MARGEM;
  const fim = VIEW_W + MARGEM;
  const passos = 96;
  let d = "";
  for (let i = 0; i <= passos; i++) {
    const p = i / passos;
    const x = inicio + (fim - inicio) * p;
    const y = CY + AMPLITUDE * Math.sin(x * ((2 * Math.PI) / COMPRIMENTO));
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d.trim();
}

const ONDA_D = caminhoOnda();

export function SinalAudio({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width="100%"
      aria-hidden="true"
      className={className}
      style={{ display: "block" }}
    >
      <defs>
        <clipPath id="sinal-audio-clip">
          <rect x={0} y={0} width={VIEW_W} height={VIEW_H} />
        </clipPath>
      </defs>
      <g clipPath="url(#sinal-audio-clip)">
        <path
          d={ONDA_D}
          stroke={SINAL}
          strokeWidth={3.4}
          strokeLinecap="round"
          fill="none"
          className={styles.onda}
        />
      </g>
    </svg>
  );
}
