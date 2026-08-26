import styles from "./RuidoContido.module.css";

/**
 * Emblema do hero de automação industrial: o mesmo núcleo de NucleoIsolado.tsx
 * e PulsoProtegido.tsx, agora cercado pelo ruído elétrico de um painel (motor,
 * drive, contator). Duas coisas afirmadas:
 *
 *  1. O ruído externo é irregular e "elétrico" (dente de serra, não onda
 *     suave), porque é isso que motor/drive/contator injetam num painel, não
 *     uma interferência genérica qualquer.
 *  2. Ele treme perto do limite do campo (leve cintilação, ver `.jitter`) mas
 *     não atravessa o anel: dentro do núcleo, o sinal de controle continua um
 *     traço reto. É a leitura visual de "isolação que resiste ao ruído do
 *     painel", não decoração de fundo.
 *
 * Determinístico, sem Math.random: os dentes de serra vêm de uma função de
 * índice, não de estado. `prefers-reduced-motion` desliga o jitter e o fluxo
 * globalmente (globals.css); o traço de controle continua legível parado.
 */

const SIZE = 440;
const C = SIZE / 2;

const R_OUT = 140;
const R_IN = 90;
const R_LIMITE = 158;

const STROKE = "rgba(190, 216, 244, 0.55)";
const STROKE_FAINT = "rgba(190, 216, 244, 0.24)";
const FLUXO = "rgba(190, 216, 244, 0.4)";
const RUIDO = "rgba(230, 150, 70, 0.55)";

function polar(r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
}

/**
 * Um "dente" de ruído: segmento em zigue-zague partindo de fora e indo até
 * quase o limite do campo, nunca até o anel. Amplitude do zigue-zague maior
 * longe do núcleo, menor perto, para ler como algo que perde força ao chegar.
 */
function denteRuido(deg: number, i: number) {
  const rExterno = R_LIMITE + 70 + (i % 3) * 14;
  const passos = 5;
  let d = "";
  for (let p = 0; p <= passos; p++) {
    const t = p / passos;
    const r = rExterno - (rExterno - (R_LIMITE + 6)) * t;
    const amplitude = 10 * (1 - t * 0.7);
    const desvio = p % 2 === 0 ? amplitude : -amplitude;
    const [x, y] = polar(r, deg + desvio * 0.14);
    d += `${p === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d.trim();
}

const DENTES = Array.from({ length: 9 }, (_, i) => ({
  key: i,
  d: denteRuido(i * 40 + 8, i),
  atraso: `${(i % 5) * 0.35}s`,
}));

export function RuidoContido({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width="100%"
      aria-hidden="true"
      className={className}
      style={{ display: "block", overflow: "visible" }}
    >
      {/* ruído do painel: irregular, treme, nunca atravessa o limite */}
      <g stroke={RUIDO} strokeWidth={1.6} strokeLinecap="round" fill="none">
        {DENTES.map((t) => (
          <path key={t.key} d={t.d} className={styles.jitter} style={{ animationDelay: t.atraso }} />
        ))}
      </g>

      <circle cx={C} cy={C} r={R_LIMITE} stroke={STROKE_FAINT} strokeWidth={1} fill="none" opacity={0.5} />

      {/* corpo do núcleo */}
      <circle cx={C} cy={C} r={R_OUT} stroke={STROKE} strokeWidth={2.2} fill="none" />
      <circle cx={C} cy={C} r={R_IN} stroke={STROKE} strokeWidth={2.2} fill="none" />

      {/* fluxo contido, calmo, contraste deliberado com o ruído de fora */}
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

      {/* sinal de controle: reto, dentro do núcleo, o oposto do ruído de fora */}
      <line x1={C - R_IN + 12} y1={C} x2={C + R_IN - 12} y2={C} stroke="#8FCB8F" strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  );
}
