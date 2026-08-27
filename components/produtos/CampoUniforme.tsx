import styles from "./CampoUniforme.module.css";

/**
 * Arte da seção "O que muda na engenharia": núcleo toroidal com o campo
 * magnético distribuído de forma uniforme ao redor do anel — só isso, sem
 * comparar com núcleo E/I (decisão comercial já registrada em
 * app/transformadores-toroidais/page.tsx). Duas afirmações visuais:
 *
 *  1. Densidade de campo igual em qualquer ponto do anel (as marcas
 *     radiais têm o mesmo comprimento, sem variação de um lado a outro).
 *  2. Fluxo contínuo e calmo, sem irradiar para fora do círculo de campo.
 *
 * Determinístico, sem Math.random: mesmo espírito de RuidoContido.tsx, mas
 * só a metade "calma" daquele componente. `prefers-reduced-motion` desliga
 * a rotação globalmente (app/globals.css); os anéis continuam legíveis
 * parados.
 */

const SIZE = 400;
const C = SIZE / 2;

const R_OUT = 128;
const R_IN = 82;
const R_CAMPO = 152;

const TICKS = 32;

const STROKE = "rgba(190, 216, 244, 0.55)";
const STROKE_FAINT = "rgba(190, 216, 244, 0.24)";
const FLUXO = "rgba(190, 216, 244, 0.4)";
const ACCENT = "#8FCB8F";

function polar(radius: number, angle: number) {
  return [C + radius * Math.cos(angle), C + radius * Math.sin(angle)] as const;
}

const ticks = Array.from({ length: TICKS }, (_, i) => {
  const angle = (i / TICKS) * Math.PI * 2;
  const [x1, y1] = polar(R_CAMPO, angle);
  const [x2, y2] = polar(R_CAMPO + 20, angle);
  return { key: i, x1, y1, x2, y2 };
});

export function CampoUniforme({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width="100%"
      aria-hidden="true"
      className={className}
      style={{ display: "block", overflow: "visible" }}
    >
      {/* marcas de campo: mesmo comprimento em qualquer ponto do anel */}
      <g stroke={ACCENT} strokeWidth={1.6} strokeLinecap="round" opacity={0.55}>
        {ticks.map((t) => (
          <line key={t.key} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
        ))}
      </g>

      <circle cx={C} cy={C} r={R_CAMPO} stroke={STROKE_FAINT} strokeWidth={1} fill="none" opacity={0.5} />

      {/* corpo do núcleo */}
      <circle cx={C} cy={C} r={R_OUT} stroke={STROKE} strokeWidth={2.2} fill="none" />
      <circle cx={C} cy={C} r={R_IN} stroke={STROKE} strokeWidth={2.2} fill="none" />

      {/* fluxo contínuo, distribuído de forma igual ao redor do anel */}
      {[
        { r: 116, duracao: "38s" },
        { r: 100, duracao: "29s" },
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
    </svg>
  );
}
