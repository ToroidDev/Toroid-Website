import styles from "./LeituraEstavel.module.css";

/**
 * Emblema do hero de equipamentos laboratoriais: o mesmo núcleo da família
 * (NucleoIsolado, PulsoProtegido, RuidoContido), agora com uma linha de
 * leitura que atravessa a zona contida perfeitamente nivelada, com marcas de
 * escala regulares, como um traço de osciloscópio calibrado. Uma segunda
 * linha, quase invisível e sem marcas, aparece por trás como "o que seria
 * deriva" e nunca chega a se destacar: é a leitura visual de "estabilidade
 * que não interfere na medição", não decoração.
 *
 * Determinístico, sem estado e sem tempo em JS. As únicas animações (fluxo
 * girando, leitura deslizando) são CSS puro, tratadas globalmente por
 * `prefers-reduced-motion` em globals.css.
 */

const SIZE = 440;
const C = SIZE / 2;

const R_OUT = 140;
const R_IN = 90;
const R_LIMITE = 158;

const STROKE = "rgba(190, 216, 244, 0.55)";
const STROKE_FAINT = "rgba(190, 216, 244, 0.24)";
const FLUXO = "rgba(190, 216, 244, 0.4)";
const ACCENT = "#8FCB8F";

// Escala regular, sem ruído: o oposto do batimento de PulsoProtegido, de
// propósito, porque aqui a afirmação é "não desvia", não "sinal vivo".
const PASSO_MARCA = 22;
const MARCAS = Array.from({ length: Math.ceil((SIZE * 2) / PASSO_MARCA) }, (_, i) => i * PASSO_MARCA);

// Ghost de deriva: uma senoide de amplitude mínima, quase plana, pra
// significar "a variação que não acontece" sem virar o elemento principal.
function ghostDeriva(largura: number) {
  let d = "";
  const passo = 8;
  for (let x = 0; x <= largura; x += passo) {
    const y = 2.5 * Math.sin((x / 260) * Math.PI * 2);
    d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(2)} `;
  }
  return d.trim();
}

const GHOST_D = ghostDeriva(SIZE * 2);

export function LeituraEstavel({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width="100%"
      aria-hidden="true"
      className={className}
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <clipPath id="leituraEstavelFaixa">
          <rect x={C - R_OUT} y={C - 26} width={R_OUT * 2} height={52} />
        </clipPath>
      </defs>

      <circle cx={C} cy={C} r={R_LIMITE} stroke={STROKE_FAINT} strokeWidth={1} fill="none" opacity={0.5} />

      <circle cx={C} cy={C} r={R_OUT} stroke={STROKE} strokeWidth={2.2} fill="none" />
      <circle cx={C} cy={C} r={R_IN} stroke={STROKE} strokeWidth={2.2} fill="none" />

      {[
        { r: 128, duracao: "40s" },
        { r: 112, duracao: "31s" },
      ].map(({ r, duracao }) => {
        const perimetro = 2 * Math.PI * r;
        const traco = perimetro / 8;
        return (
          <circle
            key={r}
            cx={C}
            cy={C}
            r={r}
            fill="none"
            stroke={FLUXO}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeDasharray={`${traco.toFixed(1)} ${traco.toFixed(1)}`}
            className={styles.fluxo}
            style={{ animationDuration: duracao }}
          />
        );
      })}

      <g clipPath="url(#leituraEstavelFaixa)">
        {/* ghost de deriva, quase imperceptível, atrás da leitura real */}
        <g className={styles.derivaLenta}>
          <path d={GHOST_D} fill="none" stroke="rgba(230, 120, 120, 0.22)" strokeWidth={1.4} transform={`translate(0 ${C})`} />
        </g>

        {/* marcas de escala, regulares, correndo junto com a leitura */}
        <g className={styles.deriva} stroke="rgba(190, 216, 244, 0.3)" strokeWidth={1}>
          {MARCAS.map((x) => (
            <line key={x} x1={x} y1={C - 8} x2={x} y2={C + 8} transform="translate(0 0)" />
          ))}
        </g>

        {/* leitura: reta, nivelada, o traço principal */}
        <g className={styles.deriva}>
          <line x1={0} y1={C} x2={SIZE * 2} y2={C} stroke={ACCENT} strokeWidth={2.6} strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
